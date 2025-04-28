const express = require('express');
const router = express.Router();
const { register, login, resetPassword,  } = require('../controllers/authController');

router.post('/register', register);  //register emp

router.post('/login', login);   //login

router.post('/reset-password', resetPassword); //reset password

module.exports = router;
