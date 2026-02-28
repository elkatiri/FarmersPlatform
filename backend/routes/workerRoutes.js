const express = require('express');
const { body } = require('express-validator');
const {
  createWorkerProfile,
  getApprovedWorkers,
  getPendingWorkers,
  updateWorkerStatus,
} = require('../controllers/workerController');
const { adminAuth } = require('../middleware/auth');
const { publicPostLimiter } = require('../middleware/rateLimit');

const router = express.Router();

router.post(
  '/',
  publicPostLimiter,
  [
    body('fullName').optional().isString().trim(),
    body('name').optional().isString().trim(),
    body().custom((value) => {
      if (!value.fullName && !value.name) {
        throw new Error('Full name is required');
      }
      return true;
    }),
    body('phone').notEmpty().withMessage('Phone is required'),
    body('phone').matches(/^\+?[0-9]{8,15}$/).withMessage('Phone must be valid'),
    body('whatsapp').optional().matches(/^\+?[0-9]{8,15}$/).withMessage('WhatsApp must be valid'),
    body('location').notEmpty().withMessage('Location is required'),
    body('regions').isArray({ min: 1 }).withMessage('At least one region required'),
    body('skills').isArray({ min: 1 }).withMessage('At least one skill required'),
    body('experienceLevel').isIn(['beginner', 'intermediate', 'expert']),
    body('availability').isIn(['immediate', 'within_week', 'seasonal']),
    body('availabilityStart').optional().isISO8601().toDate(),
    body('availabilityEnd').optional().isISO8601().toDate(),
    body('travelFlexible').optional().isBoolean().toBoolean(),
    body('transportFlexibility').optional().isIn(['yes', 'no', 'depends']),
  ],
  createWorkerProfile
);

router.get('/', getApprovedWorkers);
router.get('/pending', adminAuth, getPendingWorkers);
router.patch('/:id/status', adminAuth, updateWorkerStatus);

module.exports = router;
