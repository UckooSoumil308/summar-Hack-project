import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, FolderGit2, GitCommit, Check, X } from 'lucide-react';

const SNAP_TRANSITION = { type: 'spring', stiffness: 400, damping: 30 };

const LoadingState = () => {
  const [step, setStep] = useState(0);
  const steps = [
    "Extracting resume...",
    "Verifying GitHub commits...",
    "Analyzing architectural decisions...",
    "Synthesizing onboarding plan..."
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 1200);
    return () => clearInterval(timer);
  }, [steps.length]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[600px] w-full bg-zinc-950 p-8 font-mono text-sm text-zinc-400 relative overflow-hidden">
      <motion.div 
        initial={{ x: '-100%' }}
        animate={{ x: '100%' }}
        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
        className="absolute inset-0 bg-gradient-to-r from-transparent via-zinc-800/[0.1] to-transparent w-full h-full skew-x-12"
      />
      
      <div className="flex items-center mb-6 space-x-3 border border-zinc-800 bg-zinc-900 px-4 py-2 rounded-none">
         <motion.div
           animate={{ rotate: 360 }}
           transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
         >
           <Terminal className="text-zinc-500 w-5 h-5" />
         </motion.div>
         <span className="text-orange-500 tracking-widest font-bold uppercase">SYS.INIT</span>
      </div>

      <div className="space-y-3 w-full max-w-md z-10">
        {steps.map((text, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: step >= i ? 1 : 0.2, x: step >= i ? 0 : -10 }}
            transition={SNAP_TRANSITION}
            className="flex items-center space-x-3"
          >
            <span className="text-zinc-600">[{i + 1}/{steps.length}]</span>
            <span className={step === i ? "text-emerald-400 animate-pulse" : "text-zinc-500"}>
              {text}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const ProgressRing = ({ score }: { score: number }) => {
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  
  const colorClass = score >= 80 ? 'text-emerald-400' : score >= 60 ? 'text-orange-500' : 'text-red-500';
  const glowClass = score >= 80 ? 'drop-shadow-[0_0_12px_rgba(52,211,153,0.6)]' : '';

  return (
    <div className="relative flex items-center justify-center w-36 h-36">
      <svg className="transform -rotate-90 w-full h-full">
        <circle
          cx="72"
          cy="72"
          r={radius}
          stroke="currentColor"
          strokeWidth="6"
          fill="transparent"
          className="text-zinc-800"
        />
        <motion.circle
          cx="72"
          cy="72"
          r={radius}
          stroke="currentColor"
          strokeWidth="6"
          fill="transparent"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
          className={`${colorClass} ${glowClass}`}
          strokeLinecap="square"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <motion.span 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, ...SNAP_TRANSITION }}
          className={`font-mono text-3xl font-bold ${colorClass}`}
        >
          {score}
        </motion.span>
        <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-mono mt-1">Match</span>
      </div>
    </div>
  );
};

const SkillBadge = ({ skill, repos }: { skill: string, repos: { name: string, commits: number }[] }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="relative flex items-center group cursor-crosshair"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center px-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded-none font-mono text-xs group-hover:border-emerald-400 transition-colors duration-200">
        <span className="text-zinc-300 mr-2">[ {skill}</span>
        <span className="text-zinc-600">:</span>
        <span className="text-emerald-400 ml-2 animate-pulse">Verified ]</span>
      </div>

      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={SNAP_TRANSITION}
            className="absolute bottom-full left-0 mb-3 w-64 bg-zinc-950 border border-zinc-800 p-4 rounded-none z-20 shadow-[0_10px_40px_rgba(0,0,0,0.8)] pointer-events-none"
          >
            <div className="flex items-center mb-3 pb-3 border-b border-zinc-800">
               <FolderGit2 className="w-4 h-4 text-zinc-400 mr-2" />
               <span className="text-xs font-mono text-zinc-300 uppercase tracking-wider">Trace Evidence</span>
            </div>
            <div className="space-y-3">
              {repos.map((repo, idx) => (
                <div key={idx} className="flex flex-col">
                  <span className="text-xs text-zinc-200 font-mono">{repo.name}</span>
                  <div className="flex items-center text-[10px] text-zinc-500 font-mono mt-1">
                    <GitCommit className="w-3 h-3 mr-1" />
                    <span className="text-emerald-400 mr-1">{repo.commits}</span> commits
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Timeline = () => {
  const stages = [
    { week: "Week 1", title: "System Integration", desc: "Environment setup, credentials sync, initial PR." },
    { week: "Week 2", title: "Architecture Deep Dive", desc: "Microservices tracing & state management review." },
    { week: "Week 3", title: "Feature Deployment", desc: "Push initial components to staging environment." },
    { week: "Week 4", title: "Optimization", desc: "Performance tuning & technical debt resolution." }
  ];

  return (
    <div className="ml-3 border-l-2 border-zinc-700 space-y-8 py-2">
      {stages.map((stage, idx) => (
        <div key={idx} className="relative pl-8 group">
          <div className={`absolute -left-[5px] top-1.5 w-2 h-2 bg-zinc-950 border ${idx === 0 ? 'border-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.8)] animate-pulse' : 'border-zinc-600 group-hover:border-zinc-400 transition-colors'} rounded-none`} />
          <div className="flex flex-col">
            <span className={`font-mono text-[10px] mb-1 tracking-wider uppercase ${idx === 0 ? 'text-orange-500' : 'text-zinc-500'}`}>[{stage.week}]</span>
            <h4 className="text-zinc-100 text-sm font-medium tracking-tight">{stage.title}</h4>
            <p className="text-zinc-400 text-xs mt-2 leading-relaxed">{stage.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default function CandidateDetailView() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 3800);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) return <LoadingState />;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200 p-8 flex items-center justify-center font-sans selection:bg-orange-500/30">
       <motion.div 
         initial={{ opacity: 0, y: 30 }}
         animate={{ opacity: 1, y: 0 }}
         transition={SNAP_TRANSITION}
         className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-3 gap-6"
       >
          <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-none flex flex-col items-center">
             <div className="self-start w-full border-b border-zinc-800 pb-4 mb-8 flex justify-between items-end">
               <h2 className="text-zinc-500 font-mono text-[10px] tracking-widest uppercase">XAI Diagnostics</h2>
               <span className="text-emerald-400 text-[10px] font-mono tracking-widest uppercase animate-pulse">Live</span>
             </div>
             
             <ProgressRing score={94} />
             
             <div className="mt-10 w-full space-y-4">
                <div className="border border-zinc-800 bg-zinc-950 p-5 rounded-none group hover:border-zinc-600 transition-colors">
                   <h3 className="font-mono text-[10px] text-zinc-500 uppercase mb-4 tracking-wider flex items-center">
                      <Check className="w-3 h-3 text-emerald-400 mr-2" /> Detected Pros
                   </h3>
                   <ul className="space-y-3">
                     <li className="flex items-start text-xs text-zinc-300">
                       <span className="w-1.5 h-1.5 bg-emerald-400 rounded-none mr-3 mt-1 shrink-0" />
                       Deep expertise in distributed systems
                     </li>
                     <li className="flex items-start text-xs text-zinc-300">
                       <span className="w-1.5 h-1.5 bg-emerald-400 rounded-none mr-3 mt-1 shrink-0" />
                       High open-source commit velocity
                     </li>
                   </ul>
                </div>

                <div className="border border-zinc-800 bg-zinc-950 p-5 rounded-none group hover:border-zinc-600 transition-colors">
                   <h3 className="font-mono text-[10px] text-zinc-500 uppercase mb-4 tracking-wider flex items-center">
                      <X className="w-3 h-3 text-red-500 mr-2" /> Risk Factors
                   </h3>
                   <ul className="space-y-3">
                     <li className="flex items-start text-xs text-zinc-300">
                       <span className="w-1.5 h-1.5 bg-red-500 rounded-none mr-3 mt-1 shrink-0" />
                       Limited production Rust experience
                     </li>
                     <li className="flex items-start text-xs text-zinc-300">
                       <span className="w-1.5 h-1.5 bg-red-500 rounded-none mr-3 mt-1 shrink-0" />
                       High compensation expectations
                     </li>
                   </ul>
                </div>
             </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
             <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-none h-full">
                <div className="flex justify-between items-end mb-8 border-b border-zinc-800 pb-6">
                  <div>
                    <h1 className="text-3xl text-zinc-100 font-semibold tracking-tight mb-1">Alex Vance</h1>
                    <span className="text-zinc-500 font-mono text-xs tracking-wider uppercase">Senior Frontend Engineer</span>
                  </div>
                  <div className="text-right">
                    <span className="inline-block border border-emerald-400/30 bg-emerald-400/10 text-emerald-400 px-3 py-1 font-mono text-[10px] uppercase tracking-widest shadow-[0_0_10px_rgba(52,211,153,0.1)]">
                      Status: Ready to Hire
                    </span>
                  </div>
                </div>

                <div className="mb-10">
                  <h3 className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest mb-5">Proof of Work</h3>
                  <div className="flex flex-wrap gap-4">
                     <SkillBadge 
                       skill="React.js" 
                       repos={[{ name: "facebook/react", commits: 14 }, { name: "vance-ui/core", commits: 243 }]} 
                     />
                     <SkillBadge 
                       skill="Tailwind CSS" 
                       repos={[{ name: "tailwindlabs/tailwindcss", commits: 2 }, { name: "acme-corp/dash", commits: 105 }]} 
                     />
                     <SkillBadge 
                       skill="Framer Motion" 
                       repos={[{ name: "framer/motion", commits: 1 }, { name: "vance-ui/animations", commits: 88 }]} 
                     />
                  </div>
                </div>

                <div>
                   <h3 className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest mb-5">Day-1 Readiness Forecast</h3>
                   <div className="bg-zinc-950 border border-zinc-800 p-8 rounded-none">
                      <Timeline />
                   </div>
                </div>
             </div>
          </div>
       </motion.div>
    </div>
  );
}
