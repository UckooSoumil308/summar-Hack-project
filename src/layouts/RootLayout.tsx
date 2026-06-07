import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { Terminal } from 'lucide-react';

export default function RootLayout() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200 font-sans selection:bg-orange-500/30 flex flex-col">
      <header className="border-b border-zinc-800 bg-zinc-900 p-4 relative z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3 text-zinc-100 font-bold uppercase tracking-widest font-mono text-sm">
            <Terminal className="w-5 h-5 text-orange-500" />
            <span>XAI_Recruit</span>
          </div>
          <nav className="flex space-x-6 font-mono text-xs uppercase tracking-wider">
            <NavLink 
              to="/apply" 
              className={({ isActive }) => 
                `transition-colors ${isActive ? 'text-orange-500 border-b border-orange-500 pb-1' : 'text-zinc-500 hover:text-zinc-300'}`
              }
            >
              [ Apply ]
            </NavLink>
            <NavLink 
              to="/dashboard" 
              className={({ isActive }) => 
                `transition-colors ${isActive ? 'text-emerald-400 border-b border-emerald-400 pb-1' : 'text-zinc-500 hover:text-zinc-300'}`
              }
            >
              [ Dashboard ]
            </NavLink>
          </nav>
        </div>
      </header>
      <main className="flex-1 relative">
        <Outlet />
      </main>
    </div>
  );
}
