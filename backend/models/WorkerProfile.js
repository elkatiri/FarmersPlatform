const mongoose = require('mongoose');

const workerProfileSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true, unique: true },
    whatsapp: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
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
    availabilityStart: { type: Date },
    availabilityEnd: { type: Date },
    travelFlexible: { type: Boolean, default: false },
    transportFlexibility: {
      type: String,
      enum: ['yes', 'no', 'depends'],
    },
    status: {
      type: String,
      enum: ['en_attente', 'approuve', 'rejete', 'supprime'],
      default: 'en_attente',
    },
    notes: { type: String, trim: true, default: '' },
  },
  { timestamps: true }
);

workerProfileSchema.index({ phone: 1 }, { unique: true });
workerProfileSchema.index({ status: 1, regions: 1 });

module.exports = mongoose.model('WorkerProfile', workerProfileSchema);
