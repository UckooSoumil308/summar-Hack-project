import React, { InputHTMLAttributes } from 'react';
import { Terminal } from 'lucide-react';

interface TerminalInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const TerminalInput: React.FC<TerminalInputProps> = ({ label, ...props }) => {
  return (
    <div className="flex flex-col mb-6">
      <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-2 flex items-center">
        <Terminal className="w-3 h-3 mr-2" /> {label}
      </label>
      <input 
        {...props}
        className="bg-zinc-950 border border-zinc-800 text-zinc-100 font-mono text-sm p-4 rounded-none focus:outline-none focus:border-emerald-400 focus:shadow-[0_0_12px_rgba(52,211,153,0.3)] transition-all placeholder:text-zinc-700"
      />
    </div>
  );
};
