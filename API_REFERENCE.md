# API Response Reference

## Registration Response

### Request
```json
POST /api/auth/register
{
    "name": "John Doe",
    "email": "john@example.com",
    "nic": "123456789V",
    "contact": "+94 71 234 5678",
    "password": "Test@123"
}
```

### Success Response (201)
```json
{
    "success": true,
    "message": "User registered successfully",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
        "id": "507f1f77bcf86cd799439011",
        "name": "John Doe",
        "email": "john@example.com",
        "role": "student",
        "approvalStatus": "pending"
    }
}
```

### Error Responses

**Missing Fields (400)**
```json
{
    "message": "Please provide all required fields"
}
```

**Email Already Exists (400)**
```json
{
    "message": "User with this email already exists"
}
```

**Server Error (500)**
```json
{
    "message": "Server error",
    "error": "Error details..."
}
```

---

## Login Response

### Request
```json
POST /api/auth/login
{
    "email": "john@example.com",
    "password": "Test@123"
}
```

### Success Response (200)
```json
{
    "success": true,
    "message": "Login successful",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
        "id": "507f1f77bcf86cd799439011",
        "name": "John Doe",
        "email": "john@example.com",
        "role": "student",
        "approvalStatus": "pending"
    }
}
```

### Error Responses

**Missing Email or Password (400)**
```json
{
    "message": "Please provide email and password"
}
```

**Invalid Credentials (401)**
```json
{
    "message": "Invalid credentials"
}
```

---

## Get Branches Response

### Request
```json
GET /api/auth/branches
```

### Success Response (200)
```json
{
    "success": true,
    "branches": [
        {
            "_id": "507f1f77bcf86cd799439011",
            "name": "Main Branch",
            "location": "Colombo",
            "phone": "+94 11 234 5678",
            "email": "main@paradiselearners.com",
            "description": "Our main training facility",
            "createdAt": "2026-06-13T10:30:00.000Z",
            "updatedAt": "2026-06-13T10:30:00.000Z"
        },
        {
            "_id": "507f1f77bcf86cd799439012",
            "name": "North Branch",
            "location": "Kandy",
            "phone": "+94 81 234 5678",
            "email": "north@paradiselearners.com",
            "description": "Training facility in Kandy",
            "createdAt": "2026-06-13T10:30:00.000Z",
            "updatedAt": "2026-06-13T10:30:00.000Z"
        }
    ]
}
```

### Error Response (500)
```json
{
    "message": "Server error",
    "error": "Error details..."
}
```

---

## Get Current User Response

### Request
```
GET /api/auth/me
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Success Response (200)
```json
{
    "success": true,
    "user": {
        "_id": "507f1f77bcf86cd799439011",
        "name": "John Doe",
        "email": "john@example.com",
        "nic": "123456789V",
        "contact": "+94 71 234 5678",
        "role": "student",
        "branch": {
            "_id": "507f1f77bcf86cd799439011",
            "name": "Main Branch",
            "location": "Colombo",
            "phone": "+94 11 234 5678",
            "email": "main@paradiselearners.com"
        },
        "approvalStatus": "pending",
        "enrollmentDate": "2026-06-13T10:30:00.000Z",
        "createdAt": "2026-06-13T10:30:00.000Z",
        "updatedAt": "2026-06-13T10:30:00.000Z"
    }
}
```

### Error Responses

**No Token (401)**
```json
{
    "message": "No token provided, authorization denied"
}
```

**Invalid Token (401)**
```json
{
    "message": "Token is not valid",
    "error": "jwt malformed"
}
```

---

## Dashboard Stats Response (Admin Only)

### Request
```
GET /api/auth/dashboard-stats
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Success Response (200)
```json
{
    "success": true,
    "stats": {
        "totalStudents": 45,
        "pendingApprovals": 12,
        "approvedStudents": 30
    }
}
```

### Error Responses

**Admin Only (403)**
```json
{
    "message": "Admin access only"
}
```

---

## Get All Students Response (Admin Only)

### Request
```
GET /api/auth/students
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Success Response (200)
```json
{
    "success": true,
    "students": [
        {
            "_id": "507f1f77bcf86cd799439011",
            "name": "John Doe",
            "email": "john@example.com",
            "nic": "123456789V",
            "contact": "+94 71 234 5678",
            "role": "student",
            "branch": {
                "_id": "507f1f77bcf86cd799439011",
                "name": "Main Branch",
                "location": "Colombo"
            },
            "approvalStatus": "pending",
            "enrollmentDate": "2026-06-13T10:30:00.000Z"
        },
        {
            "_id": "507f1f77bcf86cd799439012",
            "name": "Jane Smith",
            "email": "jane@example.com",
            "nic": "987654321V",
            "contact": "+94 71 987 6543",
            "role": "student",
            "branch": {
                "_id": "507f1f77bcf86cd799439011",
                "name": "Main Branch",
                "location": "Colombo"
            },
            "approvalStatus": "approved",
            "enrollmentDate": "2026-06-12T09:15:00.000Z"
        }
    ]
}
```

---

## Update Approval Status Response (Admin Only)

### Request
```json
PUT /api/auth/students/507f1f77bcf86cd799439011/approve
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

{
    "status": "approved"
}
```

### Success Response (200)
```json
{
    "success": true,
    "message": "Approval status updated",
    "user": {
        "_id": "507f1f77bcf86cd799439011",
        "name": "John Doe",
        "email": "john@example.com",
        "nic": "123456789V",
        "contact": "+94 71 234 5678",
        "role": "student",
        "approvalStatus": "approved",
        "enrollmentDate": "2026-06-13T10:30:00.000Z"
    }
}
```

### Error Responses

**Invalid Status (400)**
```json
{
    "message": "Invalid status"
}
```

**Student Not Found (404)**
```json
{
    "message": "User not found"
}
```

---

## Token Structure

### JWT Payload
```json
{
    "id": "507f1f77bcf86cd799439011",
    "role": "student",
    "iat": 1718349000,
    "exp": 1718953800
}
```

- **id**: User MongoDB ID
- **role**: 'student' or 'admin'
- **iat**: Issued at (Unix timestamp)
- **exp**: Expires at (Unix timestamp) - 7 days from issue

---

## HTTP Status Codes

| Status | Meaning | Common Causes |
|--------|---------|---------------|
| 200 | OK | Request successful |
| 201 | Created | Resource created (registration) |
| 400 | Bad Request | Invalid input, missing fields |
| 401 | Unauthorized | Invalid token, invalid credentials |
| 403 | Forbidden | Admin access required |
| 404 | Not Found | User/resource doesn't exist |
| 500 | Server Error | Database error, server crash |

---

## Error Message Reference

| Error | Cause | Solution |
|-------|-------|----------|
| "Please provide all required fields" | Missing registration fields | Fill all fields |
| "User with this email already exists" | Email already registered | Use different email or login |
| "Please provide a valid email" | Invalid email format | Use valid email (user@domain.com) |
| "Invalid credentials" | Wrong email or password | Check email/password |
| "Please provide email and password" | Missing login fields | Fill both fields |
| "No token provided" | Not authenticated | Login first |
| "Token is not valid" | Expired or corrupted token | Login again |
| "Admin access only" | Non-admin accessing admin endpoint | Use admin account |
| "User not found" | Student ID doesn't exist | Check student ID |
| "Invalid status" | Wrong approval status value | Use: pending, approved, rejected |

---

## Testing with cURL

### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "nic": "123456789V",
    "contact": "+94 71 234 5678",
    "password": "Test@123"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "Test@123"
  }'
```

### Get Branches
```bash
curl -X GET http://localhost:5000/api/auth/branches
```

### Get Current User (with token)
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Get Stats (Admin)
```bash
curl -X GET http://localhost:5000/api/auth/dashboard-stats \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

### Approve Student (Admin)
```bash
curl -X PUT http://localhost:5000/api/auth/students/STUDENT_ID/approve \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "approved"}'
```

---

This reference covers all API responses and their expected formats.
