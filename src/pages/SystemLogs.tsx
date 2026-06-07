import React, { useEffect, useState } from 'react';
import { Terminal } from 'lucide-react';

interface Log {
  _id: string;
  agentName: string;
  action: string;
  status: 'SUCCESS' | 'ERROR' | 'WARN';
  executionTimeMs: number;
  createdAt: string;
}

export default function SystemLogs() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch('http://127.0.0.1:5000/api/logs');
        const json = await res.json();
        if (json.success) {
          setLogs(json.logs);
        } else {
          setError(json.error);
        }
      } catch (err: unknown) {
        setError(err.message);
      }
    };

    fetchLogs(); // Initial fetch
    const interval = setInterval(fetchLogs, 5000); // Polling every 5s

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SUCCESS': return 'text-emerald-400';
      case 'ERROR': return 'text-red-500';
      case 'WARN': return 'text-orange-500';
      default: return 'text-zinc-400';
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto h-[calc(100vh-65px)] flex flex-col">
      <div className="mb-6 border-b border-zinc-800 pb-4">
        <h1 className="text-3xl text-zinc-100 font-bold tracking-tight uppercase flex items-center">
          <Terminal className="w-8 h-8 mr-3 text-zinc-500" /> System Logs
        </h1>
        <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest mt-2">Live Multi-Agent Telemetry Feed</p>
      </div>

      <div className="flex-1 bg-[#0a0a0a] border border-zinc-800 p-6 overflow-hidden flex flex-col relative shadow-[inset_0_0_30px_rgba(0,0,0,0.8)]">
        
        {error && <div className="text-red-500 font-mono text-xs mb-4 uppercase tracking-widest">[ SYSTEM FAULT ]: {error}</div>}
        
        <div className="flex-1 overflow-y-auto font-mono text-xs md:text-sm space-y-1 hide-scrollbar pb-10 z-20">
          {logs.map((log) => (
            <div key={log._id} className="flex flex-col md:flex-row md:items-center space-y-1 md:space-y-0 text-zinc-400 hover:bg-zinc-900/80 p-1.5 transition-colors border-l-2 border-transparent hover:border-zinc-700">
              <div className="w-56 text-zinc-600 shrink-0">
                {new Date(log.createdAt).toISOString().replace('T', ' ').substring(0, 23)}
              </div>
              <div className="w-48 text-zinc-300 font-bold shrink-0 truncate pr-4">
                [{log.agentName}]
              </div>
              <div className="flex-1 text-zinc-400 truncate pr-4 tracking-wide">
                {log.action}
              </div>
              <div className="w-24 text-zinc-500 shrink-0 text-right pr-6">
                {log.executionTimeMs}ms
              </div>
              <div className={`w-24 shrink-0 font-bold tracking-widest ${getStatusColor(log.status)}`}>
                [{log.status}]
              </div>
            </div>
          ))}
          {logs.length === 0 && !error && (
            <div className="text-zinc-600 italic mt-4">Awaiting neural telemetry events...</div>
          )}
          
          <div className="mt-4 text-emerald-400 animate-pulse font-bold">_</div>
        </div>

        {/* Scanline overlay for Cyber-Industrial CRT aesthetic */}
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] z-10 opacity-20"></div>
      </div>
    </div>
  );
}
