const express = require('express');
const GatePass = require('../models/gatepass');   // <-- FIX

const {
  createGatePass,
  getMyGatePasses,
  getPendingGatePasses,
  getAllGatePasses,
  approvePass,
  rejectPass,
  getGatePassById,
  getPublicGatePasses
} = require('../controllers/gatepassController');

const { verifyToken, requireRole, requireAnyRole } = require('../middleware/authMiddleware');

const router = express.Router();

// --- PUBLIC ROUTE: NO LOGIN REQUIRED ---
router.get('/public/all', async (req, res) => {
  try {
    const passes = await GatePass.find().populate('studentId');
    res.json(passes);
  } catch (error) {
    console.error(error);   // Important to see actual issue
    res.status(500).json({ message: 'Failed to fetch gate passes' });
  }
});


module.exports = router;




// Student routes
router.post('/create', verifyToken, requireRole('student'), createGatePass);
router.get('/my-requests', verifyToken, requireRole('student'), getMyGatePasses);

// Admin routes
router.get('/pending', verifyToken, requireRole('admin'), getPendingGatePasses);
router.get('/all', verifyToken, requireRole('admin'), getAllGatePasses);
router.post('/approve/:id', verifyToken, requireRole('admin'), approvePass);
router.post('/reject/:id', verifyToken, requireRole('admin'), rejectPass);

// Shared routes (both admin and student can access) - MUST be last
router.get('/:id', verifyToken, requireAnyRole(['student', 'admin']), getGatePassById);

module.exports = router;