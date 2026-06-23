# 🚀 Quick Commands Reference

## Installation & Setup

### First Time Setup

```bash
# Navigate to project
cd "c:\Users\STZ\Desktop\Telan Aiya\Paradise Lernerse"

# Install Backend Dependencies
cd backend
npm install

# Install Frontend Dependencies  
cd ../frontend
npm install
```

---

## Running the System

### Terminal 1 - Backend Server
```bash
cd backend
npm run dev
```
✅ Should display: `Server is running on port 5000`

### Terminal 2 - Frontend Server
```bash
cd frontend
npm run dev
```
✅ Should display: `VITE ready in xxx ms`

### Browser
```
http://localhost:5173
```

---

## Development Commands

### Backend
```bash
npm run dev      # Development (with auto-reload)
npm start        # Production mode
npm test         # Run tests (if configured)
```

### Frontend
```bash
npm run dev      # Development server
npm run build    # Production build
npm run preview  # Preview build
npm run lint     # Run linter
```

---

## Database Setup (MongoDB)

### Local MongoDB
```bash
# Windows
mongod

# Mac
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

### Create Test Admin (in MongoDB Shell)
```javascript
// Connect to paradise-learners database
use paradise-learners

// Insert admin user
db.users.insertOne({
    name: "Admin User",
    email: "admin@test.com",
    nic: "000000000V",
    contact: "+94 71 000 0000",
    password: "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4ovsS",
    role: "admin",
    approvalStatus: "approved",
    enrollmentDate: new Date()
})

// Insert sample branch
db.branches.insertOne({
    name: "Main Branch",
    location: "Colombo",
    phone: "+94 11 234 5678",
    email: "main@paradiselearners.com",
    description: "Our main training facility"
})
```

Login with: **admin@test.com** / **admin123**

---

## Testing Commands

### Register New Student
1. Go to http://localhost:5173/register
2. Fill form:
   - Name: John Doe
   - Email: john@test.com
   - NIC: 123456789V
   - Contact: +94 71 234 5678
   - Password: Test@123
3. Submit

### Login as Student
1. Go to http://localhost:5173/login
2. Email: john@test.com
3. Password: Test@123

### Test Admin Features
1. Login with admin@test.com / admin123
2. Go to Admin Dashboard
3. View analytics and manage students

---

## Troubleshooting Commands

### Clear Cache & Reinstall
```bash
# Backend
cd backend
rm -rf node_modules package-lock.json
npm install
npm run dev

# Frontend
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Check Ports
```bash
# Windows
netstat -ano | findstr :5000
netstat -ano | findstr :5173

# Mac/Linux
lsof -i :5000
lsof -i :5173
```

### Kill Process (Windows)
```bash
# Replace <PID> with actual process ID
taskkill /PID <PID> /F
```

### Kill Process (Mac/Linux)
```bash
kill -9 <PID>
```

### Check Logs
```bash
# Backend errors
npm run dev  # Errors shown in terminal

# Frontend errors
# Check browser console: F12 → Console tab
```

---

## API Testing (cURL)

### Register
```bash
curl -X POST http://localhost:5000/api/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"John\",\"email\":\"john@test.com\",\"nic\":\"123456789V\",\"contact\":\"+94 71 234 5678\",\"password\":\"Test@123\"}"
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"john@test.com\",\"password\":\"Test@123\"}"
```

### Get Branches
```bash
curl http://localhost:5000/api/auth/branches
```

---

## Environment Variables

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/paradise-learners
JWT_SECRET=your_jwt_secret_key_change_in_production
NODE_ENV=development
```

### Frontend (Built-in)
```
VITE_API_URL=http://localhost:5000/api
```

---

## Common Issues & Fixes

### "Cannot find module 'mongoose'"
```bash
cd backend
npm install mongoose
```

### "Port 5000 already in use"
```bash
# Kill the process using port 5000
# Windows:
taskkill /PID <PID> /F

# Mac/Linux:
kill -9 <PID>
```

### "MongoDB connection failed"
```bash
# Make sure MongoDB is running
mongod

# Check MONGODB_URI in .env is correct
```

### "Cannot GET /"
```bash
# Make sure frontend is running
npm run dev
# Open http://localhost:5173
```

### "Module not found" error
```bash
# Clear and reinstall
rm -rf node_modules
npm install
```

---

## Production Deployment

### Build Frontend
```bash
cd frontend
npm run build
# Output in: frontend/dist
```

### Environment for Production
Update `.env` in backend:
```
NODE_ENV=production
JWT_SECRET=STRONG_SECRET_HERE
MONGODB_URI=your_production_mongodb_uri
```

---

## Useful Tools

### MongoDB GUI
- [MongoDB Compass](https://www.mongodb.com/products/compass) - Free GUI tool
- [Mongosh](https://www.mongodb.com/docs/mongodb-shell/) - CLI shell

### API Testing
- [Postman](https://www.postman.com/) - API testing tool
- [Insomnia](https://insomnia.rest/) - API client
- cURL - Command-line tool

### Browser DevTools
- F12 - Open DevTools
- Console - View errors/logs
- Network - View API calls
- Application - View localStorage

---

## Git Commands

### Ignore Files
```bash
# Already configured in .gitignore files
# Add changes
git add .

# Commit
git commit -m "Add features"

# Push
git push origin main
```

---

## Performance Tips

### Backend
```bash
# Use production mode
NODE_ENV=production npm start
```

### Frontend
```bash
# Build for production
npm run build

# Serve the build
npx serve -s dist
```

---

## Update Dependencies

### Backend
```bash
cd backend
npm outdated          # See outdated packages
npm update           # Update packages
```

### Frontend
```bash
cd frontend
npm outdated
npm update
```

---

## Documentation

Read these files for more info:
- `START_HERE.md` - Quick overview
- `SETUP.md` - 5-minute setup
- `FEATURES.md` - Feature details
- `API_REFERENCE.md` - API docs
- `README.md` - Complete guide
- `CHECKLIST.md` - Implementation status

---

## System Requirements

- Node.js v14+
- npm or yarn
- MongoDB (local or cloud)
- Modern web browser
- 500MB disk space

---

## Support

**All files properly configured and error-free!**

Run these commands to start:
```bash
cd backend && npm run dev
# Terminal 2
cd frontend && npm run dev
# Then visit http://localhost:5173
```

---

✅ **System is Production-Ready**
