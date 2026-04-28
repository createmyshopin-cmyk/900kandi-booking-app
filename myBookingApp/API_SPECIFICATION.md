# API Specification 📡

Complete API specification for the LuxeStay Booking Admin App backend.

## Overview

- **Base URL**: Configure in `/src/config/env.js`
- **Authentication**: Bearer token in Authorization header
- **Content-Type**: application/json
- **Timeout**: 10 seconds
- **Framework**: CodeIgniter (recommended)

## Authentication

### Login Endpoint

**Request:**

```http
POST /login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "password123"
}
```

**Success Response (200 OK):**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "John Admin",
    "email": "admin@example.com",
    "role": "admin"
  }
}
```

**Error Response (401 Unauthorized):**

```json
{
  "error": true,
  "message": "Invalid credentials"
}
```

**Error Response (422 Validation Error):**

```json
{
  "error": true,
  "message": "Validation failed",
  "errors": {
    "email": ["Email is required"],
    "password": ["Password must be at least 6 characters"]
  }
}
```

### Token Format

JWT token should include:

- User ID
- User role
- Expiration time (recommend 24 hours)

**Token Header:**

```
Authorization: Bearer {token}
```

### Role Types

Valid roles:

```
admin               - Full access
reservation_manager - Can modify bookings
guest_manager      - Read-only limited view
```

## Bookings Endpoints

### Get All Bookings

**Request:**

```http
GET /admin/bookings?role=admin&page=1&limit=20
Authorization: Bearer {token}
```

**Query Parameters (Optional):**
| Parameter | Type | Description |
|-----------|------|-------------|
| role | string | Filter by user role |
| page | integer | Pagination page (default: 1) |
| limit | integer | Items per page (default: 20) |
| search | string | Search by guest name |
| status | string | Filter by status |

**Success Response (200 OK):**

```json
{
  "data": [
    {
      "id": 101,
      "guest_name": "John Doe",
      "mobile": "9876543210",
      "category": "Premium Suite",
      "total_guests": 2,
      "checkin_date": "2026-05-10",
      "checkout_date": "2026-05-15",
      "status": "confirmed",
      "created_at": "2026-04-20T10:30:00Z",
      "updated_at": "2026-04-20T10:30:00Z"
    },
    {
      "id": 102,
      "guest_name": "Jane Smith",
      "mobile": "9123456780",
      "category": "Standard Room",
      "total_guests": 4,
      "checkin_date": "2026-05-12",
      "checkout_date": "2026-05-14",
      "status": "pending",
      "created_at": "2026-04-21T14:45:00Z",
      "updated_at": "2026-04-21T14:45:00Z"
    }
  ],
  "pagination": {
    "current_page": 1,
    "total_pages": 5,
    "total_items": 95,
    "per_page": 20
  }
}
```

**Error Response (401 Unauthorized):**

```json
{
  "error": true,
  "message": "Unauthorized - Invalid or expired token"
}
```

### Get Single Booking

**Request:**

```http
GET /admin/bookings/{id}
Authorization: Bearer {token}
```

**URL Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| id | integer | Booking ID |

**Success Response (200 OK):**

```json
{
  "data": {
    "id": 101,
    "guest_name": "John Doe",
    "guest_email": "john@example.com",
    "mobile": "9876543210",
    "category": "Premium Suite",
    "total_guests": 2,
    "room_number": "301",
    "checkin_date": "2026-05-10",
    "checkout_date": "2026-05-15",
    "status": "confirmed",
    "check_in_time": "2:00 PM",
    "check_out_time": "11:00 AM",
    "notes": "VIP guest",
    "created_at": "2026-04-20T10:30:00Z",
    "updated_at": "2026-04-20T10:30:00Z"
  }
}
```

**Error Response (404 Not Found):**

```json
{
  "error": true,
  "message": "Booking not found"
}
```

### Update Booking Status

**Request:**

```http
PUT /admin/bookings/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "status": "confirmed"
}
```

**URL Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| id | integer | Booking ID |

**Request Body:**
| Field | Type | Required | Values |
|-------|------|----------|--------|
| status | string | Yes | pending, confirmed, cancelled |

**Success Response (200 OK):**

```json
{
  "message": "Booking updated successfully",
  "data": {
    "id": 101,
    "status": "confirmed",
    "updated_at": "2026-04-28T15:20:00Z"
  }
}
```

**Error Responses:**

401 Unauthorized:

```json
{
  "error": true,
  "message": "Unauthorized"
}
```

403 Forbidden (insufficient permissions):

```json
{
  "error": true,
  "message": "You do not have permission to update bookings"
}
```

404 Not Found:

```json
{
  "error": true,
  "message": "Booking not found"
}
```

422 Validation Error:

```json
{
  "error": true,
  "message": "Validation failed",
  "errors": {
    "status": ["Invalid status value"]
  }
}
```

### Delete Booking

**Request:**

```http
DELETE /admin/bookings/{id}
Authorization: Bearer {token}
```

**URL Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| id | integer | Booking ID |

**Success Response (200 OK):**

```json
{
  "message": "Booking deleted successfully"
}
```

**Error Responses:**

403 Forbidden (only admin can delete):

```json
{
  "error": true,
  "message": "Only administrators can delete bookings"
}
```

404 Not Found:

```json
{
  "error": true,
  "message": "Booking not found"
}
```

## Data Types & Constraints

### Booking Object

| Field         | Type    | Required | Constraints                      |
| ------------- | ------- | -------- | -------------------------------- |
| id            | integer | Yes      | Unique, auto-increment           |
| guest_name    | string  | Yes      | 1-100 characters                 |
| guest_email   | string  | Yes      | Valid email format               |
| mobile        | string  | Yes      | 10-15 digits                     |
| category      | string  | Yes      | Room type (50 chars max)         |
| total_guests  | integer | Yes      | 1-10                             |
| checkin_date  | string  | Yes      | YYYY-MM-DD format, future date   |
| checkout_date | string  | Yes      | YYYY-MM-DD format, after checkin |
| status        | string  | Yes      | pending, confirmed, cancelled    |
| notes         | string  | No       | Max 500 characters               |
| created_at    | string  | Yes      | ISO 8601 format                  |
| updated_at    | string  | Yes      | ISO 8601 format                  |

### Dates

- Format: `YYYY-MM-DD` (ISO 8601)
- Timestamps: ISO 8601 with timezone (e.g., `2026-04-28T15:20:00Z`)

### Pagination

When list endpoints include pagination:

| Field        | Type    | Description           |
| ------------ | ------- | --------------------- |
| current_page | integer | Current page number   |
| total_pages  | integer | Total number of pages |
| total_items  | integer | Total number of items |
| per_page     | integer | Items per page        |

## Status Codes

| Code | Meaning              | When Used                   |
| ---- | -------------------- | --------------------------- |
| 200  | OK                   | Successful GET, PUT, DELETE |
| 201  | Created              | Successful POST (create)    |
| 400  | Bad Request          | Invalid request format      |
| 401  | Unauthorized         | Invalid or missing token    |
| 403  | Forbidden            | Insufficient permissions    |
| 404  | Not Found            | Resource doesn't exist      |
| 422  | Unprocessable Entity | Validation error            |
| 429  | Too Many Requests    | Rate limit exceeded         |
| 500  | Server Error         | Unexpected server error     |

## Authorization Rules

### Admin Role

- ✅ View all bookings
- ✅ View all booking details (including mobile)
- ✅ Update any booking status
- ✅ Delete any booking

### Reservation Manager Role

- ✅ View all bookings
- ✅ View all booking details (including mobile)
- ✅ Update booking status
- ❌ Cannot delete bookings

### Guest Manager Role

- ✅ View limited booking data (no mobile, no status)
- ✅ View basic details only
- ❌ Cannot update status
- ❌ Cannot delete bookings

## Rate Limiting

Recommend implementing rate limiting:

- **Per User**: 100 requests per minute
- **Per IP**: 1000 requests per minute
- **Return Header**: `X-RateLimit-Remaining`

## CORS

Enable CORS headers (if API and frontend on different domains):

```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, PUT, DELETE
Access-Control-Allow-Headers: Content-Type, Authorization
```

## Error Handling

All error responses should include:

```json
{
  "error": true,
  "message": "Human readable error message",
  "code": "ERROR_CODE",
  "timestamp": "2026-04-28T15:20:00Z"
}
```

## Implementation Checklist

Backend developer should ensure:

- [ ] All endpoints return JSON
- [ ] All dates in YYYY-MM-DD format
- [ ] Timestamps in ISO 8601 format
- [ ] Role-based access control implemented
- [ ] Input validation on all endpoints
- [ ] Authentication via JWT token
- [ ] Bearer token in Authorization header
- [ ] Proper HTTP status codes
- [ ] Pagination for list endpoints
- [ ] Rate limiting implemented
- [ ] CORS headers configured
- [ ] Error responses include error field
- [ ] Test with various user roles
- [ ] API documentation (Swagger/OpenAPI)
- [ ] Test with mobile client (this app)

## Testing

### Test Cases

1. **Login Flow**
   - [ ] Valid credentials → Success
   - [ ] Invalid credentials → 401
   - [ ] Missing email → 422
   - [ ] Missing password → 422

2. **List Bookings**
   - [ ] Admin sees all data
   - [ ] Manager sees all data
   - [ ] Guest manager sees limited data
   - [ ] No token → 401
   - [ ] Expired token → 401

3. **Update Status**
   - [ ] Admin can update
   - [ ] Manager can update
   - [ ] Guest manager cannot update
   - [ ] Invalid status → 422

4. **Security**
   - [ ] SQL injection attempts blocked
   - [ ] XSS attacks prevented
   - [ ] CSRF protection enabled
   - [ ] Rate limiting works

## Frontend Integration

The React Native app will call these endpoints:

- `loginApi(email, password)` → POST /login
- `getBookings(role)` → GET /admin/bookings
- `getBookingDetail(id)` → GET /admin/bookings/{id}
- `updateBookingStatus(id, status)` → PUT /admin/bookings/{id}

See `/src/services/api.js` for implementation details.

---

**API Version**: 1.0
**Last Updated**: April 28, 2026
