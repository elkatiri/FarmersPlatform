const express = require('express');
const { body } = require('express-validator');
const { createContactMessage, getContactMessages, deleteContactMessage, deleteAllContactMessages } = require('../controllers/contactController');
const { publicPostLimiter } = require('../middleware/rateLimit');
const { adminAuth } = require('../middleware/auth');

const router = express.Router();

router.get('/', adminAuth, getContactMessages);
router.delete('/all', adminAuth, deleteAllContactMessages);
router.delete('/:id', adminAuth, deleteContactMessage);

router.post(
  '/',
  publicPostLimiter,
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('message').notEmpty().withMessage('Message is required'),
  ],
  createContactMessage
);

module.exports = router;
