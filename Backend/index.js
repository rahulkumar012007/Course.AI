// server/index.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // React app ka URL
  credentials: true
}));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/chat', require('./routes/chat'));
app.use('/api/quiz', require('./routes/quiz'));

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Server chal raha hai! 🚀' });
});

// MongoDB se connect karo
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected!');
    app.listen(process.env.PORT, () => {
      console.log(`🚀 Server port ${process.env.PORT} pe chal raha hai`);
    });
  })
  .catch(err => console.log('❌ MongoDB error:', err));