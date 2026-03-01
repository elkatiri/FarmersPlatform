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
    body('phone').matches(/^\+?[0-9]{8,15}$/).withMessage('Valid phone required'),
    body('whatsapp').matches(/^\+?[0-9]{8,15}$/).withMessage('Valid WhatsApp number required'),
    body('notes').optional().isString(),
  ],
  createFarmerRequest
);

router.get('/', adminAuth, getFarmerRequests);
router.get('/mine', getMyFarmerRequests);
router.patch('/:id/status', adminAuth, updateRequestStatus);

module.exports = router;
