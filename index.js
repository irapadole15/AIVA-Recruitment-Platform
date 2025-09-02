const express = require('express');
const path = require('path');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const recruiterRoutes = require('./routes/recruiterRoutes');
const candidateRoutes = require('./routes/candidateRoutes');

const db = require('./config/db');

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type','x-recruiter-id'],
 
}));
app.use(express.json());
app.use('/resumes', express.static(path.join(__dirname, 'public/resumes')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/recruiter', recruiterRoutes);
app.use('/api/candidate', candidateRoutes);

// Check database connectivity before starting the server
async function startServer() {
  try {
    await db.query('SELECT 1');
    console.log('Database connected successfully');

    // Start server
    const PORT = 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to connect to the database:', error.message);
    process.exit(1); // Exit the process if the database connection fails
  }
}

startServer();