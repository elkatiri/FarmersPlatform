const express = require('express');
const { body } = require('express-validator');
const { loginAdmin } = require('../controllers/authController');
const { authLimiter } = require('../middleware/rateLimit');

const router = express.Router();

router.post(
  '/login',
  authLimiter,
  [body('email').isEmail().withMessage('Valid email required'), body('password').notEmpty().withMessage('Password required')],
  loginAdmin
);

module.exports = router;
