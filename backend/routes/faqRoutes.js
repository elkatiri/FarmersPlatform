const express = require('express');
const { body } = require('express-validator');
const { getFAQs, createFAQ, updateFAQ, deleteFAQ } = require('../controllers/faqController');
const { adminAuth } = require('../middleware/auth');

const router = express.Router();

router.get('/', getFAQs);
router.post(
  '/',
  adminAuth,
  [body('question').notEmpty().withMessage('Question is required'), body('answer').notEmpty().withMessage('Answer is required')],
  createFAQ
);
router.patch('/:id', adminAuth, updateFAQ);
router.delete('/:id', adminAuth, deleteFAQ);

module.exports = router;
