const GatePass = require("../models/gatepass");
const User = require("../models/users");

/* ----------------------------------------------------
   STUDENT: CREATE GATE PASS
---------------------------------------------------- */
exports.createGatePass = async (req, res) => {
  try {
    console.log("📥 Backend received GatePass:", req.body);

    const {
      name,
      hostelBlock,
      journeyDate,
      leavingTime,
      destination,
      reason,
      luggageDetails,
    } = req.body;

    const studentId = req.user.userId;

    // Validate required fields
    if (
      !name ||
      !hostelBlock ||
      !journeyDate ||
      !leavingTime ||
      !destination ||
      !reason ||
      !luggageDetails
    ) {
      return res.status(400).json({ message: "All fields are required!" });
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
    });

    const populated = await GatePass.findById(newPass._id).populate(
      "studentId",
      "name rollNumber"
    );

    res.status(201).json({
      message: "Gate pass requested successfully",
      gatePass: populated,
    });
  } catch (err) {
    console.error("CreateGatePass Error:", err);
    res.status(500).json({ message: err.message });
  }
};

/* ----------------------------------------------------
   STUDENT: VIEW OWN GATE PASS REQUESTS
---------------------------------------------------- */
exports.getMyGatePasses = async (req, res) => {
  try {
    const studentId = req.user.userId;

    const passes = await GatePass.find({ studentId })
      .populate("approvedBy", "name")
      .sort({ requestDate: -1 });

    res.status(200).json(passes);
  } catch (err) {
    console.error("GetMyGatePasses Error:", err);
    res.status(500).json({ message: err.message });
  }
};

/* ----------------------------------------------------
   ADMIN / GUARD: VIEW ALL PASSES (optional filter)
---------------------------------------------------- */
exports.getAllGatePasses = async (req, res) => {
  try {
    const filter = req.query.status ? { status: req.query.status } : {};

    const passes = await GatePass.find(filter)
      .populate("studentId", "name rollNumber email")
      .populate("approvedBy", "name")
      .sort({ requestDate: -1 });

    res.status(200).json(passes);
  } catch (err) {
    console.error("GetAllGatePasses Error:", err);
    res.status(500).json({ message: err.message });
  }
};

/* ----------------------------------------------------
   ADMIN / GUARD: GET ONLY PENDING REQUESTS
---------------------------------------------------- */
exports.getPendingGatePasses = async (req, res) => {
  try {
    const pending = await GatePass.find({ status: "pending" })
      .populate("studentId", "name rollNumber email")
      .sort({ requestDate: -1 });

    res.status(200).json(pending);
  } catch (err) {
    console.error("GetPendingGatePasses Error:", err);
    res.status(500).json({ message: err.message });
  }
};

/* ----------------------------------------------------
   ADMIN / GUARD: GET ONLY APPROVED PASSES 
---------------------------------------------------- */
exports.getApprovedGatePasses = async (req, res) => {
  try {
    const passes = await GatePass.find({ status: "approved" })
      .populate("studentId", "name rollNumber")
      .sort({ approvedDate: -1 });

    res.status(200).json(passes);
  } catch (err) {
    console.error("GetApprovedGatePasses Error:", err);
    res.status(500).json({ message: err.message });
  }
};

/* ----------------------------------------------------
   ADMIN: APPROVE REQUEST
---------------------------------------------------- */
exports.approvePass = async (req, res) => {
  try {
    const id = req.params.id;
    const approvedBy = req.user.userId;

    const gatePass = await GatePass.findById(id);
    if (!gatePass) return res.status(404).json({ message: "Gate pass not found" });

    if (gatePass.status !== "pending")
      return res.status(400).json({ message: "Gate pass already processed" });

    const updated = await GatePass.findByIdAndUpdate(
      id,
      {
        status: "approved",
        approvedBy,
        approvedDate: new Date(),
      },
      { new: true }
    )
      .populate("studentId", "name rollNumber email")
      .populate("approvedBy", "name");

    res.status(200).json({
      message: "Gate pass approved successfully",
      gatePass: updated,
    });
  } catch (err) {
    console.error("ApprovePass Error:", err);
    res.status(500).json({ message: err.message });
  }
};

/* ----------------------------------------------------
   ADMIN: REJECT REQUEST
---------------------------------------------------- */
exports.rejectPass = async (req, res) => {
  try {
    const id = req.params.id;
    const { rejectionReason } = req.body;
    const approvedBy = req.user.userId;

    const gatePass = await GatePass.findById(id);
    if (!gatePass) return res.status(404).json({ message: "Gate pass not found" });

    if (gatePass.status !== "pending")
      return res.status(400).json({ message: "Gate pass already processed" });

    const updated = await GatePass.findByIdAndUpdate(
      id,
      {
        status: "rejected",
        approvedBy,
        rejectionReason,
        approvedDate: new Date(),
      },
      { new: true }
    )
      .populate("studentId", "name rollNumber email")
      .populate("approvedBy", "name");

    res.status(200).json({
      message: "Gate pass rejected successfully",
      gatePass: updated,
    });
  } catch (err) {
    console.error("RejectPass Error:", err);
    res.status(500).json({ message: err.message });
  }
};

/* ----------------------------------------------------
   ADMIN/STUDENT: GET PASS BY ID
---------------------------------------------------- */
exports.getGatePassById = async (req, res) => {
  try {
    const id = req.params.id;
    const userId = req.user.userId;
    const userRole = req.user.role;

    const gatePass = await GatePass.findById(id)
      .populate("studentId", "name rollNumber email")
      .populate("approvedBy", "name");

    if (!gatePass) return res.status(404).json({ message: "Gate pass not found" });

    if (userRole === "student" && gatePass.studentId._id.toString() !== userId) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.status(200).json(gatePass);
  } catch (err) {
    console.error("GetGatePassById Error:", err);
    res.status(500).json({ message: err.message });
  }
};

/* ----------------------------------------------------
   GUARD (ADMIN): SAVE TRANSPORT DETAILS
---------------------------------------------------- */
exports.verifyTransport = async (req, res) => {
  try {
    const id = req.params.id;
    const { cabNumber, transportMode, ticketNumber } = req.body;

    const updated = await GatePass.findByIdAndUpdate(
      id,
      {
        cabNumber,
        transportMode,
        ticketNumber,
      },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Gate pass not found" });

    res.status(200).json({
      message: "Transport details saved successfully!",
      gatePass: updated,
    });
  } catch (err) {
    console.error("VerifyTransport Error:", err);
    res.status(500).json({ message: err.message });
  }
};

/* ----------------------------------------------------
   PUBLIC: VIEW PASSES (NO AUTH)
---------------------------------------------------- */
exports.getPublicGatePasses = async (req, res) => {
  try {
    const passes = await GatePass.find()
      .populate("studentId", "name rollNumber")
      .populate("approvedBy", "name")
      .sort({ requestDate: -1 });

    res.status(200).json(passes);
  } catch (err) {
    console.error("PublicGatePass Error:", err);
    res.status(500).json({ message: err.message });
  }
};
/* ----------------------------------------------------
   STUDENT: UPDATE TRANSPORT DETAILS AFTER APPROVAL
---------------------------------------------------- */
exports.updateTransportDetails = async (req, res) => {
  try {
    const id = req.params.id;
    const { cabNumber, transportMode, ticketNumber } = req.body;

    const gatePass = await GatePass.findById(id);

    if (!gatePass) return res.status(404).json({ message: "Gate pass not found" });

    // Student can only update their own pass
    if (gatePass.studentId.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Not allowed" });
    }

    // Only after admin approves
    if (gatePass.status !== "approved") {
      return res.status(400).json({ message: "Transport details can be filled only after approval" });
    }

    const updated = await GatePass.findByIdAndUpdate(
      id,
      { cabNumber, transportMode, ticketNumber },
      { new: true }
    );

    res.status(200).json({
      message: "Transport details updated",
      gatePass: updated
    });

  } catch (err) {
    console.error("updateTransportDetails Error:", err);
    res.status(500).json({ message: err.message });
  }
};
/* ----------------------------------------------------
   ADMIN: GET APPROVED PASSES SORTED BY LEAVING DATE
---------------------------------------------------- */
exports.getApprovedSortedByLeavingDate = async (req, res) => {
  try {
    const passes = await GatePass.find({ status: "approved" })
      .populate("studentId", "name rollNumber")
      .sort({ journeyDate: 1 }); // earliest leaving first

    res.status(200).json(passes);

  } catch (err) {
    console.error("getApprovedSortedByLeavingDate Error:", err);
    res.status(500).json({ message: err.message });
  }
};
/* ----------------------------------------------------
   GUARD: FINAL VERIFICATION CHECKBOX
---------------------------------------------------- */
exports.finalGuardVerify = async (req, res) => {
  try {
    const id = req.params.id;

    const updated = await GatePass.findByIdAndUpdate(
      id,
      { guardVerified: true },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Gate pass not found" });

    res.status(200).json({
      message: "Gate pass verified by guard",
      gatePass: updated
    });

  } catch (err) {
    console.error("finalGuardVerify Error:", err);
    res.status(500).json({ message: err.message });
  }
};

