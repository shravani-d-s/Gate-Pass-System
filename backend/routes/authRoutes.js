const express = require('express');
const { upload, handleMulterError } = require('../middleware/upload');
const { registerStudent, registerAdmin, login } = require('../controllers/authController');

const router = express.Router();

// Student registration route with file upload
router.post('/register-student', 
  upload.single('idCardImage'), 
  handleMulterError,
  registerStudent
);

// Admin registration route
router.post('/register-admin', registerAdmin);

// Login route for both students and admins
router.post('/login', login);

module.exports = router;