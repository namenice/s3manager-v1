const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');

const app = express();

// Middleware
app.use(cors()); // Allow cross-origin requests from frontend
app.use(express.json()); // Enable parsing JSON request bodies

// Routes
app.use('/api/auth', authRoutes);

// Simple root route
app.get('/', (req, res) => {
  res.send('S3 Manager Backend API is running!');
});

module.exports = app;
