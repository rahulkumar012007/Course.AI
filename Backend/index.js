// server/index.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
// app.use(cors(
//   {
//     origin:[
//       "http://localhost:5173",
//       "http://localhost:5174",
//       "http://localhost:3000",
//       "https://course-ai-frontend.onrender.com"
//     ],
//     credentials:true,
//   }
// ));

//secend change
// const allowedOrigins = [
//   'http://localhost:5173',
//   'http://localhost:5174',
//   'http://localhost:3000',
//   'https://course-ai-frontend.onrender.com'
// ];

// app.use(cors({
//   origin: function (origin, callback) {
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization']
// }));

// app.options('*', cors());

//third change
app.use(cors({
  origin: 'https://course-ai-frontend.onrender.com',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
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
console.log(" MONGO_URI ",process.env.MONGO_URI);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected!');
    app.listen(process.env.PORT, () => {
      console.log(`🚀 Server port ${process.env.PORT} pe chal raha hai`);
    });
  })
  .catch(err => console.log('❌ MongoDB error:', err));