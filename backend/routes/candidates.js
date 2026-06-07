import express from 'express';
import Candidate from '../models/Candidate.js';

const router = express.Router();

/**
 * @route   GET /api/candidates
 * @desc    Fetch all candidates for the pipeline table, sorted by top AI match
 */
router.get('/', async (req, res) => {
  try {
    // Select only necessary fields for the table and sort by highest score first
    const candidates = await Candidate.find()
      .select('_id name targetRole xaiEvaluation.matchScore proofOfWork')
      .sort({ 'xaiEvaluation.matchScore': -1 });
      
    res.status(200).json({ success: true, candidates });
  } catch (error) {
    console.error(`[ PIPELINE FETCH ERROR ] ${error.message}`);
    res.status(500).json({ success: false, error: 'Internal Server Error while fetching pipeline data.' });
  }
});

/**
 * @route   GET /api/candidates/:id
 * @desc    Fetch a single candidate by MongoDB _id for detailed diagnostics
 */
router.get('/:id', async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);
    if (!candidate) {
      return res.status(404).json({ success: false, error: 'Candidate sequence not found in database.' });
    }
    res.status(200).json({ success: true, candidate });
  } catch (error) {
    console.error(`[ CANDIDATE FETCH ERROR ] ${error.message}`);
    res.status(500).json({ success: false, error: 'Internal Server Error while fetching candidate details.' });
  }
});

/**
 * @route   DELETE /api/candidates/:id
 * @desc    Delete a candidate by MongoDB _id
 */
router.delete('/:id', async (req, res) => {
  try {
    const candidate = await Candidate.findByIdAndDelete(req.params.id);
    if (!candidate) {
      return res.status(404).json({ success: false, error: 'Candidate not found.' });
    }
    res.status(200).json({ success: true, message: 'Candidate data purged successfully.' });
  } catch (error) {
    console.error(`[ CANDIDATE DELETE ERROR ] ${error.message}`);
    res.status(500).json({ success: false, error: 'Internal Server Error while deleting candidate.' });
  }
});

export default router;
