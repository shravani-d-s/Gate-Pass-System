const express = require("express");
const GatePass = require("../models/gatepass");

const {
  createGatePass,
  getMyGatePasses,
  getPendingGatePasses,
  getAllGatePasses,
  approvePass,
  rejectPass,
  getGatePassById,
  getApprovedGatePasses,
  verifyTransport,
  getPublicGatePasses,

  // NEW CONTROLLERS
  updateTransportDetails,
  getApprovedSortedByLeavingDate,
  finalGuardVerify,
} = require("../controllers/gatepassController");

const { verifyToken, requireRole, requireAnyRole } = require("../middleware/authMiddleware");

const router = express.Router();

/* ----------------------------------------------------
   PUBLIC ROUTE (NO LOGIN)
---------------------------------------------------- */
router.get("/public/all", getPublicGatePasses);


/* ----------------------------------------------------
   STUDENT ROUTES
---------------------------------------------------- */
router.post("/create", verifyToken, requireRole("student"), createGatePass);
router.get("/my-requests", verifyToken, requireRole("student"), getMyGatePasses);

// NEW: Student updates cab, mode, ticket after approval
router.put(
  "/student/update-transport/:id",
  verifyToken,
  requireRole("student"),
  updateTransportDetails
);


/* ----------------------------------------------------
   ADMIN ROUTES
---------------------------------------------------- */
router.get("/pending", verifyToken, requireRole("admin"), getPendingGatePasses);
router.get("/all", verifyToken, requireRole("admin"), getAllGatePasses);
router.get("/approved", verifyToken, requireRole("admin"), getApprovedGatePasses);

// NEW: Admin sorted approved list
router.get("/approved/sorted", verifyToken, requireRole("admin"), getApprovedSortedByLeavingDate);

router.post("/approve/:id", verifyToken, requireRole("admin"), approvePass);
router.post("/reject/:id", verifyToken, requireRole("admin"), rejectPass);

// Guard/Admin saves transport details
router.post("/verify/:id", verifyToken, requireRole("admin"), verifyTransport);

// NEW: Final guard verification checkbox
router.put(
  "/verify/final/:id",
  verifyToken,
  requireRole("admin"),
  finalGuardVerify
);


/* ----------------------------------------------------
   SHARED ROUTE (ADMIN + STUDENT)
---------------------------------------------------- */
router.get("/:id", verifyToken, requireAnyRole(["student", "admin"]), getGatePassById);


/* ----------------------------------------------------
   EXPORT
---------------------------------------------------- */
module.exports = router;
