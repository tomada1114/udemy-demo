from fastapi import FastAPI

from app.errors import register_exception_handlers
from app.routers.forecast import router as forecast_router
from app.routers.weather import router as weather_router

app = FastAPI(title="FastAPI Weather API", version="0.1.0")
register_exception_handlers(app)
app.include_router(weather_router)
app.include_router(forecast_router)
