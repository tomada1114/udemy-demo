"""アプリケーション共通のエラーハンドリング。"""

from __future__ import annotations

import logging
from typing import Any

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

from app.schemas.error import ErrorResponse

logger = logging.getLogger(__name__)


class AppError(Exception):
    """アプリ共通の基底例外。"""

    status_code: int = 500
    error_code: str = "internal_error"
    default_message: str = "Internal server error"

    def __init__(self, *, message: str | None = None, detail: Any | None = None) -> None:
        super().__init__(message or self.default_message)
        self.message = message or self.default_message
        self.detail = detail


class UnknownCityError(AppError):
    status_code = 400
    error_code = "unknown_city"
    default_message = "指定された都市コードはサポートされていません。"


class CityNotFoundError(AppError):
    status_code = 404
    error_code = "city_not_found"
    default_message = "指定された都市は見つかりませんでした。"


class ExternalAPIError(AppError):
    status_code = 502
    error_code = "external_api_error"
    default_message = "外部APIの呼び出しに失敗しました。"


async def handle_app_error(request: Request, exc: AppError) -> JSONResponse:
    """アプリ固有例外を統一フォーマットで返却する。"""

    logger.error(
        "handled application error",
        extra={
            "error_code": exc.error_code,
            "path": str(request.url),
            "method": request.method,
            "detail": exc.detail,
        },
    )
    payload = ErrorResponse(
        error=exc.error_code,
        message=exc.message,
        detail=exc.detail,
    )
    return JSONResponse(status_code=exc.status_code, content=payload.model_dump())


def register_exception_handlers(app: FastAPI) -> None:
    """アプリケーションへ例外ハンドラを登録する。"""

    app.add_exception_handler(AppError, handle_app_error)

