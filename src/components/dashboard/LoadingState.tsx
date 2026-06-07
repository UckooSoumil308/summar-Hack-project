import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Terminal } from 'lucide-react';

const SNAP_TRANSITION = { type: 'spring', stiffness: 400, damping: 30 };

export const LoadingState = () => {
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
