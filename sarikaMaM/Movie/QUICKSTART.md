# 🚀 QUICK START GUIDE - Movie API

## 📋 What You Have

A complete **Movie Management API** with:
- ✅ User authentication (signup/login)
- ✅ Movie database management (add/edit/delete)
- ✅ Search functionality
- ✅ MongoDB integration
- ✅ RESTful API with full comments

---

## ⚡ 5-Minute Setup

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Setup MongoDB

**Option A: Local MongoDB**
```
# Install MongoDB locally from https://www.mongodb.com/try/download/community
# Start MongoDB (usually runs on localhost:27017)
```

**Option B: MongoDB Atlas (Cloud - Recommended)**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a cluster
4. Click "Connect" → "Drivers"
5. Copy connection string

### Step 3: Create .env File

Create a file named `.env` in the project root:

```
# For Local MongoDB
MONGODB_URI=mongodb://localhost:27017/movie_db

# OR for MongoDB Atlas (replace with your credentials)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/movie_db?retryWrites=true&w=majority

PORT=3000
SESSION_SECRET=your_secret_key_change_this_later
```

### Step 4: Start Server

```bash
npm start
```

✅ Server running at: **http://localhost:3000**

---

## 📂 Project Structure Explained

```
Movie/
├── server.js                 # Main server file - STARTS HERE
├── models/                   # Database schemas
│   ├── userModel.js         # User data structure
│   └── movieModel.js        # Movie data structure
├── controller/              # Business logic
│   ├── userController.js    # Signup/Login functions
│   └── movieController.js   # Movie CRUD functions
├── routes/                  # API endpoints
│   ├── userRoutes.js        # /api/user endpoints
│   └── movieRoutes.js       # /api/movies endpoints
├── middleware/              # Utility functions
│   └── userMiddleware.js    # Authentication checks
├── views/                   # Web pages
│   ├── home.ejs            # Display movies
│   ├── login.ejs           # Login page
│   └── signup.ejs          # Registration page
├── public/                  # Static files
│   └── style.css           # Styling
├── .env                     # Configuration (create this)
├── package.json            # Dependencies
└── README.md               # Full documentation
```

---

## 🧪 Quick Test Commands

### 1. Test Server is Running
```bash
curl http://localhost:3000
```

### 2. Signup New User
```bash
curl -X POST http://localhost:3000/api/user/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username":"testuser",
    "email":"test@example.com",
    "password":"password123",
    "confirmPassword":"password123",
    "fullName":"Test User"
  }'
```

### 3. Login User
```bash
curl -X POST http://localhost:3000/api/user/login \
  -H "Content-Type: application/json" \
  -d '{
    "username":"testuser",
    "password":"password123"
  }'
```

### 4. Get All Movies
```bash
curl http://localhost:3000/api/movies
```

### 5. Search Movies
```bash
curl "http://localhost:3000/api/movies/search?q=inception"
```

---

## 🔑 Key Endpoints

### User Authentication
```
POST   /api/user/signup       - Register new user
POST   /api/user/login        - Login user
GET    /api/user/logout       - Logout user
GET    /api/user/profile      - Get user profile
```

### Movie Management
```
POST   /api/movies            - Create movie (auth required)
GET    /api/movies            - Get all movies
GET    /api/movies/:id        - Get one movie
GET    /api/movies/search     - Search movies
PUT    /api/movies/:id        - Update movie (auth required)
DELETE /api/movies/:id        - Delete movie (auth required)
```

---

## 🎯 Understanding the Code

### User Signup Flow
```
1. User enters: username, email, password, fullName
2. Server validates (no duplicates, password match, etc.)
3. Password gets hashed with bcrypt (never stored in plain text!)
4. User saved to MongoDB
5. Session created (user stays logged in)
6. Response sent with user details
```

### Movie Creation Flow
```
1. User must be logged in
2. User provides: title, genre, director, etc.
3. Server validates
4. Movie saved with user's ID attached
5. Movie stored in MongoDB
6. Response confirms success
```

### Authentication Check
```
Each protected route checks:
- Is user logged in? (session exists)
- Does session have userId?
- If yes → Allow access
- If no → Return 401 Unauthorized
```

---

## 🐛 Common Issues & Solutions

### Issue: "Cannot find module 'mongoose'"
**Solution:**
```bash
npm install
```

### Issue: "MongoDB connection failed"
**Solutions:**
- Check if MongoDB is running
- Verify MONGODB_URI in .env is correct
- For Atlas: Check network access settings
- For Local: Start MongoDB service

### Issue: "Password doesn't work"
**Solutions:**
- Password must be minimum 6 characters
- Check password hash was created (pre-save middleware)
- Verify bcrypt is installed: `npm list bcrypt`

### Issue: "Session expires too quickly"
**Solutions:**
- Increase maxAge in server.js (line with cookie settings)
- Default is 24 hours (86400000 milliseconds)

---

## 📚 File Purposes

| File | Purpose |
|------|---------|
| `server.js` | Express app setup, middleware, routes, DB connection |
| `userModel.js` | User data schema (username, email, password) |
| `movieModel.js` | Movie data schema (title, genre, rating, etc.) |
| `userController.js` | Signup/login/logout/profile logic |
| `movieController.js` | Create/read/update/delete movies logic |
| `userRoutes.js` | Define user API endpoints |
| `movieRoutes.js` | Define movie API endpoints |
| `userMiddleware.js` | Check if user is logged in |
| `style.css` | All styling (colors, buttons, layout) |

---

## 🔐 Security Features

✅ **Passwords:** Hashed with bcrypt (never stored plain text)
✅ **Sessions:** Expire after 24 hours
✅ **Authorization:** Users can only edit their own movies
✅ **Validation:** All inputs validated before saving
✅ **CORS:** Configured to allow requests

---

## 🚀 Next Steps

1. **Test Signup/Login**
   - Create a test user account
   - Login and verify session works

2. **Add Movies**
   - Create some test movies
   - Try editing and deleting

3. **Explore API**
   - Use curl or Postman to test endpoints
   - Try pagination: `/api/movies?page=1&limit=5`

4. **Customize**
   - Change colors in `style.css`
   - Add new movie fields in `movieModel.js`
   - Create new endpoints in routes

5. **Deploy**
   - Use MongoDB Atlas (cloud database)
   - Deploy to Heroku, Railway, or Render
   - See README.md for deployment guide

---

## 📖 Understanding Key Concepts

### Hashing vs Encryption
- **Hashing:** One-way process (bcrypt) - ✅ Used for passwords
- **Encryption:** Two-way process - For sensitive data that needs to be read

### Sessions vs Tokens
- **Sessions:** Server stores user info (✅ Used here)
- **Tokens:** Client stores info (JWT) - For APIs

### MongoDB ObjectId
- Unique identifier automatically generated
- 24-character hex string
- Example: `507f1f77bcf86cd799439011`

### Middleware
- Functions that run before/after routes
- Example: Authentication middleware checks if user is logged in

---

## 💡 Tips

- **Always backup .env** - Contains sensitive credentials
- **Use Postman** for testing API more easily than curl
- **Read comments** in code files for explanations
- **Check console.log()** output for debugging info
- **Test before deploying** - Ensure all features work locally

---

## 📞 Need Help?

1. **Check console output** - Errors are logged there
2. **Read comment blocks** - Code has detailed explanations
3. **See README.md** - Full documentation
4. **Check .env file** - Ensure all variables are set correctly

---

## ✅ Checklist

Before deploying to production:

- [ ] Change SESSION_SECRET in .env
- [ ] Use MongoDB Atlas (not local MongoDB)
- [ ] Set NODE_ENV=production
- [ ] Update CORS origin to your domain
- [ ] Test all endpoints
- [ ] Set up HTTPS/SSL
- [ ] Use PM2 or similar process manager

---

**Ready to go!** 🎉 Start the server and begin testing!
