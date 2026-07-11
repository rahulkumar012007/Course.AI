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

    // User message add karo
    chat.messages.push({ role: 'user', content: message });

    // Last 10 messages lo (context ke liye)
    const recentMessages = chat.messages.slice(-10).map(m => ({
      role: m.role,
      content: m.content
    }));

    // Claude ko bhejo
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
        system: `Tu ek helpful study assistant hai.
                 SIRF is document ke basis pe jawab do.
                 Agar answer document mein nahi hai toh boldo.
                 Simple aur clear language use karo.
                 
                 Document Content:
                 ${document.content.slice(0, 4000)}`,
        messages: recentMessages
      })
    });

    const aiData = await response.json();
    const aiReply = aiData.content[0].text;

    // AI reply save karo
    chat.messages.push({ role: 'assistant', content: aiReply });
    await chat.save();

    res.json({
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