"""
Pydantic schemas for request/response validation
"""
from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import Optional
import uuid


class UserBase(BaseModel):
    """Base user schema"""
    email: EmailStr
    first_name: str
    last_name: str
    phone: Optional[str] = None
    user_type: str  # 'umkm', 'vendor', 'admin'


class UserCreate(UserBase):
    """User creation schema"""
    password: str = Field(..., min_length=8)


class UserResponse(UserBase):
    """User response schema"""
    id: uuid.UUID
    is_verified: bool
    created_at: datetime
    
    class Config:
        from_attributes = True


class LoginRequest(BaseModel):
    """Login request schema"""
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    """Token response schema"""
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: UserResponse


class UMKMBase(BaseModel):
    """Base UMKM schema"""
    business_name: str
    industry_category: str
    employees_count: Optional[int] = None
    annual_revenue: Optional[float] = None
    province: str
    city: str
    address: str
    bank_account_name: str
    bank_account_number: str
    bank_name: str


class UMKMCreate(UMKMBase):
    """UMKM creation schema"""
    pass


class UMKMResponse(UMKMBase):
    """UMKM response schema"""
    id: uuid.UUID
    user_id: uuid.UUID
    verification_status: str
    credit_score: float
    total_transactions: int
    created_at: datetime
    
    class Config:
        from_attributes = True


class ProcurementRequestBase(BaseModel):
    """Base procurement request schema"""
    product_name: str
    product_category: str
    product_description: str
    quantity: float
    unit: str
    budget: float
    delivery_urgency: str = "normal"
    delivery_city: str
    delivery_address: str


class ProcurementRequestCreate(ProcurementRequestBase):
    """Procurement request creation schema"""
    preferred_delivery_date: Optional[datetime] = None
    quality_specifications: Optional[str] = None
    special_requirements: Optional[str] = None


class ProcurementRequestResponse(ProcurementRequestBase):
    """Procurement request response schema"""
    id: uuid.UUID
    umkm_id: uuid.UUID
    status: str
    created_at: datetime
    
    class Config:
        from_attributes = True


class ProcurementGroupBase(BaseModel):
    """Base procurement group schema"""
    group_name: str
    product_category: str
    description: Optional[str] = None
    delivery_city: str


class ProcurementGroupCreate(ProcurementGroupBase):
    """Procurement group creation schema"""
    target_delivery_date: Optional[datetime] = None


class ProcurementGroupResponse(ProcurementGroupBase):
    """Procurement group response schema"""
    id: uuid.UUID
    member_count: int
    total_quantity: float
    status: str
    total_savings: float
    created_at: datetime
    
    class Config:
        from_attributes = True


class GroupMembershipResponse(BaseModel):
    """Group membership response schema"""
    id: uuid.UUID
    group_id: uuid.UUID
    umkm_id: uuid.UUID
    quantity: float
    total_price: Optional[float] = None
    savings_percentage: Optional[float] = None
    status: str
    
    class Config:
        from_attributes = True


class TransactionResponse(BaseModel):
    """Transaction response schema"""
    id: uuid.UUID
    order_number: str
    total_amount: float
    final_amount: float
    payment_status: str
    delivery_status: str
    order_status: str
    created_at: datetime
    
    class Config:
        from_attributes = True
