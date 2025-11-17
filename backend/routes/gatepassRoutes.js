const express = require("express");
const GatePass = require("../models/gatepass");   // FIXED: missing import

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
  getPublicGatePasses
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


/* ----------------------------------------------------
   ADMIN ROUTES (admins = guards)
---------------------------------------------------- */
router.get("/pending", verifyToken, requireRole("admin"), getPendingGatePasses);
router.get("/all", verifyToken, requireRole("admin"), getAllGatePasses);
router.get("/approved", verifyToken, requireRole("admin"), getApprovedGatePasses);

router.post("/approve/:id", verifyToken, requireRole("admin"), approvePass);
router.post("/reject/:id", verifyToken, requireRole("admin"), rejectPass);

/* Guard verification */
router.post("/verify/:id", verifyToken, requireRole("admin"), verifyTransport);


/* ----------------------------------------------------
   SHARED ROUTE (ADMIN + STUDENT)
   MUST BE LAST
---------------------------------------------------- */
router.get("/:id", verifyToken, requireAnyRole(["student", "admin"]), getGatePassById);


/* ----------------------------------------------------
   FINAL EXPORT
---------------------------------------------------- */
module.exports = router;
