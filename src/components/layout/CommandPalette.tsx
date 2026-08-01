import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Command,
  ArrowRight,
  Smile,
  Plus,
  CheckSquare,
  BarChart2,
  Settings,
  Sparkles,
  Sun,
  Moon,
  FolderSync
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const {
    tasks,
    addMoodEntry,
    addTask,
    toggleDarkMode,
    isDarkMode,
    triggerAIGenerator
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [quickMoodMode, setQuickMoodMode] = useState(false);
  const [quickTaskMode, setQuickTaskMode] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [feedbackMsg, setFeedbackMsg] = useState('');

  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when palette opens
  useEffect(() => {
    if (isOpen) {
      setSearchQuery('');
      setSelectedIndex(0);
      setQuickMoodMode(false);
      setQuickTaskMode(false);
      setTaskTitle('');
      setFeedbackMsg('');
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Define global command items
  const baseCommands = [
    { id: 'nav-dash', title: 'Go to Dashboard', subtitle: 'View your workspace', icon: <Command size={16} />, action: () => { navigate('/'); onClose(); } },
    { id: 'nav-tasks', title: 'Go to Tasks Planner', subtitle: 'Manage your priorities', icon: <CheckSquare size={16} />, action: () => { navigate('/tasks'); onClose(); } },
    { id: 'nav-mood', title: 'Go to Wellness Tracker', subtitle: 'Journal & check-in', icon: <Smile size={16} />, action: () => { navigate('/mood'); onClose(); } },
    { id: 'nav-analytics', title: 'Go to Narrative Analytics', subtitle: 'Read your storytelling insights', icon: <BarChart2 size={16} />, action: () => { navigate('/analytics'); onClose(); } },
    { id: 'nav-settings', title: 'Go to Settings', subtitle: 'Configure preferences', icon: <Settings size={16} />, action: () => { navigate('/settings'); onClose(); } },
    { id: 'action-mood', title: 'Log Mood Check-In...', subtitle: 'Record your current feeling score', icon: <Smile size={16} />, action: () => { setQuickMoodMode(true); setSearchQuery(''); } },
    { id: 'action-task', title: 'Create a New Task...', subtitle: 'Add task to your priority backlog', icon: <Plus size={16} />, action: () => { setQuickTaskMode(true); setSearchQuery(''); } },
    { id: 'action-ai', title: 'Trigger AI Care Coach Advisor', subtitle: 'Generate streaming suggestions', icon: <Sparkles size={16} />, action: () => { triggerAIGenerator(); navigate('/'); onClose(); } },
    { id: 'action-theme', title: 'Toggle Light / Dark Mode', subtitle: `Switch to ${isDarkMode ? 'light' : 'dark'} theme`, icon: isDarkMode ? <Sun size={16} /> : <Moon size={16} />, action: () => { toggleDarkMode(); onClose(); } },
    { id: 'action-ws', title: 'Switch Workspace', subtitle: 'Toggle between InternCare Workspace and Mentor Sandbox', icon: <FolderSync size={16} />, action: () => { setFeedbackMsg('Workspace switched successfully to Mentor Sandbox!'); setTimeout(() => onClose(), 1200); } },
  ];

  // Filter commands based on search query
  const filteredCommands = baseCommands.filter(cmd =>
    cmd.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cmd.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % (quickMoodMode ? 10 : quickTaskMode ? 1 : filteredCommands.length));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + (quickMoodMode ? 10 : quickTaskMode ? 1 : filteredCommands.length)) % (quickMoodMode ? 10 : quickTaskMode ? 1 : filteredCommands.length));
      } else if (e.key === 'Escape') {
        e.preventDefault();
        if (quickMoodMode || quickTaskMode) {
          setQuickMoodMode(false);
          setQuickTaskMode(false);
          setSearchQuery('');
        } else {
          onClose();
        }
      } else if (e.key === 'Enter') {
        e.preventDefault();
        handleExecuteIndex();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, filteredCommands, quickMoodMode, quickTaskMode, taskTitle]);

  const handleExecuteIndex = () => {
    if (quickMoodMode) {
      // Score is index + 1
      const score = selectedIndex + 1;
      addMoodEntry({ score, notes: 'Logged from Command Palette' });
      setFeedbackMsg(`Successfully logged mood score: ${score}/10!`);
      setTimeout(() => onClose(), 1000);
    } else if (quickTaskMode) {
      if (taskTitle.trim()) {
        addTask({
          title: taskTitle.trim(),
          description: 'Created instantly via Command Palette ⌘K',
          priority: 'medium',
          dueDate: new Date(Date.now() + 86400000).toISOString() // Tomorrow
        });
        setFeedbackMsg(`Task "${taskTitle}" created successfully!`);
        setTimeout(() => onClose(), 1000);
      }
    } else if (filteredCommands[selectedIndex]) {
      filteredCommands[selectedIndex].action();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[12vh] px-4">
      {/* Dark overlay backdrop */}
      <div
        className="fixed inset-0 bg-stone-900/40 dark:bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Launcher Container */}
      <div className="relative w-full max-w-lg overflow-hidden rounded-xl bg-white dark:bg-neutral-900 border border-stone-200/80 dark:border-neutral-800 shadow-2xl animate-fade-in-slide">

        {/* Feedback Message overlay */}
        {feedbackMsg && (
          <div className="absolute inset-0 bg-white/95 dark:bg-neutral-900/95 z-50 flex flex-col items-center justify-center p-6 text-center">
            <Sparkles className="text-stone-700 dark:text-stone-300 animate-spin mb-3" size={28} />
            <p className="text-sm font-medium text-stone-900 dark:text-stone-100">{feedbackMsg}</p>
          </div>
        )}

        {/* Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-stone-100 dark:border-neutral-800/80">
          <Search size={18} className="text-stone-400 dark:text-stone-500" />

          {quickMoodMode ? (
            <div className="flex-1 flex items-center gap-2 text-sm text-stone-500 font-medium">
              <span>Log Mood Score:</span>
              <span className="text-stone-800 dark:text-stone-100 font-bold">Use arrows to pick 1 - 10</span>
            </div>
          ) : quickTaskMode ? (
            <input
              ref={inputRef}
              type="text"
              value={taskTitle}
              onChange={e => setTaskTitle(e.target.value)}
              placeholder="What task needs to be done? Press Enter..."
              className="flex-grow bg-transparent text-sm focus:outline-none text-stone-800 dark:text-stone-100"
            />
          ) : (
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Type a command or search..."
              className="flex-grow bg-transparent text-sm focus:outline-none text-stone-800 dark:text-stone-100"
            />
          )}

          <span className="text-[10px] font-mono bg-stone-100 dark:bg-neutral-800 text-stone-400 dark:text-stone-500 px-1.5 py-0.5 rounded">
            ESC
          </span>
        </div>

        {/* Command List Area */}
        <div className="max-h-[300px] overflow-y-auto p-2">

          {/* Quick Mood Rating List */}
          {quickMoodMode && (
            <div className="space-y-0.5">
              {Array.from({ length: 10 }).map((_, idx) => {
                const score = idx + 1;
                const isSelected = selectedIndex === idx;
                const emojis = ['😫', '😔', '😐', '😐', '🙂', '🙂', '😄', '😄', '🌟', '👑'];
                return (
                  <button
                    key={score}
                    onClick={() => {
                      addMoodEntry({ score, notes: 'Logged from Command Palette' });
                      setFeedbackMsg(`Successfully logged mood score: ${score}/10!`);
                      setTimeout(() => onClose(), 1000);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left text-xs transition-colors
                      ${isSelected ? 'bg-stone-100 dark:bg-neutral-800 text-stone-900 dark:text-white font-medium' : 'text-stone-600 dark:text-neutral-400'}
                    `}
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-base">{emojis[idx]}</span>
                      <span>Rating {score} - {score >= 8 ? 'Excellent' : score >= 6 ? 'Good' : score >= 4 ? 'Neutral' : 'Challenging'}</span>
                    </span>
                    {isSelected && <span className="text-[10px] text-stone-400">Enter to submit</span>}
                  </button>
                );
              })}
            </div>
          )}

          {/* Quick Task input confirmation guide */}
          {quickTaskMode && (
            <div className="p-3 text-xs text-stone-500 dark:text-stone-400 text-center">
              Press <span className="font-semibold text-stone-800 dark:text-stone-200">Enter</span> to instantly save this task with medium priority.
            </div>
          )}

          {/* Standard commands list */}
          {!quickMoodMode && !quickTaskMode && (
            filteredCommands.length > 0 ? (
              <div className="space-y-0.5">
                {filteredCommands.map((cmd, index) => {
                  const isSelected = selectedIndex === index;
                  return (
                    <button
                      key={cmd.id}
                      onClick={cmd.action}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left transition-colors
                        ${isSelected ? 'bg-stone-50 dark:bg-neutral-800/80 text-stone-900 dark:text-white font-medium' : 'text-stone-600 dark:text-neutral-400'}
                      `}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`transition-colors ${isSelected ? 'text-stone-900 dark:text-white' : 'text-stone-400'}`}>
                          {cmd.icon}
                        </span>
                        <div>
                          <p className="text-xs">{cmd.title}</p>
                          <p className="text-[10px] text-stone-400 dark:text-stone-500 mt-0.5 font-normal">{cmd.subtitle}</p>
                        </div>
                      </div>

                      {isSelected && (
                        <ArrowRight size={12} className="text-stone-400 animate-pulse" />
                      )}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 text-center text-xs text-stone-400 dark:text-stone-500">
                No matching command or action found.
              </div>
            )
          )}

        </div>

        {/* Footer info bar */}
        <div className="px-4 py-2.5 bg-stone-50/50 dark:bg-neutral-900/30 border-t border-stone-100 dark:border-neutral-800/60 flex justify-between items-center text-[10px] text-stone-400 dark:text-stone-500 font-medium select-none">
          <span className="flex items-center gap-1.5">
            <span>Use</span>
            <span className="kdb-premium">↑</span>
            <span className="kdb-premium">↓</span>
            <span>to navigate</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span>Press</span>
            <span className="kdb-premium">↵ Enter</span>
            <span>to execute</span>
          </span>
        </div>

      </div>
    </div>
  );
};

export default CommandPalette;
