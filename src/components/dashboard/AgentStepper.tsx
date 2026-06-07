import React from 'react';
import { motion } from 'framer-motion';
import { Terminal } from 'lucide-react';

const steps = [
  "CONNECTING",
  "PROCESSING",
  "ANALYZING",
  "SYNTHESIZING",
  "COMPLETE"
];

interface AgentStepperProps {
  currentStatus: string;
}

export const AgentStepper: React.FC<AgentStepperProps> = ({ currentStatus }) => {
  // Clean status, removing brackets if they exist
  const rawStatus = currentStatus.replace(/\[|\]/g, '').trim();
  const activeStep = steps.indexOf(rawStatus) !== -1 ? steps.indexOf(rawStatus) : 0;

  return (
    <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-none font-mono text-sm w-full max-w-lg shadow-[0_20px_60px_rgba(0,0,0,0.8)] mx-auto">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-zinc-800">
        <div className="flex items-center">
          <Terminal className="w-4 h-4 text-zinc-500 mr-3" />
          <span className="text-zinc-500 uppercase tracking-widest text-[10px]">Agent Telemetry</span>
        </div>
        <span className="text-[10px] text-zinc-700 uppercase animate-pulse">SSE_ACTIVE</span>
      </div>
      
      <div className="space-y-4">
        {steps.map((step, index) => {
          const isCompleted = index < activeStep;
          const isActive = index === activeStep;
          const isFinal = index === steps.length - 1;
          
          let colorClass = "text-zinc-800"; 
          if (isCompleted) colorClass = "text-zinc-600";
          if (isActive && !isFinal) colorClass = "text-orange-500 animate-pulse drop-shadow-[0_0_8px_rgba(249,115,22,0.8)]";
          if (isActive && isFinal) colorClass = "text-emerald-400 animate-pulse drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]";
          if (rawStatus === "ERROR") colorClass = "text-red-500 animate-pulse";
          
          return (
            <motion.div 
              key={step}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: isActive || isCompleted ? 1 : 0.2, x: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className={`flex items-center space-x-4 ${colorClass}`}
            >
              <span className="w-4">{isActive ? '>' : ' '}</span>
              <span className="tracking-widest font-bold">[ {step} ]</span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
