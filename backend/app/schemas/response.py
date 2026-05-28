"""
Base Response model for consistent API responses
"""
from typing import Any, Optional, Dict
from pydantic import BaseModel
from datetime import datetime


class ResponseMeta(BaseModel):
    """Response metadata"""
    timestamp: datetime = None
    version: str = "1.0"
    
    def __init__(self, **data):
        super().__init__(**data)
        if self.timestamp is None:
            self.timestamp = datetime.utcnow()


class BaseResponse(BaseModel):
    """Base response model"""
    success: bool
    message: str = "Operation successful"
    data: Optional[Any] = None
    meta: ResponseMeta = None
    
    def __init__(self, **data):
        super().__init__(**data)
        if self.meta is None:
            self.meta = ResponseMeta()


class ErrorDetail(BaseModel):
    """Error detail"""
    field: Optional[str] = None
    message: str


class ErrorResponse(BaseModel):
    """Error response model"""
    success: bool = False
    message: str
    error: Dict[str, Any]
    meta: ResponseMeta = None
    
    def __init__(self, **data):
        super().__init__(**data)
        if self.meta is None:
            self.meta = ResponseMeta()
