# Deschain API Design Guide

## API Principles

- **REST Architecture**: Resource-based endpoints
- **JSON Requests/Responses**: Consistent format
- **Versioning**: `/api/v1/` prefix
- **Authentication**: JWT Bearer tokens
- **Error Handling**: Standard HTTP status codes
- **Pagination**: Cursor-based for large datasets
- **Rate Limiting**: Per-user rate limits

## Response Format

All API responses follow this format:

```json
{
  "success": true,
  "message": "Operation successful",
  "data": { /* response data */ },
  "meta": {
    "timestamp": "2024-05-27T10:30:00Z",
    "version": "1.0"
  }
}
```

## Error Response Format

```json
{
  "success": false,
  "message": "Error message",
  "error": {
    "code": "VALIDATION_ERROR",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ]
  },
  "meta": {
    "timestamp": "2024-05-27T10:30:00Z",
    "request_id": "uuid"
  }
}
```

## HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Not authenticated |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 409 | Conflict - Resource already exists |
| 422 | Unprocessable Entity - Validation failed |
| 429 | Too Many Requests - Rate limited |
| 500 | Server Error - Internal error |

## Authentication

### Request Headers

```
Authorization: Bearer <access_token>
Content-Type: application/json
```

### Token Format

JWT containing:
- `sub`: User ID
- `user_type`: 'umkm' | 'vendor' | 'admin'
- `email`: User email
- `iat`: Issued at
- `exp`: Expiration (15 minutes)

## Endpoint Categories

### 1. Authentication Endpoints

#### Register User
```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "first_name": "John",
  "last_name": "Doe",
  "user_type": "umkm",
  "phone": "+62812345678"
}
```

**Response (201)**:
```json
{
  "success": true,
  "data": {
    "user_id": "uuid",
    "email": "user@example.com",
    "verification_sent": true
  }
}
```

#### Login
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Response (200)**:
```json
{
  "success": true,
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIs...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "user_type": "umkm",
      "name": "John Doe"
    }
  }
}
```

#### Refresh Token
```http
POST /api/v1/auth/refresh
Content-Type: application/json

{
  "refresh_token": "eyJhbGciOiJIUzI1NiIs..."
}
```

### 2. UMKM Endpoints

#### Create UMKM Profile
```http
POST /api/v1/umkm
Authorization: Bearer <token>
Content-Type: application/json

{
  "business_name": "CV. Maju Jaya",
  "business_registration_number": "1234567890123456",
  "industry_category": "Food Manufacturing",
  "employees_count": 15,
  "annual_revenue": 500000000,
  "province": "Jawa Barat",
  "city": "Bandung",
  "district": "Cidadap",
  "address": "Jl. Siliwangi No. 123",
  "bank_account_name": "CV. Maju Jaya",
  "bank_account_number": "1234567890",
  "bank_name": "BRI"
}
```

**Response (201)**:
```json
{
  "success": true,
  "data": {
    "umkm_id": "uuid",
    "business_name": "CV. Maju Jaya",
    "verification_status": "pending"
  }
}
```

#### Get UMKM Profile
```http
GET /api/v1/umkm/me
Authorization: Bearer <token>
```

**Response (200)**:
```json
{
  "success": true,
  "data": {
    "umkm_id": "uuid",
    "business_name": "CV. Maju Jaya",
    "credit_score": 3.8,
    "total_transactions": 12,
    "verification_status": "verified"
  }
}
```

### 3. Procurement Endpoints

#### Create Procurement Request
```http
POST /api/v1/procurement/request
Authorization: Bearer <token>
Content-Type: application/json

{
  "product_name": "Beras Premium Grade A",
  "product_category": "Food & Agriculture",
  "product_description": "Long grain white rice, high quality",
  "quality_specifications": "Broken: <5%, Moisture: <14%",
  "quantity": 100,
  "unit": "kg",
  "budget": 7000000,
  "preferred_delivery_date": "2024-06-10",
  "delivery_urgency": "normal",
  "delivery_city": "Bandung",
  "delivery_address": "Jl. Siliwangi No. 123",
  "special_requirements": "Packaging must be food-grade"
}
```

**Response (201)**:
```json
{
  "success": true,
  "data": {
    "request_id": "uuid",
    "status": "active",
    "created_at": "2024-05-27T10:30:00Z"
  }
}
```

#### Get Similar Requests
```http
GET /api/v1/procurement/request/{request_id}/similar
Authorization: Bearer <token>
```

**Response (200)**:
```json
{
  "success": true,
  "data": {
    "similar_requests": [
      {
        "request_id": "uuid",
        "umkm_name": "CV. Maju Jaya 2",
        "quantity": 80,
        "similarity_score": 0.92,
        "city": "Bandung"
      }
    ]
  }
}
```

### 4. Procurement Group Endpoints

#### Create Procurement Group
```http
POST /api/v1/procurement/group
Authorization: Bearer <token>
Content-Type: application/json

{
  "group_name": "Collective Rice Order - May 2024",
  "product_category": "Food & Agriculture",
  "description": "Group purchase for rice supplies",
  "target_delivery_date": "2024-06-10",
  "delivery_city": "Bandung"
}
```

**Response (201)**:
```json
{
  "success": true,
  "data": {
    "group_id": "uuid",
    "status": "forming",
    "member_count": 1
  }
}
```

#### Add Member to Group
```http
POST /api/v1/procurement/group/{group_id}/members
Authorization: Bearer <token>
Content-Type: application/json

{
  "request_id": "uuid",
  "quantity": 100,
  "unit": "kg"
}
```

**Response (201)**:
```json
{
  "success": true,
  "data": {
    "membership_id": "uuid",
    "group_id": "uuid",
    "member_count": 5,
    "total_quantity": 450,
    "estimated_discount_percentage": 12.5
  }
}
```

#### List Group Members
```http
GET /api/v1/procurement/group/{group_id}/members
Authorization: Bearer <token>
```

**Response (200)**:
```json
{
  "success": true,
  "data": {
    "members": [
      {
        "umkm_id": "uuid",
        "business_name": "CV. Maju Jaya",
        "quantity": 100,
        "unit": "kg",
        "joined_at": "2024-05-27T10:30:00Z"
      }
    ],
    "total_members": 5,
    "total_quantity": 450
  }
}
```

### 5. Vendor Endpoints

#### Get Vendor List
```http
GET /api/v1/vendor/list?category=Food&city=Bandung&page=1&limit=20
Authorization: Bearer <token>
```

**Response (200)**:
```json
{
  "success": true,
  "data": {
    "vendors": [
      {
        "vendor_id": "uuid",
        "vendor_name": "PT. Supplier Raya",
        "category": "Food & Agriculture",
        "city": "Bandung",
        "rating": 4.5,
        "total_orders": 156,
        "reliability_score": 0.92
      }
    ]
  },
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 45
  }
}
```

### 6. Payment Endpoints

#### Create Payment Order
```http
POST /api/v1/payment/order
Authorization: Bearer <token>
Content-Type: application/json

{
  "group_id": "uuid",
  "vendor_id": "uuid",
  "total_amount": 5400000,
  "payment_method": "midtrans"
}
```

**Response (201)**:
```json
{
  "success": true,
  "data": {
    "transaction_id": "uuid",
    "order_number": "ORD-20240527-001",
    "payment_url": "https://app.midtrans.com/payment/...",
    "payment_reference": "20240527001"
  }
}
```

#### Payment Callback (Webhook)
```http
POST /api/v1/payment/callback
Content-Type: application/json

{
  "transaction_id": "uuid",
  "status": "settlement",
  "payment_type": "credit_card",
  "amount": 5400000,
  "timestamp": "2024-05-27T10:35:00Z",
  "signature_key": "..."
}
```

### 7. Analytics Endpoints

#### Get Dashboard Metrics
```http
GET /api/v1/analytics/dashboard
Authorization: Bearer <token>
```

**Response (200)**:
```json
{
  "success": true,
  "data": {
    "total_procurement_value": 25000000,
    "total_savings": 2500000,
    "average_savings_percentage": 10.2,
    "total_transactions": 12,
    "credit_score": 3.8,
    "recent_transactions": [
      {
        "transaction_id": "uuid",
        "date": "2024-05-25",
        "amount": 5400000,
        "savings": 500000,
        "status": "completed"
      }
    ]
  }
}
```

### 8. Notification Endpoints

#### Get Notifications
```http
GET /api/v1/notification/list?unread=true&limit=20
Authorization: Bearer <token>
```

**Response (200)**:
```json
{
  "success": true,
  "data": {
    "notifications": [
      {
        "notification_id": "uuid",
        "title": "Group matched!",
        "message": "Your rice request matched with 4 other UMKMs",
        "type": "procurement_matched",
        "created_at": "2024-05-27T10:30:00Z",
        "is_read": false
      }
    ]
  }
}
```

#### Mark Notification as Read
```http
PUT /api/v1/notification/{notification_id}/read
Authorization: Bearer <token>
```

## Pagination

For list endpoints, use cursor-based pagination:

```http
GET /api/v1/resource/list?cursor=abc123&limit=20
```

Response includes:
```json
{
  "data": [...],
  "meta": {
    "cursor": "abc123",
    "next_cursor": "def456",
    "has_more": true,
    "limit": 20
  }
}
```

## Rate Limiting

- 100 requests per 15 minutes per user
- 1000 requests per 15 minutes per IP

Headers in response:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1685162400
```

## Error Codes

| Code | Description |
|------|-------------|
| VALIDATION_ERROR | Input validation failed |
| UNAUTHORIZED | Authentication required |
| FORBIDDEN | Insufficient permissions |
| NOT_FOUND | Resource not found |
| DUPLICATE_ENTRY | Resource already exists |
| INTERNAL_ERROR | Server error |

## Webhook Events

### Notification Events

The system will POST to configured webhook URLs:

```json
{
  "event_type": "procurement.matched",
  "timestamp": "2024-05-27T10:30:00Z",
  "data": {
    "request_id": "uuid",
    "matched_count": 4,
    "suggested_group_id": "uuid"
  }
}
```

---

**Version**: 1.0
**Last Updated**: May 2026
