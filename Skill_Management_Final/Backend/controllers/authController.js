// require('dotenv').config();
// const pool = require('../config/db');
// const bcrypt = require("bcrypt");
// const jwt = require('jsonwebtoken');
// // const authenticate  = require('../middleware/authMiddleware');
// const authenticateJWT = require('../authenticateJWT');
// console.log('JWT Secret Key:', jwtSecret);

const pool = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const authenticateJWT = require('../middleware/authenticateJWT');

const JWT_SECRET1 = process.env.JWT_SECRET;
console.log('JWT Secret Key:', JWT_SECRET1);

//registered employee
exports.register =  async (req,res) => {
  console.log("Request Body:", req.body);
    const {emp_id,name,email,password,date_of_joining,department_name,skill_category,skill,skill_level,role,status} = req.body;

    try{
        const hashedPassword = await bcrypt.hash(password,5);

        await pool.query(
            `INSERT INTO employee (
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


exports.login = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const result = await pool.query(
        `SELECT * FROM employee WHERE email = $1 AND is_deleted = $2`,
        [email, false]
      );
      const user = result.rows[0];
  
      if (!user) {
        return res.status(401).json({ error: 'User not found' });
      }
  
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ error: 'Invalid Credentials' });
      }
  
      // Creating JWT token using sign(payload + secretKey + expiresIn)
      const token = jwt.sign(
        {
          emp_id: user.emp_id,
          role: user.role,
        },
        JWT_SECRET1,
        { expiresIn: '1d' }
      );
  
      if (user.role === 'Admin') {
        res.json({
          message: 'Admin login successful!',
          role: user.role,
          userData: user,
          token,
        });
      } else if (user.role === 'Employee') {
        res.json({
          message: 'Employee Login Successful!',
          role: user.role,
          userData: user,
          token,
        });
      } else {
        return res.status(400).send('Invalid role');
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
};

// Example using your 'pool' (assuming PostgreSQL)

exports.getDistinctDepartments = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT DISTINCT department_name FROM employee ORDER BY department_name'
    );
    const departments = result.rows.map(row => row.department_name);
    res.status(200).json(departments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


