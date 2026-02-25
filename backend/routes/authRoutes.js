const express = require('express');
const { body } = require('express-validator');
const { loginAdmin } = require('../controllers/authController');

const router = express.Router();

router.post(
  '/login',
  [body('email').isEmail().withMessage('Valid email required'), body('password').notEmpty().withMessage('Password required')],
  loginAdmin
);

module.exports = router;
