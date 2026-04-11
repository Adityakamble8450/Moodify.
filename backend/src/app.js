const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const app = express();
const authRoutes = require('./routes/auth.user');
const songRoutes = require('./routes/song.routes');

// Middleware - order matters!
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/song', songRoutes);




module.exports = app;