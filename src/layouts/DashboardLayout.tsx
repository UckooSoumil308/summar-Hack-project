import React, { useState, useRef, useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, BarChart2, Activity, Menu, Terminal, CircleUser, Loader2, LogOut } from 'lucide-react';

const SNAP_TRANSITION = { type: 'spring', stiffness: 400, damping: 30 };

export default function DashboardLayout() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showAdminMenu, setShowAdminMenu] = useState(false);
  const adminMenuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (adminMenuRef.current && !adminMenuRef.current.contains(event.target as Node)) {
        setShowAdminMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navNodes = [
    { name: 'Pipeline Overview', icon: <Users className="w-5 h-5" />, path: '/dashboard' },
    { name: 'Talent Analytics', icon: <BarChart2 className="w-5 h-5" />, path: '/dashboard/analytics' },
    { name: 'System Logs', icon: <Activity className="w-5 h-5" />, path: '/dashboard/logs' },
  ];

  return (
    <div className="flex h-screen bg-zinc-950 text-zinc-200 font-sans overflow-hidden selection:bg-orange-500/30">
      {/* Left Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: isCollapsed ? 80 : 280 }}
        transition={SNAP_TRANSITION}
        className="flex flex-col bg-zinc-900 border-r border-zinc-800 relative z-20 flex-shrink-0"
      >
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between h-[65px]">
          {!isCollapsed && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="flex items-center space-x-2 text-zinc-100 font-bold font-mono tracking-widest text-sm"
            >
              <Terminal className="w-5 h-5 text-orange-500" />
              <span className="uppercase">XAI_Recruit</span>
            </motion.div>
          )}
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`p-2 bg-zinc-950 border border-zinc-800 hover:border-orange-500 hover:text-orange-500 text-zinc-400 transition-colors rounded-none ${isCollapsed ? 'mx-auto' : ''}`}
          >
            <Menu className="w-4 h-4" />
          </button>
        </div>

        <nav className="flex-1 flex flex-col space-y-2 p-4">
          {navNodes.map((node) => (
            <NavLink
              key={node.name}
              to={node.path}
              end={node.path === '/dashboard'}
              className={({ isActive }) => `
                flex items-center p-3 rounded-none border font-mono text-xs uppercase tracking-widest transition-all
                ${isActive ? 'bg-zinc-950 border-zinc-800 text-emerald-400 shadow-inner' : 'border-transparent text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50 hover:border-zinc-800'}
                ${isCollapsed ? 'justify-center' : 'space-x-4'}
              `}
              title={isCollapsed ? node.name : undefined}
            >
              {({ isActive }) => (
                <>
                  <div className={isActive ? 'text-emerald-400' : ''}>{node.icon}</div>
                  {!isCollapsed && <span>{node.name}</span>}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </motion.aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Global Header Banner */}
        <header className="h-[65px] bg-zinc-950 border-b border-zinc-800 flex items-center justify-between px-6 flex-shrink-0">
          <div className="flex items-center space-x-4">
            <div className="flex items-center border border-zinc-800 bg-zinc-900 px-3 py-1.5 rounded-none">
              <div className="w-2 h-2 bg-emerald-400 rounded-none animate-pulse mr-2 shadow-[0_0_8px_rgba(52,211,153,0.8)]"></div>
              <span className="font-mono text-[10px] text-emerald-400 tracking-widest uppercase">System Online</span>
            </div>
            
            <div className="flex items-center text-zinc-500 font-mono text-[10px] tracking-widest uppercase">
              <Loader2 className="w-3 h-3 mr-2 animate-spin text-orange-500" />
              <span>Agents Idle</span>
            </div>
          </div>

          <div className="flex items-center space-x-4 relative" ref={adminMenuRef}>
            <button 
              onClick={() => setShowAdminMenu(!showAdminMenu)}
              className="flex items-center space-x-2 text-zinc-400 hover:text-zinc-200 transition-colors group"
            >
              <span className="font-mono text-[10px] uppercase tracking-widest">Admin</span>
              <CircleUser className="w-6 h-6 border border-zinc-800 rounded-none bg-zinc-900 p-1 group-hover:border-zinc-600 transition-colors" />
            </button>

            {/* Admin Dropdown Menu */}
            {showAdminMenu && (
              <div className="absolute top-full right-0 mt-4 w-56 bg-zinc-950 border border-zinc-800 shadow-[0_20px_60px_rgba(0,0,0,0.8)] z-50 rounded-none">
                <div className="p-4 border-b border-zinc-800 flex flex-col">
                  <span className="font-sans text-sm text-zinc-100 font-bold tracking-tight">System Administrator</span>
                  <span className="font-mono text-[10px] text-emerald-400 uppercase tracking-widest mt-1 animate-pulse">Level 5 Access</span>
                </div>
                <div className="p-2">
                  <button 
                    onClick={() => {
                      setShowAdminMenu(false);
                      navigate('/apply');
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-mono uppercase tracking-widest text-zinc-400 hover:text-red-400 hover:bg-zinc-900 flex items-center transition-colors"
                  >
                    <LogOut className="w-3 h-3 mr-3" /> Log out to Portal
                  </button>
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Content Canvas */}
        <main className="flex-1 overflow-auto bg-zinc-950 relative">
          <div className="absolute inset-0">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
