// server/controllers/uploadController.js
const Document = require('../models/Document');
const pdfParse = require('pdf-parse');
const fs = require('fs');

// Claude se summary banana
async function generateSummary(text) {
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: `Tu ek expert teacher hai.
                 Document ka clear summary do.
                 Main points bullet points mein likho.
                 Simple Hindi-English (Hinglish) mein samjhao.`,
        messages: [{
          role: 'user',
          content: `Is document ka summary do:\n\n${text.slice(0, 4000)}`
        }]
      })
    });

    const data = await response.json();
    return data.content[0].text;
  } catch (err) {
    return 'Summary generate nahi ho saki';
  }
}

// Document upload
exports.uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'PDF file select karo' });
    }

    // PDF text extract karo
    const pdfBuffer = fs.readFileSync(req.file.path);
    const pdfData = await pdfParse(pdfBuffer);

    if (!pdfData.text || pdfData.text.trim() === '') {
      return res.status(400).json({
        message: 'PDF mein text nahi mila. Scanned PDF nahi chalega.'
      });
    }

    // AI summary banao
    console.log('📝 Summary ban rahi hai...');
    const summary = await generateSummary(pdfData.text);

    // MongoDB mein save karo
    const document = await Document.create({
      userId: req.user._id,
      originalName: req.file.originalname,
      filename: req.file.filename,
      content: pdfData.text,
      summary: summary,
      pageCount: pdfData.numpages
    });

    res.status(201).json({
      message: 'Document upload ho gaya! ✅',
      document: {
        id: document._id,
        originalName: document.originalName,
        summary: document.summary,
        pageCount: document.pageCount,
        uploadedAt: document.createdAt
      }
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// User ke sare documents
exports.getDocuments = async (req, res) => {
  try {
    const documents = await Document.find({ userId: req.user._id })
      .select('originalName summary pageCount createdAt')
      .sort({ createdAt: -1 });

    res.json({ documents });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Single document
exports.getDocument = async (req, res) => {
  try {
    const document = await Document.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!document) {
      return res.status(404).json({ message: 'Document nahi mila' });
    }

    res.json({ document });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};