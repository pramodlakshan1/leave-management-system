const express = require('express');
const { body } = require('express-validator');
const { login } = require('../controller/authController');

const router = express.Router();

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Enter a valid email'),
    body('password').exists().withMessage('Password is required'),
  ],
  login
);

module.exports = router;