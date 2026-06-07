import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertTriangle, ShieldCheck, Loader2 } from 'lucide-react';

interface FullCandidate {
  _id: string;
  name: string;
  targetRole: string;
  overallStatus: string;
  xaiEvaluation: {
    matchScore: number;
    detectedPros: string[];
    riskFactors: string[];
  };
  proofOfWork: {
    technology: string;
    verificationStatus: string;
  }[];
  readinessRoadmap: {
    phase: string;
    milestone: string;
  }[];
  hrPlaybook: {
    question: string;
    targetKeywords: string[];
    deceptionRedFlags: string;
    targetSkill: string;
  }[];
}

interface DrawerProps {
  candidateId: string;
  onClose: () => void;
}

export const CandidateDetailDrawer: React.FC<DrawerProps> = ({ candidateId, onClose }) => {
  const [candidate, setCandidate] = useState<FullCandidate | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Escape key listener for accessibility
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  // Context-Aware Data Loader
  useEffect(() => {
    let isMounted = true;
    
    const fetchCandidateDetails = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`http://127.0.0.1:5000/api/candidates/${candidateId}`);
        const data = await response.json();
        
        if (data.success && isMounted) {
          setCandidate(data.candidate);
        } else if (isMounted) {
          setError(data.error || 'Failed to parse candidate data.');
        }
      } catch (err: unknown) {
        if (isMounted) setError(err.message || 'Connection failure.');
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchCandidateDetails();
    
    return () => { isMounted = false; };
  }, [candidateId]);

  const getScoreColor = (score: number) => {
    if (score >= 90) return '#34d399'; // emerald-400
    if (score >= 70) return '#f97316'; // orange-500
    return '#ef4444'; // red-500
  };

  return (
    <AnimatePresence>
      {/* Background Overlay */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
      />
      
      {/* Sliding Drawer Panel */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="fixed top-0 right-0 h-full w-full md:w-[40%] bg-zinc-950 border-l border-zinc-800 shadow-[0_0_60px_rgba(0,0,0,0.8)] z-50 flex flex-col overflow-hidden"
      >
        {/* Header Ribbon */}
        <div className="flex justify-between items-center p-4 border-b border-zinc-800 bg-zinc-900">
          <div className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest flex items-center">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse mr-2"></span>
            Deep Diagnostics
          </div>
          <button 
            onClick={onClose}
            className="text-zinc-500 hover:text-orange-500 transition-colors p-1 bg-zinc-950 border border-zinc-800 rounded-none"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Dynamic Content Canvas */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden hide-scrollbar relative">
          
          {isLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950/80 backdrop-blur-sm z-10">
              <Loader2 className="w-8 h-8 text-emerald-400 animate-spin mb-4 drop-shadow-[0_0_12px_rgba(52,211,153,0.8)]" />
              <span className="font-mono text-xs text-zinc-500 uppercase tracking-widest animate-pulse">
                Extracting Neural Traces...
              </span>
            </div>
          )}

          {error && (
            <div className="p-8">
              <div className="bg-red-500/10 border border-red-500 p-4 font-mono text-xs text-red-500 uppercase tracking-widest">
                [ CRITICAL ERROR ]: {error}
              </div>
            </div>
          )}

          {candidate && !isLoading && !error && (
            <div className="p-6 md:p-8 space-y-10">
              
              {/* Section A: Header & Match Radial */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-8 border-b border-zinc-800">
                <div>
                  <h1 className="text-3xl font-bold text-zinc-100 tracking-tight font-sans">{candidate.name}</h1>
                  <h2 className="text-sm font-mono text-zinc-500 uppercase tracking-widest mt-2">{candidate.targetRole}</h2>
                  <div className="mt-4 inline-block font-mono text-[10px] uppercase px-3 py-1 bg-zinc-900 border border-zinc-800 text-zinc-400 tracking-widest">
                    Status: <span className="text-zinc-200">{candidate.overallStatus}</span>
                  </div>
                </div>
                
                {/* Giant Radial Match Graphic */}
                <div className="relative w-24 h-24 flex items-center justify-center flex-shrink-0">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="48" cy="48" r="44" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-zinc-900" />
                    <motion.circle 
                      initial={{ strokeDasharray: "0 1000" }}
                      animate={{ strokeDasharray: `${(candidate.xaiEvaluation.matchScore / 100) * 276.46} 1000` }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      cx="48" cy="48" r="44" stroke={getScoreColor(candidate.xaiEvaluation.matchScore)} strokeWidth="4" fill="transparent"
                      strokeLinecap="square"
                      style={{ filter: `drop-shadow(0 0 8px ${getScoreColor(candidate.xaiEvaluation.matchScore)}80)` }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="font-mono text-xl font-bold" style={{ color: getScoreColor(candidate.xaiEvaluation.matchScore) }}>
                      {candidate.xaiEvaluation.matchScore}
                    </span>
                  </div>
                </div>
              </div>

              {/* Section B: Reasoning Cards (Pros & Risks) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-emerald-400/5 border border-emerald-400/20 p-5 rounded-none">
                  <h3 className="flex items-center text-emerald-400 font-mono text-[10px] uppercase tracking-widest mb-4 pb-2 border-b border-emerald-400/20">
                    <CheckCircle className="w-3 h-3 mr-2" /> XAI Detected Pros
                  </h3>
                  <ul className="space-y-3">
                    {candidate.xaiEvaluation.detectedPros.map((pro, idx) => (
                      <li key={idx} className="flex items-start text-sm text-zinc-300">
                        <span className="text-emerald-400 mr-2 font-mono">{'>'}</span>
                        <span className="leading-relaxed">{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="bg-orange-500/5 border border-orange-500/20 p-5 rounded-none">
                  <h3 className="flex items-center text-orange-500 font-mono text-[10px] uppercase tracking-widest mb-4 pb-2 border-b border-orange-500/20">
                    <AlertTriangle className="w-3 h-3 mr-2" /> Risk Factors
                  </h3>
                  <ul className="space-y-3">
                    {candidate.xaiEvaluation.riskFactors.map((risk, idx) => (
                      <li key={idx} className="flex items-start text-sm text-zinc-300">
                        <span className="text-orange-500 mr-2 font-mono">{'>'}</span>
                        <span className="leading-relaxed">{risk}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Section C: Skill Matrix */}
              <div>
                <h3 className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest mb-4 border-b border-zinc-800 pb-2">
                  Proof of Work Matrix
                </h3>
                <div className="flex flex-wrap gap-3">
                  {candidate.proofOfWork.map((skill, idx) => {
                    const isVerified = skill.verificationStatus === 'Verified';
                    return (
                      <div 
                        key={idx}
                        className={`flex items-center space-x-2 px-3 py-1.5 border font-mono text-xs tracking-wider transition-colors ${
                          isVerified 
                            ? 'bg-emerald-400/10 border-emerald-400 text-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.15)]' 
                            : 'bg-zinc-900 border-zinc-800 text-zinc-500'
                        }`}
                      >
                        {isVerified && <ShieldCheck className="w-3 h-3" />}
                        <span>{skill.technology}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Section D: The Roadmap */}
              <div>
                <h3 className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest mb-6 border-b border-zinc-800 pb-2">
                  30-Day Onboarding Roadmap
                </h3>
                <div className="relative border-l border-zinc-800 ml-3 space-y-6">
                  {candidate.readinessRoadmap.map((item, idx) => (
                    <div key={idx} className="relative pl-6">
                      <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 bg-zinc-950 border border-orange-500 rounded-none shadow-[0_0_8px_rgba(249,115,22,0.5)]"></div>
                      <div className="font-mono text-[10px] text-orange-500 uppercase tracking-widest mb-1">
                        {item.phase}
                      </div>
                      <div className="text-sm text-zinc-300 leading-relaxed font-sans">
                        {item.milestone}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section E: Screening Playbook */}
              {candidate.hrPlaybook && candidate.hrPlaybook.length > 0 && (
                <div>
                  <h3 className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest mb-6 border-b border-zinc-800 pb-2">
                    AI Inquisitor Playbook
                  </h3>
                  <div className="space-y-6">
                    {candidate.hrPlaybook.map((playbook, idx) => (
                      <div key={idx} className="bg-zinc-900 border border-zinc-800 p-6 rounded-none shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-emerald-400 font-mono text-[10px] uppercase tracking-widest px-2 py-1 bg-emerald-400/10 border border-emerald-400/30 drop-shadow-[0_0_8px_rgba(52,211,153,0.3)]">
                            Target: {playbook.targetSkill}
                          </span>
                          <span className="text-zinc-600 font-mono text-[10px]">Q_0{idx + 1}</span>
                        </div>
                        
                        <p className="text-zinc-200 font-mono text-sm leading-relaxed mb-6 border-l-2 border-zinc-700 pl-4">
                          "{playbook.question}"
                        </p>
                        
                        <div className="mb-4">
                          <h4 className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest mb-2">Expected Structural Keywords</h4>
                          <div className="flex flex-wrap gap-2">
                            {playbook.targetKeywords.map((kw, i) => (
                              <span key={i} className="text-emerald-400 bg-emerald-400/10 border border-emerald-400/30 px-2 py-1 font-mono text-[10px] uppercase tracking-widest shadow-[0_0_8px_rgba(52,211,153,0.1)]">
                                {kw}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="bg-red-500/5 border border-red-500/20 p-4 mt-6">
                          <h4 className="flex items-center text-red-500 font-mono text-[10px] uppercase tracking-widest mb-2">
                            <AlertTriangle className="w-3 h-3 mr-2 text-red-500" /> Deception Red Flags
                          </h4>
                          <p className="text-zinc-300 text-xs font-sans leading-relaxed">
                            {playbook.deceptionRedFlags}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
