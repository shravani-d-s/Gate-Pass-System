const User = require('../models/users');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register student
exports.registerStudent = async (req, res) => {
  try {
    const { name, email, password, rollNumber } = req.body;

    // Validate required fields
    if (!name || !email || !password || !rollNumber) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Enforce @students.vnit.ac.in domain
    if (!/^[a-zA-Z0-9._%+-]+@vnit\.ac\.in$/.test(email)) {
      return res.status(400).json({ message: "Please use your VNIT email (@vnit.ac.in)" });
    }

    const idCardImageURL = req.file ? req.file.path : null;

    // Check if user already exists
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "User already exists" });

    // Check if roll number already exists
    const existingRoll = await User.findOne({ rollNumber });
    if (existingRoll) return res.status(400).json({ message: "Roll number already registered" });

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      passwordHash,
      role: 'student',
      rollNumber,
      idCardImageURL
    });

    await newUser.save();
    res.status(201).json({ message: "Student registered successfully" });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: err.message });
  }
};


// Register admin
exports.registerAdmin = async (req, res) => {
  try {
    const { name, email, password, adminId } = req.body;

    // Validate required fields
    if (!name || !email || !password || !adminId) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const allowedAdminIds = ['GTVNIT001', 'GTVNIT002', 'GTVNIT003', 'GTVNIT004', 'GTVNIT005'];

    if (!allowedAdminIds.includes(adminId)) {
      return res.status(400).json({ message: "Invalid Admin ID. Allowed IDs are GTVNIT001 to GTVNIT005." });
    }

    // Check if user already exists
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "User already exists" });

    // Check if admin ID already exists
    const existingAdmin = await User.findOne({ adminId });
    if (existingAdmin) return res.status(400).json({ message: "Admin ID already registered" });

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      passwordHash,
      role: 'admin',
      adminId
    });

    await newUser.save();
    res.status(201).json({ message: "Admin registered successfully" });
  } catch (err) {
    console.error('Admin registration error:', err);
    res.status(500).json({ message: err.message });
  }
};

// Login for both roles
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
        rollNumber: user.rollNumber,
        adminId: user.adminId
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: err.message });
  }
};