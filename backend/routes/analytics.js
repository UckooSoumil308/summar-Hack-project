import express from 'express';
import Candidate from '../models/Candidate.js';

const router = express.Router();

/**
 * @route   GET /api/analytics
 * @desc    Fetch aggregated metrics for the Talent Analytics dashboard
 */
router.get('/', async (req, res) => {
  try {
    const totalCandidates = await Candidate.countDocuments();
    
    // Aggregation pipeline to compute macros, distribution, and top skills
    const metrics = await Candidate.aggregate([
      {
        $facet: {
          averageScore: [
            { $group: { _id: null, avgMatchScore: { $avg: "$xaiEvaluation.matchScore" } } }
          ],
          statusDistribution: [
            { $group: { _id: "$overallStatus", count: { $sum: 1 } } }
          ],
          verifiedSkills: [
            { $unwind: "$proofOfWork" },
            { $match: { "proofOfWork.verificationStatus": "Verified" } },
            { $group: { _id: "$proofOfWork.technology", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 }
          ],
          totalVerifiedSkills: [
            { $unwind: "$proofOfWork" },
            { $match: { "proofOfWork.verificationStatus": "Verified" } },
            { $count: "count" }
          ],
          totalSkills: [
            { $unwind: "$proofOfWork" },
            { $count: "count" }
          ]
        }
      }
    ]);

    const result = metrics[0];
    const avgScore = result.averageScore[0]?.avgMatchScore || 0;
    
    const verifiedCount = result.totalVerifiedSkills[0]?.count || 0;
    const totalCount = result.totalSkills[0]?.count || 0;
    const verificationRate = totalCount > 0 ? (verifiedCount / totalCount) * 100 : 0;

    const data = {
      totalCandidates,
      averageMatchScore: Math.round(avgScore),
      verificationRate: Math.round(verificationRate),
      statusDistribution: result.statusDistribution.map(s => ({
        name: s._id,
        candidates: s.count
      })),
      topSkills: result.verifiedSkills.map(s => ({
        technology: s._id,
        count: s.count
      }))
    };

    res.status(200).json({ success: true, analytics: data });
  } catch (error) {
    console.error(`[ ANALYTICS ERROR ] ${error.message}`);
    res.status(500).json({ success: false, error: 'Internal Server Error while aggregating analytics.' });
  }
});

export default router;
