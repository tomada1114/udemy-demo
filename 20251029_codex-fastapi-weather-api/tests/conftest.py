import sys
from collections.abc import Generator
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

import pytest
from fastapi.testclient import TestClient

from app.config import get_settings
from app.main import app


@pytest.fixture(autouse=True)
def configure_env(monkeypatch: pytest.MonkeyPatch) -> Generator[None, None, None]:
    monkeypatch.setenv("OPENWEATHERMAP_API_KEY", "test-key")
    monkeypatch.setenv("OPENWEATHERMAP_BASE_URL", "https://api.openweathermap.org/data/2.5")
    monkeypatch.setenv("HTTP_TIMEOUT_SECONDS", "5")
    # get_settings()はlru_cacheされるため一度クリア
    get_settings.cache_clear()  # type: ignore[attr-defined]
    yield
    app.dependency_overrides.clear()
    get_settings.cache_clear()  # type: ignore[attr-defined]


@pytest.fixture
def client() -> TestClient:
    return TestClient(app)
