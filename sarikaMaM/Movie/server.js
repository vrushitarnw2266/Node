require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

// Import Routes
const userRoutes = require('./routes/userRoutes');
const movieRoutes = require('./routes/movieRoutes');

const User = require('./models/userModel');

const app = express();

// Configuration
app.set('view engine', 'ejs');
app.set('views', path.resolve(__dirname, 'views'));

// =========================================================================
// PRINCIPAL'S DIAGNOSTIC CHECK
// This script checks if you placed your CSS correctly.
// =========================================================================
const cssPath = path.resolve(__dirname, 'public', 'style.css');


// Configuration
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Simple Manual Cookie Parser (no library needed!)
app.use((req, res, next) => {
  req.cookies = {};
  const cookieHeader = req.headers.cookie;
  if (cookieHeader) {
    cookieHeader.split(';').forEach(cookie => {0
      const [name, ...rest] = cookie.split('=');
      req.cookies[name.trim()] = rest.join('=');
    });
  }
  next();
});

// Noise Cancellation (Simplified for Express 5 compatibility)
app.get('/favicon.ico', (req, res) => res.status(204).end());

// Explicit CSS Route to help students see if their CSS is loading
app.get('/style.css', (req, res) => {
  if (fs.existsSync(cssPath)) {
    res.sendFile(cssPath);
  } else {
    res.status(404).type('text/css').send('/* ERROR: You did not put style.css in the public folder! */');
  }
});

app.use(express.static(path.resolve(__dirname, 'public')));

// Mount Routes
app.use('/api/user', userRoutes);
app.use('/api/movies', movieRoutes);

// Database Connection
const mongoURI = process.env.MONGODB_URI;
mongoose.connect(mongoURI)
  .then(() => console.log('✓ Database Engine Online. MVC Engaged.'))
  .catch(err => {
    console.log('✗ MongoDB connection failed. Check your .env file!');
    console.log('Error:', err.message);
  });

// Page Routes
app.get('/', async (req, res) => {
  try {
    const Movie = require('./models/movieModel');
    const movies = await Movie.find();
    
    // Find user from cookie
    let user = null;
    if (req.cookies.userId) {
      user = await User.findById(req.cookies.userId);
    }
    
    res.render('home', { movies, user });
  } catch (err) {
    res.render('home', { movies: [], user: null });
  }
});

app.get('/login', (req, res) => res.render('login'));
app.get('/signup', (req, res) => res.render('signup'));
app.get('/add-movie', (req, res) => res.render('add-movie'));
app.get('/edit-movie/:id', async (req, res) => {
  try {
    const Movie = require('./models/movieModel');
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).send('Movie not found');
    res.render('edit-movie', { movie });
  } catch (err) {
    res.status(500).send(err.message);
  }
});
app.get('/logout', (req, res) => {
  res.clearCookie('userId');
  res.redirect('/login');
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✓ Server running at: http://localhost:${PORT}`);
});
