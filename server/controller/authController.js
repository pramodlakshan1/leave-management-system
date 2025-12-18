const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../model/User');

exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    console.log('Login attempt for email:', email); // Debug log
    
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found:', email);
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    console.log('User found:', user.email, 'Role:', user.role); // Debug log

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Password mismatch for:', email);
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    console.log('Password matched for:', email); // Debug log

    const payload = { 
      userId: user._id, 
      role: user.role,
      email: user.email 
    };
    
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'fallback-secret-key', { 
      expiresIn: '7d' 
    });

    console.log('Login successful for:', email, 'Role:', user.role); // Debug log

    // IMPORTANT: Return both token AND role
    res.json({ 
      token,
      role: user.role,
      name: user.name || user.email.split('@')[0],
      email: user.email,
      userId: user._id
    });
    
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};