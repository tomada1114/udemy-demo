from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """アプリケーション設定。"""

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    openweathermap_api_key: str
    openweathermap_base_url: str = "https://api.openweathermap.org/data/2.5"
    http_timeout_seconds: float = 10.0


@lru_cache
def get_settings() -> Settings:
    """設定をキャッシュして取得する。"""

    return Settings()
