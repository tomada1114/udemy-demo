"""天気比較API用のスキーマ。"""

from __future__ import annotations

from pydantic import BaseModel, Field, field_validator

from app.schemas.error import ErrorResponse
from app.schemas.weather import WeatherResponse


class ComparisonRequest(BaseModel):
    """複数都市の天気比較リクエストボディ。"""

    cities: list[str] = Field(
        ...,
        min_length=1,
        max_length=10,
        description="比較対象となる都市名リスト（重複可、1〜10件）。",
    )
    lang: str = Field(
        default="ja",
        pattern=r"^[a-zA-Z]{2}$",
        description="ISO 639-1形式の言語コード。例: ja, en",
    )

    @field_validator("cities", mode="before")
    def coerce_to_list(cls, value: object) -> list[str]:
        if isinstance(value, list):
            return value
        raise TypeError("cities must be a list of strings")

    @field_validator("cities")
    def sanitize_cities(cls, value: list[str]) -> list[str]:
        normalized: list[str] = []
        for city in value:
            if not isinstance(city, str):
                raise TypeError("each city must be a string")
            stripped = city.strip()
            if not stripped:
                raise ValueError("city must not be blank")
            normalized.append(stripped)
        return normalized

    @field_validator("lang", mode="before")
    def normalize_lang(cls, value: str) -> str:
        if not isinstance(value, str):
            raise TypeError("lang must be a string")
        return value.strip().lower()


class ComparisonResponse(BaseModel):
    """複数都市の現在天気とエラーをまとめたレスポンス。"""

    cities: list[WeatherResponse] = Field(
        default_factory=list,
        description="取得に成功した都市の天気一覧。",
    )
    errors: list[ErrorResponse] = Field(
        default_factory=list,
        description="取得に失敗した都市に関するエラー一覧。",
    )

