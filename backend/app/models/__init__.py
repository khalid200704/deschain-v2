"""
SQLAlchemy ORM Models for Deschain
"""
from datetime import datetime
import uuid
from sqlalchemy import Column, String, Integer, Float, DateTime, Boolean, Text, ForeignKey, Enum, ARRAY
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.database import Base


class User(Base):
    """User model"""
    __tablename__ = "users"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, nullable=False, index=True)
    phone = Column(String(20), unique=True)
    password_hash = Column(String(255), nullable=False)
    first_name = Column(String(100))
    last_name = Column(String(100))
    user_type = Column(String(50), nullable=False)  # 'umkm', 'vendor', 'admin'
    is_active = Column(Boolean, default=True, index=True)
    is_verified = Column(Boolean, default=False)
    last_login = Column(DateTime)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    umkm = relationship("UMKM", back_populates="user", uselist=False)
    vendor = relationship("Vendor", back_populates="user", uselist=False)


class UMKM(Base):
    """UMKM (Small Business) model"""
    __tablename__ = "umkms"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    business_name = Column(String(255), nullable=False)
    business_registration_number = Column(String(50))
    industry_category = Column(String(100))
    description = Column(Text)
    employees_count = Column(Integer)
    annual_revenue = Column(Float)
    owner_name = Column(String(255))
    owner_id_number = Column(String(50))
    province = Column(String(100), index=True)
    city = Column(String(100), index=True)
    district = Column(String(100))
    address = Column(Text)
    latitude = Column(Float)
    longitude = Column(Float)
    bank_account_name = Column(String(255))
    bank_account_number = Column(String(50))
    bank_name = Column(String(100))
    verification_status = Column(String(50), default="pending", index=True)  # pending, verified, rejected
    credit_score = Column(Float, default=0)
    total_transactions = Column(Integer, default=0)
    total_procurement_value = Column(Float, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="umkm")
    procurement_requests = relationship("ProcurementRequest", back_populates="umkm")
    group_memberships = relationship("GroupMembership", back_populates="umkm")


class Vendor(Base):
    """Vendor (Supplier) model"""
    __tablename__ = "vendors"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    vendor_name = Column(String(255), nullable=False)
    vendor_registration_number = Column(String(50))
    business_category = Column(String(100))
    description = Column(Text)
    website = Column(String(500))
    primary_contact_person = Column(String(255))
    primary_phone = Column(String(20))
    province = Column(String(100))
    city = Column(String(100), index=True)
    address = Column(Text)
    latitude = Column(Float)
    longitude = Column(Float)
    product_categories = Column(ARRAY(String))
    min_order_quantity = Column(Integer)
    average_lead_time_days = Column(Integer)
    verification_status = Column(String(50), default="pending", index=True)
    reliability_score = Column(Float, default=0)
    total_orders = Column(Integer, default=0)
    total_revenue = Column(Float, default=0)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="vendor")


class ProcurementRequest(Base):
    """Procurement request model"""
    __tablename__ = "procurement_requests"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    umkm_id = Column(UUID(as_uuid=True), ForeignKey("umkms.id", ondelete="CASCADE"), nullable=False, index=True)
    product_name = Column(String(255), nullable=False)
    product_category = Column(String(100), index=True)
    product_description = Column(Text)
    quantity = Column(Float, nullable=False)
    unit = Column(String(50))
    quality_specifications = Column(Text)
    budget = Column(Float)
    preferred_delivery_date = Column(DateTime)
    delivery_urgency = Column(String(50), default="normal")
    delivery_city = Column(String(100))
    delivery_address = Column(Text)
    special_requirements = Column(Text)
    status = Column(String(50), default="draft", index=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    expires_at = Column(DateTime)
    
    # Relationships
    umkm = relationship("UMKM", back_populates="procurement_requests")


class ProcurementGroup(Base):
    """Procurement group model"""
    __tablename__ = "procurement_groups"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    group_name = Column(String(255), nullable=False)
    description = Column(Text)
    product_category = Column(String(100))
    total_quantity = Column(Float)
    unit = Column(String(50))
    total_budget = Column(Float)
    member_count = Column(Integer, default=0)
    target_delivery_date = Column(DateTime)
    delivery_city = Column(String(100))
    status = Column(String(50), default="forming", index=True)
    created_by_umkm_id = Column(UUID(as_uuid=True), ForeignKey("umkms.id"), nullable=False)
    selected_vendor_id = Column(UUID(as_uuid=True), ForeignKey("vendors.id"))
    total_savings = Column(Float, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class GroupMembership(Base):
    """Group membership model"""
    __tablename__ = "group_memberships"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    group_id = Column(UUID(as_uuid=True), ForeignKey("procurement_groups.id", ondelete="CASCADE"), nullable=False)
    umkm_id = Column(UUID(as_uuid=True), ForeignKey("umkms.id", ondelete="CASCADE"), nullable=False)
    request_id = Column(UUID(as_uuid=True), ForeignKey("procurement_requests.id"))
    quantity = Column(Float)
    unit_price = Column(Float)
    total_price = Column(Float)
    individual_budget = Column(Float)
    savings_percentage = Column(Float)
    status = Column(String(50), default="pending", index=True)
    joined_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    umkm = relationship("UMKM", back_populates="group_memberships")


class Transaction(Base):
    """Transaction model"""
    __tablename__ = "transactions"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    group_id = Column(UUID(as_uuid=True), ForeignKey("procurement_groups.id"), nullable=False)
    vendor_id = Column(UUID(as_uuid=True), ForeignKey("vendors.id"), nullable=False)
    order_number = Column(String(50), unique=True)
    total_amount = Column(Float, nullable=False)
    tax_amount = Column(Float, default=0)
    delivery_fee = Column(Float, default=0)
    final_amount = Column(Float, nullable=False)
    quantity = Column(Float)
    unit = Column(String(50))
    delivery_date = Column(DateTime)
    delivery_address = Column(Text)
    payment_status = Column(String(50), default="pending", index=True)
    delivery_status = Column(String(50), default="pending", index=True)
    order_status = Column(String(50), default="pending", index=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    completed_at = Column(DateTime)


class Payment(Base):
    """Payment model"""
    __tablename__ = "payments"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    transaction_id = Column(UUID(as_uuid=True), ForeignKey("transactions.id", ondelete="CASCADE"), nullable=False, index=True)
    payment_method = Column(String(50))
    payment_reference = Column(String(100))
    amount = Column(Float, nullable=False)
    payment_date = Column(DateTime)
    status = Column(String(50), default="pending", index=True)
    provider_transaction_id = Column(String(255))
    notes = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class Notification(Base):
    """Notification model"""
    __tablename__ = "notifications"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    message = Column(Text)
    notification_type = Column(String(50))
    related_entity_id = Column(UUID(as_uuid=True))
    related_entity_type = Column(String(100))
    is_read = Column(Boolean, default=False, index=True)
    channel = Column(String(50), default="in_app")
    delivery_status = Column(String(50), default="pending")
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    read_at = Column(DateTime)


# Add relationships to UMKM
UMKM.procurement_requests = relationship("ProcurementRequest", back_populates="umkm")
UMKM.group_memberships = relationship("GroupMembership", back_populates="umkm")
