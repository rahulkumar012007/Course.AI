const Document = require('../models/Document');
// const pdf = require('pdf-parse');  // ✅ fixed
const pdf = require('pdf-parse-debugging-disabled');
const fs = require('fs');

async function generateSummary(text) {
  try {
    // const response = await fetch('https://api.anthropic.com/v1/messages', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'x-api-key': process.env.ANTHROPIC_API_KEY,
    //     'anthropic-version': '2023-06-01'
    //   },
    //   body: JSON.stringify({
    //     model: 'claude-sonnet-4-6',  // ✅ fixed
    //     max_tokens: 1000,
    //     system: `Tu ek expert teacher hai.
    //              Document ka clear summary do.
    //              Main points bullet points mein likho.
    //              Simple Hindi-English (Hinglish) mein samjhao.`,
    //     messages: [{
    //       role: 'user',
    //       content: `Is document ka summary do:\n\n${text.slice(0, 4000)}`
    //     }]
    //   })
    // });

    // const data = await response.json();
    // return data.content[0].text;

    // goggle gemni
    // chatController.js mein replace karo
// const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + process.env.GEMINI_API_KEY, {
//   method: 'POST',
//   headers: { 'Content-Type': 'application/json' },
//   body: JSON.stringify({
//     contents: recentMessages.map(m => ({
//       role: m.role === 'assistant' ? 'model' : 'user',
//       parts: [{ text: m.content }]
//     }))
//   })
// })

// const aiData = await response.json()
// const aiReply = aiData.candidates[0].content.parts[0].text

// secend change
// console.log('🔑 Gemini Key:', process.env.GEMINI_API_KEY ? 'Mil gayi' : '❌ Missing!');
    
//     const response = await fetch(
//       'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + process.env.GEMINI_API_KEY,
    
//     );

//     const aiData = await response.json();
//     console.log('Gemini response:', JSON.stringify(aiData)); // ✅ full response dekho
    
//     return aiData.candidates[0].content.parts[0].text;


//third change
// const response = await fetch(
//       'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=' + process.env.GEMINI_API_KEY,
//       {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           contents: [{
//             role: 'user',
//             parts: [{ 
//               text: `Tu ek expert teacher hai. Is document ka clear summary do:\n\n${text.slice(0, 4000)}` 
//             }]
//           }]
//         })
//       }
//     );

//     const aiData = await response.json();
//     console.log('Gemini response:', JSON.stringify(aiData)); // ✅ yeh add karo

//     return aiData.candidates[0].content.parts[0].text;


// fourth change groq api
const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'openai/gpt-oss-20b',
        max_tokens: 1000,
        messages: [
          {
            role: 'system',
            content: 'You are an expert teacher. Give a clear summary in English with bullet points. Keep it simple.'
          },
          {
            role: 'user',
            content: `Summarize this document:\n\n${text.slice(0, 4000)}`
          }
        ]
      })
    });

    const aiData = await response.json();
    console.log('Groq response:', JSON.stringify(aiData));
    return aiData.choices[0].message.content;



    

  } catch (err) {
    return 'Summary generate nahi ho saki';
  }
}

exports.uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'PDF file select karo' });
    }

    const pdfBuffer = fs.readFileSync(req.file.path);
    const pdfData = await pdf(pdfBuffer);  // ✅ fixed

    if (!pdfData.text || pdfData.text.trim() === '') {
      return res.status(400).json({
        message: 'PDF mein text nahi mila. Scanned PDF nahi chalega.'
      });
    }

    console.log('📝 Summary ban rahi hai...');
    const summary = await generateSummary(pdfData.text);

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
        _id: document._id,
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