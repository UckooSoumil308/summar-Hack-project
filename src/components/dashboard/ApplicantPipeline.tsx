import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Search, FolderGit2, Trash2 } from 'lucide-react';

interface CandidateSummary {
  _id: string;
  name: string;
  targetRole: string;
  xaiEvaluation: {
    matchScore: number;
  };
  proofOfWork: {
    technology: string;
    verificationStatus: string;
  }[];
}

export const ApplicantPipeline = ({ onInspect }: { onInspect?: (id: string) => void }) => {
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState<CandidateSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Active Filtering States
  const [searchQuery, setSearchQuery] = useState('');
  const [scoreFilter, setScoreFilter] = useState<'ALL' | 'HIGH' | 'MID'>('ALL');
  const [verificationFilter, setVerificationFilter] = useState<'ALL' | 'VERIFIED'>('ALL');
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const res = await fetch('http://127.0.0.1:5000/api/candidates');
        const data = await res.json();
        if (data.success) {
          setCandidates(data.candidates);
        } else {
          setError(data.error);
        }
      } catch (err: unknown) {
        setError(err.message || 'Failed to fetch pipeline data.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchCandidates();
  }, []);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the row click (Inspect) from triggering
    if (!window.confirm("WARNING: Are you sure you want to permanently purge this candidate's neural telemetry?")) return;
    
    try {
      const res = await fetch(`http://127.0.0.1:5000/api/candidates/${id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        setCandidates(prev => prev.filter(c => c._id !== id));
      } else {
        setError(data.error);
      }
    } catch (err: unknown) {
      setError(err.message || 'Failed to delete candidate.');
    }
  };

  // Global Keyboard Listener: Cmd/Ctrl + K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.6)]';
    if (score >= 70) return 'text-orange-500';
    return 'text-red-500';
  };

  // Fuzzy Selection Mapping
  const filteredCandidates = candidates.filter(c => {
    const q = searchQuery.toLowerCase();
    const matchName = c.name.toLowerCase().includes(q);
    const matchRole = c.targetRole.toLowerCase().includes(q);
    const matchTech = c.proofOfWork?.some(p => p.technology.toLowerCase().includes(q));
    
    if (searchQuery && !matchName && !matchRole && !matchTech) return false;

    const score = c.xaiEvaluation?.matchScore || 0;
    if (scoreFilter === 'HIGH' && score < 80) return false;
    if (scoreFilter === 'MID' && (score < 70 || score >= 80)) return false;

    if (verificationFilter === 'VERIFIED') {
      const hasVerified = c.proofOfWork?.some(p => p.verificationStatus === 'Verified');
      if (!hasVerified) return false;
    }

    return true;
  });

  return (
    <div className="w-full bg-zinc-900 border border-zinc-800 rounded-none overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.8)]">
      
      {/* Header and Omnibar Interface */}
      <div className="bg-zinc-950 border-b border-zinc-800 p-6 flex flex-col space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-zinc-100 font-bold tracking-tight uppercase text-xl">Applicant Pipeline</h2>
            <span className="font-mono text-[10px] text-zinc-500 tracking-widest uppercase block mt-1">Active Ingestion Queue</span>
          </div>
          <div className="font-mono text-[10px] text-zinc-500 border border-zinc-800 px-3 py-1 bg-zinc-900 flex items-center">
            {isLoading ? (
              <span className="animate-pulse">Fetching...</span>
            ) : (
              `Total Nodes: ${filteredCandidates.length}`
            )}
          </div>
        </div>

        {/* Dynamic Facets and Omnibar */}
        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
          <div className="relative flex-1 w-full group">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 transform -translate-y-1/2 group-focus-within:text-orange-500 transition-colors" />
            <input 
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Fuzzy search nodes by identity, role, or neural stack..."
              className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 font-mono text-sm py-2.5 pl-10 pr-14 focus:outline-none focus:border-orange-500 focus:shadow-[0_0_12px_rgba(249,115,22,0.3)] transition-all rounded-none placeholder:text-zinc-700"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1 pointer-events-none">
              <kbd className="px-1.5 border border-zinc-700 bg-zinc-800 text-zinc-400 rounded-sm font-mono text-[10px]">ctrl</kbd>
              <kbd className="px-1.5 border border-zinc-700 bg-zinc-800 text-zinc-400 rounded-sm font-mono text-[10px]">K</kbd>
            </div>
          </div>

          <div className="flex items-center space-x-2 font-mono text-[10px] uppercase tracking-widest w-full md:w-auto overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
            <button 
              onClick={() => setScoreFilter(scoreFilter === 'HIGH' ? 'ALL' : 'HIGH')}
              className={`px-4 py-2 border whitespace-nowrap transition-colors ${scoreFilter === 'HIGH' ? 'border-emerald-400 text-emerald-400 bg-emerald-400/10' : 'border-zinc-800 text-zinc-500 bg-zinc-900 hover:border-zinc-600 hover:text-zinc-300'}`}
            >
              &gt;80% Match
            </button>
            <button 
              onClick={() => setScoreFilter(scoreFilter === 'MID' ? 'ALL' : 'MID')}
              className={`px-4 py-2 border whitespace-nowrap transition-colors ${scoreFilter === 'MID' ? 'border-orange-500 text-orange-500 bg-orange-500/10' : 'border-zinc-800 text-zinc-500 bg-zinc-900 hover:border-zinc-600 hover:text-zinc-300'}`}
            >
              70-80% Match
            </button>
            <button 
              onClick={() => setVerificationFilter(verificationFilter === 'VERIFIED' ? 'ALL' : 'VERIFIED')}
              className={`px-4 py-2 border whitespace-nowrap transition-colors flex items-center ${verificationFilter === 'VERIFIED' ? 'border-zinc-300 text-zinc-100 bg-zinc-800' : 'border-zinc-800 text-zinc-500 bg-zinc-900 hover:border-zinc-600 hover:text-zinc-300'}`}
            >
               <FolderGit2 className="w-3 h-3 mr-2" /> Verified Only
            </button>
          </div>
        </div>
      </div>
      
      {error && <div className="p-4 bg-red-500/10 border-b border-red-500 text-red-500 font-mono text-xs">[ ERROR ] {error}</div>}
      
      {/* Interactive Render Matrix */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-zinc-950 font-mono text-[10px] text-zinc-500 uppercase tracking-widest border-b border-zinc-800">
              <th className="p-4 font-normal border-r border-zinc-800 whitespace-nowrap w-32">Candidate ID</th>
              <th className="p-4 font-normal border-r border-zinc-800">Identity Matrix</th>
              <th className="p-4 font-normal border-r border-zinc-800 text-center w-24">AI Match</th>
              <th className="p-4 font-normal border-r border-zinc-800 text-center w-32">Verified Skills</th>
              <th className="p-4 font-normal text-right w-24">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCandidates.map((c) => {
              const verifiedCount = c.proofOfWork?.filter(p => p.verificationStatus === 'Verified').length || 0;
              const matchScore = c.xaiEvaluation?.matchScore || 0;
              
              return (
                <tr 
                  key={c._id} 
                  onClick={() => onInspect ? onInspect(c._id) : navigate(`/dashboard/${c._id}`)}
                  className="border-b border-zinc-800 bg-zinc-900 hover:bg-zinc-800 transition-colors cursor-crosshair group"
                >
                  <td className="p-4 font-mono text-xs text-zinc-500 border-r border-zinc-800 truncate max-w-[120px] group-hover:text-zinc-400 transition-colors">{c._id}</td>
                  <td className="p-4 text-sm text-zinc-200 border-r border-zinc-800">
                    <div className="font-bold tracking-tight font-sans text-zinc-100">{c.name}</div>
                    <div className="text-zinc-500 font-mono text-[10px] mt-1 uppercase tracking-wider">{c.targetRole}</div>
                  </td>
                  <td className={`p-4 text-center font-mono text-xl font-bold border-r border-zinc-800 ${getScoreColor(matchScore)}`}>
                    {matchScore}
                  </td>
                  <td className="p-4 text-center font-mono text-sm text-emerald-400 border-r border-zinc-800">
                    [{verifiedCount}]
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end space-x-4">
                      <button 
                        onClick={(e) => handleDelete(c._id, e)}
                        className="text-zinc-600 hover:text-red-500 transition-colors p-2"
                        title="Purge Candidate"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <span className="inline-flex items-center space-x-2 font-mono text-[10px] uppercase tracking-widest text-zinc-500 group-hover:text-orange-500 transition-colors pointer-events-none">
                        <span>Inspect</span>
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
            
            {/* Empty States */}
            {filteredCandidates.length === 0 && !isLoading && !error && (
              <tr>
                <td colSpan={5} className="p-12 text-center text-zinc-500 font-mono text-xs uppercase tracking-widest">
                  {candidates.length === 0 ? "Pipeline empty. Awaiting ingestion." : "No nodes match the current filter criteria."}
                </td>
              </tr>
            )}
            
            {/* Loading State Placeholder */}
            {isLoading && candidates.length === 0 && (
              <tr>
                <td colSpan={5} className="p-12 text-center text-zinc-500 font-mono text-xs uppercase tracking-widest animate-pulse">
                  [ Initializing Data Substrate... ]
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
