const express = require('express');
const {
  createGatePass,
  getMyGatePasses,
  getPendingGatePasses,
  getAllGatePasses,
  approvePass,
  rejectPass,
  getGatePassById
} = require('../controllers/gatepassController');

const { verifyToken, requireRole, requireAnyRole } = require('../middleware/authMiddleware');

const router = express.Router();

// Student routes
router.post('/create', verifyToken, requireRole('student'), createGatePass);
router.get('/my-requests', verifyToken, requireRole('student'), getMyGatePasses);

// Admin routes
router.get('/pending', verifyToken, requireRole('admin'), getPendingGatePasses);
router.get('/all', verifyToken, requireRole('admin'), getAllGatePasses);
router.post('/approve/:id', verifyToken, requireRole('admin'), approvePass);
router.post('/reject/:id', verifyToken, requireRole('admin'), rejectPass);

// Shared routes (both admin and student can access)
router.get('/:id', verifyToken, requireAnyRole(['student', 'admin']), getGatePassById);

module.exports = router;