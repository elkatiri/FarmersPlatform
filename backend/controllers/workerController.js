const { validationResult } = require('express-validator');
const WorkerProfile = require('../models/WorkerProfile');

const createWorkerProfile = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const profile = await WorkerProfile.create(req.body);
  return res.status(201).json({
    message: 'Profile submitted and pending admin approval',
    profile,
  });
};

const getApprovedWorkers = async (req, res) => {
  const { location, skill, availability } = req.query;

  const filters = { status: 'approved' };

  if (location) {
    filters.regions = { $in: [location] };
  }
  if (skill) {
    filters.skills = { $in: [skill] };
  }
  if (availability) {
    filters.availability = availability;
  }

  const workers = await WorkerProfile.find(filters).sort({ createdAt: -1 });
  return res.json(workers);
};

const getPendingWorkers = async (req, res) => {
  const workers = await WorkerProfile.find({ status: 'pending' }).sort({ createdAt: -1 });
  return res.json(workers);
};

const updateWorkerStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!['approved', 'rejected', 'pending'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }

  const updated = await WorkerProfile.findByIdAndUpdate(id, { status }, { new: true });
  if (!updated) {
    return res.status(404).json({ message: 'Worker not found' });
  }

  return res.json(updated);
};

module.exports = {
  createWorkerProfile,
  getApprovedWorkers,
  getPendingWorkers,
  updateWorkerStatus,
};
