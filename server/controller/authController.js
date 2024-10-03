// authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

// Register a new user
exports.register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if user already exists
    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, result) => {
      if (err) return res.status(500).json({ message: 'Server error' });

      if (result.length > 0) {
        return res.status(400).json({ message: 'User already exists' });
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Insert new user
      db.query(
        'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
        [username, email, hashedPassword],
        (err, result) => {
          if (err) return res.status(500).json({ message: 'Database error' });

          // Generate JWT token
          const token = jwt.sign({ id: result.insertId }, '12212021', {
            expiresIn: '1h',
          });

          res.status(201).json({ token });
        }
      );
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  
  // Fetch user from the database
  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, result) => {
    if (err) return res.status(500).json({ message: 'Server error' });
    
    const user = result[0];
    
    // Check if password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
    
    // Generate JWT token
    const token = jwt.sign({ id: user.id }, '12212021', { expiresIn: '1h' });
    
    // Send the token and user details in response
    res.status(200).json({ token, username: user.username, email: user.email });
  });
};
  
