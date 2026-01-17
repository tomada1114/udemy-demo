from fastapi import APIRouter, Depends, Path, Query
from fastapi.exceptions import RequestValidationError
from pydantic import BaseModel, Field, ValidationError, field_validator

from app.config import Settings, get_settings
from app.errors import UnknownCityError
from app.schemas.comparison import ComparisonRequest, ComparisonResponse
from app.schemas.weather import WeatherResponse
from app.services.openweather import (
    OpenWeatherService,
    SUPPORTED_CITY_CODES,
)

router = APIRouter(prefix="/weather", tags=["weather"])

SUPPORTED_CITY_CODES_TEXT = ", ".join(SUPPORTED_CITY_CODES)


class WeatherQueryParams(BaseModel):
    """GET /weather クエリパラメータの検証モデル。"""

    city: str = Field(..., min_length=1)
    lang: str = Field(default="ja", pattern=r"^[a-zA-Z]{2}$")

    @field_validator("city", mode="before")
    def strip_city(cls, value: str) -> str:
        if not isinstance(value, str):  # pragma: no cover - FastAPIが保証
            raise TypeError("city must be a string")
        return value.strip()

    @field_validator("lang", mode="before")
    def normalize_lang(cls, value: str) -> str:
        if not isinstance(value, str):  # pragma: no cover - FastAPIが保証
            raise TypeError("lang must be a string")
        return value.strip().lower()


def parse_weather_query_params(
    city: str = Query(..., min_length=1, description="検索対象の都市名"),
    lang: str = Query(
        "ja",
        pattern=r"^[a-zA-Z]{2}$",
        description="ISO 639-1形式の言語コード。例: ja, en",
    ),
) -> WeatherQueryParams:
    try:
        return WeatherQueryParams(city=city, lang=lang)
    except ValidationError as exc:  # pragma: no cover - FastAPIで422へ変換
        raise RequestValidationError(exc.errors()) from exc


def get_openweather_service(
    settings: Settings = Depends(get_settings),
) -> OpenWeatherService:
    return OpenWeatherService(settings)


@router.get("/tokyo", response_model=WeatherResponse)
def get_tokyo_weather(
    service: OpenWeatherService = Depends(get_openweather_service),
) -> WeatherResponse:
    """東京の現在の天気を返す。"""

    return service.fetch_tokyo_weather()


@router.get("", response_model=WeatherResponse)
def get_weather(
    params: WeatherQueryParams = Depends(parse_weather_query_params),
    service: OpenWeatherService = Depends(get_openweather_service),
) -> WeatherResponse:
    """任意都市の現在の天気を返す。"""

    return service.fetch_current_weather(params.city, lang=params.lang)


@router.get("/{city}", response_model=WeatherResponse)
def get_weather_by_city(
    city: str = Path(
        ...,
        description=f"サポートされている都市コード: {SUPPORTED_CITY_CODES_TEXT}",
        examples={
            "tokyo": {
                "summary": "Tokyo",
                "value": "tokyo",
            }
        },
    ),
    service: OpenWeatherService = Depends(get_openweather_service),
) -> WeatherResponse:
    """事前に許可された都市コード（tokyo/osaka/sapporo/nagoya/fukuoka）の天気を返す。"""

    return service.fetch_known_city_weather(city)


@router.post("/compare", response_model=ComparisonResponse)
async def compare_weather(
    request: ComparisonRequest,
    service: OpenWeatherService = Depends(get_openweather_service),
) -> ComparisonResponse:
    """複数都市の現在の天気を比較して返す。"""

    success, errors = await service.compare_cities_weather(request.cities, lang=request.lang)
    return ComparisonResponse(cities=success, errors=errors)
