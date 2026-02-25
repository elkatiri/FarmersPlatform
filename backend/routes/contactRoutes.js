const express = require('express');
const { body } = require('express-validator');
const { createContactMessage } = require('../controllers/contactController');

const router = express.Router();

router.post(
  '/',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('message').notEmpty().withMessage('Message is required'),
  ],
  createContactMessage
);

module.exports = router;
