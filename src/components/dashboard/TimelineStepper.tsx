import React from 'react';

export const TimelineStepper = () => {
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
