const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^[a-zA-Z0-9._%+-]+@vnit\.ac\.in$/, 'Please enter a valid VNIT email'],
    index: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['student', 'admin'],
    required: true,
    index: true
  },
  rollNumber: {
    type: String,
    required: function () { return this.role === 'student'; },
    match: [/^BT\d{2}[A-Z]{3}\d{3}$/, 'Invalid roll number format. Use format like BT20MEC001'],
    unique: true
  },
  adminId: {
    type: String,
    enum: ['GTVNIT001', 'GTVNIT002', 'GTVNIT003', 'GTVNIT004', 'GTVNIT005'],
    required: function () { return this.role === 'admin'; },
    unique: true
  },
  idCardImageURL: {
    type: String,
    required: function () {
      return this.role === 'student';
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  }
}, {
  timestamps: true // Adds createdAt and updatedAt
});

// Pre-save middleware to ensure role-specific validations
userSchema.pre('save', function (next) {
  if (this.role === 'student') {
    if (!this.rollNumber) {
      return next(new Error('Roll number is required for students'));
    }
    if (!this.idCardImageURL) {
      return next(new Error('ID card image is required for students'));
    }
  } else if (this.role === 'admin') {
    if (!this.adminId) {
      return next(new Error('Admin ID is required for admins'));
    }
  }
  next();
});

// Method to get public profile (without sensitive data)
userSchema.methods.getPublicProfile = function () {
  const userObject = this.toObject();
  delete userObject.passwordHash;
  return userObject;
};

// Static method to find user by email or roll number
userSchema.statics.findByEmailOrRoll = function (identifier) {
  return this.findOne({
    $or: [
      { email: identifier.toLowerCase() },
      { rollNumber: identifier.toUpperCase() }
    ]
  });
};

module.exports = mongoose.model('User', userSchema);
