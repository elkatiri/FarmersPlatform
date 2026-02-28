const mongoose = require('mongoose');

const farmerRequestSchema = new mongoose.Schema(
  {
    workType: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    durationDays: { type: Number },
    workersNeeded: { type: Number, required: true, min: 1 },
    transportResponsibility: {
      type: String,
      enum: ['farmer', 'worker', 'shared', 'unsure'],
      default: 'farmer',
    },
    transportInfo: { type: String, trim: true },
    housingProvided: { type: Boolean, default: false },
    mealsProvided: { type: Boolean, default: false },
    contactName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    whatsapp: { type: String, required: true, trim: true },
    notes: { type: String, default: '' },
    status: {
      type: String,
      enum: ['new', 'in_progress', 'matched', 'closed'],
      default: 'new',
    },
    source: { type: String, trim: true, default: 'web' },
  },
  { timestamps: true }
);

farmerRequestSchema.index({ status: 1, startDate: 1 });

module.exports = mongoose.model('FarmerRequest', farmerRequestSchema);
