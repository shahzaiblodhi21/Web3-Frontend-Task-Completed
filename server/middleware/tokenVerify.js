const jwt = require('jsonwebtoken');

// Middleware to verify token and extract userId
function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization']; // Get the token from the Authorization header
  if (!authHeader) {
    return res.status(403).json({ message: 'No token provided.' });
  }

  const token = authHeader.split(' ')[1]; // Split the "Bearer" part and extract the token

  if (!token) {
    return res.status(403).json({ message: 'Token is missing.' });
  }

  jwt.verify(token, '12212021', (err, decoded) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to authenticate token.' });
    }
    req.userId = decoded.id; // Assuming the token contains the user's id in the payload
    console.log('Decoded userId:', req.userId); // Debugging to verify userId extraction
    next();
  });
}

module.exports = verifyToken;
