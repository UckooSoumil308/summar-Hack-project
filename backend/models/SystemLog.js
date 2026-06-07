import mongoose from 'mongoose';

const SystemLogSchema = new mongoose.Schema({
  agentName: { type: String, required: true },
  action: { type: String, required: true },
  status: { type: String, enum: ['SUCCESS', 'ERROR', 'WARN'], required: true },
  executionTimeMs: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('SystemLog', SystemLogSchema);
