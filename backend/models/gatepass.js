const mongoose = require('mongoose');

const gatePassSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // NEW FIELDS
  name: { type: String, required: true, trim: true },
  hostelBlock: { type: String, required: true },
  journeyDate: { type: String, required: true },
  leavingTime: { type: String, required: true },
  destination: { type: String, required: true },

  // OLD FIELDS
  reason: { type: String, required: true, trim: true },
  luggageDetails: { type: String, required: true, trim: true },

  requestDate: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  approvedDate: { type: Date },
  rejectionReason: { type: String, trim: true }
}, {
  timestamps: true
});

module.exports = mongoose.model('GatePass', gatePassSchema);
