const GatePass = require('../models/gatepass');
const User = require('../models/users');

// Student creates a gate pass request
exports.createGatePass = async (req, res) => {
  try {
    console.log("📥 Backend received:", req.body);

    const {
      name,
      hostelBlock,
      journeyDate,
      leavingTime,
      destination,
      reason,
      luggageDetails
    } = req.body;

    const studentId = req.user.userId;

    if (!name || !hostelBlock || !journeyDate || !leavingTime || !destination || !reason || !luggageDetails) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newPass = await GatePass.create({
      studentId,
      name,
      hostelBlock,
      journeyDate,
      leavingTime,
      destination,
      reason,
      luggageDetails,
      requestDate: new Date()
    });

    const populatedPass = await GatePass.findById(newPass._id)
      .populate('studentId', 'name rollNumber');

    res.status(201).json({
      message: "Gate pass requested successfully",
      gatePass: populatedPass
    });

  } catch (err) {
    console.error('Create gate pass error:', err);
    res.status(500).json({ message: err.message });
  }
};


// Student views their gate pass requests
exports.getMyGatePasses = async (req, res) => {
  try {
    const studentId = req.user.userId;
    const passes = await GatePass.find({ studentId })
      .populate('approvedBy', 'name')
      .sort({ requestDate: -1 });

    res.status(200).json(passes);
  } catch (err) {
    console.error('Get my gate passes error:', err);
    res.status(500).json({ message: err.message });
  }
};

// Admin views all gate pass requests (with optional status filter)
exports.getAllGatePasses = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};

    const passes = await GatePass.find(filter)
      .populate('studentId', 'name rollNumber email')
      .populate('approvedBy', 'name')
      .sort({ requestDate: -1 });

    res.status(200).json(passes);
  } catch (err) {
    console.error('Get all gate passes error:', err);
    res.status(500).json({ message: err.message });
  }
};

// Admin views pending gate pass requests
exports.getPendingGatePasses = async (req, res) => {
  try {
    const pending = await GatePass.find({ status: 'pending' })
      .populate('studentId', 'name rollNumber email')
      .sort({ requestDate: -1 });

    res.status(200).json(pending);
  } catch (err) {
    console.error('Get pending gate passes error:', err);
    res.status(500).json({ message: err.message });
  }
};

// Admin approves a request
exports.approvePass = async (req, res) => {
  try {
    const { id } = req.params;
    const approvedBy = req.user.userId;

    const gatePass = await GatePass.findById(id);
    if (!gatePass) {
      return res.status(404).json({ message: "Gate pass not found" });
    }

    if (gatePass.status !== 'pending') {
      return res.status(400).json({ message: "Gate pass already processed" });
    }

    const updated = await GatePass.findByIdAndUpdate(id, {
      status: 'approved',
      approvedBy,
      approvedDate: new Date()
    }, { new: true })
      .populate('studentId', 'name rollNumber email')
      .populate('approvedBy', 'name');

    res.status(200).json({
      message: "Gate pass approved successfully",
      gatePass: updated
    });
  } catch (err) {
    console.error('Approve gate pass error:', err);
    res.status(500).json({ message: err.message });
  }
};

// Admin rejects a request
exports.rejectPass = async (req, res) => {
  try {
    const { id } = req.params;
    const { rejectionReason } = req.body;
    const approvedBy = req.user.userId;

    const gatePass = await GatePass.findById(id);
    if (!gatePass) {
      return res.status(404).json({ message: "Gate pass not found" });
    }

    if (gatePass.status !== 'pending') {
      return res.status(400).json({ message: "Gate pass already processed" });
    }

    const updated = await GatePass.findByIdAndUpdate(id, {
      status: 'rejected',
      approvedBy,
      rejectionReason,
      approvedDate: new Date()
    }, { new: true })
      .populate('studentId', 'name rollNumber email')
      .populate('approvedBy', 'name');

    res.status(200).json({
      message: "Gate pass rejected successfully",
      gatePass: updated
    });
  } catch (err) {
    console.error('Reject gate pass error:', err);
    res.status(500).json({ message: err.message });
  }
};

// Get gate pass by ID (for both admin and student)
exports.getGatePassById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    const userRole = req.user.role;

    const gatePass = await GatePass.findById(id)
      .populate('studentId', 'name rollNumber email')
      .populate('approvedBy', 'name');

    if (!gatePass) {
      return res.status(404).json({ message: "Gate pass not found" });
    }

    // Check if student is requesting their own gate pass or if user is admin
    if (userRole === 'student' && gatePass.studentId._id.toString() !== userId) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.status(200).json(gatePass);
  } catch (err) {
    console.error('Get gate pass by ID error:', err);
    res.status(500).json({ message: err.message });
  }
};

// Public endpoint - Get all gate passes (no authentication required)
exports.getPublicGatePasses = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};

    const passes = await GatePass.find(filter)
      .populate('studentId', 'name rollNumber')
      .populate('approvedBy', 'name')
      .sort({ exitDate: -1 });

    res.status(200).json(passes);
  } catch (err) {
    console.error('Get public gate passes error:', err);
    res.status(500).json({ message: err.message });
  }
};