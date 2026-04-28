# 🎬 Movie Database API

A complete Node.js/Express REST API for managing movies with user authentication using MongoDB. Users can sign up, log in, and manage their movie collections.

## 📋 Features

- **User Authentication**: Sign up, login, logout with bcrypt password hashing
- **Session Management**: Persistent user sessions using express-session
- **Movie CRUD Operations**: Create, Read, Update, Delete movies
- **Search Functionality**: Search movies by title, director, genre, or description
- **User-Specific Content**: Users can only edit/delete their own movies
- **MongoDB Integration**: Complete MongoDB database integration with Mongoose
- **RESTful API**: Fully RESTful API design
- **Error Handling**: Comprehensive error handling and validation
- **Pagination**: Movies listing with pagination support

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js v5.2.1
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: bcrypt for password hashing
- **Session**: express-session
- **CORS**: For cross-origin requests
- **Template Engine**: EJS for views
- **Environment**: dotenv for configuration
- **Development**: nodemon for hot reload

## 📦 Installation

### Prerequisites
- Node.js (v14+)
- npm or yarn
- MongoDB (local or MongoDB Atlas)

### Steps

1. **Clone or navigate to project directory**
```bash
cd v:\Study\Node\sarikaMaM\Movie
```

2. **Install dependencies**
```bash
npm install
```

3. **Create .env file**
```bash
# .env file should be in project root
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/movie_db?retryWrites=true&w=majority
PORT=3000
SESSION_SECRET=your_secret_key_change_this_in_production
```

4. **Get MongoDB Connection String**
   - **Local MongoDB**: `mongodb://localhost:27017/movie_db`
   - **MongoDB Atlas**:
     1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
     2. Create a cluster
     3. Get your connection string
     4. Replace username and password

5. **Start the server**
```bash
npm start
# or with nodemon (for development with auto-reload)
npm run dev
```

6. **Access the application**
   - API: http://localhost:3000
   - Home Page: http://localhost:3000/

## 📁 Project Structure

```
Movie/
├── models/              # Database schemas
│   ├── userModel.js     # User schema (username, email, password, fullName)
│   └── movieModel.js    # Movie schema (title, year, genre, rating, etc.)
├── controller/          # Business logic controllers
│   ├── userController.js   # Signup, login, logout, profile
│   └── movieController.js  # CRUD operations for movies
├── routes/              # API route definitions
│   ├── userRoutes.js    # User authentication routes
│   └── movieRoutes.js   # Movie CRUD routes
├── middleware/          # Custom middleware
│   └── userMiddleware.js # Authentication middleware
├── views/               # EJS templates
│   ├── home.ejs         # Movie listing page
│   ├── login.ejs        # User login form
│   └── signup.ejs       # User registration form
├── public/              # Static files
│   └── style.css        # Styling
├── .env                 # Environment variables
├── package.json         # Dependencies
└── server.js            # Main server file
```

## 🔐 API Endpoints

### User Routes (`/api/user`)

#### 1. Sign Up
```
POST /api/user/signup
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "confirmPassword": "securePassword123",
  "fullName": "John Doe"
}

Response:
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "id": "...",
    "username": "john_doe",
    "email": "john@example.com",
    "fullName": "John Doe"
  }
}
```

#### 2. Login
```
POST /api/user/login
Content-Type: application/json

{
  "username": "john_doe",
  "password": "securePassword123"
}

Response:
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": "...",
    "username": "john_doe",
    "email": "john@example.com",
    "fullName": "John Doe"
  }
}
```

#### 3. Logout
```
GET /api/user/logout

Response:
{
  "success": true,
  "message": "Logged out successfully"
}
```

#### 4. Get User Profile
```
GET /api/user/profile
(Requires authentication)

Response:
{
  "success": true,
  "user": {
    "id": "...",
    "username": "john_doe",
    "email": "john@example.com",
    "fullName": "John Doe",
    "createdAt": "2024-04-27T..."
  }
}
```

### Movie Routes (`/api/movies`)

#### 1. Create Movie (Auth Required)
```
POST /api/movies
Content-Type: application/json

{
  "title": "Inception",
  "description": "A mind-bending thriller",
  "year": 2010,
  "genre": ["Action", "Sci-Fi"],
  "rating": 8.8,
  "director": "Christopher Nolan",
  "cast": ["Leonardo DiCaprio", "Ellen Page"],
  "duration": 148,
  "language": "English",
  "country": "USA",
  "posterUrl": "https://...",
  "budget": 160000000,
  "boxOffice": 839000000
}

Response:
{
  "success": true,
  "message": "Movie added successfully",
  "movie": { ...movie data... }
}
```

#### 2. Get All Movies
```
GET /api/movies?page=1&limit=10

Response:
{
  "success": true,
  "totalMovies": 50,
  "totalPages": 5,
  "currentPage": 1,
  "movies": [ ...array of movies... ]
}
```

#### 3. Get Single Movie
```
GET /api/movies/:id

Response:
{
  "success": true,
  "movie": { ...movie data... }
}
```

#### 4. Search Movies
```
GET /api/movies/search?q=Inception

Response:
{
  "success": true,
  "totalResults": 1,
  "movies": [ ...matching movies... ]
}
```

#### 5. Update Movie (Auth Required - Owner Only)
```
PUT /api/movies/:id
Content-Type: application/json

{
  "rating": 9.0,
  "title": "Inception (Updated)"
}

Response:
{
  "success": true,
  "message": "Movie updated successfully",
  "movie": { ...updated movie... }
}
```

#### 6. Delete Movie (Auth Required - Owner Only)
```
DELETE /api/movies/:id

Response:
{
  "success": true,
  "message": "Movie deleted successfully"
}
```

## 💾 Database Schema

### User Schema
```javascript
{
  username: String (unique, required),
  email: String (unique, required),
  fullName: String (required),
  password: String (hashed, required),
  createdAt: Date (default: now),
  updatedAt: Date (default: now)
}
```

### Movie Schema
```javascript
{
  title: String (required),
  description: String,
  year: Number,
  genre: [String],
  rating: Number (0-10),
  director: String,
  cast: [String],
  duration: Number,
  language: String,
  country: String,
  posterUrl: String,
  budget: Number,
  boxOffice: Number,
  addedBy: ObjectId (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

## 🔑 Key Concepts Explained

### Authentication Flow
1. User signs up → Password is hashed with bcrypt → User stored in MongoDB
2. User logs in → Password compared with hash → Session created
3. Session ID stored in cookie → Sent with each request
4. Middleware checks session → Grants/denies access

### Password Security
- Passwords are **never stored in plain text**
- bcrypt hashes passwords with salt (10 rounds)
- Password hash is computed before saving to database
- On login, entered password is compared with stored hash

### Session Management
- Express-session stores user ID in server session
- Session cookie automatically sent to client
- Session persists across requests
- Session expires after 24 hours (configurable)

### Movie Ownership
- Each movie stores reference to user who added it
- Users can only edit/delete their own movies
- Middleware checks authorization before allowing updates

## 🧪 Testing with API

### Using curl
```bash
# Signup
curl -X POST http://localhost:3000/api/user/signup \
  -H "Content-Type: application/json" \
  -d '{"username":"john","email":"john@test.com","password":"pass123","confirmPassword":"pass123","fullName":"John Doe"}'

# Login
curl -X POST http://localhost:3000/api/user/login \
  -H "Content-Type: application/json" \
  -d '{"username":"john","password":"pass123"}'

# Get all movies
curl http://localhost:3000/api/movies

# Create movie (requires session)
curl -X POST http://localhost:3000/api/movies \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Movie","year":2024,"genre":["Action"]}'
```

### Using Postman
1. Create collection for Movie API
2. Add requests for each endpoint
3. Use session cookies for authentication
4. Test signup → login → create movie workflow

## 🔧 Environment Variables

```env
# MongoDB Connection String
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/movie_db

# Server Port
PORT=3000

# Session Secret Key (change in production)
SESSION_SECRET=your_super_secret_key_change_this
```

## 📝 Code Comments

All files include detailed inline comments explaining:
- Function purpose and usage
- Parameter requirements
- Return values
- Validation logic
- Error handling
- Database operations

## 🚀 Deployment

### For Production
1. Update `.env` with production MongoDB URI
2. Change `SESSION_SECRET` to a strong random string
3. Set `NODE_ENV=production`
4. Use a process manager like PM2
5. Set up HTTPS/SSL
6. Configure CORS for specific domains

### Using PM2
```bash
npm install -g pm2
pm2 start server.js --name "movie-api"
pm2 save
pm2 startup
```

## 🐛 Troubleshooting

### MongoDB Connection Error
- Check if MongoDB is running
- Verify connection string in `.env`
- Check network access in MongoDB Atlas

### Session Not Persisting
- Clear browser cookies
- Check SESSION_SECRET is set
- Verify express-session middleware is loaded

### Password Issues
- Make sure bcrypt is installed: `npm install bcrypt`
- Check password length (minimum 6 characters)
- Verify password hash timing isn't too slow

## 📚 Learning Resources

- [Express.js Docs](https://expressjs.com/)
- [MongoDB Docs](https://docs.mongodb.com/)
- [Mongoose Docs](https://mongoosejs.com/)
- [bcrypt Docs](https://www.npmjs.com/package/bcrypt)
- [express-session Docs](https://www.npmjs.com/package/express-session)

## 📄 License

MIT License - Free to use for learning and projects

## 👨‍💻 Author

Created for learning Node.js and MongoDB

---

**Happy Coding!** 🚀
