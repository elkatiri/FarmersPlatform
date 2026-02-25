const mongoose = require('mongoose');

const farmerRequestSchema = new mongoose.Schema(
  {
    workType: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    workersNeeded: { type: Number, required: true, min: 1 },
    transportInfo: { type: String, required: true, trim: true },
    housingProvided: { type: Boolean, default: false },
    mealsProvided: { type: Boolean, default: false },
    whatsapp: { type: String, required: true, trim: true },
    notes: { type: String, default: '' },
    status: {
      type: String,
      enum: ['new', 'matched', 'closed'],
      default: 'new',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('FarmerRequest', farmerRequestSchema);
