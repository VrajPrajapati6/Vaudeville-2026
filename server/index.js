require('dotenv').config({ path: '../.env' }); // Read from the root .env file
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Registration = require('./models/Registration');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.post('/api/register', async (req, res) => {
  try {
    const { eventId, teamName, members } = req.body;

    // Basic Validation
    if (!eventId || !members || members.length === 0) {
      return res.status(400).json({ error: 'Missing required fields: eventId and members are required.' });
    }

    // Create the registration
    const newRegistration = new Registration({
      eventId,
      teamName,
      members,
    });

    await newRegistration.save();

    res.status(201).json({ message: 'Registration successful!', registration: newRegistration });
  } catch (error) {
    console.error('Registration API Error:', error);
    res.status(500).json({ error: 'Failed to complete registration. Please try again.' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
