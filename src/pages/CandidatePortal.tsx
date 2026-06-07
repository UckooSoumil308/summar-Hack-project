import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TerminalInput } from '../components/apply/TerminalInput';
import { ResumeDropZone } from '../components/apply/ResumeDropZone';
import { SubmitButton } from '../components/apply/SubmitButton';
import { AgentStepper } from '../components/dashboard/AgentStepper';
import { useNavigate } from 'react-router-dom';

export default function CandidatePortal() {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [github, setGithub] = useState('');
  const [leetcode, setLeetcode] = useState('');
  
  // Pipeline State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pipelineStatus, setPipelineStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!file) {
      setError('A valid PDF payload is required for uplink.');
      return;
    }
    setError(null);
    setIsSubmitting(true);
    setPipelineStatus('CONNECTING'); // Initial state

    const formData = new FormData();
    formData.append('resume', file);
    formData.append('github', github);
    formData.append('leetcode', leetcode);

    try {
      const response = await fetch('http://127.0.0.1:5000/api/analyze', {
        method: 'POST',
        body: formData,
      });

      if (!response.body) throw new Error("ReadableStream not supported in this browser.");

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        
        // Split by SSE double newlines
        const events = chunk.split('\n\n');
        
        for (const event of events) {
          if (event.startsWith('data: ')) {
            const dataStr = event.replace('data: ', '').trim();
            if (!dataStr) continue;
            
            try {
              const data = JSON.parse(dataStr);
              setPipelineStatus(data.status);
              
              if (data.status === 'ERROR') {
                setError(data.error || 'Unknown pipeline anomaly.');
                setIsSubmitting(false);
                break;
              }

              if (data.status === 'COMPLETE' && data.candidateId) {
                setTimeout(() => {
                  navigate(`/dashboard/${data.candidateId}`);
                }, 1500);
              }
            } catch (err) {
              console.error("Error parsing SSE JSON:", err, "Raw string:", dataStr);
            }
          }
        }
      }
    } catch (err: unknown) {
      setError(err.message || 'Failed to establish uplink with server.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-65px)] flex items-center justify-center p-4 md:p-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        className="w-full max-w-2xl bg-zinc-900 border border-zinc-800 p-8 rounded-none shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden"
      >
        <div className="border-b border-zinc-800 pb-4 mb-8">
          <h1 className="text-3xl text-zinc-100 font-bold tracking-tight uppercase">Data Ingestion</h1>
          <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest mt-2">Awaiting Candidate Telemetry...</p>
        </div>

        {error && (
          <div className="mb-6 p-4 border border-red-500 bg-red-500/10 text-red-500 font-mono text-xs uppercase tracking-widest">
            [ ERROR ]: {error}
          </div>
        )}

        <AnimatePresence mode="wait">
          {!isSubmitting ? (
            <motion.div 
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-2"
            >
              <ResumeDropZone onFileSelect={setFile} />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <TerminalInput 
                  label="GitHub Identity" 
                  placeholder="github.com/username" 
                  value={github}
                  onChange={(e) => setGithub(e.target.value)}
                />
                <TerminalInput 
                  label="LeetCode Profile" 
                  placeholder="leetcode.com/username" 
                  value={leetcode}
                  onChange={(e) => setLeetcode(e.target.value)}
                />
              </div>

              <div className="pt-8 mt-4 border-t border-zinc-800">
                <SubmitButton onClick={handleSubmit} />
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="stepper"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-8"
            >
              <AgentStepper currentStatus={pipelineStatus || 'CONNECTING'} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
