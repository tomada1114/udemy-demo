from datetime import datetime, timedelta

import httpx
import pytest

from app.config import Settings
from app.routers.weather import get_openweather_service
from app.services.openweather import OpenWeatherService


def build_forecast_mock_transport(
    status_code: int,
    *,
    expected_city: str,
    json_data: dict | None = None,
    text_data: str | None = None,
    expected_lang: str = "ja",
    expected_cnt: int | None = None,
) -> httpx.MockTransport:
    def handler(request: httpx.Request) -> httpx.Response:
        assert request.method == "GET"
        assert request.url.path.endswith("/forecast")
        assert request.url.params["q"] == expected_city
        assert request.url.params["lang"] == expected_lang
        if expected_cnt is not None:
            assert int(request.url.params["cnt"]) == expected_cnt
        else:
            assert "cnt" not in request.url.params
        if json_data is not None:
            return httpx.Response(status_code, json=json_data)
        if text_data is not None:
            return httpx.Response(status_code, text=text_data)
        return httpx.Response(status_code)

    return httpx.MockTransport(handler)


def test_get_forecast_by_supported_city_success(client):
    payload = {
        "city": {"name": "Tokyo", "timezone": 32400},
        "list": [
            {
                "dt": 1735689600,
                "main": {"temp": 5.0, "humidity": 70},
                "weather": [{"description": "晴れ"}],
            },
            {
                "dt": 1735700400,
                "main": {"temp": 4.2, "humidity": 72},
                "weather": [{"description": "曇り"}],
            },
            {
                "dt": 1735711200,
                "main": {"temp": 3.8, "humidity": 75},
                "weather": [{"description": "雨"}],
            },
        ],
    }
    transport = build_forecast_mock_transport(200, expected_city="Tokyo", json_data=payload)
    service = OpenWeatherService(Settings(), transport=transport)
    client.app.dependency_overrides[get_openweather_service] = lambda: service

    response = client.get("/forecast/tokyo")

    assert response.status_code == 200
    body = response.json()
    assert body["city"] == "Tokyo"
    assert body["timezone"] == 32400
    timestamps = [datetime.fromisoformat(item["timestamp"]) for item in body["items"]]
    assert all(
        second - first == timedelta(hours=3)
        for first, second in zip(timestamps, timestamps[1:])
    )


def test_get_forecast_query_with_cnt_and_lang(client):
    payload = {
        "city": {"name": "Berlin", "timezone": 3600},
        "list": [
            {
                "dt": 1735689600,
                "main": {"temp": 1.0, "humidity": 80},
                "weather": [{"description": "clear sky"}],
            }
        ],
    }
    transport = build_forecast_mock_transport(
        200,
        expected_city="Berlin",
        json_data=payload,
        expected_lang="en",
        expected_cnt=5,
    )
    service = OpenWeatherService(Settings(), transport=transport)
    client.app.dependency_overrides[get_openweather_service] = lambda: service

    response = client.get("/forecast", params={"city": "Berlin", "lang": "EN", "cnt": 5})

    assert response.status_code == 200
    assert response.json()["items"][0]["weather_description"] == "clear sky"


@pytest.mark.parametrize("cnt", [0, 41])
def test_get_forecast_query_with_invalid_cnt_returns_422(client, cnt):
    response = client.get("/forecast", params={"city": "Kyoto", "cnt": cnt})

    assert response.status_code == 422
    detail = response.json()["detail"]
    assert any(error["loc"][-1] == "cnt" for error in detail)


def test_get_forecast_by_unknown_city_returns_400(client, caplog):
    caplog.set_level("ERROR", logger="app.errors")

    response = client.get("/forecast/kyoto")

    assert response.status_code == 400
    assert response.json() == {
        "error": "unknown_city",
        "message": "指定された都市コードはサポートされていません。",
        "detail": {"city_code": "kyoto"},
    }
    assert any(record.error_code == "unknown_city" for record in caplog.records)


def test_get_forecast_known_city_external_error_returns_unified_response(client, caplog):
    caplog.set_level("ERROR", logger="app.errors")
    transport = build_forecast_mock_transport(
        502,
        expected_city="Tokyo",
        text_data="bad gateway",
    )
    service = OpenWeatherService(Settings(), transport=transport)
    client.app.dependency_overrides[get_openweather_service] = lambda: service

    response = client.get("/forecast/tokyo")

    assert response.status_code == 502
    body = response.json()
    assert body["error"] == "external_api_error"
    assert body["detail"]["status_code"] == 502
    assert body["detail"]["response"]["text"] == "bad gateway"
    assert "cnt" not in body["detail"]
    assert any(record.error_code == "external_api_error" for record in caplog.records)


def test_get_forecast_query_city_not_found_returns_404(client, caplog):
    caplog.set_level("ERROR", logger="app.errors")
    payload = {"cod": "404", "message": "city not found"}
    transport = build_forecast_mock_transport(
        404,
        expected_city="Atlantis",
        json_data=payload,
        expected_cnt=5,
    )
    service = OpenWeatherService(Settings(), transport=transport)
    client.app.dependency_overrides[get_openweather_service] = lambda: service

    response = client.get("/forecast", params={"city": "Atlantis", "cnt": 5})

    assert response.status_code == 404
    body = response.json()
    assert body == {
        "error": "city_not_found",
        "message": "指定された都市は見つかりませんでした。",
        "detail": {
            "city": "Atlantis",
            "lang": "ja",
            "cnt": 5,
            "status_code": 404,
            "response": payload,
        },
    }
    assert any(record.error_code == "city_not_found" for record in caplog.records)


def test_fetch_forecast_with_invalid_cnt_raises_value_error():
    service = OpenWeatherService(Settings())

    with pytest.raises(ValueError, match="cnt must be between 1 and 40 inclusive."):
        service.fetch_forecast("Tokyo", cnt=100)
