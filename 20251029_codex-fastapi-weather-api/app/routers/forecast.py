from fastapi import APIRouter, Depends, Path, Query

from app.schemas.weather import ForecastResponse
from app.services.openweather import (
    OpenWeatherService,
    SUPPORTED_CITY_CODES,
)
from app.routers.weather import (
    get_openweather_service,
    parse_weather_query_params,
)

router = APIRouter(prefix="/forecast", tags=["forecast"])

SUPPORTED_CITY_CODES_TEXT = ", ".join(SUPPORTED_CITY_CODES)


@router.get("", response_model=ForecastResponse)
def get_forecast(
    city: str = Query(..., min_length=1, description="検索対象の都市名"),
    lang: str = Query(
        "ja",
        pattern=r"^[a-zA-Z]{2}$",
        description="ISO 639-1形式の言語コード。例: ja, en",
    ),
    cnt: int | None = Query(
        None,
        ge=1,
        le=40,
        description="取得する予報数（1〜40, 3時間刻み）",
    ),
    service: OpenWeatherService = Depends(get_openweather_service),
) -> ForecastResponse:
    """任意都市の5日間予報を返す。"""

    params = parse_weather_query_params(city=city, lang=lang)
    return service.fetch_forecast(params.city, lang=params.lang, cnt=cnt)


@router.get("/{city}", response_model=ForecastResponse)
def get_forecast_by_city(
    city: str = Path(
        ...,
        description=f"サポートされている都市コード: {SUPPORTED_CITY_CODES_TEXT}",
        examples={"tokyo": {"summary": "Tokyo", "value": "tokyo"}},
    ),
    lang: str = Query(
        "ja",
        pattern=r"^[a-zA-Z]{2}$",
        description="ISO 639-1形式の言語コード。例: ja, en",
    ),
    cnt: int | None = Query(
        None,
        ge=1,
        le=40,
        description="取得する予報数（1〜40, 3時間刻み）",
    ),
    service: OpenWeatherService = Depends(get_openweather_service),
) -> ForecastResponse:
    """事前定義済み都市コードの5日間予報を返す。"""

    return service.fetch_known_city_forecast(city, lang=lang, cnt=cnt)
