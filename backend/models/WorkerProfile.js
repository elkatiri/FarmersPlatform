const mongoose = require('mongoose');

const workerProfileSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    regions: [{ type: String, required: true }],
    skills: [{ type: String, required: true }],
    experienceLevel: {
      type: String,
      enum: ['beginner', 'intermediate', 'expert'],
      required: true,
    },
    availability: {
      type: String,
      enum: ['immediate', 'within_week', 'seasonal'],
      required: true,
    },
    transportFlexibility: {
      type: String,
      enum: ['yes', 'no', 'depends'],
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('WorkerProfile', workerProfileSchema);
