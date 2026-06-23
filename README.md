# New Paradise Learners - Driving School Management System

A complete MERN (MongoDB, Express, React, Node.js) stack application for managing a driving school with role-based access control, student registration, approval system, and admin dashboard.

## Features

✅ **Landing & Registration**: Beautiful landing page with branch details and student registration
✅ **Authentication**: Secure email-based login with JWT tokens
✅ **Role-Based Access**: Separate dashboards for Students and Admins
✅ **Student Dashboard**: View approval status and access online learning resources
✅ **Admin Dashboard**: Manage students, view analytics, and approve registrations
✅ **Error-Free Implementation**: Production-ready code with comprehensive error handling

## Project Structure

```
Paradise Lernerse/
├── backend/
│   ├── config/
│   │   └── db.js           # MongoDB connection
│   ├── controllers/
│   │   └── authController.js # Auth logic
│   ├── middleware/
│   │   └── authMiddleware.js # JWT verification
│   ├── models/
│   │   ├── User.js         # User schema
│   │   └── Branch.js       # Branch schema
│   ├── routes/
│   │   └── authRoutes.js   # Auth endpoints
│   ├── .env                # Environment variables
│   ├── server.js           # Main server
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── pages/
    │   │   ├── LandingPage.jsx
    │   │   ├── RegisterPage.jsx
    │   │   ├── LoginPage.jsx
    │   │   ├── StudentDashboard.jsx
    │   │   └── AdminDashboard.jsx
    │   ├── components/
    │   │   └── ProtectedRoute.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── hooks/
    │   │   └── useAuth.js
    │   ├── utils/
    │   │   └── api.js
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    └── package.json
```

## Getting Started

### Prerequisites

- Node.js (v14+)
- MongoDB (local or cloud)
- npm or yarn

### Installation

#### 1. Backend Setup

```bash
cd backend
npm install
```

**Configure Environment Variables** - Update `.env`:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/paradise-learners
JWT_SECRET=your_jwt_secret_key_change_in_production
NODE_ENV=development
```

**Start Backend Server**:

```bash
npm run dev  # Development with nodemon
# or
npm start   # Production
```

Backend will run on `http://localhost:5000`

#### 2. Frontend Setup

```bash
cd frontend
npm install
```

**Start Frontend Server**:

```bash
npm run dev
```

Frontend will run on `http://localhost:5173`

### Database Setup (Optional - Create Sample Branch)

Connect to MongoDB and insert a sample branch:

```javascript
db.branches.insertOne({
    name: "Main Branch",
    location: "Colombo",
    phone: "+94 11 234 5678",
    email: "main@paradiselearners.com",
    description: "Our main training facility"
})
```

## API Endpoints

### Authentication Routes (Public)

- `POST /api/auth/register` - Register new student
- `POST /api/auth/login` - Login user
- `GET /api/auth/branches` - Get all branches

### Protected Routes (Requires JWT Token)

- `GET /api/auth/me` - Get current user

### Admin Routes (Requires JWT Token + Admin Role)

- `GET /api/auth/dashboard-stats` - Get analytics
- `GET /api/auth/students` - Get all students
- `PUT /api/auth/students/:id/approve` - Update approval status

## Testing the Application

### 1. Register a Student

- Go to `http://localhost:5173/register`
- Fill in the registration form
- Submit to create account
- Account will be in "Pending" approval status

### 2. Login

- Go to `http://localhost:5173/login`
- Use your registered email and password
- You'll be redirected to Student Dashboard

### 3. Admin Account

For testing admin features, create an admin user directly in MongoDB:

```javascript
// First, hash the password using bcryptjs
db.users.insertOne({
    name: "Admin User",
    email: "admin@paradiselearners.com",
    nic: "000000000V",
    contact: "+94 71 000 0000",
    password: "$2a$10/...", // bcrypt hashed password
    role: "admin",
    approvalStatus: "approved"
})
```

Or use the browser console to manually set a test token:

```javascript
localStorage.setItem('token', 'your_jwt_token_here');
window.location.href = '/admin-dashboard';
```

### 4. Admin Dashboard Features

- View total students, pending approvals, and approved count
- Search and filter students by status
- Approve or reject pending student applications
- Real-time dashboard updates

## Error Handling

All endpoints include comprehensive error handling:

- ✅ Input validation
- ✅ Authentication verification
- ✅ Authorization checks
- ✅ Database error handling
- ✅ User-friendly error messages
- ✅ Proper HTTP status codes

## Technologies Used

**Backend:**
- Express.js - Web framework
- MongoDB + Mongoose - Database
- JWT - Authentication
- bcryptjs - Password hashing
- CORS - Cross-origin requests
- Dotenv - Environment variables

**Frontend:**
- React 18 - UI library
- React Router v6 - Routing
- Tailwind CSS - Styling
- Lucide React - Icons
- Axios - HTTP client
- Vite - Build tool

## Troubleshooting

### Backend won't start

```bash
# Check if port 5000 is in use
netstat -ano | findstr :5000  # Windows
lsof -i :5000                  # Mac/Linux

# Make sure MongoDB is running
mongod
```

### Frontend build fails

```bash
# Clear node_modules and reinstall
rm -rf node_modules
npm install
npm run dev
```

### MongoDB connection error

- Verify MONGODB_URI in .env
- Ensure MongoDB is running
- Check network connectivity

### CORS errors

- Backend should allow frontend origin
- Frontend should use correct API URL
- Check .env configuration

## Production Deployment

### Backend (Heroku/Railway)

```bash
npm run build
```

### Frontend (Vercel/Netlify)

```bash
npm run build
```

Update API URLs to production backend URL.

## Security Notes

⚠️ **Before Production:**

1. Change `JWT_SECRET` in .env
2. Enable HTTPS
3. Set `NODE_ENV=production`
4. Use strong database credentials
5. Implement rate limiting
6. Add email verification
7. Enable CORS for specific origins only

## License

MIT License - feel free to use this project

## Support

For issues or questions, please create an issue in the repository.

---

**Created with ❤️ for New Paradise Learners**
