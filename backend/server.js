console.log('Starting server.js execution...');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to MongoDB
console.log('Calling connectDB()...');
connectDB();
console.log('connectDB() called, initializing express...');

const app = express();

// Middleware
app.use(cors({ origin: ['http://localhost:3000', 'http://localhost:3001'] }));
app.use(express.json());

// Routes
console.log('Loading auth routes...');
app.use('/api/auth', require('./routes/authRoutes'));
console.log('Loading profile routes...');
app.use('/api/profile', require('./routes/profileRoutes'));
console.log('Loading contacts routes...');
app.use('/api/contacts', require('./routes/contactRoutes'));
console.log('Loading documents routes...');
app.use('/api/documents', require('./routes/documentRoutes'));
console.log('Loading medical routes...');
app.use('/api/medical', require('./routes/medicalRoutes'));

// Default route
console.log('Loading default routes...');
app.get('/', (req, res) => {
  res.json({ message: 'SafeVault API is running...' });
});

// Force server to strictly run on 5000, preventing React from hijacking the port env var
const PORT = 5000;
console.log('Starting app.listen...');
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
