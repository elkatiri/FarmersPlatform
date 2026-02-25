const express = require('express');
const { body } = require('express-validator');
const {
  createWorkerProfile,
  getApprovedWorkers,
  getPendingWorkers,
  updateWorkerStatus,
} = require('../controllers/workerController');
const { adminAuth } = require('../middleware/auth');

const router = express.Router();

router.post(
  '/',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('phone').notEmpty().withMessage('Phone is required'),
    body('regions').isArray({ min: 1 }).withMessage('At least one region required'),
    body('skills').isArray({ min: 1 }).withMessage('At least one skill required'),
    body('experienceLevel').isIn(['beginner', 'intermediate', 'expert']),
    body('availability').isIn(['immediate', 'within_week', 'seasonal']),
    body('transportFlexibility').isIn(['yes', 'no', 'depends']),
  ],
  createWorkerProfile
);

router.get('/', getApprovedWorkers);
router.get('/pending', adminAuth, getPendingWorkers);
router.patch('/:id/status', adminAuth, updateWorkerStatus);

module.exports = router;
