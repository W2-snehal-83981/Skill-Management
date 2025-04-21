const jwt = require('jsonwebtoken');

exports.authenticate = (req,res,next) => {
    const token = req.headers.authorization?.(" ")[1];
    if(!token) return res.status(401).json({message: 'Access token required'});

    try{
        const decoded = jwt.verify(token,process.emitWarning.JWT_SECRET);
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