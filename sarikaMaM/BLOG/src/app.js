const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');

const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const blogRoutes = require('./routes/blogRoutes');
const commentRoutes = require('./routes/commentRoutes');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(methodOverride('_method'));

const { checkUser } = require('../middleware/authMiddleware');

app.use(express.static(path.join(__dirname,'public')));

app.use(checkUser);

app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use('/blogs', blogRoutes);
app.use('/comments', commentRoutes);

app.get('/', (req, res) => {
  res.redirect('/blogs');
});

app.use((req,res,next) => {
    res.status(404).send('Page Not Found');
});

module.exports = app;