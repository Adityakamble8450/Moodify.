const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const app = express();
const authRoutes = require('./routes/auth.user');
const songRoutes = require('./routes/song.routes');
const frontendDistPath = path.resolve(__dirname, '../dist');

// Middleware - order matters!
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: process.env.CLIENT_URL || true,
  credentials: true
}));
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/song', songRoutes);
app.use(express.static(frontendDistPath));

app.get(/^(?!\/api).*/, (_req, res) => {
  res.sendFile(path.join(frontendDistPath, 'index.html'));
});



module.exports = app;
