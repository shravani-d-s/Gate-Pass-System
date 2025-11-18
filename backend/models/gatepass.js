const mongoose = require('mongoose');

const gatePassSchema = new mongoose.Schema(
  {
    // Reference to Student User ID
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // BASIC DETAILS
    name: { type: String, required: true, trim: true },
    hostelBlock: { type: String, required: true },
    journeyDate: { type: String, required: true },   // stays as string since FE sends dd-mm-yyyy
    leavingTime: { type: String, required: true },
    destination: { type: String, required: true },

    // REASON & LUGGAGE
    reason: { type: String, required: true, trim: true },
    luggageDetails: { type: String, required: true, trim: true },

    // STATUS & APPROVAL
    requestDate: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    approvedDate: { type: Date },
    rejectionReason: { type: String, trim: true },

    // STUDENT TRANSPORT DETAILS (visible only after approval)
    cabNumber: { type: String, default: "", trim: true },
    transportMode: { type: String, default: "", trim: true },
    ticketNumber: { type: String, default: "", trim: true },

    // FINAL GUARD CHECK
    guardVerified: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("GatePass", gatePassSchema);
