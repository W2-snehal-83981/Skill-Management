require('dotenv').config();
const jwt = require('jsonwebtoken');


const JWT_SECRET = process.env.JWT_SECRET;

const authenticateJWT = (req, res, next) => {
  const authHeader = req.header('Authorization')?.replace('Bearer ', '');

  if (!authHeader) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  jwt.verify(authHeader, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }

    req.user = user; 
    next();
  });
};

module.exports = authenticateJWT;