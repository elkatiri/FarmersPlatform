const { validationResult } = require('express-validator');
const FarmerRequest = require('../models/FarmerRequest');

const createFarmerRequest = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const request = await FarmerRequest.create(req.body);
  return res.status(201).json({
    message: 'Request submitted successfully',
    request,
  });
};

const getFarmerRequests = async (_req, res) => {
  const requests = await FarmerRequest.find().sort({ createdAt: -1 });
  return res.json(requests);
};

const updateRequestStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!['new', 'matched', 'closed'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }

  const updated = await FarmerRequest.findByIdAndUpdate(id, { status }, { new: true });

  if (!updated) {
    return res.status(404).json({ message: 'Request not found' });
  }

  return res.json(updated);
};

module.exports = {
  createFarmerRequest,
  getFarmerRequests,
  updateRequestStatus,
};
