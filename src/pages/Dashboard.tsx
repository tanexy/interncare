import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PlusCircle,
  Clock,
  Calendar,
  Smile,
  Sparkles,
  Flame,
  TrendingUp,
  Coffee,
  Moon,
  Award,
  ChevronRight,
  AlertCircle,
  Send,
  Zap,
  CheckCircle2,
  Circle,
  Activity,
  Heart,
  Volume2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { format } from 'date-fns';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { 
    tasks, 
    suggestions, 
    moodEntries, 
    healthData, 
    getCompletedTasksCount, 
    getAverageMood,
    getAverageSleep,
    getWaterIntakeAverage,
    getStressLevelAverage,
    toggleTaskComplete,
    addMoodEntry,
    addHealthData,
    connectionStatus,
    activityEvents,
    announcements,
    dismissAnnouncement,
    achievements,
    departmentStats,
    aiState,
    triggerAIGenerator
  } = useApp();
  
  // Inline Quick-Log Mood state
  const [quickMoodScore, setQuickMoodScore] = useState<number>(7);
  const [quickMoodNotes, setQuickMoodNotes] = useState('');
  const [quickFactors, setQuickFactors] = useState<string[]>([]);
  const [isLoggedToday, setIsLoggedToday] = useState(false);

  // Quick Health Log
  const [quickSleepHours, setQuickSleepHours] = useState(7);
  const [quickWater, setQuickWater] = useState(6);
  const [quickStress, setQuickStress] = useState(4);
  const [isHealthLogged, setIsHealthLogged] = useState(false);

  const commonFactors = ['Work', 'Sleep', 'Exercise', 'Food', 'Social', 'Stress', 'Health'];

  // Toggle quick-factor
  const handleToggleFactor = (factor: string) => {
    if (quickFactors.includes(factor)) {
      setQuickFactors(quickFactors.filter(f => f !== factor));
    } else {
      setQuickFactors([...quickFactors, factor]);
    }
  };

  // Submit quick check-in
  const handleQuickMoodSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addMoodEntry({
      score: quickMoodScore,
      notes: quickMoodNotes.trim() || undefined,
      factors: quickFactors.length > 0 ? quickFactors : undefined,
    });
    setQuickMoodNotes('');
    setQuickFactors([]);
    setIsLoggedToday(true);
    setTimeout(() => setIsLoggedToday(false), 4000); // Reset toast alert
  };

  const handleQuickHealthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addHealthData({
      sleepHours: quickSleepHours,
      waterIntake: quickWater,
      stressLevel: quickStress,
    });
    setIsHealthLogged(true);
    setTimeout(() => setIsHealthLogged(false), 4000);
  };

  // Get dynamic greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };
  
  const today = new Date();
  const formattedDate = format(today, 'EEEE, MMMM d');

  // Key metrics
  const completedTasksCount = getCompletedTasksCount(7);
  const averageMood = getAverageMood(7);
  const averageSleep = getAverageSleep(7);
  const averageStress = getStressLevelAverage(7);
  const averageWater = getWaterIntakeAverage(7);

  // Calculate generic wellness score out of 100
  // Score incorporates mood average, sleep hours, stress management, hydration
  const rawWellnessScore = Math.round(
    ((averageMood || 7) * 4) +
    (Math.min(averageSleep || 7, 8) * 4) +
    ((10 - (averageStress || 4)) * 3.5) +
    (Math.min(averageWater || 6, 8) * 1.5)
  );
  const wellnessScore = Math.min(Math.max(rawWellnessScore, 10), 100);

  // Filter out top pending tasks
  const pendingTasks = tasks
    .filter(task => !task.completed)
    .sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    })
    .slice(0, 3);

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Dynamic Time-of-day Premium Greeting Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-teal-950 p-6 md:p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 -mt-6 -mr-6 w-32 h-32 rounded-full bg-teal-500/10 blur-xl"></div>
        <div className="absolute bottom-0 left-1/3 -mb-10 w-48 h-48 rounded-full bg-indigo-500/10 blur-2xl"></div>

        <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-teal-300">
              <Sparkles size={13} className="animate-pulse" />
              <span>Personal Workspace</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
              {getGreeting()}, Intern
            </h1>
            <p className="text-slate-300 text-xs md:text-sm font-medium">
              Today is <span className="text-white font-semibold">{formattedDate}</span>. Let's make today mindful and productive.
            </p>
          </div>

          {/* Symmetrical Mini-Metric Highlights */}
          <div className="flex flex-wrap gap-4 items-center">

            {/* Streak Badge */}
            <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                <Flame size={20} className="animate-bounce-light" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Log Streak</p>
                <p className="text-base font-extrabold text-white">{moodEntries.length} Days</p>
              </div>
            </div>

            {/* Wellness Score Ring */}
            <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <div className="relative flex items-center justify-center">
                <svg className="w-11 h-11 transform -rotate-90">
                  <circle cx="22" cy="22" r="18" stroke="rgba(255,255,255,0.1)" strokeWidth="3" fill="transparent" />
                  <circle cx="22" cy="22" r="18" stroke="#14b8a6" strokeWidth="3" fill="transparent"
                    strokeDasharray={2 * Math.PI * 18}
                    strokeDashoffset={2 * Math.PI * 18 * (1 - wellnessScore / 100)}
                  />
                </svg>
                <span className="absolute text-[11px] font-bold text-white">{wellnessScore}</span>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Wellbeing</p>
                <p className="text-base font-extrabold text-white">
                  {wellnessScore >= 80 ? 'Optimal' : wellnessScore >= 60 ? 'Healthy' : 'Nurturing Needed'}
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Columns (Span 2) */}
        <div className="lg:col-span-2 space-y-8">

          {/* Section 1: Interactive Wellness Log Room (NO MODALS) */}
          <div className="card bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-900">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50">Quick Log Hub</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Instantly record your daily state without any modals</p>
              </div>
              <span className="text-[11px] font-semibold text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/40 px-2.5 py-1 rounded-full">
                Active Session
              </span>
            </div>

            {isLoggedToday && (
              <div className="p-3 mb-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2 border border-emerald-500/20 animate-fade-in">
                <CheckCircle2 size={15} />
                <span>Your daily mood was saved securely! Thank you for check-in.</span>
              </div>
            )}

            {isHealthLogged && (
              <div className="p-3 mb-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2 border border-emerald-500/20 animate-fade-in">
                <CheckCircle2 size={15} />
                <span>Health metrics logged successfully. Check your personalized suggestions!</span>
              </div>
            )}

            {/* Split Log columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">

              {/* Mood Log Form */}
              <form onSubmit={handleQuickMoodSubmit} className="space-y-4 pr-0 md:pr-4 md:border-r border-slate-100 dark:border-slate-800/80">
                <div className="text-center py-2 bg-slate-50/60 dark:bg-slate-900/60 rounded-2xl p-3 border border-slate-100 dark:border-slate-800">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">How are you feeling?</p>

                  {/* Dynamic Emoji Scale Indicator */}
                  <div className="text-3xl mb-1.5 transition-transform duration-300 scale-110">
                    {quickMoodScore >= 8 ? '😄' : quickMoodScore >= 6 ? '🙂' : quickMoodScore >= 4 ? '😐' : quickMoodScore >= 2 ? '😔' : '😫'}
                  </div>
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    {quickMoodScore >= 8 ? 'Excellent' : quickMoodScore >= 6 ? 'Good' : quickMoodScore >= 4 ? 'Neutral' : quickMoodScore >= 2 ? 'Not Great' : 'Poor'} ({quickMoodScore}/10)
                  </p>

                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={quickMoodScore}
                    onChange={e => setQuickMoodScore(parseInt(e.target.value))}
                    className="w-full accent-teal-500 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Mind Notes</label>
                  <input
                    type="text"
                    value={quickMoodNotes}
                    onChange={e => setQuickMoodNotes(e.target.value)}
                    placeholder="E.g., Finished demo deck, had coffee..."
                    className="input w-full py-1.5 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Contributing Factors</label>
                  <div className="flex flex-wrap gap-1.5">
                    {commonFactors.map(factor => {
                      const isSelected = quickFactors.includes(factor);
                      return (
                        <button
                          key={factor}
                          type="button"
                          onClick={() => handleToggleFactor(factor)}
                          className={`px-2 py-1 rounded-lg text-[10px] font-semibold transition-all duration-200
                            ${isSelected
                              ? 'bg-teal-500 text-white shadow-sm'
                              : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 hover:bg-slate-200'}
                          `}
                        >
                          {factor}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <button type="submit" className="btn btn-primary w-full py-2 text-xs font-semibold">
                  Save Mood Check-In
                </button>
              </form>

              {/* Quick Health Form */}
              <form onSubmit={handleQuickHealthSubmit} className="space-y-4 flex flex-col justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest text-center mb-3">Health Metrics Today</p>

                  <div className="space-y-3.5">

                    {/* Sleep hours slider */}
                    <div>
                      <div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                        <span className="flex items-center gap-1"><Moon size={12} className="text-indigo-400" /> Sleep Duration</span>
                        <span className="text-teal-600 dark:text-teal-400 font-bold">{quickSleepHours} Hours</span>
                      </div>
                      <input
                        type="range"
                        min="3"
                        max="11"
                        step="0.5"
                        value={quickSleepHours}
                        onChange={e => setQuickSleepHours(parseFloat(e.target.value))}
                        className="w-full accent-teal-500 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg cursor-pointer"
                      />
                    </div>

                    {/* Water intake slider */}
                    <div>
                      <div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                        <span className="flex items-center gap-1"><Coffee size={12} className="text-blue-400" /> Water Intake</span>
                        <span className="text-teal-600 dark:text-teal-400 font-bold">{quickWater} Glasses</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="12"
                        value={quickWater}
                        onChange={e => setQuickWater(parseInt(e.target.value))}
                        className="w-full accent-teal-500 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg cursor-pointer"
                      />
                    </div>

                    {/* Stress Level slider */}
                    <div>
                      <div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                        <span className="flex items-center gap-1"><Activity size={12} className="text-rose-400" /> Stress Level</span>
                        <span className="text-teal-600 dark:text-teal-400 font-bold">{quickStress}/10</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={quickStress}
                        onChange={e => setQuickStress(parseInt(e.target.value))}
                        className="w-full accent-teal-500 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg cursor-pointer"
                      />
                    </div>

                  </div>
                </div>

                <button type="submit" className="btn btn-secondary w-full py-2 text-xs font-semibold">
                  Record Health Stats
                </button>
              </form>

            </div>
          </div>

          {/* Section 2: AI Wellness Recommendations with Real-time Interactive Streaming */}
          <div className="card relative overflow-hidden bg-gradient-to-br from-teal-900/10 via-white to-indigo-900/10 dark:from-slate-900 dark:via-slate-900 dark:to-indigo-950/20 border-teal-500/10 dark:border-slate-800">
            <div className="absolute top-2 right-2 p-1 bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400 rounded-full">
              <Sparkles size={16} className="animate-spin" style={{ animationDuration: '8s' }} />
            </div>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-5">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Zap size={18} className="text-teal-500" />
                  Gemini AI Wellness Assistant
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Tailored wellness prescriptions based on your activity and mood logs</p>
              </div>

              <button
                onClick={triggerAIGenerator}
                disabled={aiState.status === 'loading' || aiState.status === 'streaming'}
                className="btn btn-primary text-xs px-4 py-2 font-semibold shadow-sm flex items-center gap-1.5"
              >
                <Sparkles size={13} />
                {aiState.status === 'loading' ? 'Analyzing logs...' : aiState.status === 'streaming' ? 'Streaming...' : 'Ask AI Advice'}
              </button>
            </div>

            {/* AI Streaming Content Area */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/80 min-h-[140px] flex flex-col justify-between">

              {/* Idle State */}
              {aiState.status === 'idle' && (
                <div className="text-center py-6">
                  <Sparkles size={28} className="mx-auto text-teal-500/30 mb-2" />
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Click "Ask AI Advice" above to analyze your sleep, water, and task workload.
                  </p>
                </div>
              )}

              {/* Loading State */}
              {aiState.status === 'loading' && (
                <div className="space-y-2.5 py-4 animate-pulse">
                  <div className="h-3 w-3/4 bg-slate-300 dark:bg-slate-800 rounded"></div>
                  <div className="h-3 w-5/6 bg-slate-300 dark:bg-slate-800 rounded"></div>
                  <div className="h-3 w-2/3 bg-slate-300 dark:bg-slate-800 rounded"></div>
                </div>
              )}

              {/* Streaming and Success State */}
              {(aiState.status === 'streaming' || aiState.status === 'success') && (
                <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap font-mono">
                  {aiState.streamText}
                  {aiState.status === 'streaming' && <span className="inline-block w-2 h-4 bg-teal-500 animate-pulse ml-0.5" />}
                </div>
              )}

              {/* Suggestions quick indicators */}
              {aiState.status === 'success' && aiState.suggestions.length > 0 && (
                <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-wrap gap-2">
                  {aiState.suggestions.map((s, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-teal-500/10 text-teal-600 dark:text-teal-400"
                    >
                      💡 {s.message.split(':')[0]}
                    </span>
                  ))}
                </div>
              )}

            </div>
          </div>

          {/* Section 3: Priority Tasks & Today's Targets */}
          <div className="card">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50">Today's Priorities</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Important tasks requiring attention</p>
              </div>
              <button 
                onClick={() => navigate('/tasks')}
                className="btn btn-ghost text-xs text-teal-600 dark:text-teal-400 flex items-center gap-1 font-semibold"
              >
                View all tasks <ChevronRight size={14} />
              </button>
            </div>

            {pendingTasks.length > 0 ? (
              <div className="space-y-3">
                {pendingTasks.map(task => (
                  <div
                    key={task.id}
                    className="flex items-start justify-between p-3.5 bg-slate-50/60 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 rounded-xl hover:shadow-sm transition-all"
                  >
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => toggleTaskComplete(task.id)}
                        className="mt-0.5 focus:outline-none"
                      >
                        <Circle size={18} className="text-slate-400 hover:text-teal-500 transition-colors" />
                      </button>
                      <div>
                        <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100">{task.title}</h4>
                        {task.description && (
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">{task.description}</p>
                        )}
                        <div className="flex items-center gap-3 mt-1.5">
                          {task.dueDate && (
                            <span className="text-[10px] font-medium text-slate-400 flex items-center gap-1">
                              <Calendar size={11} /> {format(new Date(task.dueDate), 'MMM d, h:mm a')}
                            </span>
                          )}
                          {task.priority && (
                            <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded
                              ${task.priority === 'high' ? 'bg-rose-50 text-rose-600' : task.priority === 'medium' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'}
                            `}>
                              {task.priority}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-slate-50/40 dark:bg-slate-900/40 border border-dashed rounded-2xl">
                <CheckCircle2 size={32} className="mx-auto text-emerald-500/40 mb-2" />
                <p className="text-xs text-slate-500 dark:text-slate-400">All caught up! No high-priority pending tasks today.</p>
                <button onClick={() => navigate('/tasks')} className="mt-3 btn btn-outline py-1 px-3 text-xs">Create Task</button>
              </div>
            )}
          </div>

          {/* Section 4: Supervisor Announcements (Collapsible Feed) */}
          <div className="card bg-gradient-to-r from-teal-500/5 via-indigo-500/5 to-transparent border-teal-500/15">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                <Volume2 size={16} className="text-teal-600 dark:text-teal-400" />
                Supervisor Announcements
              </h2>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Supervisor Pinboard</span>
            </div>

            {announcements.length > 0 ? (
              <div className="space-y-4">
                {announcements.map((ann) => (
                  <div
                    key={ann.id}
                    className="p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl relative"
                  >
                    <button
                      onClick={() => dismissAnnouncement(ann.id)}
                      className="absolute top-3 right-3 text-xs font-bold text-slate-400 hover:text-rose-500"
                    >
                      Dismiss
                    </button>

                    <div className="flex items-center gap-3 mb-2.5">
                      <img
                        src={ann.authorAvatar}
                        alt={ann.author}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div>
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-100">{ann.author}</p>
                        <p className="text-[10px] text-teal-600 dark:text-teal-400 font-semibold">{ann.authorRole}</p>
                      </div>
                    </div>

                    <h3 className="text-xs font-bold text-slate-900 dark:text-slate-50 mb-1">{ann.title}</h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-1">{ann.content}</p>
                    <p className="text-[9px] text-slate-400">{format(new Date(ann.date), 'MMM d, yyyy h:mm a')}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 text-center py-4">No announcement notices from supervisors.</p>
            )}
          </div>

        </div>

        {/* Right Sidebar Columns (Span 1) */}
        <div className="space-y-8">

          {/* Wellness Insights Snapshot Gauge */}
          <div className="card">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-50 mb-4">Wellness Snapshot</h2>

            <div className="space-y-4">

              {/* Mood Average */}
              <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/10">
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">💛 Avg Mood (7d)</span>
                  <span className="font-bold text-amber-600 dark:text-amber-400">{averageMood ? averageMood.toFixed(1) : 'N/A'}/10</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full">
                  <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: `${(averageMood || 7) * 10}%` }}></div>
                </div>
              </div>

              {/* Sleep Average */}
              <div className="p-3 rounded-xl bg-indigo-500/5 border border-indigo-500/10">
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">🛌 Avg Sleep (7d)</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">{averageSleep ? averageSleep.toFixed(1) : 'N/A'} hrs</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full">
                  <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: `${((averageSleep || 7) / 10) * 100}%` }}></div>
                </div>
              </div>

              {/* Stress Average */}
              <div className="p-3 rounded-xl bg-rose-500/5 border border-rose-500/10">
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">⚡ Avg Stress (7d)</span>
                  <span className="font-bold text-rose-600 dark:text-rose-400">{averageStress ? averageStress.toFixed(1) : 'N/A'}/10</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full">
                  <div className="bg-rose-500 h-1.5 rounded-full" style={{ width: `${(averageStress || 4) * 10}%` }}></div>
                </div>
              </div>

            </div>
          </div>

          {/* Realtime Connection Peer Feed */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-50 flex items-center gap-1.5">
                <Activity size={16} className="text-emerald-500" />
                Live Collaboration Feed
              </h2>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </div>

            <div className="space-y-4">
              {activityEvents.slice(0, 5).map((event) => (
                <div
                  key={event.id}
                  className="flex items-start gap-2.5 text-xs border-b border-slate-50 dark:border-slate-800/60 pb-3 last:border-0 last:pb-0"
                >
                  <img
                    src={event.userAvatar}
                    alt={event.userName}
                    className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-100"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-slate-800 dark:text-slate-100">
                      {event.userName}
                    </p>
                    <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
                      {event.detail}
                    </p>
                    <span className="text-[9px] text-slate-400 block mt-0.5">
                      {format(new Date(event.timestamp), 'h:mm a')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Achievements, Wellness Streaks & Badges */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-50 flex items-center gap-1.5">
                <Award size={16} className="text-amber-500" />
                Wellness Badges
              </h2>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Level 2</span>
            </div>

            <div className="space-y-3.5">
              {achievements.slice(0, 3).map((ach) => {
                const percent = Math.round((ach.progress / ach.target) * 100);
                const isUnlocked = percent >= 100;

                return (
                  <div
                    key={ach.id}
                    className={`p-3 rounded-2xl border transition-all duration-300
                      ${isUnlocked
                        ? 'bg-gradient-to-br from-amber-500/5 to-teal-500/5 border-amber-500/20 shadow-sm'
                        : 'bg-slate-50/50 dark:bg-slate-900/50 border-slate-100 dark:border-slate-800/80'
                      }
                    `}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`p-2 rounded-xl text-xs font-bold
                        ${isUnlocked ? 'bg-amber-100 text-amber-600' : 'bg-slate-200 text-slate-500 dark:bg-slate-800 dark:text-slate-400'}
                      `}>
                        {ach.iconName === 'streak' ? '🔥' : ach.iconName === 'sleep' ? '💤' : ach.iconName === 'water' ? '💧' : '🎯'}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center">
                          <p className={`text-xs font-bold ${isUnlocked ? 'text-slate-900 dark:text-slate-100' : 'text-slate-500'}`}>
                            {ach.title}
                          </p>
                          {isUnlocked && (
                            <span className="text-[9px] font-extrabold uppercase tracking-widest bg-amber-100 text-amber-700 px-1 py-0.2 rounded">
                              Unlocked
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-normal mt-0.5">
                          {ach.description}
                        </p>

                        <div className="mt-2 flex items-center gap-2">
                          <div className="flex-1 h-1 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div className="bg-teal-500 h-1 rounded-full" style={{ width: `${percent}%` }}></div>
                          </div>
                          <span className="text-[9px] font-bold text-slate-400">
                            {ach.progress}/{ach.target}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Team Wellbeing Snapshot compares departments */}
          <div className="card">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-3.5">Team Benchmark</h2>

            <div className="space-y-3">
              {departmentStats.map((dept, index) => (
                <div key={index} className="text-xs space-y-1.5">
                  <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                    <span className="font-semibold">{dept.name}</span>
                    <span className="font-bold text-teal-600 dark:text-teal-400">{dept.avgMood} ★</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-1 rounded-full overflow-hidden">
                    <div className="bg-teal-500 h-1 rounded-full" style={{ width: `${dept.taskCompletion}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default Dashboard;