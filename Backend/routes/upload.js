// server/routes/upload.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const protect = require('../middleware/authMiddleware');
const {
  uploadDocument,
  getDocuments,
  getDocument
} = require('../controllers/uploadController');

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Sirf PDF files allowed hain!'));
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Uploads folder banao
const fs = require('fs');
if (!fs.existsSync('uploads')) fs.mkdirSync('uploads');

router.post('/', protect, upload.single('pdf'), uploadDocument);
router.get('/', protect, getDocuments);
router.get('/:id', protect, getDocument);

module.exports = router;