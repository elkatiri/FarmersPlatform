const { validationResult } = require('express-validator');
const WorkerProfile = require('../models/WorkerProfile');

const createWorkerProfile = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const duplicate = await WorkerProfile.findOne({ phone: req.body.phone });
    if (duplicate) {
      return res.status(409).json({ message: 'A worker with this phone already exists.' });
    }

    const payload = {
      fullName: req.body.fullName || req.body.name,
      phone: req.body.phone,
      whatsapp: req.body.whatsapp || req.body.phone,
      location: req.body.location,
      regions: req.body.regions,
      skills: req.body.skills,
      experienceLevel: req.body.experienceLevel,
      availability: req.body.availability,
      availabilityStart: req.body.availabilityStart,
      availabilityEnd: req.body.availabilityEnd,
      travelFlexible:
        typeof req.body.travelFlexible === 'boolean'
          ? req.body.travelFlexible
          : req.body.transportFlexibility === 'yes',
      transportFlexibility: req.body.transportFlexibility,
      status: 'pending',
      notes: req.body.notes || '',
    };

    const profile = await WorkerProfile.create(payload);
    return res.status(201).json({
      message: 'Profile submitted and pending admin approval',
      profile,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to create profile', error: error.message });
  }
};

const getApprovedWorkers = async (req, res) => {
  try {
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
  } catch (error) {
    return res.status(500).json({ message: 'Unable to fetch workers' });
  }
};

const getPendingWorkers = async (req, res) => {
  try {
    const workers = await WorkerProfile.find({ status: 'pending' }).sort({ createdAt: -1 });
    return res.json(workers);
  } catch (error) {
    return res.status(500).json({ message: 'Unable to fetch pending workers' });
  }
};

const updateWorkerStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['approved', 'rejected', 'pending', 'deleted'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const updated = await WorkerProfile.findByIdAndUpdate(id, { status }, { new: true });
    if (!updated) {
      return res.status(404).json({ message: 'Worker not found' });
    }

    return res.json(updated);
  } catch (error) {
    return res.status(500).json({ message: 'Unable to update status' });
  }
};

const getAllWorkers = async (_req, res) => {
  try {
    const workers = await WorkerProfile.find().sort({ createdAt: -1 });
    return res.json(workers);
  } catch (error) {
    return res.status(500).json({ message: 'Unable to fetch workers' });
  }
};

const updateWorkerProfile = async (req, res) => {
  try {
    const { id } = req.params;

    const worker = await WorkerProfile.findById(id);
    if (!worker) {
      return res.status(404).json({ message: 'Worker not found' });
    }

    const incomingFullName = req.body.fullName || req.body.name;
    const incomingPhone = req.body.phone;
    if (incomingPhone && incomingPhone !== worker.phone) {
      const duplicate = await WorkerProfile.findOne({ phone: incomingPhone });
      if (duplicate) {
        return res.status(409).json({ message: 'A worker with this phone already exists.' });
      }
    }

    const allowedFields = [
      'fullName',
      'phone',
      'whatsapp',
      'location',
      'regions',
      'skills',
      'experienceLevel',
      'availability',
      'availabilityStart',
      'availabilityEnd',
      'travelFlexible',
      'transportFlexibility',
      'notes',
      'status',
    ];

    const updates = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }
    if (incomingFullName !== undefined) {
      updates.fullName = incomingFullName;
    }

    if (updates.status && !['pending', 'approved', 'rejected', 'deleted'].includes(updates.status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const updated = await WorkerProfile.findByIdAndUpdate(id, updates, { new: true });
    return res.json(updated);
  } catch (error) {
    return res.status(500).json({ message: 'Unable to update worker' });
  }
};

const deleteWorkerProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await WorkerProfile.findByIdAndUpdate(id, { status: 'deleted' }, { new: true });
    if (!updated) {
      return res.status(404).json({ message: 'Worker not found' });
    }
    return res.json({ message: 'Worker deleted', worker: updated });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to delete worker' });
  }
};

module.exports = {
  createWorkerProfile,
  getApprovedWorkers,
  getPendingWorkers,
  getAllWorkers,
  updateWorkerStatus,
  updateWorkerProfile,
  deleteWorkerProfile,
};
