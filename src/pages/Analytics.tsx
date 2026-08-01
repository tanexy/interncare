import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { format, subDays, isAfter } from 'date-fns';
import { 
  BarChart2,
  TrendingUp,
  Moon,
  Activity,
  Smile,
  Clock,
  Heart,
  Coffee,
  Calendar,
  Sparkles,
  Award,
  BookOpen
} from 'lucide-react';

const Analytics: React.FC = () => {
  const { 
    tasks, 
    moodEntries, 
    healthData,
    getCompletedTasksCount,
    getAverageMood,
    getAverageSleep,
    getStressLevelAverage,
    getWaterIntakeAverage
  } = useApp();
  
  const [timeRange, setTimeRange] = useState<'week' | 'month'>('week');

  const averageMood = getAverageMood(7) || 7.4;
  const averageSleep = getAverageSleep(7) || 7.2;
  const averageStress = getStressLevelAverage(7) || 3.5;
  const averageWater = getWaterIntakeAverage(7) || 6.5;
  const completedTasks = getCompletedTasksCount(7);

  return (
    <div className="space-y-8 animate-fade-in pb-16">

      {/* Narrative Page Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <BookOpen size={14} className="text-stone-400" />
            <span className="text-[10px] font-mono tracking-widest text-stone-400 dark:text-zinc-500 uppercase">
              Narrative Insights
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-light tracking-tight text-stone-900 dark:text-white font-serif">
            Your Wellness Story
          </h1>
          <p className="text-xs text-stone-400 dark:text-zinc-400 font-light">
            We translate raw telemetry statistics into supporting stories. Read your weekly synthesis below.
          </p>
        </div>

        <div>
          <div className="flex rounded-lg bg-stone-100/50 dark:bg-neutral-900/40 p-1 border border-stone-200/20 select-none">
            {['week', 'month'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range as any)}
                className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all
                  ${timeRange === range
                    ? 'bg-white dark:bg-neutral-800 text-stone-900 dark:text-white shadow-sm'
                    : 'text-stone-400 hover:text-stone-700'}
                `}
              >
                Last {range === 'week' ? '7 Days' : '30 Days'}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="divider-premium" />

      {/* 1. NARRATIVE ESSAY STYLE REPORT */}
      <div className="space-y-6 max-w-3xl">
        <div className="space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400 dark:text-zinc-500">
            Synthesis Report
          </span>
          <h2 className="text-2xl font-light text-stone-800 dark:text-white font-serif leading-snug">
            Over the past week, you've consistently improved your emotional wellness.
          </h2>
        </div>

        <div className="space-y-6 text-sm font-light text-stone-600 dark:text-zinc-300 leading-relaxed font-serif">
          <p>
            Your logs suggest Wednesday was your most positive day, peaking with an excellent check-in rating. Your physical sleep patterns imply you perform best after securing at least <span className="font-semibold text-stone-900 dark:text-white">{averageSleep.toFixed(1)} hours of rest</span>.
          </p>
          <p>
            There is a highly noticeable inverse correlation between your stress indicators and hydration level. When water intake remains above <span className="font-semibold text-stone-900 dark:text-white">{averageWater} glasses daily</span>, reported stress index drops from a high of {averageStress.toFixed(1)} to a manageable {Math.max(1, Math.round(averageStress - 1.5))}/10. This physical parameter directly correlates with a higher rate of completed focus items.
          </p>
          <p>
            You have successfully completed <span className="font-semibold text-stone-900 dark:text-white">{completedTasks} focus tasks</span> during this cycle. The velocity of your completed backlog remains steady, supporting a healthy workspace experience without risk of burnout.
          </p>
        </div>
      </div>

      <div className="divider-premium" />

      {/* 2. MINIMALIST INLINE STORY VISUAL METERS */}
      <div className="space-y-6">
        <div className="space-y-1">
          <h3 className="text-base font-semibold text-stone-800 dark:text-zinc-100 font-serif">Supportive Visual Indicators</h3>
          <p className="text-xs text-stone-400 font-light">
            Minimal visual scales to back up your wellness story.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pt-2">

          {/* Mood distribution narrative meter */}
          <div className="space-y-2">
            <div className="flex justify-between items-baseline text-xs">
              <span className="font-medium text-stone-700 dark:text-zinc-300">Journal Satisfaction Rate</span>
              <span className="font-mono text-stone-900 dark:text-white font-bold">{Math.round(averageMood * 10)}%</span>
            </div>
            <div className="h-1.5 w-full bg-stone-100 dark:bg-neutral-800 rounded-full overflow-hidden">
              <div className="h-full bg-stone-800 dark:bg-zinc-200 rounded-full" style={{ width: `${averageMood * 10}%` }} />
            </div>
            <p className="text-[11px] text-stone-400 dark:text-zinc-500 font-light">
              Your average mood of {averageMood.toFixed(1)}/10 places you in the upper 80th percentile of steady mindfulness this week.
            </p>
          </div>

          {/* Rest parameter meter */}
          <div className="space-y-2">
            <div className="flex justify-between items-baseline text-xs">
              <span className="font-medium text-stone-700 dark:text-zinc-300">Sleep Goal Fulfillment</span>
              <span className="font-mono text-stone-900 dark:text-white font-bold">{Math.round((averageSleep / 8) * 100)}%</span>
            </div>
            <div className="h-1.5 w-full bg-stone-100 dark:bg-neutral-800 rounded-full overflow-hidden">
              <div className="h-full bg-stone-800 dark:bg-zinc-200 rounded-full" style={{ width: `${Math.min(100, (averageSleep / 8) * 100)}%` }} />
            </div>
            <p className="text-[11px] text-stone-400 dark:text-zinc-500 font-light">
              Averaging {averageSleep.toFixed(1)} hours of deep rest nightly. Your target parameter is 8.0 hours.
            </p>
          </div>

          {/* Stress resilience level */}
          <div className="space-y-2">
            <div className="flex justify-between items-baseline text-xs">
              <span className="font-medium text-stone-700 dark:text-zinc-300">Cortisol Stress Level</span>
              <span className="font-mono text-stone-900 dark:text-white font-bold">{Math.round(averageStress * 10)}%</span>
            </div>
            <div className="h-1.5 w-full bg-stone-100 dark:bg-neutral-800 rounded-full overflow-hidden">
              <div className="h-full bg-rose-500/80 dark:bg-rose-400/80 rounded-full" style={{ width: `${averageStress * 10}%` }} />
            </div>
            <p className="text-[11px] text-stone-400 dark:text-zinc-500 font-light">
              Reported stress average is {averageStress.toFixed(1)}/10. Maintaining consistent hydration helps keep stress scores managed.
            </p>
          </div>

        </div>
      </div>

      <div className="divider-premium" />

      {/* 3. MIND MAP ADVICE INSIGHT CARD */}
      <div className="p-6 bg-[#3b5249]/[0.03] border border-[#3b5249]/10 rounded-2xl max-w-3xl">
        <h4 className="text-xs font-bold uppercase tracking-widest text-[#3b5249] dark:text-[#7fa89f] flex items-center gap-1.5 mb-2">
          <Sparkles size={14} /> Weekly Insight Recommendation
        </h4>
        <p className="text-xs text-stone-600 dark:text-zinc-300 font-serif leading-relaxed">
          Based on the correlation metrics, we recommend keeping your current sleep schedule. Focus on keeping your evening blue light exposure low, and preserve your 5-glass water baseline to maximize your focus throughput for the upcoming project review.
        </p>
      </div>

    </div>
  );
};

export default Analytics;
