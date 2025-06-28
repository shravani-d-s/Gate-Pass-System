// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const dotenv = require('dotenv');

// // Route imports
// const authRoutes = require('./routes/authRoutes');
// const gatePassRoutes = require('./routes/gatepassRoutes');

// dotenv.config();

// const app = express();

// // Middleware
// app.use(cors());
// app.use(express.json());

// // Root route
// app.get('/', (req, res) => {
//   res.send('Server is working!');
// });

// // Route middleware
// app.use('/api/auth', authRoutes);
// app.use('/api/gatepass', gatePassRoutes);

// // MongoDB Connection
// mongoose.connect(process.env.MONGO_URI)
// .then(() => {
//   const port = process.env.PORT || 5000;
//   app.listen(port, () => console.log(`Server running on port ${port}`));
// })
// .catch(err => {
//   console.error('MongoDB connection error:', err.message);
// });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Route imports
const authRoutes = require('./routes/authRoutes');
const gatePassRoutes = require('./routes/gatepassRoutes');

// Load .env
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Root route for Render health check
app.get('/', (req, res) => {
  res.send('✅ Backend is running on Render!');
});

// Route middleware
app.use('/api/auth', authRoutes);
app.use('/api/gatepass', gatePassRoutes);

// MongoDB Connection + Server Listen
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    const port = process.env.PORT || 5000;
    app.listen(port, () => {
      console.log(✅ Server running on port ${port});
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
  });