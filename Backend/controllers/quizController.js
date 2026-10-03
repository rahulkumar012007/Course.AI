// server/controllers/quizController.js
const Document = require('../models/Document');

//  exports.generateQuiz = async (req, res) => {
//   try {
//     const document = await Document.findOne({
//       _id: req.params.documentId,
//       userId: req.user._id
//     });

//     if (!document) {
//       return res.status(404).json({ message: 'Document nahi mila' });
//     }

//     const response = await fetch('https://api.anthropic.com/v1/messages', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'x-api-key': process.env.ANTHROPIC_API_KEY,
//         'anthropic-version': '2023-06-01'
//       },
//       body: JSON.stringify({
//         model: 'claude-sonnet-4-20250514',
//         max_tokens: 2000,
//         system: `Tu quiz generator hai.
//                  SIRF valid JSON return kar.
//                  Koi extra text mat likho.`,
//         messages: [{
//           role: 'user',
//           content: `Is content se 5 MCQ questions banao.
          
//           Exact format yeh hoga:
//           [
//             {
//               "question": "Yahan question likho?",
//               "options": ["Option A", "Option B", "Option C", "Option D"],
//               "correct": 0,
//               "explanation": "Yahan explanation likho"
//             }
//           ]
          
//           Content:
//           ${document.content.slice(0, 3000)}`
//         }]
//       })
//     });

//     const data = await response.json();

//     // JSON parse karo
//     let quiz;
//     try {
//       const text = data.content[0].text;
//       const clean = text.replace(/```json|```/g, '').trim();
//       quiz = JSON.parse(clean);
//     } catch {
//       return res.status(500).json({
//         message: 'Quiz generate nahi ho saka, dobara try karo'
//       });
//     }

//     res.json({ quiz });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };


//groq api problem
// server/controllers/quizController.js

// const Document = require('../models/Document');

exports.generateQuiz = async (req, res) => {
  try {

    // 1. Document find karo
    const document = await Document.findOne({
      _id: req.params.documentId,
      userId: req.user._id
    });

    if (!document) {
      return res.status(404).json({
        message: 'Document nahi mila'
      });
    }

    // 2. Groq API call
    const response = await fetch(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
        },

        body: JSON.stringify({
          model: 'openai/gpt-oss-20b',

          max_tokens: 2000,

          messages: [
            {
              role: 'system',

              content: `Tu ek expert quiz generator hai.

Sirf valid JSON return karo.
Koi extra text mat likho.
Markdown code block mat use karo.

Exactly 5 MCQ questions generate karo.

Har question ka format:

{
  "question": "Question?",
  "options": [
    "Option A",
    "Option B",
    "Option C",
    "Option D"
  ],
  "correct": 0,
  "explanation": "Explanation"
}

"correct" mein:
0 = Option A
1 = Option B
2 = Option C
3 = Option D

Output sirf ek JSON array hona chahiye.`
            },

            {
              role: 'user',

              content: `Is document ke content se 5 MCQ questions banao.

Document:
${document.content.slice(0, 5000)}`
            }
          ]
        })
      }
    );

    // 3. Groq response
    const data = await response.json();

    console.log(
      'Groq quiz response:',
      JSON.stringify(data, null, 2)
    );

    // 4. Groq API error
    if (!response.ok) {
      return res.status(500).json({
        message: 'Groq API error',
        error: data
      });
    }

    // 5. AI response nikalo
    const text = data.choices?.[0]?.message?.content;

    if (!text) {
      return res.status(500).json({
        message: 'Quiz response nahi mila',
        error: data
      });
    }

    // 6. JSON clean karo
    const clean = text
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim();

    // 7. JSON parse karo
    let quiz;

    try {
      quiz = JSON.parse(clean);
    } catch (error) {

      console.error('Quiz JSON parse error:', error);
      console.error('AI response:', text);

      return res.status(500).json({
        message: 'Quiz ka JSON format invalid hai',
        rawResponse: text
      });
    }

    // 8. Quiz frontend ko bhejo
    return res.json({
      quiz
    });

  } catch (err) {

    console.error('QUIZ ERROR:', err);

    return res.status(500).json({
      message: err.message
    });
  }
};