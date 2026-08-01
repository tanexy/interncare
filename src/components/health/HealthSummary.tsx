import React from 'react';
import { HealthData } from '../../types';
import { format } from 'date-fns';
import { 
  Coffee, 
  Dumbbell, 
  Moon,
  Heart,
  Calendar,
  Apple
} from 'lucide-react';

interface HealthSummaryProps {
  health: HealthData;
}

const HealthSummary: React.FC<HealthSummaryProps> = ({ health }) => {
  return (
    <div className="p-4 rounded-2xl border bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 shadow-sm transition-all duration-300 hover:shadow-md animate-fade-in">

      {/* Date Header */}
      <div className="flex justify-between items-center pb-2 border-b border-slate-50 dark:border-slate-800/60 mb-3.5">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
          <Calendar size={12} /> Health Log
        </h3>
        <span className="text-[10px] text-slate-400 font-semibold bg-slate-50 dark:bg-slate-950 px-2 py-0.5 rounded-full border border-slate-100 dark:border-slate-850">
          {format(new Date(health.date), 'MMM d, h:mm a')}
        </span>
      </div>
      
      {/* 4-Column Grid for Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">

        {/* Sleep Hours */}
        <div className="flex items-center gap-2.5 p-2 bg-slate-50/50 dark:bg-slate-950/40 rounded-xl border border-slate-100/40 dark:border-slate-850/40">
          <div className="p-1.5 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-500 rounded-lg">
            <Moon size={15} />
          </div>
          <div>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Sleep</p>
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{health.sleepHours} hrs</p>
          </div>
        </div>
        
        {/* Water Intake */}
        <div className="flex items-center gap-2.5 p-2 bg-slate-50/50 dark:bg-slate-950/40 rounded-xl border border-slate-100/40 dark:border-slate-850/40">
          <div className="p-1.5 bg-blue-50 dark:bg-blue-950/40 text-blue-500 rounded-lg">
            <Coffee size={15} />
          </div>
          <div>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Hydration</p>
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{health.waterIntake} gl</p>
          </div>
        </div>
        
        {/* Stress Level */}
        <div className="flex items-center gap-2.5 p-2 bg-slate-50/50 dark:bg-slate-950/40 rounded-xl border border-slate-100/40 dark:border-slate-850/40">
          <div className="p-1.5 bg-rose-50 dark:bg-rose-950/40 text-rose-500 rounded-lg">
            <Heart size={15} />
          </div>
          <div>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Stress</p>
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{health.stressLevel}/10</p>
          </div>
        </div>
        
        {/* Exercise Indicator (Optional, falls back to Nourishment or similar) */}
        {health.exercise ? (
          <div className="flex items-center gap-2.5 p-2 bg-slate-50/50 dark:bg-slate-950/40 rounded-xl border border-slate-100/40 dark:border-slate-850/40">
            <div className="p-1.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500 rounded-lg">
              <Dumbbell size={15} />
            </div>
            <div>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Exercise</p>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{health.exercise.minutes}m {health.exercise.type ? `(${health.exercise.type})` : ''}</p>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2.5 p-2 bg-slate-50/50 dark:bg-slate-950/40 rounded-xl border border-slate-100/40 dark:border-slate-850/40 opacity-60">
            <div className="p-1.5 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-lg">
              <Dumbbell size={15} />
            </div>
            <div>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Exercise</p>
              <p className="text-xs font-bold text-slate-400 dark:text-slate-500">None logged</p>
            </div>
          </div>
        )}
      </div>

      {/* Meals Summary (Optional) */}
      {health.meals && (
        <div className="mt-3 flex items-center gap-1.5 text-[10px] font-bold text-slate-500 border-t border-slate-50 dark:border-slate-800/40 pt-2.5">
          <Apple size={12} className="text-amber-500" />
          <span>Nourishment logged:</span>
          {health.meals.breakfast && <span className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.2 rounded text-[9px]">Breakfast</span>}
          {health.meals.lunch && <span className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.2 rounded text-[9px]">Lunch</span>}
          {health.meals.dinner && <span className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.2 rounded text-[9px]">Dinner</span>}
          {health.meals.snacks > 0 && <span className="text-slate-400">({health.meals.snacks} snack{health.meals.snacks > 1 ? 's' : ''})</span>}
        </div>
      )}
      
      {/* Notes */}
      {health.notes && (
        <p className="mt-3 text-xs text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-950/40 p-2 rounded-xl border border-slate-100 dark:border-slate-850/60 leading-relaxed italic">
          "{health.notes}"
        </p>
      )}
    </div>
  );
};

export default HealthSummary;