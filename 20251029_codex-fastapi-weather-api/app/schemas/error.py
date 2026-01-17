"""エラーレスポンス用スキーマ。"""

from typing import Any

from pydantic import BaseModel


class ErrorResponse(BaseModel):
    """統一されたエラーレスポンスフォーマット。"""

    error: str
    message: str
    detail: dict[str, Any] | list[Any] | None = None

