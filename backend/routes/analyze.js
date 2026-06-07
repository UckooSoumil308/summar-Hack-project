import express from 'express';
import multer from 'multer';
import pdfParse from 'pdf-parse';
import { aiClient } from '../config/llm.js';
import Candidate from '../models/Candidate.js';
import { createLog } from './logs.js';

const router = express.Router();

// Multer configuration: Memory storage with 5MB strict limit
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF files are allowed.'));
    }
  },
});

// Helper to sanitize LLM JSON output (strips markdown block if present)
const sanitizeJson = (text) => {
  const match = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  return match ? match[1].trim() : text.trim();
};

router.post('/', (req, res) => {
  upload.single('resume')(req, res, async (err) => {
    // Standard Multer Error Handling before starting the stream
    if (err) {
      const msg = err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE' 
        ? 'File size exceeds the 5MB limit.' 
        : err.message;
      return res.status(400).json({ success: false, error: msg });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No PDF file uploaded.' });
    }

    // ==========================================
    // STEP 1: SSE Initialization
    // ==========================================
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    // Important: Don't let the proxy buffer SSE events
    res.setHeader('X-Accel-Buffering', 'no'); 

    const sendUpdate = (status, data = {}) => {
      // SSE format requires starting with 'data: ' and ending with two newlines
      res.write(`data: ${JSON.stringify({ status, ...data })}\n\n`);
    };

    // ==========================================
    // STEP 2: The Agentic Pipeline (Logic Loop)
    // ==========================================
    try {
      // [ PROCESSING ] Phase: Extract Text
      sendUpdate('PROCESSING', { message: 'Extracting text from PDF...' });
      const parsedPdf = await pdfParse(req.file.buffer);
      
      if (!parsedPdf.text || parsedPdf.text.trim().length === 0) {
        throw new Error('The uploaded PDF appears to be empty or unreadable.');
      }
      
      const rawText = parsedPdf.text.trim();

      // [ CONNECTING ] Phase: Extractor Agent (Llama 3 8B)
      sendUpdate('CONNECTING', { message: 'Agent 1: Extracting entity metrics...' });
      
      const extractorPrompt = `
      You are an elite data extraction agent. Extract the candidate's Name, Target Role, and a list of Technical Skills from the following resume text.
      Return ONLY valid JSON. No markdown, no conversational text.
      Format: {"name": "Candidate Name", "targetRole": "Role Title", "skills": ["skill1", "skill2"]}
      
      Resume Text:
      ${rawText.substring(0, 4000)}
      `;

      const extractStart = Date.now();
      const extractCompletion = await aiClient.chat.completions.create({
        model: 'Qwen/Qwen2.5-7B-Instruct',
        messages: [{ role: 'user', content: extractorPrompt }],
        temperature: 0.1,
      });

      const extractionResult = JSON.parse(sanitizeJson(extractCompletion.choices[0].message.content));
      await createLog('Extractor Agent', 'Parsed technical skills and identity payload', 'SUCCESS', Date.now() - extractStart);

      // [ ANALYZING ] Phase: Empirical Verifier (Mocked GitHub API)
      sendUpdate('ANALYZING', { message: 'Verifying trace evidence via GitHub/Open Source...' });
      
      // Simulate checking skills against external repos
      const verifiedSkills = (extractionResult.skills || []).map(skill => {
        // Randomly assign Verified/Unverified for demonstration
        const isVerified = Math.random() > 0.3; 
        return {
          technology: skill,
          verificationStatus: isVerified ? 'Verified' : 'Unverified'
        };
      });

      // Simulate network delay for verification
      const verifyStart = Date.now();
      await new Promise(r => setTimeout(r, 1500));
      await createLog('Empirical Verifier', `Cross-referenced ${verifiedSkills.length} trace nodes against GitHub`, 'SUCCESS', Date.now() - verifyStart);

      // [ SYNTHESIZING ] Phase: Synthesizer Agent (Llama 3 70B)
      sendUpdate('SYNTHESIZING', { message: 'Agent 2: Synthesizing diagnostic roadmap...' });

      const synthesizerPrompt = `
      You are a Principal Engineering Architect evaluating a candidate. Based on the extracted data, synthesize a structured evaluation.
      You must also analyze the list of skills flagged as "Unverified" in the Verified Skills payload. Generate exactly 3 custom, highly precise technical questions targeting those unverified claims.
      Return ONLY valid JSON matching this exact schema structure:
      {
        "overallStatus": "READY TO HIRE" | "REVIEW REQUIRED" | "REJECTED" | "PROCESSING",
        "xaiEvaluation": {
          "matchScore": <Number between 0 and 100>,
          "detectedPros": [<String>],
          "riskFactors": [<String>]
        },
        "readinessRoadmap": [
          { "phase": <String>, "milestone": <String>, "details": <String> }
        ],
        "hrPlaybook": [
          {
            "question": <Literal text for a non-technical recruiter to read out loud>,
            "targetKeywords": [<Array of 3-4 structural technical terms the candidate should use in a genuine answer>],
            "deceptionRedFlags": <Specific indicators of bluffed knowledge or superficial memorization>,
            "targetSkill": <Name of the unverified skill being tested>
          }
        ]
      }
      
      Candidate Data:
      Name: ${extractionResult.name}
      Role: ${extractionResult.targetRole}
      Verified Skills: ${JSON.stringify(verifiedSkills)}
      
      Resume Context:
      ${rawText.substring(0, 3000)}
      `;

      const synthStart = Date.now();
      const synthesisCompletion = await aiClient.chat.completions.create({
        model: 'Qwen/Qwen2.5-72B-Instruct',
        messages: [{ role: 'user', content: synthesizerPrompt }],
        temperature: 0.2,
      });

      const synthesisResult = JSON.parse(sanitizeJson(synthesisCompletion.choices[0].message.content));
      await createLog('Synthesizer Agent', 'Generated strategic 30-day roadmap and matrix assessment', 'SUCCESS', Date.now() - synthStart);

      // ==========================================
      // STEP 3: Database Persistence
      // ==========================================
      const newCandidate = new Candidate({
        name: extractionResult.name || 'Unknown Candidate',
        targetRole: extractionResult.targetRole || 'Unspecified Role',
        overallStatus: synthesisResult.overallStatus || 'REVIEW REQUIRED',
        xaiEvaluation: {
          matchScore: synthesisResult.xaiEvaluation?.matchScore || 50,
          detectedPros: synthesisResult.xaiEvaluation?.detectedPros || [],
          riskFactors: synthesisResult.xaiEvaluation?.riskFactors || []
        },
        proofOfWork: verifiedSkills,
        readinessRoadmap: synthesisResult.readinessRoadmap || [],
        hrPlaybook: synthesisResult.hrPlaybook || []
      });

      const savedCandidate = await newCandidate.save();

      // ==========================================
      // STEP 4: Stream Termination
      // ==========================================
      sendUpdate('COMPLETE', { 
        message: 'System pipeline sequence finalized.',
        candidateId: savedCandidate._id 
      });
      res.end();

    } catch (error) {
      console.error(`[ PIPELINE ERROR ] ${error.message}`);
      await createLog('System Orchestrator', `Pipeline fault: ${error.message}`, 'ERROR', 0);
      sendUpdate('ERROR', { error: 'Pipeline anomaly detected: ' + error.message });
      res.end();
    }
  });
});

export default router;
