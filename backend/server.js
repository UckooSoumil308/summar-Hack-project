import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import analyzeRoutes from './routes/analyze.js';
import candidateRoutes from './routes/candidates.js';
import analyticsRoutes from './routes/analytics.js';
import logRoutes from './routes/logs.js';

// Load environment variables
dotenv.config();

// Trigger the database connection
connectDB();

// Initialize the Express application
const app = express();

// Global Middleware Configuration
app.use(cors()); // Allow cross-origin requests from the React frontend
app.use(express.json()); // Parse incoming JSON payloads

// Mount Routes
app.use('/api/analyze', analyzeRoutes);
app.use('/api/candidates', candidateRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/logs', logRoutes);

/**
 * Health Check Endpoint
 * Used by external monitors or the frontend to verify the pipeline is active.
 */
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: '[ SYSTEM ONLINE ] XAI Recruitment Platform core is operational.' 
  });
});

// Define designated port
const PORT = process.env.PORT || 5000;

// Boot the server
app.listen(PORT, () => {
  console.log(`[ SERVER ] Agentic Pipeline API listening on port ${PORT}`);
});
