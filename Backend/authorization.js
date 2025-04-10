const jwt = require('jsonwebtoken');
const JWT_SECRET = 'CrossCountryInfotech';

const authenticateJWT = (req,res,next) => {
    const token = req.header('Authorization')?.replace('Bearer','');

    if(!token){
        return res.status(403).json({message:'Access AudioDestinationNode. No token provided'});
    }

    jwt.verify(token,JWT_SECRET,(err,employee) => {
        if(err){
            return res.status(403).json({message:'Invalid token'});
        }

        req.employee = employee;
        next();
    });
}

module.exports = authenticateJWT;