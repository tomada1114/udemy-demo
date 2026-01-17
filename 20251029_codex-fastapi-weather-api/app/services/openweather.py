from __future__ import annotations

import asyncio
import logging
from collections.abc import Sequence
from datetime import datetime, timezone
from typing import Any, Final

import httpx

from app.config import Settings
from app.errors import AppError, CityNotFoundError, ExternalAPIError, UnknownCityError
from app.schemas.error import ErrorResponse
from app.schemas.weather import (
    ForecastItem,
    ForecastResponse,
    WeatherResponse,
)

logger = logging.getLogger(__name__)


CITY_ALIAS_MAP: Final[dict[str, str]] = {
    "tokyo": "Tokyo",
    "osaka": "Osaka",
    "sapporo": "Sapporo",
    "nagoya": "Nagoya",
    "fukuoka": "Fukuoka",
}
SUPPORTED_CITY_CODES: Final[tuple[str, ...]] = tuple(CITY_ALIAS_MAP.keys())


class OpenWeatherService:
    """OpenWeatherMapから天気情報を取得するサービス。"""

    def __init__(
        self,
        settings: Settings,
        *,
        transport: httpx.BaseTransport | httpx.AsyncBaseTransport | None = None,
    ) -> None:
        self._settings = settings
        self._transport = transport

    def fetch_current_weather(self, city: str, *, lang: str = "ja") -> WeatherResponse:
        """指定都市の現在の天気を取得してレスポンスモデルに変換する。"""

        params = self._build_weather_params(city=city, lang=lang)
        try:
            with httpx.Client(
                base_url=self._settings.openweathermap_base_url,
                timeout=self._settings.http_timeout_seconds,
                transport=self._transport,
            ) as client:
                response = client.get("/weather", params=params)
                response.raise_for_status()
        except httpx.HTTPStatusError as exc:
            raise self._convert_http_status_error(
                exc,
                city=city,
                lang=lang,
                cnt=None,
            ) from exc
        except httpx.RequestError as exc:  # pragma: no cover - ネットワーク例外はモックが困難
            raise self._build_request_error(
                city=city,
                lang=lang,
                cnt=None,
                reason=str(exc),
            ) from exc
        payload = response.json()
        return self._to_weather_response(payload)

    def fetch_known_city_weather(self, city_code: str) -> WeatherResponse:
        """事前に定義した都市コードに対応する天気を取得する。"""

        try:
            mapped_city = CITY_ALIAS_MAP[city_code.lower()]
        except KeyError as exc:  # pragma: no cover - defensive branch
            raise UnknownCityError(detail={"city_code": city_code}) from exc
        return self.fetch_current_weather(mapped_city)

    def fetch_tokyo_weather(self) -> WeatherResponse:
        """東京の天気を取得するヘルパー。"""

        return self.fetch_known_city_weather("tokyo")

    def fetch_forecast(
        self,
        city: str,
        *,
        lang: str = "ja",
        cnt: int | None = None,
    ) -> ForecastResponse:
        """指定都市の5日間予報を取得してレスポンスモデルに変換する。"""

        if cnt is not None and not 1 <= cnt <= 40:
            raise ValueError("cnt must be between 1 and 40 inclusive.")
        params: dict[str, Any] = {
            "q": city,
            "units": "metric",
            "lang": lang,
            "appid": self._settings.openweathermap_api_key,
        }
        if cnt is not None:
            params["cnt"] = cnt
        try:
            with httpx.Client(
                base_url=self._settings.openweathermap_base_url,
                timeout=self._settings.http_timeout_seconds,
                transport=self._transport,
            ) as client:
                response = client.get("/forecast", params=params)
                response.raise_for_status()
        except httpx.HTTPStatusError as exc:
            raise self._convert_http_status_error(
                exc,
                city=city,
                lang=lang,
                cnt=cnt,
            ) from exc
        except httpx.RequestError as exc:  # pragma: no cover - ネットワーク例外はモックが困難
            raise self._build_request_error(
                city=city,
                lang=lang,
                cnt=cnt,
                reason=str(exc),
            ) from exc
        payload = response.json()
        items = [
            ForecastItem(
                timestamp=datetime.fromtimestamp(item["dt"], tz=timezone.utc),
                temperature=item["main"]["temp"],
                weather_description=item["weather"][0]["description"],
                humidity=item["main"]["humidity"],
            )
            for item in payload["list"]
        ]
        city_info = payload["city"]
        return ForecastResponse(
            city=city_info["name"],
            timezone=city_info["timezone"],
            items=items,
        )

    def fetch_known_city_forecast(
        self,
        city_code: str,
        *,
        lang: str = "ja",
        cnt: int | None = None,
    ) -> ForecastResponse:
        """事前に定義した都市コードに対応する予報を取得する。"""

        try:
            mapped_city = CITY_ALIAS_MAP[city_code.lower()]
        except KeyError as exc:  # pragma: no cover - defensive branch
            raise UnknownCityError(detail={"city_code": city_code}) from exc
        return self.fetch_forecast(mapped_city, lang=lang, cnt=cnt)

    async def compare_cities_weather(
        self,
        cities: Sequence[str],
        *,
        lang: str = "ja",
    ) -> tuple[list[WeatherResponse], list[ErrorResponse]]:
        """複数都市の天気を並列取得し結果とエラーを返す。"""

        if not cities:
            return [], []
        requested_cities = list(cities)
        async with httpx.AsyncClient(
            base_url=self._settings.openweathermap_base_url,
            timeout=self._settings.http_timeout_seconds,
            transport=self._transport,
        ) as client:
            tasks = [
                self._fetch_current_weather_async(
                    client,
                    city,
                    lang=lang,
                )
                for city in requested_cities
            ]
            results = await asyncio.gather(*tasks, return_exceptions=True)
        success_responses: list[WeatherResponse] = []
        error_responses: list[ErrorResponse] = []
        for result in results:
            if isinstance(result, WeatherResponse):
                success_responses.append(result)
                continue
            if isinstance(result, AppError):
                error_responses.append(
                    ErrorResponse(
                        error=result.error_code,
                        message=result.message,
                        detail=result.detail,
                    )
                )
                continue
            if isinstance(result, Exception):
                raise result
            raise RuntimeError("unexpected result from weather comparison")  # pragma: no cover
        if error_responses:
            logger.warning(
                "weather comparison finished with partial failures",
                extra={
                    "requested_cities": requested_cities,
                    "success_count": len(success_responses),
                    "error_count": len(error_responses),
                    "error_codes": [error.error for error in error_responses],
                },
            )
        return success_responses, error_responses

    def _build_weather_params(self, *, city: str, lang: str) -> dict[str, Any]:
        return {
            "q": city,
            "units": "metric",
            "lang": lang,
            "appid": self._settings.openweathermap_api_key,
        }

    def _convert_http_status_error(
        self,
        exc: httpx.HTTPStatusError,
        *,
        city: str,
        lang: str,
        cnt: int | None,
    ) -> AppError:
        detail = self._build_error_detail(
            city=city,
            lang=lang,
            cnt=cnt,
            response=exc.response,
        )
        if exc.response.status_code == 404:
            return CityNotFoundError(detail=detail)
        return ExternalAPIError(detail=detail)

    def _build_request_error(
        self,
        *,
        city: str,
        lang: str,
        cnt: int | None,
        reason: str,
    ) -> ExternalAPIError:
        detail: dict[str, Any] = {
            "city": city,
            "lang": lang,
            "reason": reason,
        }
        if cnt is not None:
            detail["cnt"] = cnt
        return ExternalAPIError(
            message="外部APIへの接続に失敗しました。",
            detail=detail,
        )

    async def _fetch_current_weather_async(
        self,
        client: httpx.AsyncClient,
        city: str,
        *,
        lang: str,
    ) -> WeatherResponse:
        params = self._build_weather_params(city=city, lang=lang)
        try:
            response = await client.get("/weather", params=params)
            response.raise_for_status()
        except httpx.HTTPStatusError as exc:
            raise self._convert_http_status_error(
                exc,
                city=city,
                lang=lang,
                cnt=None,
            ) from exc
        except httpx.RequestError as exc:  # pragma: no cover - ネットワーク例外はモックが困難
            raise self._build_request_error(
                city=city,
                lang=lang,
                cnt=None,
                reason=str(exc),
            ) from exc
        payload = response.json()
        return self._to_weather_response(payload)

    @staticmethod
    def _to_weather_response(payload: dict[str, Any]) -> WeatherResponse:
        return WeatherResponse(
            city=payload["name"],
            temperature=payload["main"]["temp"],
            weather_description=payload["weather"][0]["description"],
            humidity=payload["main"]["humidity"],
        )

    @staticmethod
    def _build_error_detail(
        *,
        city: str,
        lang: str,
        cnt: int | None,
        response: httpx.Response,
    ) -> dict[str, Any]:
        try:
            body: Any = response.json()
        except ValueError:  # pragma: no cover - 想定外フォーマット
            body = {"text": response.text}
        detail = {
            "city": city,
            "lang": lang,
            "status_code": response.status_code,
            "response": body,
        }
        if cnt is not None:
            detail["cnt"] = cnt
        return detail
