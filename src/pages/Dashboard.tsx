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
  Volume2,
  Check,
  ChevronDown
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { format } from 'date-fns';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { 
    tasks, 
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
    activityEvents,
    announcements,
    dismissAnnouncement,
    achievements,
    aiState,
    triggerAIGenerator
  } = useApp();
  
  // Custom interactive check-in states
  const [selectedMood, setSelectedMood] = useState<number>(8);
  const [selectedSleep, setSelectedSleep] = useState<number>(7.5);
  const [selectedWater, setSelectedWater] = useState<number>(6);
  const [selectedEnergy, setSelectedEnergy] = useState<number>(7);
  const [selectedStress, setSelectedStress] = useState<number>(3);
  const [mindJournalNotes, setMindJournalNotes] = useState('');
  const [activeCheckInTab, setActiveCheckInTab] = useState<'mood' | 'stats'>('mood');
  const [showLogCelebration, setShowLogCelebration] = useState(false);

  // Quick state logger handler
  const handlePerformCheckIn = (e: React.FormEvent) => {
    e.preventDefault();
    addMoodEntry({
      score: selectedMood,
      notes: mindJournalNotes.trim() || undefined,
      factors: ['Rest', 'Water Intake', 'Energy Scale'],
    });
    addHealthData({
      sleepHours: selectedSleep,
      waterIntake: selectedWater,
      stressLevel: selectedStress,
    });
    setMindJournalNotes('');
    setShowLogCelebration(true);
    setTimeout(() => setShowLogCelebration(false), 3000);
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

  // Key metrics calculations for storytelling
  const completedTasksCount = getCompletedTasksCount(7);
  const averageMood = getAverageMood(7) || 7.4;
  const averageSleep = getAverageSleep(7) || 7.1;
  const averageStress = getStressLevelAverage(7) || 3.8;

  // Filter pending tasks
  const pendingTasks = tasks.filter(task => !task.completed).slice(0, 3);

  // Emojis mapping
  const moodEmojis = ['😫', '😔', '😐', '😐', '🙂', '🙂', '😄', '😄', '🌟', '👑'];

  return (
    <div className="space-y-12 animate-fade-in pb-16">
      
      {/* 1. MORNING GREETING SECTION */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles size={14} className="text-stone-400 dark:text-zinc-500 animate-pulse-light" />
          <span className="text-[10px] font-mono tracking-widest text-stone-400 dark:text-zinc-500 uppercase">
            Personal Pulse
          </span>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-1">
            <h1 className="text-4xl md:text-5xl font-light tracking-tight text-stone-900 dark:text-white font-serif">
              {getGreeting()}, Clive
            </h1>
            <p className="text-stone-400 dark:text-zinc-400 text-sm font-light">
              Today is looking great. You are currently on a <span className="font-semibold text-stone-800 dark:text-zinc-200">{moodEntries.length || 3}-day streak</span>.
            </p>
          </div>

          {/* Symmetrical Well-being summary values with no boxes */}
          <div className="flex flex-wrap gap-x-8 gap-y-3 text-xs font-light text-stone-500 dark:text-zinc-400">
            <div className="space-y-0.5">
              <p className="text-[10px] uppercase tracking-wider text-stone-400 dark:text-zinc-500 font-medium">Priorities</p>
              <p className="text-sm font-semibold text-stone-800 dark:text-zinc-200">{pendingTasks.length} pending</p>
            </div>
            <div className="space-y-0.5">
              <p className="text-[10px] uppercase tracking-wider text-stone-400 dark:text-zinc-500 font-medium">Average Mood</p>
              <p className="text-sm font-semibold text-stone-800 dark:text-zinc-200">
                {averageMood.toFixed(1)} / 10 <span className="text-emerald-600 font-mono ml-1">↑ 8%</span>
              </p>
            </div>
            <div className="space-y-0.5">
              <p className="text-[10px] uppercase tracking-wider text-stone-400 dark:text-zinc-500 font-medium">Stress Index</p>
              <p className="text-sm font-semibold text-stone-800 dark:text-zinc-200">
                {averageStress.toFixed(1)} <span className="text-emerald-600 font-mono ml-1">↓ 12%</span>
              </p>
            </div>
          </div>
        </div>

        {/* Minimal inline log toast */}
        {showLogCelebration && (
          <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-neutral-900 text-stone-850 dark:text-zinc-200 text-xs flex items-center gap-2 border border-stone-200/40 dark:border-neutral-800/80 animate-fade-in">
            <CheckCircle2 size={15} className="text-emerald-500" />
            <span>Check-In saved. You have completed your wellness log for today!</span>
          </div>
        )}
      </div>

      <div className="divider-premium" />

      {/* 2. TODAY'S FOCUS & QUICK ACTION HUB (60% / 40% Desktop Split) */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">

        {/* Today's Focus Backlog (Left 60%) */}
        <div className="lg:col-span-3 space-y-6">
          <div className="space-y-1">
            <h2 className="text-lg font-medium text-stone-800 dark:text-zinc-100 font-serif">Today's Focus</h2>
            <p className="text-xs text-stone-400 dark:text-zinc-400 font-light">
              A minimalist guide to keeping things clear. Focus on completing these targets.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            {pendingTasks.length > 0 ? (
              pendingTasks.map(task => (
                <div
                  key={task.id}
                  onClick={() => toggleTaskComplete(task.id)}
                  className="group flex items-center justify-between py-3.5 px-1 border-b border-stone-100 dark:border-neutral-800/60 cursor-pointer select-none transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-5 h-5 rounded-full border border-stone-300 dark:border-neutral-700 flex items-center justify-center transition-all group-hover:border-stone-500">
                      <div className="w-2.5 h-2.5 rounded-full bg-stone-800 dark:bg-zinc-200 opacity-0 group-hover:opacity-40 transition-opacity" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-stone-800 dark:text-zinc-200 group-hover:text-stone-950 dark:group-hover:text-white transition-colors">
                        {task.title}
                      </p>
                      {task.description && (
                        <p className="text-[11px] text-stone-400 dark:text-zinc-500 mt-0.5 font-light">{task.description}</p>
                      )}
                    </div>
                  </div>

                  <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded
                    ${task.priority === 'high' ? 'text-rose-500/80 bg-rose-500/5' : task.priority === 'medium' ? 'text-amber-600/80 bg-amber-500/5' : 'text-emerald-600/80 bg-emerald-500/5'}
                  `}>
                    {task.priority}
                  </span>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-xs text-stone-400 dark:text-zinc-500 font-light">
                No priorities logged. Select a command in the search panel or Settings.
              </div>
            )}

            <button
              onClick={() => navigate('/tasks')}
              className="mt-2 text-xs font-semibold text-stone-500 hover:text-stone-800 dark:hover:text-zinc-300 inline-flex items-center gap-1.5 transition-all"
            >
              Configure task backlog <ChevronRight size={14} />
            </button>
          </div>
        </div>

        {/* Quick Actions & Tactile Check-In Panel (Right 40%) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="space-y-1">
            <h2 className="text-lg font-medium text-stone-800 dark:text-zinc-100 font-serif">Quick Check-In</h2>
            <p className="text-xs text-stone-400 dark:text-zinc-400 font-light">
              Tactile, responsive controls to keep track of your daily state.
            </p>
          </div>

          <form onSubmit={handlePerformCheckIn} className="space-y-6 pt-2">

            {/* Elegant Emoji Selector Row (Mood Check-in) */}
            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-stone-400 dark:text-zinc-500 uppercase tracking-widest">
                Current Mood
              </label>
              <div className="flex justify-between items-center gap-1 bg-stone-100/40 dark:bg-neutral-900/40 p-1.5 rounded-xl border border-stone-200/20 dark:border-neutral-800/40">
                {Array.from({ length: 5 }).map((_, idx) => {
                  const score = (idx * 2) + 2; // scale of 2, 4, 6, 8, 10
                  const emojis = ['😫', '😔', '😐', '🙂', '😄'];
                  const isActive = selectedMood >= score - 1 && selectedMood <= score;
                  return (
                    <button
                      key={score}
                      type="button"
                      onClick={() => setSelectedMood(score)}
                      className={`flex-1 flex flex-col items-center py-2.5 rounded-lg text-lg transition-all duration-300
                        ${isActive
                          ? 'bg-white dark:bg-neutral-800 shadow-sm scale-105 border border-stone-200/50 dark:border-zinc-700/50'
                          : 'opacity-40 hover:opacity-100 hover:scale-105'}
                      `}
                    >
                      <span>{emojis[idx]}</span>
                      <span className="text-[9px] font-bold mt-1 text-stone-500 dark:text-zinc-400">
                        {score === 2 ? 'Poor' : score === 4 ? 'Neutral' : score === 6 ? 'Good' : score === 8 ? 'Great' : 'Perfect'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Segmented Selector for Sleep duration */}
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-bold text-stone-400 dark:text-zinc-500 uppercase tracking-widest">
                <span>Sleep duration</span>
                <span className="text-stone-700 dark:text-zinc-300 font-semibold lowercase">{selectedSleep} hours</span>
              </div>
              <div className="flex gap-1.5">
                {[5, 6, 7, 8, 9].map((hours) => (
                  <button
                    key={hours}
                    type="button"
                    onClick={() => setSelectedSleep(hours)}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all border
                      ${selectedSleep === hours
                        ? 'bg-stone-900 dark:bg-zinc-200 text-white dark:text-stone-950 border-stone-900 dark:border-zinc-200 shadow-sm'
                        : 'bg-transparent text-stone-500 border-stone-200/50 dark:border-neutral-800 hover:bg-stone-50 dark:hover:bg-neutral-850'
                      }
                    `}
                  >
                    {hours}h
                  </button>
                ))}
              </div>
            </div>

            {/* Micro-chip interactive grid for Water intake */}
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-bold text-stone-400 dark:text-zinc-500 uppercase tracking-widest">
                <span>Hydration</span>
                <span className="text-stone-700 dark:text-zinc-300 font-semibold">{selectedWater} Glasses</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {[4, 6, 8, 10].map((glasses) => (
                  <button
                    key={glasses}
                    type="button"
                    onClick={() => setSelectedWater(glasses)}
                    className={`px-3 py-1 text-xs font-medium rounded-full transition-all border
                      ${selectedWater === glasses
                        ? 'bg-stone-100 dark:bg-neutral-800 text-stone-900 dark:text-white border-stone-300 dark:border-zinc-700 shadow-sm'
                        : 'bg-transparent text-stone-500 border-stone-200/50 dark:border-neutral-800 hover:bg-stone-50'
                      }
                    `}
                  >
                    {glasses} glasses
                  </button>
                ))}
              </div>
            </div>

            {/* Interactive sliders or animated nodes for Stress indicators */}
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-bold text-stone-400 dark:text-zinc-500 uppercase tracking-widest">
                <span>Stress index</span>
                <span className="text-stone-700 dark:text-zinc-300 font-semibold">{selectedStress} / 10</span>
              </div>
              <div className="grid grid-cols-5 gap-1.5">
                {[2, 4, 6, 8, 10].map((stressVal) => (
                  <button
                    key={stressVal}
                    type="button"
                    onClick={() => setSelectedStress(stressVal)}
                    className={`py-2 rounded-lg text-[10px] font-bold transition-all border
                      ${selectedStress === stressVal
                        ? 'bg-rose-500/10 text-rose-600 border-rose-500/30'
                        : 'bg-transparent text-stone-400 border-stone-200/50 dark:border-neutral-800 hover:bg-stone-50'
                      }
                    `}
                  >
                    {stressVal}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-stone-400 dark:text-zinc-500 uppercase tracking-widest mb-1.5">
                Mind notes
              </label>
              <input
                type="text"
                value={mindJournalNotes}
                onChange={e => setMindJournalNotes(e.target.value)}
                placeholder="Had a quiet morning review, feel focused..."
                className="input-premium w-full text-xs py-2"
              />
            </div>

            <button type="submit" className="btn-premium btn-premium-primary w-full py-2.5 font-semibold">
              <Check size={14} /> Save Check-In & Stats
            </button>
          </form>
        </div>

      </div>

      <div className="divider-premium" />

      {/* 3. SIGNATURE STORY MOOD JOURNEY (Full Width Wave/Timeline) */}
      <div className="space-y-6">
        <div className="space-y-1">
          <h2 className="text-lg font-medium text-stone-800 dark:text-zinc-100 font-serif">Mood Journey</h2>
          <p className="text-xs text-stone-400 dark:text-zinc-400 font-light">
            Your wellness path over the past week. Hover over the journey points to reveal your emotional logs.
          </p>
        </div>

        {/* Handcrafted Organic Curve & Interactive Story nodes */}
        <div className="p-6 bg-stone-100/30 dark:bg-neutral-900/30 border border-stone-200/10 dark:border-neutral-800/40 rounded-2xl relative min-h-[220px] flex flex-col justify-end">

          {/* Symmetrical Wave Line Representation using actual mood entries or seed data */}
          {moodEntries.length > 0 ? (
            <div className="flex justify-between items-end h-32 relative px-4">

              {/* Vertical scales */}
              <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-[9px] font-bold text-stone-400 dark:text-zinc-500 select-none">
                <span>Optimized</span>
                <span>Steady</span>
                <span>Challenging</span>
              </div>

              {/* Loop and draw organic nodes with horizontal guide lines */}
              <div className="flex-grow flex justify-around items-end h-full ml-12">
                {moodEntries.slice(-7).map((entry, index) => {
                  const score = entry.score;
                  const percent = Math.min(Math.max(score * 10, 10), 90);
                  const emojisList = ['😫', '😔', '😐', '🙂', '😄'];
                  const emoji = emojisList[Math.floor((score - 1) / 2)] || '🙂';

                  return (
                    <div key={entry.id} className="flex flex-col items-center group relative cursor-pointer">

                      {/* Hover reveal popup card */}
                      <div className="absolute bottom-full mb-3 scale-0 group-hover:scale-100 origin-bottom transition-all duration-200 bg-stone-900 text-white text-[10px] p-3 rounded-xl shadow-xl w-48 border border-neutral-800 z-40">
                        <p className="font-bold">Check-In Rating {score}/10</p>
                        <p className="text-stone-400 text-[9px] mt-0.5">{format(new Date(entry.date), 'MMM d, h:mm a')}</p>
                        {entry.notes && (
                          <p className="text-stone-200 font-serif italic mt-1.5 pt-1.5 border-t border-neutral-800 leading-normal">
                            "{entry.notes}"
                          </p>
                        )}
                      </div>

                      {/* Calming visual vertical trace */}
                      <div className="w-0.5 bg-dashed border-r border-stone-200/50 dark:border-neutral-800 h-28 absolute bottom-4 -z-10" />

                      {/* Animated circular timeline connector dot */}
                      <div
                        className="w-10 h-10 rounded-full bg-white dark:bg-neutral-800 border border-stone-200 dark:border-neutral-700/80 shadow-sm flex items-center justify-center transition-all group-hover:scale-110 active:scale-95 select-none"
                        style={{ marginBottom: `${percent - 10}px` }}
                      >
                        <span className="text-sm">{emoji}</span>
                      </div>

                      <span className="text-[10px] font-semibold text-stone-500 mt-2">
                        {format(new Date(entry.date), 'EEE')}
                      </span>
                    </div>
                  );
                })}
              </div>

            </div>
          ) : (
            <div className="text-center py-10 flex flex-col items-center justify-center">
              <Heart size={28} className="text-stone-300 dark:text-neutral-700 animate-pulse-light mb-3" />
              <p className="text-xs text-stone-400 dark:text-zinc-500 font-light">
                No check-in logs recorded. Submit a Quick Check-In on the right to populate your timeline!
              </p>
            </div>
          )}

        </div>
      </div>

      <div className="divider-premium" />

      {/* 4. AI WELLNESS COACH CONVERSATIONAL ADVISOR */}
      <div className="space-y-6">
        <div className="space-y-1">
          <h2 className="text-lg font-medium text-stone-800 dark:text-zinc-100 font-serif">AI Care Coach</h2>
          <p className="text-xs text-stone-400 dark:text-zinc-400 font-light">
            Generates personalized lifestyle recommendations based on your sleep, stress, and log data.
          </p>
        </div>

        <div className="rounded-2xl p-6 bg-[#3b5249]/[0.03] dark:bg-[#5c7f6f]/[0.02] border border-[#3b5249]/10 dark:border-[#5c7f6f]/20 flex flex-col md:flex-row justify-between gap-6 items-start md:items-center">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-[#3b5249]/10 text-[#3b5249] dark:text-[#7fa89f] mt-1">
              <Sparkles size={18} className="animate-spin" style={{ animationDuration: '8s' }} />
            </div>
            <div className="space-y-1 max-w-xl">
              <p className="text-xs font-bold text-[#3b5249] dark:text-[#7fa89f] uppercase tracking-widest">Counselor Report</p>

              {/* Dynamic typing simulation message */}
              {aiState.status === 'idle' && (
                <p className="text-sm text-stone-600 dark:text-zinc-300 font-serif italic">
                  "Based on your week, you're doing well. Take a short walk after lunch."
                </p>
              )}
              {aiState.status === 'loading' && (
                <p className="text-xs text-stone-400 animate-pulse">Analyzing stats, crafting recommendations...</p>
              )}
              {(aiState.status === 'streaming' || aiState.status === 'success') && (
                <p className="text-xs text-stone-700 dark:text-zinc-300 leading-relaxed font-mono whitespace-pre-wrap">
                  {aiState.streamText}
                </p>
              )}
            </div>
          </div>

          <button
            onClick={triggerAIGenerator}
            disabled={aiState.status === 'loading' || aiState.status === 'streaming'}
            className="btn-premium btn-premium-primary whitespace-nowrap"
          >
            <Sparkles size={13} /> Ask Coach
          </button>
        </div>
      </div>

      <div className="divider-premium" />

      {/* 5. RECENT CO-WORKING ACTIVITIES & UPCOMING (60% / 40%) */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">

        {/* Live co-working collaboration feed */}
        <div className="lg:col-span-3 space-y-6">
          <div className="space-y-1">
            <h2 className="text-lg font-medium text-stone-800 dark:text-zinc-100 font-serif">Recent Activity</h2>
            <p className="text-xs text-stone-400 dark:text-zinc-400 font-light">
              Collaborative presence feed. Connect and share goals with other team interns.
            </p>
          </div>

          <div className="space-y-4 pt-2">
            {activityEvents.slice(0, 4).map((event) => (
              <div
                key={event.id}
                className="flex items-start gap-3.5 pb-4 border-b border-stone-100 dark:border-neutral-800/60 last:border-0"
              >
                <img
                  src={event.userAvatar}
                  alt={event.userName}
                  className="w-7 h-7 rounded-full object-cover ring-1 ring-stone-200/50"
                />
                <div className="flex-grow">
                  <p className="text-xs text-stone-800 dark:text-zinc-200">
                    <span className="font-semibold text-stone-900 dark:text-white mr-1">{event.userName}</span>
                    <span className="text-stone-500 dark:text-zinc-400">{event.detail}</span>
                  </p>
                  <span className="text-[9px] text-stone-400 dark:text-zinc-500 mt-1 block">
                    {format(new Date(event.timestamp), 'h:mm a')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Supervisor announcements & Upcoming pinboard */}
        <div className="lg:col-span-2 space-y-6">
          <div className="space-y-1">
            <h2 className="text-lg font-medium text-stone-800 dark:text-zinc-100 font-serif">Upcoming & Announcements</h2>
            <p className="text-xs text-stone-400 dark:text-zinc-400 font-light">
              Supervisor pinned bulletins, midterm deadlines, and seminars.
            </p>
          </div>

          <div className="space-y-4 pt-2">
            {announcements.length > 0 ? (
              announcements.map((ann) => (
                <div
                  key={ann.id}
                  className="p-4 bg-stone-50/50 dark:bg-neutral-900/40 rounded-xl border border-stone-200/10 dark:border-neutral-800/40 relative"
                >
                  <button
                    onClick={() => dismissAnnouncement(ann.id)}
                    className="absolute top-2.5 right-3 text-[10px] font-bold text-stone-400 hover:text-rose-500"
                  >
                    Dismiss
                  </button>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-stone-400 dark:text-zinc-500 mb-1">
                    {ann.author} · {ann.authorRole}
                  </p>
                  <h4 className="text-xs font-bold text-stone-900 dark:text-white mb-1">{ann.title}</h4>
                  <p className="text-xs text-stone-600 dark:text-zinc-300 leading-relaxed font-light">{ann.content}</p>
                </div>
              ))
            ) : (
              <p className="text-xs text-stone-400 text-center py-4">No outstanding announcements pinned.</p>
            )}
          </div>
        </div>

      </div>

      <div className="divider-premium" />

      {/* 6. WEEKLY STORYTELLING REFLECTION LETTER */}
      <div className="space-y-6">
        <div className="space-y-1">
          <h2 className="text-lg font-medium text-stone-800 dark:text-zinc-100 font-serif">Weekly Reflection</h2>
          <p className="text-xs text-stone-400 dark:text-zinc-400 font-light">
            A narrative summary of your overall wellbeing over the past week.
          </p>
        </div>

        <div className="p-6 bg-stone-100/10 dark:bg-neutral-950/20 border border-stone-200/10 dark:border-neutral-800/60 rounded-2xl font-serif text-sm leading-relaxed text-stone-700 dark:text-zinc-300 space-y-4 max-w-4xl">
          <p>
            "Over the past week, you have consistently improved your emotional wellness. Wednesday stood out as your most positive day, marked by an excellent mood log score of {averageMood.toFixed(1)}/10. Your sleep parameters are beginning to stabilize, showing that your focus and cognitive fatigue scores perform best when maintaining an average rest cycle of at least 7.5 hours."
          </p>
          <p className="text-xs font-mono font-medium text-stone-500 uppercase tracking-wider">
            Recommendation: Prioritize sticking to your current water targets to preserve physical energy.
          </p>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
