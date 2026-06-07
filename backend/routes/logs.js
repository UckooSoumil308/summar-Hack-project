import express from 'express';
import SystemLog from '../models/SystemLog.js';

const router = express.Router();

/**
 * @route   GET /api/logs
 * @desc    Fetch the 50 most recent system logs
 */
router.get('/', async (req, res) => {
  try {
    const logs = await SystemLog.find().sort({ createdAt: -1 }).limit(50);
    res.status(200).json({ success: true, logs });
  } catch (error) {
    console.error(`[ LOG FETCH ERROR ] ${error.message}`);
    res.status(500).json({ success: false, error: 'Internal Server Error fetching logs.' });
  }
});

/**
 * Helper function to inject into agent pipelines
 */
export const createLog = async (agentName, action, status, time) => {
  try {
    const newLog = new SystemLog({
      agentName,
      action,
      status,
      executionTimeMs: time
    });
    await newLog.save();
  } catch (err) {
    console.error(`[ TELEMETRY ERROR ] ${err.message}`);
  }
};

export default router;
