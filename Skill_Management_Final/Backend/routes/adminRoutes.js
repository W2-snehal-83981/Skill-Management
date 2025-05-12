require('dotenv').config(); 
const express = require('express');
const router = express.Router();
const { getEmployees , getEmployeeByIdWithTraining , deleteEmployeeAdmin , updateEmployeeSkill , adminlevelInc , getComTraining , getComTrainingById, changePassword } = require('../controllers/adminController');
const authenticateJWT = require('../middleware/authenticateJWT');


router.get('/',getEmployees);

router.get('/employee/:emp_id',getEmployeeByIdWithTraining);

router.delete('/deleteEmp/:emp_id',deleteEmployeeAdmin);

router.put('/updateEmp/:emp_id',updateEmployeeSkill);

router.put('/updateLev/:emp_id', adminlevelInc);

router.get('/ctbe',getComTraining);

router.get('/cotrbi/:emp_id',getComTrainingById);

router.put('/chgpassword/:emp_id',changePassword);





module.exports = router;