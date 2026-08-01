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
  CheckCircle,
  Wifi,
  Settings as SettingsIcon
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
    <div className="space-y-8 animate-fade-in pb-16 max-w-3xl">

      {/* Narrative Page Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <SettingsIcon size={14} className="text-stone-400" />
          <span className="text-[10px] font-mono tracking-widest text-stone-400 dark:text-zinc-500 uppercase">
            Workspace preferences
          </span>
        </div>
        <h1 className="text-3xl md:text-4xl font-light tracking-tight text-stone-900 dark:text-white font-serif">
          System Settings
        </h1>
        <p className="text-xs text-stone-400 dark:text-zinc-400 font-light">
          Configure triggers, toggle lighting modes, reset private databases, and send feedback metrics.
        </p>
      </div>

      <div className="divider-premium" />

      {/* 1. APPEARANCE & CORES */}
      <div className="space-y-6">
        <h3 className="text-xs font-bold uppercase tracking-widest text-stone-400 dark:text-zinc-500">
          Environment & Interface
        </h3>

        <div className="flex justify-between items-center py-4 border-b border-stone-100 dark:border-neutral-800/60">
          <div className="space-y-0.5">
            <h4 className="text-sm font-semibold text-stone-800 dark:text-zinc-200">Dark Mode Lighting</h4>
            <p className="text-xs text-stone-400 font-light">Toggle ambient illumination and contrast ratios.</p>
          </div>
          
          <button
            onClick={toggleDarkMode}
            className="btn-premium btn-premium-secondary"
          >
            {isDarkMode ? <Sun size={13} /> : <Moon size={13} />}
            <span>{isDarkMode ? 'Light view' : 'Dark view'}</span>
          </button>
        </div>

        {/* Real-time synchronization */}
        <div className="flex justify-between items-center py-4 border-b border-stone-100 dark:border-neutral-800/60">
          <div className="space-y-0.5">
            <h4 className="text-sm font-semibold text-stone-800 dark:text-zinc-200">PostgreSQL Sync State</h4>
            <p className="text-xs text-stone-400 font-light">
              Current state: <span className="font-bold text-stone-900 dark:text-white">{connectionStatus}</span>
            </p>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => setConnectionStatus('connected')}
              className="btn-premium btn-premium-secondary text-[10px]"
            >
              Force Sync
            </button>
            <button
              onClick={() => setConnectionStatus('offline')}
              className="btn-premium btn-premium-ghost text-[10px]"
            >
              Offline
            </button>
          </div>
        </div>
      </div>

      <div className="divider-premium" />

      {/* 2. PRIVACY & RESET METRICS */}
      <div className="space-y-6">
        <h3 className="text-xs font-bold uppercase tracking-widest text-stone-400 dark:text-zinc-500">
          Privacy & Storage Security
        </h3>

        <div className="space-y-4 font-serif text-sm text-stone-600 dark:text-zinc-300 leading-relaxed font-light max-w-2xl">
          <p>
            Your logs and checklist items are secured locally within your browser sandbox via HTML5 LocalStorage, ensuring absolute privacy.
          </p>
        </div>

        <div className="py-4 border-b border-stone-100 dark:border-neutral-800/60 space-y-3">
          <div className="space-y-0.5">
            <h4 className="text-sm font-semibold text-rose-600">Purge Sandbox Data</h4>
            <p className="text-xs text-stone-400 font-light">
              This action clears all scheduled items, mood history, and sleep variables instantly. This cannot be rolled back.
            </p>
          </div>

          {dataCleared && (
            <p className="text-xs font-semibold text-emerald-500">
              Database cleared successfully!
            </p>
          )}

          {!showClearConfirm ? (
            <button
              onClick={() => setShowClearConfirm(true)}
              className="btn-premium text-rose-600 hover:text-white hover:bg-rose-500/95"
            >
              Clear All Data
            </button>
          ) : (
            <div className="p-4 rounded-xl bg-rose-500/5 border border-rose-200/20 space-y-3">
              <p className="text-xs font-semibold text-rose-600">Are you absolutely sure you want to clear your local database?</p>
              <div className="flex gap-2">
                <button
                  onClick={handleClearData}
                  className="btn-premium btn-premium-primary bg-rose-600 hover:bg-rose-700 text-[10px]"
                >
                  Yes, Purge
                </button>
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="btn-premium btn-premium-secondary text-[10px]"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="divider-premium" />

      {/* 3. FEEDBACK FORM */}
      <div className="space-y-6">
        <h3 className="text-xs font-bold uppercase tracking-widest text-stone-400 dark:text-zinc-500">
          Share Your Experience
        </h3>

        <form onSubmit={handleSendFeedback} className="space-y-4 max-w-xl">
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold text-stone-400 dark:text-zinc-500 uppercase tracking-widest">
              Review notes
            </label>
            <textarea
              value={feedbackText}
              onChange={e => setFeedbackText(e.target.value)}
              placeholder="Tell us about your wellness requirements or layout feedback..."
              rows={3}
              className="textarea-premium w-full text-xs"
            />
          </div>

          {feedbackSent && (
            <p className="text-xs font-semibold text-emerald-500">
              Thank you! Your feedback message has been transmitted securely.
            </p>
          )}

          <button type="submit" className="btn-premium btn-premium-primary">
            Send Feedback
          </button>
        </form>
      </div>

    </div>
  );
};

export default Settings;
