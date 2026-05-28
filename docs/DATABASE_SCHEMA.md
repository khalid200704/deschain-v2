# Deschain Database Schema

## Core Entities

### 1. Users
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    user_type ENUM ('umkm', 'vendor', 'admin') NOT NULL,
    is_active BOOLEAN DEFAULT true,
    is_verified BOOLEAN DEFAULT false,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$')
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_user_type ON users(user_type);
```

### 2. UMKMs (Small Business Profiles)
```sql
CREATE TABLE umkms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    business_name VARCHAR(255) NOT NULL,
    business_registration_number VARCHAR(50),
    industry_category VARCHAR(100),
    description TEXT,
    employees_count INT,
    annual_revenue DECIMAL(15, 2),
    business_license_url VARCHAR(500),
    owner_name VARCHAR(255),
    owner_id_number VARCHAR(50),
    province VARCHAR(100),
    city VARCHAR(100),
    district VARCHAR(100),
    address TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    bank_account_name VARCHAR(255),
    bank_account_number VARCHAR(50),
    bank_name VARCHAR(100),
    verification_status ENUM ('pending', 'verified', 'rejected') DEFAULT 'pending',
    credit_score DECIMAL(5, 2) DEFAULT 0,
    total_transactions INT DEFAULT 0,
    total_procurement_value DECIMAL(15, 2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX idx_umkms_user_id ON umkms(user_id);
CREATE INDEX idx_umkms_city ON umkms(city);
CREATE INDEX idx_umkms_verification_status ON umkms(verification_status);
```

### 3. Vendors (Suppliers)
```sql
CREATE TABLE vendors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    vendor_name VARCHAR(255) NOT NULL,
    vendor_registration_number VARCHAR(50),
    business_category VARCHAR(100),
    description TEXT,
    website VARCHAR(500),
    primary_contact_person VARCHAR(255),
    primary_phone VARCHAR(20),
    province VARCHAR(100),
    city VARCHAR(100),
    address TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    product_categories TEXT[], -- Array of categories they supply
    min_order_quantity INT,
    average_lead_time_days INT,
    verification_status ENUM ('pending', 'verified', 'rejected') DEFAULT 'pending',
    reliability_score DECIMAL(5, 2) DEFAULT 0,
    total_orders INT DEFAULT 0,
    total_revenue DECIMAL(15, 2) DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX idx_vendors_user_id ON vendors(user_id);
CREATE INDEX idx_vendors_city ON vendors(city);
CREATE INDEX idx_vendors_verification_status ON vendors(verification_status);
CREATE INDEX idx_vendors_category ON vendors USING GIN(product_categories);
```

### 4. Procurement Requests
```sql
CREATE TABLE procurement_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    umkm_id UUID NOT NULL REFERENCES umkms(id) ON DELETE CASCADE,
    product_name VARCHAR(255) NOT NULL,
    product_category VARCHAR(100),
    product_description TEXT,
    quantity DECIMAL(10, 2) NOT NULL,
    unit VARCHAR(50),
    quality_specifications TEXT,
    budget DECIMAL(15, 2),
    preferred_delivery_date DATE,
    delivery_urgency ENUM ('normal', 'urgent', 'critical') DEFAULT 'normal',
    delivery_city VARCHAR(100),
    delivery_address TEXT,
    special_requirements TEXT,
    status ENUM ('draft', 'active', 'matched', 'grouped', 'completed', 'cancelled') DEFAULT 'draft',
    product_embedding VECTOR(384), -- For AI matching (pgvector extension)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP,
    
    FOREIGN KEY (umkm_id) REFERENCES umkms(id)
);

CREATE INDEX idx_procurement_requests_umkm_id ON procurement_requests(umkm_id);
CREATE INDEX idx_procurement_requests_status ON procurement_requests(status);
CREATE INDEX idx_procurement_requests_category ON procurement_requests(product_category);
CREATE INDEX idx_procurement_requests_embedding ON procurement_requests USING ivfflat(product_embedding vector_cosine_ops);
```

### 5. Procurement Groups
```sql
CREATE TABLE procurement_groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_name VARCHAR(255) NOT NULL,
    description TEXT,
    product_category VARCHAR(100),
    total_quantity DECIMAL(10, 2),
    unit VARCHAR(50),
    total_budget DECIMAL(15, 2),
    member_count INT DEFAULT 0,
    target_delivery_date DATE,
    delivery_city VARCHAR(100),
    status ENUM ('forming', 'active', 'negotiating', 'ordered', 'delivered', 'completed', 'cancelled') DEFAULT 'forming',
    created_by_umkm_id UUID NOT NULL REFERENCES umkms(id),
    selected_vendor_id UUID REFERENCES vendors(id),
    total_savings DECIMAL(15, 2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (created_by_umkm_id) REFERENCES umkms(id)
);

CREATE INDEX idx_procurement_groups_status ON procurement_groups(status);
CREATE INDEX idx_procurement_groups_created_by ON procurement_groups(created_by_umkm_id);
CREATE INDEX idx_procurement_groups_vendor ON procurement_groups(selected_vendor_id);
```

### 6. Group Memberships
```sql
CREATE TABLE group_memberships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID NOT NULL REFERENCES procurement_groups(id) ON DELETE CASCADE,
    umkm_id UUID NOT NULL REFERENCES umkms(id) ON DELETE CASCADE,
    request_id UUID REFERENCES procurement_requests(id),
    quantity DECIMAL(10, 2),
    unit_price DECIMAL(15, 2),
    total_price DECIMAL(15, 2),
    individual_budget DECIMAL(15, 2),
    savings_percentage DECIMAL(5, 2),
    status ENUM ('pending', 'accepted', 'rejected', 'completed') DEFAULT 'pending',
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(group_id, umkm_id),
    FOREIGN KEY (group_id) REFERENCES procurement_groups(id),
    FOREIGN KEY (umkm_id) REFERENCES umkms(id),
    FOREIGN KEY (request_id) REFERENCES procurement_requests(id)
);

CREATE INDEX idx_group_memberships_group_id ON group_memberships(group_id);
CREATE INDEX idx_group_memberships_umkm_id ON group_memberships(umkm_id);
CREATE INDEX idx_group_memberships_status ON group_memberships(status);
```

### 7. Supplier Quotes
```sql
CREATE TABLE supplier_quotes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID NOT NULL REFERENCES procurement_groups(id) ON DELETE CASCADE,
    vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
    total_quantity DECIMAL(10, 2),
    unit_price DECIMAL(15, 2),
    total_price DECIMAL(15, 2),
    lead_time_days INT,
    delivery_fee DECIMAL(15, 2),
    payment_terms TEXT,
    validity_days INT DEFAULT 7,
    quote_document_url VARCHAR(500),
    status ENUM ('pending', 'accepted', 'rejected', 'expired') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP,
    accepted_at TIMESTAMP,
    
    FOREIGN KEY (group_id) REFERENCES procurement_groups(id),
    FOREIGN KEY (vendor_id) REFERENCES vendors(id)
);

CREATE INDEX idx_supplier_quotes_group_id ON supplier_quotes(group_id);
CREATE INDEX idx_supplier_quotes_vendor_id ON supplier_quotes(vendor_id);
CREATE INDEX idx_supplier_quotes_status ON supplier_quotes(status);
```

### 8. Transactions (Orders)
```sql
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID NOT NULL REFERENCES procurement_groups(id),
    vendor_id UUID NOT NULL REFERENCES vendors(id),
    order_number VARCHAR(50) UNIQUE,
    quote_id UUID REFERENCES supplier_quotes(id),
    total_amount DECIMAL(15, 2) NOT NULL,
    tax_amount DECIMAL(15, 2) DEFAULT 0,
    delivery_fee DECIMAL(15, 2) DEFAULT 0,
    final_amount DECIMAL(15, 2) NOT NULL,
    quantity DECIMAL(10, 2),
    unit VARCHAR(50),
    delivery_date DATE,
    delivery_address TEXT,
    invoice_number VARCHAR(50),
    invoice_url VARCHAR(500),
    proof_of_delivery_url VARCHAR(500),
    payment_status ENUM ('pending', 'partial', 'completed', 'failed', 'refunded') DEFAULT 'pending',
    delivery_status ENUM ('pending', 'in_transit', 'delivered', 'returned') DEFAULT 'pending',
    order_status ENUM ('pending', 'confirmed', 'preparing', 'ready', 'delivered', 'completed', 'cancelled') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    
    FOREIGN KEY (group_id) REFERENCES procurement_groups(id),
    FOREIGN KEY (vendor_id) REFERENCES vendors(id),
    FOREIGN KEY (quote_id) REFERENCES supplier_quotes(id)
);

CREATE INDEX idx_transactions_group_id ON transactions(group_id);
CREATE INDEX idx_transactions_vendor_id ON transactions(vendor_id);
CREATE INDEX idx_transactions_payment_status ON transactions(payment_status);
CREATE INDEX idx_transactions_delivery_status ON transactions(delivery_status);
CREATE INDEX idx_transactions_order_status ON transactions(order_status);
```

### 9. Payments
```sql
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_id UUID NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
    payment_method VARCHAR(50), -- 'midtrans', 'bank_transfer', 'credit_card'
    payment_reference VARCHAR(100),
    amount DECIMAL(15, 2) NOT NULL,
    payment_date TIMESTAMP,
    status ENUM ('pending', 'processing', 'completed', 'failed', 'refunded') DEFAULT 'pending',
    provider_transaction_id VARCHAR(255),
    provider_response JSONB,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (transaction_id) REFERENCES transactions(id)
);

CREATE INDEX idx_payments_transaction_id ON payments(transaction_id);
CREATE INDEX idx_payments_status ON payments(status);
```

### 10. Credit Trail
```sql
CREATE TABLE credit_trail (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    umkm_id UUID NOT NULL REFERENCES umkms(id) ON DELETE CASCADE,
    transaction_id UUID REFERENCES transactions(id),
    event_type VARCHAR(100), -- 'procurement', 'payment', 'delivery', etc.
    event_description TEXT,
    amount DECIMAL(15, 2),
    credit_score_change DECIMAL(5, 2),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (umkm_id) REFERENCES umkms(id),
    FOREIGN KEY (transaction_id) REFERENCES transactions(id)
);

CREATE INDEX idx_credit_trail_umkm_id ON credit_trail(umkm_id);
CREATE INDEX idx_credit_trail_timestamp ON credit_trail(timestamp);
```

### 11. AI Match Results
```sql
CREATE TABLE match_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id UUID NOT NULL REFERENCES procurement_requests(id) ON DELETE CASCADE,
    matched_request_ids UUID[] NOT NULL, -- Array of matching request IDs
    similarity_score DECIMAL(5, 2),
    group_id UUID REFERENCES procurement_groups(id),
    algorithm_version VARCHAR(50),
    suggested_vendors UUID[] NOT NULL, -- Array of vendor IDs
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (request_id) REFERENCES procurement_requests(id)
);

CREATE INDEX idx_match_results_request_id ON match_results(request_id);
CREATE INDEX idx_match_results_group_id ON match_results(group_id);
```

### 12. Notifications
```sql
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT,
    notification_type VARCHAR(50), -- 'procurement_created', 'group_formed', etc.
    related_entity_id UUID,
    related_entity_type VARCHAR(100),
    is_read BOOLEAN DEFAULT false,
    channel VARCHAR(50), -- 'in_app', 'email', 'sms', 'whatsapp'
    delivery_status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    read_at TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);
```

### 13. Analytics Snapshots
```sql
CREATE TABLE analytics_snapshots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    umkm_id UUID REFERENCES umkms(id) ON DELETE CASCADE,
    period_start DATE,
    period_end DATE,
    total_requests INT,
    total_groups_joined INT,
    total_orders INT,
    total_procurement_value DECIMAL(15, 2),
    total_savings DECIMAL(15, 2),
    average_savings_percentage DECIMAL(5, 2),
    average_lead_time_days INT,
    on_time_delivery_rate DECIMAL(5, 2),
    payment_on_time_rate DECIMAL(5, 2),
    credit_score DECIMAL(5, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (umkm_id) REFERENCES umkms(id)
);

CREATE INDEX idx_analytics_snapshots_umkm_id ON analytics_snapshots(umkm_id);
CREATE INDEX idx_analytics_snapshots_period ON analytics_snapshots(period_start, period_end);
```

### 14. Vendor Ratings & Reviews
```sql
CREATE TABLE vendor_ratings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
    umkm_id UUID NOT NULL REFERENCES umkms(id) ON DELETE CASCADE,
    transaction_id UUID REFERENCES transactions(id),
    rating DECIMAL(3, 1) CHECK (rating >= 1 AND rating <= 5),
    quality_rating INT,
    delivery_rating INT,
    price_rating INT,
    communication_rating INT,
    review_text TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (vendor_id) REFERENCES vendors(id),
    FOREIGN KEY (umkm_id) REFERENCES umkms(id),
    FOREIGN KEY (transaction_id) REFERENCES transactions(id)
);

CREATE INDEX idx_vendor_ratings_vendor_id ON vendor_ratings(vendor_id);
CREATE INDEX idx_vendor_ratings_umkm_id ON vendor_ratings(umkm_id);
```

## Migration Strategy

```sql
-- Create extensions first
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgvector";

-- Then create tables in dependency order:
-- 1. Users
-- 2. UMKMs
-- 3. Vendors
-- 4. Procurement Requests
-- 5. Procurement Groups
-- 6. Group Memberships
-- 7. Supplier Quotes
-- 8. Transactions
-- 9. Payments
-- 10. Credit Trail
-- 11. Match Results
-- 12. Notifications
-- 13. Analytics Snapshots
-- 14. Vendor Ratings
```

## Key Indexing Strategy

1. **Foreign Keys**: Indexed for JOIN performance
2. **Status Columns**: Indexed for filtering queries
3. **Time Columns**: Indexed for range queries
4. **Vector Embeddings**: Indexed with pgvector IVFFLAT
5. **Business Logic**: Array columns indexed with GIN

## Performance Considerations

- Partitioning tables by date (transactions, analytics)
- Read replicas for analytics queries
- Connection pooling for database access
- Query optimization and N+1 prevention in ORM

---

**Version**: 1.0
**Last Updated**: May 2026
