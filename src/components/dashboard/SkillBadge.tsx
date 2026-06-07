import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FolderGit2, GitCommit } from 'lucide-react';

const SNAP_TRANSITION = { type: 'spring', stiffness: 400, damping: 30 };

export const SkillBadge = ({ skill, repos }: { skill: string, repos: { name: string, commits: number }[] }) => {
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
