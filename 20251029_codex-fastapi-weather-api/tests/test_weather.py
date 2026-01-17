import httpx
import pytest

from app.config import Settings
from app.routers.weather import get_openweather_service
from app.services.openweather import OpenWeatherService


def build_mock_transport(
    status_code: int,
    json_data: dict,
    *,
    expected_city: str,
    expected_lang: str = "ja",
) -> httpx.MockTransport:
    def handler(request: httpx.Request) -> httpx.Response:
        assert request.method == "GET"
        assert request.url.path.endswith("/weather")
        assert request.url.params["q"] == expected_city
        assert request.url.params["lang"] == expected_lang
        return httpx.Response(status_code, json=json_data)

    return httpx.MockTransport(handler)


@pytest.mark.parametrize(
    (
        "city_code",
        "api_city",
        "temperature",
        "humidity",
        "description",
    ),
    [
        ("tokyo", "Tokyo", 21.5, 55, "晴れ"),
        ("osaka", "Osaka", 18.2, 60, "曇り"),
        ("sapporo", "Sapporo", -2.3, 70, "雪"),
        ("nagoya", "Nagoya", 16.0, 65, "薄曇り"),
        ("fukuoka", "Fukuoka", 19.8, 68, "雨"),
    ],
)
def test_get_supported_city_weather_success(
    client,
    city_code,
    api_city,
    temperature,
    humidity,
    description,
):
    payload = {
        "name": api_city,
        "main": {"temp": temperature, "humidity": humidity},
        "weather": [{"description": description}],
    }
    transport = build_mock_transport(
        200,
        payload,
        expected_city=api_city,
    )
    service = OpenWeatherService(Settings(), transport=transport)
    client.app.dependency_overrides[get_openweather_service] = lambda: service

    response = client.get(f"/weather/{city_code}")

    assert response.status_code == 200
    assert response.json() == {
        "city": api_city,
        "temperature": temperature,
        "weather_description": description,
        "humidity": humidity,
    }


def test_get_unknown_city_returns_400(client, caplog):
    caplog.set_level("ERROR", logger="app.errors")
    service = OpenWeatherService(Settings())
    client.app.dependency_overrides[get_openweather_service] = lambda: service

    response = client.get("/weather/kyoto")

    assert response.status_code == 400
    assert response.json() == {
        "error": "unknown_city",
        "message": "指定された都市コードはサポートされていません。",
        "detail": {"city_code": "kyoto"},
    }
    assert any(record.error_code == "unknown_city" for record in caplog.records)


def test_get_tokyo_weather_external_error_returns_unified_response(client, caplog):
    caplog.set_level("ERROR", logger="app.errors")
    transport = build_mock_transport(
        502,
        {"cod": 502, "message": "bad gateway"},
        expected_city="Tokyo",
    )
    service = OpenWeatherService(Settings(), transport=transport)
    client.app.dependency_overrides[get_openweather_service] = lambda: service

    response = client.get("/weather/tokyo")

    assert response.status_code == 502
    body = response.json()
    assert body["error"] == "external_api_error"
    assert body["detail"]["status_code"] == 502
    assert any(record.error_code == "external_api_error" for record in caplog.records)


def test_get_weather_query_success_default_lang(client):
    payload = {
        "name": "Kyoto",
        "main": {"temp": 23.4, "humidity": 48},
        "weather": [{"description": "晴天"}],
    }
    transport = build_mock_transport(
        200,
        payload,
        expected_city="Kyoto",
    )
    service = OpenWeatherService(Settings(), transport=transport)
    client.app.dependency_overrides[get_openweather_service] = lambda: service

    response = client.get("/weather", params={"city": "Kyoto"})

    assert response.status_code == 200
    assert response.json() == {
        "city": "Kyoto",
        "temperature": 23.4,
        "weather_description": "晴天",
        "humidity": 48,
    }


def test_get_weather_query_with_language_parameter(client):
    payload = {
        "name": "Berlin",
        "main": {"temp": 12.0, "humidity": 70},
        "weather": [{"description": "clear sky"}],
    }
    transport = build_mock_transport(
        200,
        payload,
        expected_city="Berlin",
        expected_lang="en",
    )
    service = OpenWeatherService(Settings(), transport=transport)
    client.app.dependency_overrides[get_openweather_service] = lambda: service

    response = client.get("/weather", params={"city": "Berlin", "lang": "EN"})

    assert response.status_code == 200
    assert response.json()["weather_description"] == "clear sky"


def test_get_weather_query_invalid_lang_returns_422(client):
    response = client.get("/weather", params={"city": "Kyoto", "lang": "jpn"})

    assert response.status_code == 422
    detail = response.json()["detail"]
    assert any(error["loc"][-1] == "lang" for error in detail)


def test_get_weather_query_missing_city_returns_422(client):
    response = client.get("/weather")

    assert response.status_code == 422
    detail = response.json()["detail"]
    assert any(error["loc"][-1] == "city" for error in detail)


def test_get_weather_query_blank_city_returns_422(client):
    response = client.get("/weather", params={"city": "   "})

    assert response.status_code == 422
    detail = response.json()["detail"]
    assert any(error["loc"][-1] == "city" for error in detail)


def test_get_weather_query_city_not_found_returns_404(client, caplog):
    caplog.set_level("ERROR", logger="app.errors")
    payload = {"cod": "404", "message": "city not found"}
    transport = build_mock_transport(
        404,
        payload,
        expected_city="Atlantis",
    )
    service = OpenWeatherService(Settings(), transport=transport)
    client.app.dependency_overrides[get_openweather_service] = lambda: service

    response = client.get("/weather", params={"city": "Atlantis"})

    assert response.status_code == 404
    body = response.json()
    assert body == {
        "error": "city_not_found",
        "message": "指定された都市は見つかりませんでした。",
        "detail": {
            "city": "Atlantis",
            "lang": "ja",
            "status_code": 404,
            "response": payload,
        },
    }
    assert any(record.error_code == "city_not_found" for record in caplog.records)
