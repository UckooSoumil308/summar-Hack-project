import mongoose from 'mongoose';

const CandidateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    index: true,
  },
  targetRole: {
    type: String,
    required: true,
    trim: true,
  },
  overallStatus: {
    type: String,
    enum: ['READY TO HIRE', 'REVIEW REQUIRED', 'REJECTED', 'PROCESSING'],
    default: 'PROCESSING',
  },
  xaiEvaluation: {
    matchScore: {
      type: Number,
      min: 0,
      max: 100,
    },
    detectedPros: [String],
    riskFactors: [String],
  },
  proofOfWork: [{
    technology: String,
    verificationStatus: {
      type: String,
      enum: ['Verified', 'Unverified'],
    },
  }],
  hrPlaybook: [{
    question: { type: String, required: true },
    targetKeywords: [{ type: String }],
    deceptionRedFlags: { type: String, required: true },
    targetSkill: { type: String, required: true }
  }],
  readinessRoadmap: [{
    phase: { type: String, required: true },
    milestone: { type: String, required: true },
    details: { type: String, required: true },
  }],
}, {
  timestamps: true,
  versionKey: false,
});

// Crucial compound index to optimize fetching top candidates by role
CandidateSchema.index({ targetRole: 1, 'xaiEvaluation.matchScore': -1 });

export default mongoose.model('Candidate', CandidateSchema);
