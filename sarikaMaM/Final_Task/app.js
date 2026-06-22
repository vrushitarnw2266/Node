require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const connectDB = require('./config/db');
const { checkUser } = require('./middleware/authMiddleware');
const Category = require('./models/Category');

const app = express();

// Connect to Database
connectDB().then(() => {
  // Seed default categories
  seedCategories();
});

// Seed default categories helper
const seedCategories = async () => {
  try {
    const count = await Category.countDocuments();
    if (count === 0) {
      await Category.insertMany([
        { name: 'Work' },
        { name: 'Personal' },
        { name: 'Urgent' },
        { name: 'Study' }
      ]);
      console.log('Default categories seeded.');
    }
  } catch (err) {
    console.error('Error seeding categories:', err);
  }
};

// Set View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Global User Context Middleware
app.use(checkUser);

// Routes
app.use('/', require('./routes/authRoutes'));
app.use('/tasks', require('./routes/taskRoutes'));
app.use('/categories', require('./routes/categoryRoutes'));

// Root Redirection Route
app.get('/', (req, res) => {
  if (req.user) {
    res.redirect('/tasks');
  } else {
    res.redirect('/login');
  }
});

// 404 Error Handler Page
app.use((req, res) => {
  res.status(404).render('error', {
    message: 'Page not found.',
    title: '404 - Not Found'
  });
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
