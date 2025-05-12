const express = require('express');
const router = express.Router();
const { updateEmployee, deleteEmployee, getEmployeeWithTraining, getEmployeeProfile, getAllSkills, updateStatus, getEmployeeByRole } = require('../controllers/employeeController');
const  {auditRecord} = require('../controllers/auditController');

//const { authenticate, authorizeAdmin, authorizeSelfOrAdmin } = require('../middleware/authMiddleware');

router.get('/admin_dashnoard', getEmployeeWithTraining);  //to show admin dashboard

router.get('/filter',getEmployeeByRole);   //get emp by role

router.get('/',getEmployeeWithTraining);  

router.get('/skills',getAllSkills);  //get all skills from table

router.get('/audit',auditRecord);  //for audit

router.get('/:emp_id', getEmployeeProfile);  //get emp by id

router.put('/status/:emp_id',updateStatus);     //update status

router.put('/editemp/:emp_id',updateEmployee);  //update emp

router.delete('/delemp/:emp_id', deleteEmployee);  //delete employee




// Update - only self or admin
// router.put('/:emp_id', authenticate, authorizeSelfOrAdmin, updateEmployee);

// Delete - only admin
// router.delete('/:emp_id', authenticate, authorizeAdmin, deleteEmployee);


module.exports = router;
