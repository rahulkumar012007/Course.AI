// server/controllers/authController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Token banane ka function
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });
};

// Register
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        message: 'Sab fields bharo!'
      });
    }

    // Email already exist karta hai?
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: 'Yeh email already registered hai'
      });
    }

    // User banao
    console.log("Creating user...");
    const user = await User.create({ name, email, password });
    console.log("User created:", user);
    const token = generateToken(user._id);

    res.status(201).json({
      message: 'Account ban gaya! 🎉',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (err) {
    console.log("hello....");
    res.status(500).json({ message: err.message });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // User dhundo
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: 'Email ya password galat hai'
      });
    }

    // Password check karo
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({
        message: 'Email ya password galat hai'
      });
    }

    const token = generateToken(user._id);

    res.json({
      message: 'Login successful! 👋',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Current user info
exports.getMe = async (req, res) => {
  res.json({ user: req.user });
};