const pool = require('../config/db');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

//registered employee
exports.register = async (req,res) => {
    const {emp_id,name,email,password,date_of_joining,department_name,skill_category,skill,skill_level,role,status} = req.body;

    try{
        const hashedPassword = await bcrypt.hash(password,5);

        await pool.query(
            `INSERT INTO Employee (
                emp_id, name, email, password, date_of_joining, department_name,
                skill_category, skill, skill_level, role, status)
                 VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
              [
                emp_id, name, email, hashedPassword,
                date_of_joining, department_name, skill_category,
                skill, skill_level, role, status
              ]
        );

        res.status(200).json({message: 'Employee registered successfully'});
    } catch(err) {
        res.status(500).json({error: err.message});
    }
};

//login
exports.login = async (req,res) => {
    const {email,password} = req.body;
    
    try {
        const result = await pool.query(`select * from Employee where email=$1 AND isDeleted=$2`,[email,false]);
        const user = result.rows[0];
        if(!user) return res.status(401).json({error: 'User not found'});

        const validPassword = await bcrypt.compare(password,user.password);
        if(!validPassword) return res.status(401).json({error: 'Invalid Credentials'});
        
        //creating JWT token using sign(payload+secretkey+expiresIn)
        const token = jwt.sign({
            emp_id:user.emp_id,
            role:user.role},
            process.env.JWT_SECRET,{expiresIn:'1d'}
        );

        
        if(user.role === 'Admin'){
            res.json({
                message:"Admin login successful!",
                role: user.role,
                userData: user,
                token
            });
        }
        else if(user.role === 'Employee'){
            res.json ({
                message: "Employee Login Successful!",
                role: user.role,
                userData:user,
                token
            });
        }
        else{
              return res.status(400).send("Invalid role");
        }
    }catch (error){
        console.error(error);
        res.status(500).send("Server Error");
    }
}

//reset password
exports.resetPassword = async (req,res) => {
    const { email , newPassword, confirmPassword } = req.body;
    
    if(newPassword != confirmPassword) {
        return res.status(400).json({message: 'Password do not match'});
    }
    
    try{
        const result = await pool.query('select * from Employee where email =$1 AND isDeleted=$2', [email,false]);
        const user = result.rows[0];
    
        if(!user) return res.status(404).json({message: 'Employee not found!'});
    
        await pool.query('update Employee set password=$1 where email=$2', [newPassword,email]);
        res.status(200).json({message: 'Password has been reset successfully. Please login again.'});
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'server error'});
    }
};
    