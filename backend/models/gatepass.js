const mongoose = require('mongoose');

const gatePassSchema = new mongoose.Schema({
  studentId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  reason: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: 500
  },
  luggageDetails: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: 300
  },
  exitDate: {
    type: Date,
    default: Date.now
  },
  requestDate: { 
    type: Date, 
    default: Date.now 
  },
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected'], 
    default: 'pending' 
  },
  approvedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  approvedDate: {
    type: Date
  },
  rejectionReason: {
    type: String,
    trim: true,
    maxlength: 300
  }
}, {
  timestamps: true // This adds createdAt and updatedAt automatically
});

// Index for better query performance
gatePassSchema.index({ studentId: 1, requestDate: -1 });
gatePassSchema.index({ status: 1, requestDate: -1 });

// Virtual for formatted dates
gatePassSchema.virtual('formattedRequestDate').get(function() {
  return this.requestDate ? this.requestDate.toLocaleDateString() : '';
});

gatePassSchema.virtual('formattedExitDate').get(function() {
  return this.exitDate ? this.exitDate.toLocaleDateString() : '';
});

// Ensure virtual fields are serialized
gatePassSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('GatePass', gatePassSchema);