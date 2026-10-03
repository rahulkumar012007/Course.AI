// server/controllers/chatController.js
const ChatHistory = require('../models/ChatHistory');
const Document = require('../models/Document');

exports.sendMessage = async (req, res) => {
  try {
    const { message, documentId } = req.body;

    if (!message || !documentId) {
      return res.status(400).json({
        message: 'Message aur documentId zaroori hai'
      });
    }

    // Document check karo - user ka hai?
    const document = await Document.findOne({
      _id: documentId,
      userId: req.user._id
    });

    if (!document) {
      return res.status(404).json({ message: 'Document nahi mila' });
    }

    // Chat history lo ya naya banao
    let chat = await ChatHistory.findOne({
      userId: req.user._id,
      documentId
    });

    if (!chat) {
      chat = await ChatHistory.create({
        userId: req.user._id,
        documentId,
        messages: []
      });
    }

    // // User message add karo
    // chat.messages.push({ role: 'user', content: message });

    // // Last 10 messages lo (context ke liye)
    // const recentMessages = chat.messages.slice(-10).map(m => ({
    //   role: m.role,
    //   content: m.content
    // }));

    // gemni messege
    chat.messages.push({ role: 'user', content: message });

// ✅ Gemini format mein convert karo
// const recentMessages = chat.messages.slice(-10).map(m => ({
//   role: m.role === 'assistant' ? 'model' : 'user',
//   parts: [{ text: m.content }]  // ✅ content → parts[0].text
// }));

//gorq messege
const recentMessages = chat.messages.slice(-10).map(m => ({
  role: m.role === 'assistant' ? 'assistant' : 'user',
  content: m.content
}));

    // Claude ko bhejo
    // const response = await fetch('https://api.anthropic.com/v1/messages', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'x-api-key': process.env.ANTHROPIC_API_KEY,
    //     'anthropic-version': '2023-06-01'
    //   },
    //   body: JSON.stringify({
    //     model: 'claude-sonnet-4-6',
    //     max_tokens: 1000,
    //     system: `Tu ek helpful study assistant hai.
    //              SIRF is document ke basis pe jawab do.
    //              Agar answer document mein nahi hai toh boldo.
    //              Simple aur clear language use karo.
                 
    //              Document Content:
    //              ${document.content.slice(0, 4000)}`,
    //     messages: recentMessages
    //   })
    // });

    // const aiData = await response.json();
    // const aiReply = aiData.content[0].text;

    // google gemni
    // chatController.js mein replace karo
// const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=' + process.env.GEMINI_API_KEY, {
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


//     // AI reply save karo
//     chat.messages.push({ role: 'assistant', content: aiReply });
//     await chat.save();

//     res.json({
//       reply: aiReply,
//       chatId: chat._id
//     });

// second change
// ✅ Gemini API
  //   const response = await fetch(
  //     'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=' + process.env.GEMINI_API_KEY,
  //     {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       // body: JSON.stringify({
  //       //   system_instruction: {
  //       //     parts: [{ 
  //       //       text: `Tu ek helpful study assistant hai. SIRF is document ke basis pe jawab do. Agar answer document mein nahi hai toh bol do. Simple aur clear language use karo.\n\nDocument Content:\n${document.content.slice(0, 4000)}`
  //       //     }]
  //       //   },
  //       //   contents: recentMessages
  //       // })
  //       body: JSON.stringify({
  //     system_instruction: {
  //        parts: [{ 
  //     text: `Tu ek helpful study assistant hai. SIRF is document ke basis pe jawab do. Simple aur clear language use karo.\n\nDocument:\n${document.content.slice(0, 4000)}`
  //   }]
  // },
  // contents: recentMessages  // ✅ sirf recentMessages — alag field mein
  //     })
  //     }
  //   );

  //   const aiData = await response.json();
  //   console.log('Gemini chat response:', JSON.stringify(aiData));

  //   const aiReply = aiData.candidates[0].content.parts[0].text;

  //   chat.messages.push({ role: 'assistant', content: aiReply });
  //   await chat.save();

  //   res.json({
  //     reply: aiReply,
  //     chatId: chat._id
  //   });

  // third change groq api
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
      max_tokens: 1000,
      messages: [
        {
          role: 'system',
          content: `Tu ek helpful study assistant hai.
SIRF is document ke basis pe jawab do.
Agar answer document mein nahi hai toh bol do.
Simple aur clear Hinglish mein answer do.

Document:
${document.content.slice(0, 4000)}`
        },
        ...recentMessages
      ]
    })
  }
);

// const aiData = await response.json();

// console.log('Groq response:', JSON.stringify(aiData, null, 2));

// const aiReply = aiData.choices?.[0]?.message?.content;

const aiData = await response.json();

console.log(
  'Groq response:',
  JSON.stringify(aiData, null, 2)
);

if (!response.ok) {
  return res.status(500).json({
    message: 'Groq API error',
    error: aiData
  });
}

const aiReply = aiData.choices?.[0]?.message?.content;

if (!aiReply) {
  return res.status(500).json({
    message: 'AI response nahi mila',
    error: aiData
  });
}

chat.messages.push({
  role: 'assistant',
  content: aiReply
});

await chat.save();

// res.json({
//   reply: aiReply,
//   chatId: chat._id
// });

return res.json({
  reply: aiReply,
  chatId: chat._id
});

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Chat history get karo
exports.getChatHistory = async (req, res) => {
  try {
    const chat = await ChatHistory.findOne({
      userId: req.user._id,
      documentId: req.params.documentId
    });

    res.json({ messages: chat ? chat.messages : [] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};