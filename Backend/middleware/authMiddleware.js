// server/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  try {
    // Token header se lo
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        message: 'Login karo pehle!'
      });
    }

    const token = authHeader.split(' ')[1];

    // Token verify karo
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // User dhundo
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'User nahi mila' });
    }

    req.user = user;
    next();

  } catch (err) {
    res.status(401).json({ message: 'Token invalid hai' });
  }
};

module.exports = protect;