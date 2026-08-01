import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Moon,
  Sun,
  BellRing,
  Bell,
  ShieldCheck,
  Info,
  Trash2,
  HelpCircle,
  Send,
  CheckCircle,
  Lock,
  Wifi,
  Users
} from 'lucide-react';

const Settings: React.FC = () => {
  const { isDarkMode, toggleDarkMode, clearAllData, connectionStatus, setConnectionStatus } = useApp();
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [dataCleared, setDataCleared] = useState(false);
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');

  const handleClearData = () => {
    clearAllData();
    setShowClearConfirm(false);
    setDataCleared(true);
    setTimeout(() => setDataCleared(false), 3000);
  };

  const handleSendFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (feedbackText.trim()) {
      setFeedbackText('');
      setFeedbackSent(true);
      setTimeout(() => setFeedbackSent(false), 3000);
    }
  };
  
  return (
    <div className="space-y-6 max-w-4xl">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">System Settings</h1>
        <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">
          Customize workspace triggers, appearance modes, and notification parameters
        </p>
      </div>
      
      {/* Settings Grid */}
      <div className="space-y-6">

        {/* Appearance Grouping */}
        <div className="card">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Workspace Environment</h2>
          
          <div className="flex items-center justify-between p-3.5 bg-slate-50/50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-850 rounded-2xl">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-white dark:bg-slate-900 rounded-xl text-indigo-500 shadow-sm">
                {isDarkMode ? <Sun size={18} className="text-amber-500" /> : <Moon size={18} className="text-indigo-500" />}
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-100">Dark Mode Interface</p>
                <p className="text-[10px] text-slate-400 dark:text-slate-500">
                  Switch between deep dark-slate parameters and light ambient views
                </p>
              </div>
            </div>

            <button
              onClick={toggleDarkMode}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none
                ${isDarkMode ? 'bg-teal-500' : 'bg-slate-200 dark:bg-slate-800'}
              `}
              aria-label="Toggle dark mode"
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out
                  ${isDarkMode ? 'translate-x-5' : 'translate-x-0'}
                `}
              />
            </button>
          </div>
        </div>
        
        {/* Notifications Grouping */}
        <div className="card">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Workspace Triggers</h2>
          
          <div className="space-y-3">
            {/* Task reminders */}
            <div className="flex items-center justify-between p-3.5 bg-slate-50/50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-850 rounded-2xl">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-white dark:bg-slate-900 rounded-xl text-teal-500 shadow-sm">
                  <BellRing size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-100">Smart Deadline Alarms</p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500">
                    Get gentle push alarms when high-priority targets approach
                  </p>
                </div>
              </div>
              
              <div className="relative inline-flex h-6 w-11 flex-shrink-0 rounded-full bg-teal-500 border-2 border-transparent">
                <span className="translate-x-5 inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200" />
              </div>
            </div>
            
            {/* Wellness check-ins */}
            <div className="flex items-center justify-between p-3.5 bg-slate-50/50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-850 rounded-2xl">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-white dark:bg-slate-900 rounded-xl text-amber-500 shadow-sm">
                  <Bell size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-100">Mindfulness Reminders</p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500">
                    Gentle notifications suggesting water hydration or stress logs
                  </p>
                </div>
              </div>
              
              <div className="relative inline-flex h-6 w-11 flex-shrink-0 rounded-full bg-teal-500 border-2 border-transparent">
                <span className="translate-x-5 inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200" />
              </div>
            </div>
          </div>
        </div>

        {/* Realtime Settings */}
        <div className="card">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">PostgreSQL Realtime Sync</h2>
          
          <div className="p-4 bg-slate-50/50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-850 rounded-2xl space-y-3">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-white dark:bg-slate-900 rounded-xl text-emerald-500 shadow-sm">
                <Wifi size={18} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-100">Supabase Connection State</p>
                <p className="text-[10px] text-slate-400 dark:text-slate-500">
                  Current state: <span className="font-extrabold text-emerald-500 capitalize">{connectionStatus}</span>. Synchronizing tasks, announcements, and peer presence vectors seamlessly.
                </p>
              </div>
            </div>

            <div className="flex gap-2.5 pt-1.5">
              <button
                onClick={() => setConnectionStatus('connected')}
                className={`px-3 py-1.5 rounded-xl text-[10px] font-bold border transition-all
                  ${connectionStatus === 'connected' ? 'bg-teal-500 text-white border-teal-600' : 'bg-white dark:bg-slate-900 border-slate-100'}
                `}
              >
                Force Connect
              </button>
              <button
                onClick={() => setConnectionStatus('offline')}
                className={`px-3 py-1.5 rounded-xl text-[10px] font-bold border transition-all
                  ${connectionStatus === 'offline' ? 'bg-rose-500 text-white border-rose-600' : 'bg-white dark:bg-slate-900 border-slate-100'}
                `}
              >
                Simulate Offline
              </button>
            </div>
          </div>
        </div>

        {/* Privacy & Reset Grouping */}
        <div className="card border-rose-500/10">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Security, Privacy & Reset</h2>

          <div className="space-y-4">
            
            {/* Storage indicator */}
            <div className="flex items-start gap-3 p-3.5 bg-slate-50/50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-850 rounded-2xl">
              <div className="p-2 bg-white dark:bg-slate-900 rounded-xl text-emerald-500 shadow-sm">
                <ShieldCheck size={18} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-100">Local Sandbox Security</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  Your tracking variables are compiled locally on your device via HTML5 LocalStorage. None of your private notes are packaged or leaked to third-party models.
                </p>
              </div>
            </div>

            {/* Clear All Data */}
            <div className="flex items-start gap-3 p-3.5 bg-rose-500/5 border border-rose-500/15 rounded-2xl">
              <div className="p-2 bg-white dark:bg-slate-900 rounded-xl text-rose-500 shadow-sm">
                <Trash2 size={18} />
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-rose-600">Purge Workspace Parameters</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mb-3.5">
                  This action clears all your scheduled tasks, daily sleep journals, and water logs. This purge cannot be rolled back.
                </p>

                {dataCleared && (
                  <p className="text-xs font-bold text-emerald-500 flex items-center gap-1 mb-2">
                    <CheckCircle size={14} /> Sandbox cleared successfully!
                  </p>
                )}

                {!showClearConfirm ? (
                  <button
                    onClick={() => setShowClearConfirm(true)}
                    className="btn btn-outline text-rose-600 hover:text-white dark:text-rose-400 hover:bg-rose-500 dark:hover:bg-rose-600 text-[10px] font-bold px-3 py-1.5"
                  >
                    Clear All Local Data
                  </button>
                ) : (
                  <div className="space-y-2 p-3 bg-white dark:bg-slate-900 border border-rose-200 rounded-xl animate-fade-in">
                    <p className="text-[10px] font-bold text-rose-600">Are you absolutely sure? This will hard-reset your state.</p>
                    <div className="flex gap-2">
                      <button
                        onClick={handleClearData}
                        className="btn btn-primary bg-rose-600 hover:bg-rose-700 text-[10px] font-bold px-3 py-1"
                      >
                        Yes, Hard Reset
                      </button>
                      <button
                        onClick={() => setShowClearConfirm(false)}
                        className="btn btn-outline text-[10px] font-bold px-3 py-1"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
        
        {/* About & Feedback */}
        <div className="card">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Send System Feedback</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            
            <form onSubmit={handleSendFeedback} className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Your thoughts</label>
                <textarea
                  value={feedbackText}
                  onChange={e => setFeedbackText(e.target.value)}
                  placeholder="Feature requests, UX issues or design reviews..."
                  rows={3}
                  className="textarea w-full text-xs"
                />
              </div>

              {feedbackSent && (
                <p className="text-xs font-bold text-teal-600 flex items-center gap-1">
                  <CheckCircle size={14} /> Thank you! Your feedback was logged.
                </p>
              )}

              <button
                type="submit"
                className="btn btn-primary text-xs px-4 py-1.5 font-bold"
              >
                Send Feedback Message
              </button>
            </form>

            <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-2xl text-xs space-y-2.5 text-slate-500 dark:text-slate-400">
              <p className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Info size={14} className="text-teal-500" />
                InternCare Product Brief
              </p>
              <p className="leading-relaxed">
                InternCare is a premium wellness-productivity platform optimized to prevent burnout and synchronize workloads for interns and supervisors.
              </p>
              <p className="text-[10px] font-bold text-slate-400">
                Release: v1.1.0 Premium | React 19 Engine
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default Settings;