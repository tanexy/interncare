import React, { useState, useEffect } from 'react';
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
  Search,
  ChevronLeft,
  ChevronRight,
  Bell,
  Sparkles,
  Heart,
  Briefcase
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import CommandPalette from './CommandPalette';

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

  // Navigation states
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [activeWorkspace, setActiveWorkspace] = useState('InternCare Personal');
  const [showWorkspaceMenu, setShowWorkspaceMenu] = useState(false);

  const navItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={18} />, path: '/' },
    { name: 'Tasks', icon: <CheckSquare size={18} />, path: '/tasks' },
    { name: 'Wellness Tracker', icon: <SmilePlus size={18} />, path: '/mood' },
    { name: 'Analytics', icon: <BarChart3 size={18} />, path: '/analytics' },
    { name: 'Settings', icon: <Settings size={18} />, path: '/settings' },
  ];

  // Global keyboard shortcut listener for ⌘K or Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleConnectionToggle = () => {
    if (connectionStatus === 'connected') {
      setConnectionStatus('reconnecting');
      setTimeout(() => setConnectionStatus('offline'), 1200);
    } else if (connectionStatus === 'offline') {
      setConnectionStatus('reconnecting');
      setTimeout(() => setConnectionStatus('connected'), 1200);
    } else {
      setConnectionStatus('connected');
    }
  };

  const activeMembers = teamMembers.filter(m => m.status === 'online' || m.status === 'busy' || m.status === 'away');

  return (
    <div className={`min-h-screen font-sans antialiased transition-colors duration-300 ${isDarkMode ? 'dark bg-[#0a0a0a] text-zinc-100' : 'bg-[#faf9f6] text-stone-800'}`}>

      {/* ⌘K Command Palette Overlay */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
      />

      {/* Floating Glass Sidebar (Desktop / Tablet view) */}
      <aside
        className={`hidden lg:flex flex-col fixed top-3 bottom-3 left-3 z-30 rounded-2xl border border-stone-200/50 dark:border-neutral-800/80 bg-white/70 dark:bg-neutral-900/60 backdrop-blur-md transition-all duration-300 shadow-sm
          ${isSidebarCollapsed ? 'w-20' : 'w-64'}
        `}
      >
        {/* Workspace Switcher Header */}
        <div className="p-4 border-b border-stone-100 dark:border-neutral-800/60 relative">
          <div
            onClick={() => setShowWorkspaceMenu(!showWorkspaceMenu)}
            className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-stone-50 dark:hover:bg-neutral-850 cursor-pointer select-none transition-colors"
          >
            <div className="w-7 h-7 rounded-md bg-stone-900 dark:bg-neutral-800 flex items-center justify-center text-white font-serif">
              <Briefcase size={14} className="text-stone-300" />
            </div>
            {!isSidebarCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-bold text-stone-400 dark:text-zinc-500 uppercase tracking-widest leading-none">Workspace</p>
                <p className="text-xs font-semibold text-stone-800 dark:text-zinc-200 truncate mt-1">{activeWorkspace}</p>
              </div>
            )}
          </div>

          {/* Collapsible Dropdown for workspace switcher */}
          {showWorkspaceMenu && !isSidebarCollapsed && (
            <div className="absolute left-4 right-4 top-full mt-1.5 bg-white dark:bg-neutral-900 border border-stone-200/60 dark:border-neutral-800 rounded-xl shadow-xl p-1.5 z-40 animate-fade-in-slide">
              <button
                onClick={() => { setActiveWorkspace('InternCare Personal'); setShowWorkspaceMenu(false); }}
                className="w-full text-left text-xs px-3 py-2 rounded-lg hover:bg-stone-50 dark:hover:bg-neutral-850 text-stone-700 dark:text-zinc-300 font-medium"
              >
                InternCare Personal
              </button>
              <button
                onClick={() => { setActiveWorkspace('Supervisor Sandbox'); setShowWorkspaceMenu(false); }}
                className="w-full text-left text-xs px-3 py-2 rounded-lg hover:bg-stone-50 dark:hover:bg-neutral-850 text-stone-700 dark:text-zinc-300 font-medium"
              >
                Supervisor Sandbox
              </button>
            </div>
          )}
        </div>

        {/* Search Command Trigger (Linear style) */}
        <div className="px-4 py-3">
          <button
            onClick={() => setIsCommandPaletteOpen(true)}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-stone-100/50 dark:bg-neutral-800/40 text-stone-400 dark:text-zinc-500 hover:bg-stone-100 dark:hover:bg-neutral-800/80 transition-all text-xs border border-transparent hover:border-stone-200/50 dark:hover:border-zinc-700/50"
          >
            <span className="flex items-center gap-2">
              <Search size={14} />
              {!isSidebarCollapsed && <span>Search Workspace...</span>}
            </span>
            {!isSidebarCollapsed && <span className="kdb-premium">⌘K</span>}
          </button>
        </div>

        {/* Navigation Items list */}
        <div className="flex-1 px-3 py-2 overflow-y-auto space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.name}
                onClick={() => navigate(item.path)}
                className={`
                  w-full flex items-center rounded-xl p-2.5 text-xs font-medium transition-all duration-200 group relative
                  ${isActive
                    ? 'bg-stone-100/80 dark:bg-neutral-800/70 text-stone-900 dark:text-white font-semibold'
                    : 'text-stone-500 hover:text-stone-900 hover:bg-stone-100/30 dark:text-zinc-400 dark:hover:text-zinc-200 dark:hover:bg-neutral-850/40'}
                `}
                title={item.name}
              >
                <span className={`mr-3 transition-transform duration-200 group-hover:scale-105 ${isActive ? 'text-stone-900 dark:text-white' : 'text-stone-400'}`}>
                  {item.icon}
                </span>
                {!isSidebarCollapsed && (
                  <span className="truncate">{item.name}</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Collapsible toggle trigger block */}
        <div className="p-4 border-t border-stone-100 dark:border-neutral-800/60 flex items-center justify-between">
          {!isSidebarCollapsed && (
            <div className="flex items-center gap-2">
              <Sparkles size={14} className="text-stone-400" />
              <span className="text-[10px] font-semibold text-stone-400 dark:text-zinc-500 uppercase tracking-widest">Workspace Actions</span>
            </div>
          )}
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="p-1.5 rounded-md bg-stone-50 dark:bg-neutral-850 border border-stone-200/30 text-stone-500 dark:text-zinc-400 hover:bg-stone-100 dark:hover:bg-neutral-800 transition-colors mx-auto lg:mx-0"
          >
            {isSidebarCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        </div>

        {/* Profile / Bottom Area */}
        <div className="p-4 border-t border-stone-100 dark:border-neutral-800/60">
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"
                alt="Your Avatar"
                className="w-8 h-8 rounded-full object-cover ring-2 ring-stone-100 dark:ring-neutral-800"
              />
              <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-neutral-900" />
            </div>

            {!isSidebarCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-stone-800 dark:text-zinc-200 truncate">Clive (You)</p>
                <p className="text-[10px] text-stone-400 dark:text-zinc-500 font-medium">UX/UI Design Intern</p>
              </div>
            )}

            {!isSidebarCollapsed && (
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-stone-400 opacity-70"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-stone-500"></span>
              </span>
            )}
          </div>
        </div>
      </aside>

      {/* Main viewport area, handles sliding margins based on sidebar collapsed state */}
      <div className={`transition-all duration-300 flex flex-col min-h-screen
        ${isSidebarCollapsed ? 'lg:pl-28' : 'lg:pl-72'}
      `}>

        {/* Sleek Header Bar */}
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between px-6 md:px-10 bg-transparent">

          {/* Logo element for mobile views (hidden on desktop) */}
          <div className="flex items-center gap-2.5 lg:hidden">
            <div className="w-7 h-7 rounded-md bg-stone-900 dark:bg-neutral-800 flex items-center justify-center">
              <Heart size={14} className="text-white fill-white" />
            </div>
            <span className="text-sm font-bold tracking-tight text-stone-900 dark:text-white font-serif">
              InternCare
            </span>
          </div>

          <div className="hidden lg:block">
            {/* Soft path info indicators */}
            <span className="text-[10px] font-mono tracking-widest text-stone-400 dark:text-zinc-500 uppercase">
              {location.pathname === '/' ? 'WORKSPACE / OVERVIEW' : `WORKSPACE / ${location.pathname.replace('/', '').toUpperCase()}`}
            </span>
          </div>

          {/* Real-time Collaboration feed, Supabase Wifi toggle, theme toggle */}
          <div className="flex items-center gap-4">

            {/* Live Peer Activity bubbles */}
            <div className="hidden md:flex items-center gap-1.5 border-r border-stone-200/50 dark:border-neutral-800 pr-4">
              <div className="flex -space-x-1 overflow-hidden">
                {activeMembers.slice(0, 3).map((member) => (
                  <img
                    key={member.id}
                    className="inline-block h-6 w-6 rounded-full ring-2 ring-white dark:ring-[#0a0a0a] object-cover"
                    src={member.avatarUrl}
                    alt={member.name}
                    title={`${member.name} (${member.role}) is online`}
                  />
                ))}
              </div>
              <span className="text-[10px] text-stone-400 dark:text-zinc-500 font-medium flex items-center gap-1">
                <Users size={12} /> {activeMembers.length} Active
              </span>
            </div>

            {/* Supabase status control trigger button */}
            <button
              onClick={handleConnectionToggle}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold transition-all duration-300 border
                ${connectionStatus === 'connected'
                  ? 'bg-stone-100 text-stone-600 dark:bg-neutral-850 dark:text-zinc-400 border-stone-200/40 dark:border-neutral-800'
                  : connectionStatus === 'reconnecting'
                  ? 'bg-amber-500/10 text-amber-600 border-amber-500/20 animate-pulse'
                  : 'bg-rose-500/10 text-rose-600 border-rose-500/20'
                }
              `}
              title="PostgreSQL Sync State. Click to toggle state."
            >
              {connectionStatus === 'connected' ? (
                <>
                  <Wifi size={11} className="text-emerald-500 animate-pulse" />
                  <span className="hidden sm:inline">Sync Connected</span>
                </>
              ) : connectionStatus === 'reconnecting' ? (
                <>
                  <Wifi size={11} className="animate-spin text-amber-400" />
                  <span>Syncing...</span>
                </>
              ) : (
                <>
                  <WifiOff size={11} className="text-rose-400" />
                  <span>Offline</span>
                </>
              )}
            </button>

            {/* Dark / Light trigger */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-xl border border-stone-200/40 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-stone-500 dark:text-zinc-300 hover:bg-stone-50 dark:hover:bg-neutral-800 shadow-sm"
              aria-label="Toggle theme mode"
            >
              {isDarkMode ? <Sun size={14} /> : <Moon size={14} />}
            </button>
          </div>
        </header>

        {/* MAIN BODY LAYOUT VIEW */}
        <main className="flex-1 px-6 md:px-10 py-6">
          <div className="max-w-5xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* BOTTOM MOBILE NAVIGATION BAR - Visible on small phone screens */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-neutral-900/95 border-t border-stone-200/40 dark:border-neutral-800/80 backdrop-blur-lg px-4 py-2 flex justify-around items-center shadow-xl">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.name}
              onClick={() => navigate(item.path)}
              className="flex flex-col items-center justify-center p-1.5"
            >
              <div className={`p-1 rounded-xl transition-all
                ${isActive
                  ? 'text-stone-900 dark:text-white bg-stone-100 dark:bg-neutral-800'
                  : 'text-stone-400 dark:text-zinc-500'}
              `}>
                {item.icon}
              </div>
              <span className={`text-[9px] font-semibold mt-1 tracking-tight
                ${isActive ? 'text-stone-900 dark:text-white' : 'text-stone-400'}
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
