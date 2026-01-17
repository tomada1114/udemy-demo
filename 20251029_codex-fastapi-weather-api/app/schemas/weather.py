from datetime import datetime

from pydantic import BaseModel


class WeatherResponse(BaseModel):
    """現在の天気レスポンス。"""

    city: str
    temperature: float
    weather_description: str
    humidity: int


class ForecastItem(BaseModel):
    """3時間刻みの予報アイテム。"""

    timestamp: datetime
    temperature: float
    weather_description: str
    humidity: int


class ForecastResponse(BaseModel):
    """5日間予報のレスポンス。"""

    city: str
    timezone: int
    items: list[ForecastItem]
