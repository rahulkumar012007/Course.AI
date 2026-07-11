// server/controllers/quizController.js
const Document = require('../models/Document');

exports.generateQuiz = async (req, res) => {
  try {
    const document = await Document.findOne({
      _id: req.params.documentId,
      userId: req.user._id
    });

    if (!document) {
      return res.status(404).json({ message: 'Document nahi mila' });
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2000,
        system: `Tu quiz generator hai.
                 SIRF valid JSON return kar.
                 Koi extra text mat likho.`,
        messages: [{
          role: 'user',
          content: `Is content se 5 MCQ questions banao.
          
          Exact format yeh hoga:
          [
            {
              "question": "Yahan question likho?",
              "options": ["Option A", "Option B", "Option C", "Option D"],
              "correct": 0,
              "explanation": "Yahan explanation likho"
            }
          ]
          
          Content:
          ${document.content.slice(0, 3000)}`
        }]
      })
    });

    const data = await response.json();

    // JSON parse karo
    let quiz;
    try {
      const text = data.content[0].text;
      const clean = text.replace(/```json|```/g, '').trim();
      quiz = JSON.parse(clean);
    } catch {
      return res.status(500).json({
        message: 'Quiz generate nahi ho saka, dobara try karo'
      });
    }

    res.json({ quiz });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};