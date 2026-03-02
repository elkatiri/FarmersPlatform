const express = require('express');
const { body } = require('express-validator');
const {
  createFarmerRequest,
  getFarmerRequests,
  getMyFarmerRequests,
  updateRequestStatus,
} = require('../controllers/requestController');
const { adminAuth } = require('../middleware/auth');
const { publicPostLimiter } = require('../middleware/rateLimit');

const router = express.Router();

const maPhoneRegex = /^\+212\d{9}$/;

router.post(
  '/',
  publicPostLimiter,
  [
    body('workType').notEmpty().withMessage('Work type is required'),
    body('location').notEmpty().withMessage('Location is required'),
    body('startDate').isISO8601().withMessage('Valid start date required'),
    body('endDate').isISO8601().withMessage('Valid end date required'),
    body('workersNeeded').isInt({ min: 1 }).withMessage('At least 1 worker required'),
    body('transportResponsibility')
      .isIn(['farmer', 'worker', 'shared', 'unsure'])
      .withMessage('Transport responsibility is required'),
    body('transportInfo').optional().isString(),
    body('housingProvided').optional().isBoolean().toBoolean(),
    body('mealsProvided').optional().isBoolean().toBoolean(),
    body('contactName').notEmpty().withMessage('Contact name required'),
    body('phone').matches(maPhoneRegex).withMessage('Phone must be in format +212XXXXXXXXX'),
    body('whatsapp').matches(maPhoneRegex).withMessage('WhatsApp must be in format +212XXXXXXXXX'),
    body('notes').optional().isString(),
  ],
  createFarmerRequest
);

router.get('/', adminAuth, getFarmerRequests);
router.get('/mine', getMyFarmerRequests);
router.patch('/:id/status', adminAuth, updateRequestStatus);

module.exports = router;
