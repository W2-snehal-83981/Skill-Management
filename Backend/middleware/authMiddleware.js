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

//exports.authorizeAdmin = (req, res, next) => {
//     if (req.user.role !== 'Admin') {
//       return res.status(403).json({ message: "Admin access required" });
//     }
//     next();
//};
  
//exports.authorizeSelfOrAdmin = (req, res, next) => {
//     if (req.user.role === 'Admin' || req.user.emp_id === req.params.emp_id) {
//       return next();
//     }
//     return res.status(403).json({ message: "Access denied" });
//};