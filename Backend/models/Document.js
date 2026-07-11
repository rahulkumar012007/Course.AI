// server/models/Document.js
const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  originalName: {
    type: String,
    required: true
  },
  filename: {
    type: String,
    required: true
  },
  content: {
    type: String,  // PDF ka extracted text
    required: true
  },
  summary: {
    type: String,  // AI generated summary
    default: ''
  },
  pageCount: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('Document', documentSchema);