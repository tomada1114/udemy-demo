import httpx

from app.config import Settings
from app.routers.weather import get_openweather_service
from app.services.openweather import OpenWeatherService


def build_comparison_transport(
    expected_lang: str,
    responses: dict[str, dict],
) -> httpx.MockTransport:
    def handler(request: httpx.Request) -> httpx.Response:
        assert request.method == "GET"
        assert request.url.path.endswith("/weather")
        assert request.url.params["lang"] == expected_lang
        city = request.url.params["q"]
        assert city in responses, f"unexpected city {city}"
        payload = responses[city]
        status_code = payload["status"]
        if "json" in payload:
            return httpx.Response(status_code, json=payload["json"])
        if "text" in payload:
            return httpx.Response(status_code, text=payload["text"])
        return httpx.Response(status_code)

    return httpx.MockTransport(handler)


def test_compare_weather_partial_failures(client, caplog):
    caplog.set_level("WARNING", logger="app.services.openweather")
    responses = {
        "Tokyo": {
            "status": 200,
            "json": {
                "name": "Tokyo",
                "main": {"temp": 20.0, "humidity": 60},
                "weather": [{"description": "晴れ"}],
            },
        },
        "Atlantis": {
            "status": 404,
            "json": {"cod": "404", "message": "city not found"},
        },
        "Berlin": {
            "status": 502,
            "json": {"cod": 502, "message": "bad gateway"},
        },
    }
    transport = build_comparison_transport("en", responses)
    service = OpenWeatherService(Settings(), transport=transport)
    client.app.dependency_overrides[get_openweather_service] = lambda: service

    payload = {"cities": ["Tokyo", "Atlantis", "Berlin"], "lang": "EN"}
    response = client.post("/weather/compare", json=payload)

    assert response.status_code == 200
    body = response.json()
    assert len(body["cities"]) == 1
    assert body["cities"][0]["city"] == "Tokyo"
    assert len(body["errors"]) == 2
    error_codes = {error["error"] for error in body["errors"]}
    assert error_codes == {"city_not_found", "external_api_error"}
    city_not_found = next(error for error in body["errors"] if error["error"] == "city_not_found")
    assert city_not_found["detail"]["city"] == "Atlantis"
    assert city_not_found["detail"]["status_code"] == 404
    assert any(
        record.requested_cities == ["Tokyo", "Atlantis", "Berlin"]
        and record.error_count == 2
        and record.success_count == 1
        for record in caplog.records
    )


def test_compare_weather_all_success_with_duplicates(client):
    responses = {
        "Tokyo": {
            "status": 200,
            "json": {
                "name": "Tokyo",
                "main": {"temp": 19.5, "humidity": 58},
                "weather": [{"description": "晴れ"}],
            },
        },
    }
    transport = build_comparison_transport("ja", responses)
    service = OpenWeatherService(Settings(), transport=transport)
    client.app.dependency_overrides[get_openweather_service] = lambda: service

    payload = {"cities": [" Tokyo ", "Tokyo"]}
    response = client.post("/weather/compare", json=payload)

    assert response.status_code == 200
    body = response.json()
    assert len(body["cities"]) == 2
    assert all(city["city"] == "Tokyo" for city in body["cities"])
    assert body["errors"] == []


def test_compare_weather_rejects_blank_city(client):
    response = client.post("/weather/compare", json={"cities": ["   "]})

    assert response.status_code == 422
    detail = response.json()["detail"]
    assert any(error["loc"][-1] == "cities" for error in detail)

