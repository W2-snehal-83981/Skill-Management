const express = require('express');
const router = express.Router();
const { updateEmployee, deleteEmployee, getEmployeeWithTraining, getEmployeeProfile, getEmployee , updateEmployeeClient,updateStatus,getEmployeeById, getEmployeeProfilec, getAllSkills} = require('../controllers/employeeController');

router.get('/skills',getAllSkills);
router.delete('/delemp/:emp_id', deleteEmployee);
router.put('/editemp/:emp_id',updateEmployee);
router.get('/admin_dashnoard', getEmployeeWithTraining);
router.get('/:emp_id', getEmployeeProfile);
router.get('/',getEmployee);
router.get('/client/:emp_id',getEmployeeProfilec);
router.put('/status/:emp_id',updateStatus);
router.put('/editempClient/:emp_id',updateEmployeeClient);


module.exports = router;
