const { validationResult } = require('express-validator');
const FarmerRequest = require('../models/FarmerRequest');

const createFarmerRequest = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const durationDays = Math.max(
      1,
      Math.ceil((new Date(req.body.endDate).getTime() - new Date(req.body.startDate).getTime()) / (1000 * 60 * 60 * 24))
    );

    const payload = {
      ...req.body,
      durationDays,
      source: req.body.source || 'web',
      status: 'new',
    };

    const request = await FarmerRequest.create(payload);
    return res.status(201).json({
      message: 'Request submitted successfully',
      request,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to create request' });
  }
};

const getFarmerRequests = async (req, res) => {
  try {
    const { status } = req.query;
    const filters = status ? { status } : {};
    const requests = await FarmerRequest.find(filters).sort({ createdAt: -1 });
    return res.json(requests);
  } catch (error) {
    return res.status(500).json({ message: 'Unable to fetch requests' });
  }
};

const updateRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['new', 'in_progress', 'matched', 'closed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const updated = await FarmerRequest.findByIdAndUpdate(id, { status }, { new: true });

    if (!updated) {
      return res.status(404).json({ message: 'Request not found' });
    }

    return res.json(updated);
  } catch (error) {
    return res.status(500).json({ message: 'Unable to update request status' });
  }
};

module.exports = {
  createFarmerRequest,
  getFarmerRequests,
  updateRequestStatus,
};
