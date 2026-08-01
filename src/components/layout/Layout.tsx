import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  CheckSquare,
  SmilePlus,
  BarChart3,
  Settings,
  Moon,
  Sun,
  Wifi,
  WifiOff,
  Users,
  Sparkles,
  Heart
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const {
    isDarkMode,
    toggleDarkMode,
    connectionStatus,
    setConnectionStatus,
    teamMembers
  } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  
  const navItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/' },
    { name: 'Tasks', icon: <CheckSquare size={20} />, path: '/tasks' },
    { name: 'Wellness Tracker', icon: <SmilePlus size={20} />, path: '/mood' },
    { name: 'Analytics', icon: <BarChart3 size={20} />, path: '/analytics' },
    { name: 'Settings', icon: <Settings size={20} />, path: '/settings' },
  ];

  // Helper to toggle simulated connection status for delightful interactive testing
  const handleConnectionToggle = () => {
    if (connectionStatus === 'connected') {
      setConnectionStatus('reconnecting');
      setTimeout(() => setConnectionStatus('offline'), 1500);
    } else if (connectionStatus === 'offline') {
      setConnectionStatus('reconnecting');
      setTimeout(() => setConnectionStatus('connected'), 1500);
    } else {
      setConnectionStatus('connected');
    }
  };

  const activeMembers = teamMembers.filter(m => m.status === 'online' || m.status === 'busy' || m.status === 'away');

  return (
    <div className={`min-h-screen font-sans antialiased transition-colors duration-300 ${isDarkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-800'}`}>

      {/* Top Header - Visible on all viewports for branding, quick stats, dark mode toggle */}
      <header className="sticky top-0 z-30 flex items-center justify-between px-4 md:px-8 py-3 bg-white/70 dark:bg-slate-900/70 border-b border-slate-100 dark:border-slate-900/60 backdrop-blur-md">
        <div className="flex items-center gap-3">
          {/* Symmetrical glowing tech-health logo */}
          <div className="relative group cursor-pointer" onClick={() => navigate('/')}>
            <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-teal-500 to-indigo-500 opacity-70 blur-sm group-hover:opacity-100 transition duration-300"></div>
            <div className="relative w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center">
              <Heart size={16} className="text-teal-400 fill-teal-400 animate-pulse-light" />
            </div>
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-slate-900 via-teal-700 to-indigo-800 dark:from-white dark:via-teal-400 dark:to-indigo-300 bg-clip-text text-transparent">
              InternCare
            </span>
            <span className="hidden sm:inline-block ml-2 text-[10px] font-semibold uppercase tracking-widest bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-400 px-1.5 py-0.5 rounded border border-teal-200/20">
              v1.1 Premium
            </span>
          </div>
        </div>

        {/* Real-time Collaboration & Connection Hub */}
        <div className="flex items-center gap-4">

          {/* Desktop/Tablet Presence indicators */}
          <div className="hidden md:flex items-center gap-2 border-r border-slate-100 dark:border-slate-800/80 pr-4">
            <div className="flex -space-x-1.5 overflow-hidden">
              {activeMembers.slice(0, 4).map((member) => (
                <div
                  key={member.id}
                  className="relative group cursor-pointer"
                  title={`${member.name} (${member.role}) - ${member.currentActivity || 'Active'}`}
                >
                  <img
                    className="inline-block h-7 w-7 rounded-full ring-2 ring-white dark:ring-slate-900 object-cover"
                    src={member.avatarUrl}
                    alt={member.name}
                  />
                  <span className={`absolute bottom-0 right-0 block h-2 w-2 rounded-full ring-1 ring-white dark:ring-slate-900
                    ${member.status === 'online' ? 'bg-emerald-500' : member.status === 'busy' ? 'bg-rose-500' : 'bg-amber-500'}
                  `} />

                  {/* Custom tooltip hover card */}
                  <div className="absolute bottom-full right-0 mb-2 w-48 scale-0 group-hover:scale-100 transition-all origin-bottom duration-200 z-50 bg-slate-900 text-white text-xs p-2.5 rounded-lg shadow-xl border border-slate-800">
                    <p className="font-semibold">{member.name}</p>
                    <p className="text-[10px] text-teal-400 font-medium">{member.role}</p>
                    {member.currentActivity && (
                      <p className="text-[10px] text-slate-300 mt-1 italic border-t border-slate-800 pt-1">
                        ⚡ {member.currentActivity}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {activeMembers.length > 4 && (
              <span className="text-xs font-semibold text-slate-500 ml-1">
                +{activeMembers.length - 4}
              </span>
            )}
            <span className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1 ml-1 font-medium">
              <Users size={12} /> Live
            </span>
          </div>

          {/* Interactive Supabase Realtime Status Button */}
          <button
            onClick={handleConnectionToggle}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-all duration-300 active:scale-95 border
              ${connectionStatus === 'connected'
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                : connectionStatus === 'reconnecting'
                ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 animate-pulse'
                : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
              }
            `}
            title="Supabase PostgreSQL Realtime Status. Click to simulate status change."
          >
            {connectionStatus === 'connected' ? (
              <>
                <Wifi size={13} className="animate-pulse" />
                <span className="hidden sm:inline">Sync Active</span>
              </>
            ) : connectionStatus === 'reconnecting' ? (
              <>
                <Wifi size={13} className="animate-spin" />
                <span>Reconnecting...</span>
              </>
            ) : (
              <>
                <WifiOff size={13} />
                <span>Offline</span>
              </>
            )}
          </button>

          {/* Dark / Light Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-xl border border-slate-100 dark:border-slate-900 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-950 dark:hover:text-white transition-all shadow-sm"
            aria-label="Toggle theme mode"
          >
            {isDarkMode ? <Sun size={17} /> : <Moon size={17} />}
          </button>
        </div>
      </header>
      
      <div className="flex">
        {/* SIDEBAR NAVIGATION - Visible only on Tablets & Desktops */}
        <aside className="hidden lg:block fixed top-16 left-0 z-20 w-64 h-[calc(100vh-4rem)] border-r border-slate-100 dark:border-slate-900 bg-white/40 dark:bg-slate-950/40 backdrop-blur-md p-4">
          <div className="flex flex-col h-full justify-between">
            <nav className="space-y-1">
              <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                Workspace
              </div>
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <button
                    key={item.name}
                    onClick={() => navigate(item.path)}
                    className={`
                      flex items-center w-full px-4 py-3 text-left rounded-xl font-medium transition-all duration-200 group relative
                      ${isActive
                        ? 'bg-gradient-to-r from-teal-500/10 to-indigo-500/5 text-teal-700 dark:text-teal-300 font-semibold border-l-2 border-teal-500 shadow-sm'
                        : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100/70 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-900/60'}
                    `}
                  >
                    <span className={`mr-3 transition-transform duration-200 group-hover:scale-110 ${isActive ? 'text-teal-600 dark:text-teal-400' : 'text-slate-400 dark:text-slate-500'}`}>
                      {item.icon}
                    </span>
                    <span className="text-sm">{item.name}</span>

                    {/* Tiny neon glow dots on active sidebar items */}
                    {isActive && (
                      <span className="absolute right-3 w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse-light" />
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Micro-Interaction Tips */}
            <div className="rounded-2xl p-4 bg-gradient-to-br from-teal-500/5 to-indigo-500/5 border border-teal-500/10">
              <div className="flex items-center gap-1.5 mb-1.5">
                <Sparkles size={14} className="text-teal-500" />
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">AI Care Tip</span>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400 font-medium">
                Try logging your mood twice a day for deeper insight analytics.
              </p>
            </div>
          </div>
        </aside>
        
        {/* MAIN BODY CONTAINER */}
        <main className="flex-1 lg:ml-64 p-4 md:p-8 pb-24 lg:pb-10 min-h-[calc(100vh-4rem)]">
          <div className="max-w-6xl mx-auto animate-fade-in">
            {children}
          </div>
        </main>
      </div>

      {/* BOTTOM MOBILE NAVIGATION BAR - Visible only on Smartphones */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-950/95 border-t border-slate-100 dark:border-slate-900/80 backdrop-blur-lg px-4 py-2 shadow-2xl flex justify-around items-center">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.name}
              onClick={() => navigate(item.path)}
              className="flex flex-col items-center justify-center p-1.5 select-none active:scale-90 transition-transform"
            >
              <div className={`p-1 rounded-xl transition-all
                ${isActive
                  ? 'text-teal-600 dark:text-teal-400 bg-teal-500/10'
                  : 'text-slate-400 dark:text-slate-500'}
              `}>
                {item.icon}
              </div>
              <span className={`text-[9px] font-bold mt-1 tracking-tight transition-colors
                ${isActive ? 'text-teal-600 dark:text-teal-400' : 'text-slate-500 dark:text-slate-500'}
              `}>
                {item.name === 'Wellness Tracker' ? 'Tracker' : item.name}
              </span>
            </button>
          );
        })}
      </nav>

    </div>
  );
};

export default Layout;