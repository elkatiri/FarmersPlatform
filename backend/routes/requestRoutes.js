const express = require('express');
const { body } = require('express-validator');
const { createFarmerRequest, getFarmerRequests, updateRequestStatus } = require('../controllers/requestController');
const { adminAuth } = require('../middleware/auth');

const router = express.Router();

router.post(
  '/',
  [
    body('workType').notEmpty().withMessage('Work type is required'),
    body('location').notEmpty().withMessage('Location is required'),
    body('startDate').isISO8601().withMessage('Valid start date required'),
    body('endDate').isISO8601().withMessage('Valid end date required'),
    body('workersNeeded').isInt({ min: 1 }).withMessage('At least 1 worker required'),
    body('transportInfo').notEmpty().withMessage('Transport info required'),
    body('whatsapp').notEmpty().withMessage('WhatsApp number required'),
  ],
  createFarmerRequest
);

router.get('/', adminAuth, getFarmerRequests);
router.patch('/:id/status', adminAuth, updateRequestStatus);

module.exports = router;
