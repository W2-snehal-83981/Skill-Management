const jwt = require('jsonwebtoken');

exports.authenticate = (req,res,next) => {
    const authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.startsWith("Bearer ")){
        return res.status(401).json({message: 'Access token required'});
    } 

    const token = authHeader.split(' ')[1]; // Split "Bearer <token>"

    try{
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        req.user = decoded;  // { emp_id, role }
        next();
    } catch (err) {
        res.status(403).json({message: 'Invalid or expired token'});
    }
};

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