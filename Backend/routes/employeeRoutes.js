const express = require('express');
const router = express.Router();
const { updateEmployee, deleteEmployee, getEmployeeWithTraining, getEmployeeProfile, getEmployee } = require('../controllers/employeeController');
const  {auditRecord} = require('../controllers/auditController');

const { authenticate, authorizeAdmin, authorizeSelfOrAdmin } = require('../middleware/authMiddleware');

// Update - only self or admin
// router.put('/:emp_id', authenticate, authorizeSelfOrAdmin, updateEmployee);

// Delete - only admin
// router.delete('/:emp_id', authenticate, authorizeAdmin, deleteEmployee);

router.delete('/delemp/:emp_id', deleteEmployee);
router.put('/editemp/:emp_id',updateEmployee);
router.get('/admin_dashnoard', getEmployeeWithTraining);
router.get('/:emp_id', getEmployeeProfile);
// router.get('/',getEmployee);
router.get('/',getEmployeeWithTraining);
router.post('/audit',auditRecord);

module.exports = router;
