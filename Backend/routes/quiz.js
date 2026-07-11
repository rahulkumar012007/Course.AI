// server/routes/quiz.js
const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const { generateQuiz } = require('../controllers/quizController');

router.get('/:documentId', protect, generateQuiz);

module.exports = router;