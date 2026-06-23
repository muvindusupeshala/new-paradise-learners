# Quick Start Setup Guide

## ⚡ 5-Minute Setup

### Step 1: Start Backend (Terminal 1)

```bash
cd backend
npm run dev
```

Expected output:
```
MongoDB Connected: localhost:27017
Server is running on port 5000
```

### Step 2: Start Frontend (Terminal 2)

```bash
cd frontend
npm run dev
```

Expected output:
```
VITE v5.3.1  ready in xxx ms
➜  Local:   http://localhost:5173/
```

### Step 3: Open in Browser

Go to `http://localhost:5173`

---

## 🧪 Testing the System

### Test 1: Register as Student

1. Click "Register" on landing page
2. Fill in details:
   - Name: John Doe
   - Email: john@example.com
   - NIC: 123456789V
   - Contact: +94 71 234 5678
   - Password: Test@123
3. Select a branch (optional)
4. Submit registration

✅ Account created with "Pending" approval status

### Test 2: Login

1. Go to Login page
2. Enter your email and password
3. You'll see "Student Dashboard" with approval status

### Test 3: Admin Access (For Testing)

Run this in browser console to test admin features:

```javascript
// Create a mock admin token (for testing only)
// In production, use proper admin account

// 1. Register as normal user first
// 2. Then go to login
// 3. Open browser console (F12)
// 4. Go to Admin Dashboard using:
window.location.href = '/admin-dashboard';

// If not authenticated, you'll be redirected to login
```

**Better way - Create admin in MongoDB:**

```javascript
// In MongoDB compass or mongosh
db.users.insertOne({
    name: "Admin",
    email: "admin@test.com",
    nic: "000000000V",
    contact: "+94 71 000 0000",
    password: "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4ovsS", // "admin123"
    role: "admin",
    approvalStatus: "approved"
})
```

Then login with admin@test.com / admin123

---

## 📊 Features to Test

### Landing Page
- ✅ View branch information
- ✅ See features and benefits
- ✅ Navigation to Login/Register

### Student Registration
- ✅ Email validation
- ✅ NIC unique check
- ✅ Password requirements
- ✅ Branch selection
- ✅ Approval status tracking

### Student Dashboard
- ✅ View personal information
- ✅ Check approval status
- ✅ Access online resources (if approved)
- ✅ Logout functionality

### Admin Dashboard
- ✅ View total students count
- ✅ See pending approvals
- ✅ View approved students
- ✅ Search students
- ✅ Filter by status
- ✅ Approve/Reject applications
- ✅ Real-time updates

---

## 🐛 Common Issues & Solutions

### Issue: Backend won't connect to MongoDB

**Solution:**
```bash
# 1. Check MongoDB is running
mongod  # Start MongoDB service

# 2. Verify .env has correct URI
# In backend/.env
MONGODB_URI=mongodb://localhost:27017/paradise-learners

# 3. Restart backend
npm run dev
```

### Issue: Frontend shows "Failed to fetch branches"

**Solution:**
1. Ensure backend is running on port 5000
2. Check browser console for errors (F12)
3. Verify CORS is enabled in backend

### Issue: "Invalid token" error on dashboard

**Solution:**
```javascript
// Clear and re-login
localStorage.clear();
window.location.href = '/login';
```

### Issue: Port already in use

**Windows:**
```bash
# Kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Kill process on port 5173
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

**Mac/Linux:**
```bash
# Kill process on port 5000
lsof -i :5000
kill -9 <PID>

# Kill process on port 5173
lsof -i :5173
kill -9 <PID>
```

---

## 📝 API Endpoints (for testing with Postman)

### Register Student
```
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
    "name": "John Doe",
    "email": "john@test.com",
    "nic": "123456789V",
    "contact": "+94 71 234 5678",
    "password": "Test@123"
}
```

### Login
```
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
    "email": "john@test.com",
    "password": "Test@123"
}
```

### Get Branches
```
GET http://localhost:5000/api/auth/branches
```

### Get Current User (Requires Token)
```
GET http://localhost:5000/api/auth/me
Authorization: Bearer <token_from_login>
```

### Get Dashboard Stats (Admin Only)
```
GET http://localhost:5000/api/auth/dashboard-stats
Authorization: Bearer <admin_token>
```

### Get All Students (Admin Only)
```
GET http://localhost:5000/api/auth/students
Authorization: Bearer <admin_token>
```

### Approve Student (Admin Only)
```
PUT http://localhost:5000/api/auth/students/<student_id>/approve
Authorization: Bearer <admin_token>
Content-Type: application/json

{
    "status": "approved"
}
```

---

## 🎨 Key Features Implemented

✅ **Landing Page**
- Beautiful hero section
- Branch showcase with details
- Feature highlights
- Responsive design

✅ **Authentication**
- Email-based login
- Password hashing with bcryptjs
- JWT token management
- Session persistence

✅ **Student Features**
- Registration with validation
- Personal dashboard
- Approval status tracking
- Online resources access (when approved)

✅ **Admin Features**
- Analytics overview
- Student management
- Approval workflow
- Search & filter
- Real-time updates

✅ **Security**
- Protected routes
- Role-based access control
- Password validation
- Secure token storage
- Error handling

---

## 📱 Responsive Design

All pages are fully responsive:
- ✅ Mobile (320px+)
- ✅ Tablet (768px+)
- ✅ Desktop (1024px+)

---

## 🚀 Next Steps

1. ✅ System is ready for testing
2. Customize branch information
3. Add more online resources
4. Implement email notifications
5. Add payment integration
6. Deploy to production

---

## 📞 Support

For detailed information, see the main **README.md** file.

---

Happy testing! 🎓
