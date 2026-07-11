// server/routes/chat.js
const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const { sendMessage, getChatHistory } = require('../controllers/chatController');

router.post('/message', protect, sendMessage);
router.get('/history/:documentId', protect, getChatHistory);

module.exports = router;