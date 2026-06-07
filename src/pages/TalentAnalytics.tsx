import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, Activity, ShieldCheck, Terminal } from 'lucide-react';

interface AnalyticsData {
  totalCandidates: number;
  averageMatchScore: number;
  verificationRate: number;
  statusDistribution: { name: string; candidates: number }[];
  topSkills: { technology: string; count: number }[];
}

export default function TalentAnalytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchAnalytics = async () => {
      try {
        const res = await fetch('http://127.0.0.1:5000/api/analytics');
        const json = await res.json();
        if (json.success && isMounted) {
          setData(json.analytics);
        } else if (isMounted) {
          setError(json.error);
        }
      } catch (err: unknown) {
        if (isMounted) setError(err.message || 'Failed to fetch analytics.');
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    fetchAnalytics();
    return () => { isMounted = false; };
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-full flex flex-col items-center justify-center p-8">
        <Activity className="w-8 h-8 text-emerald-400 animate-spin mb-4" />
        <span className="font-mono text-xs text-zinc-500 uppercase tracking-widest animate-pulse">Aggregating Global Telemetry...</span>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-8">
        <div className="bg-red-500/10 border border-red-500 p-4 font-mono text-xs text-red-500 uppercase tracking-widest">
          [ CRITICAL ERROR ]: {error || 'No data available'}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <div className="mb-8 border-b border-zinc-800 pb-4">
        <h1 className="text-3xl text-zinc-100 font-bold tracking-tight uppercase">Talent Analytics</h1>
        <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest mt-2">Global System Metrics</p>
      </div>

      {/* Macro KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-none shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
          <div className="flex items-center text-zinc-500 font-mono text-[10px] uppercase tracking-widest mb-4">
            <Users className="w-4 h-4 mr-2" /> Total Processed Nodes
          </div>
          <div className="text-4xl font-bold text-zinc-100 font-mono">{data.totalCandidates}</div>
        </div>
        
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-none shadow-[0_10px_30px_rgba(0,0,0,0.5)] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-orange-500"></div>
          <div className="flex items-center text-zinc-500 font-mono text-[10px] uppercase tracking-widest mb-4">
            <Activity className="w-4 h-4 mr-2" /> Average Neural Match
          </div>
          <div className="text-4xl font-bold text-orange-500 font-mono drop-shadow-[0_0_8px_rgba(249,115,22,0.4)]">
            {data.averageMatchScore}%
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-none shadow-[0_10px_30px_rgba(0,0,0,0.5)] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-emerald-400"></div>
          <div className="flex items-center text-zinc-500 font-mono text-[10px] uppercase tracking-widest mb-4">
            <ShieldCheck className="w-4 h-4 mr-2" /> Global Verification Rate
          </div>
          <div className="text-4xl font-bold text-emerald-400 font-mono drop-shadow-[0_0_8px_rgba(52,211,153,0.4)]">
            {data.verificationRate}%
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Status Distribution Recharts */}
        <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 p-6 rounded-none shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
          <h3 className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest mb-6 border-b border-zinc-800 pb-2">
            Funnel Status Distribution
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.statusDistribution} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis dataKey="name" stroke="#71717a" fontSize={10} tickMargin={10} fontFamily="monospace" />
                <YAxis stroke="#71717a" fontSize={10} fontFamily="monospace" />
                <Tooltip 
                  cursor={{ fill: '#27272a' }} 
                  contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '0' }}
                  itemStyle={{ color: '#f4f4f5', fontFamily: 'monospace', fontSize: '12px' }}
                />
                <Bar dataKey="candidates" fill="#f97316" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Verified Stack Terminal */}
        <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-none shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex flex-col">
          <h3 className="flex items-center text-emerald-400 font-mono text-[10px] uppercase tracking-widest mb-6 border-b border-emerald-400/20 pb-2">
            <Terminal className="w-3 h-3 mr-2" /> Top Verified Stack
          </h3>
          <div className="flex-1 space-y-4">
            {data.topSkills.map((skill, idx) => (
              <div key={idx} className="flex justify-between items-center group">
                <div className="flex items-center text-sm font-mono text-zinc-300">
                  <span className="text-zinc-600 mr-3">0{idx + 1}</span>
                  <span className="group-hover:text-emerald-400 transition-colors">{skill.technology}</span>
                </div>
                <div className="text-xs font-mono text-zinc-500 bg-zinc-900 border border-zinc-800 px-2 py-1">
                  {skill.count}
                </div>
              </div>
            ))}
            {data.topSkills.length === 0 && (
              <div className="text-zinc-500 font-mono text-xs uppercase text-center mt-8">No verified skills logged.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
