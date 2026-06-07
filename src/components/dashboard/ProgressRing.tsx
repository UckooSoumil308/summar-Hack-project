import React from 'react';
import { motion } from 'framer-motion';

const SNAP_TRANSITION = { type: 'spring', stiffness: 400, damping: 30 };

export const ProgressRing = ({ score }: { score: number }) => {
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
