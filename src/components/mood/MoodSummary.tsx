import React from 'react';
import { MoodEntry } from '../../types';
import { format } from 'date-fns';
import { Sparkles, Calendar, Clock, Smile, AlertCircle } from 'lucide-react';

interface MoodSummaryProps {
  mood: MoodEntry;
}

const MoodSummary: React.FC<MoodSummaryProps> = ({ mood }) => {
  const getMoodEmoji = () => {
    if (mood.score >= 9) return '😄';
    if (mood.score >= 7) return '🙂';
    if (mood.score >= 5) return '😐';
    if (mood.score >= 3) return '😔';
    return '😫';
  };
  
  const getMoodText = () => {
    if (mood.score >= 9) return 'Incredible';
    if (mood.score >= 7) return 'Good / Content';
    if (mood.score >= 5) return 'Neutral';
    if (mood.score >= 3) return 'Not Great';
    return 'Poor';
  };
  
  const getMoodColors = () => {
    if (mood.score >= 8) return 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/10';
    if (mood.score >= 6) return 'bg-teal-500/10 text-teal-700 dark:text-teal-300 border-teal-500/10';
    if (mood.score >= 4) return 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/10';
    return 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/10';
  };
  
  return (
    <div className={`p-4 rounded-2xl border bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 shadow-sm transition-all duration-300 hover:shadow-md animate-fade-in`}>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="text-2xl select-none">{getMoodEmoji()}</div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-slate-800 dark:text-slate-100">{getMoodText()}</span>
              <span className="text-[10px] text-slate-400 font-medium flex items-center gap-0.5">
                <Clock size={11} /> {format(new Date(mood.date), 'h:mm a')}
              </span>
            </div>

            {/* Minimalist Gauge bar */}
            <div className="flex items-center gap-2 mt-1.5 w-40 sm:w-52">
              <div className="flex-1 h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-1 rounded-full ${
                    mood.score >= 8 ? 'bg-emerald-500' :
                    mood.score >= 6 ? 'bg-teal-500' :
                    mood.score >= 4 ? 'bg-amber-500' :
                    'bg-rose-500'
                  }`}
                  style={{ width: `${mood.score * 10}%` }}
                />
              </div>
              <span className="text-[10px] font-extrabold text-slate-400">{mood.score}/10</span>
            </div>
          </div>
        </div>

        {/* Dynamic Badge */}
        <span className={`hidden sm:inline-block text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full border ${getMoodColors()}`}>
          Score {mood.score}
        </span>
      </div>
      
      {mood.notes && (
        <p className="mt-2.5 text-xs text-slate-500 dark:text-slate-400 leading-relaxed italic bg-slate-50/50 dark:bg-slate-950/40 p-2 rounded-xl border border-slate-100 dark:border-slate-850/60">
          "{mood.notes}"
        </p>
      )}
      
      {mood.factors && mood.factors.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {mood.factors.map(factor => (
            <span key={factor} className="px-2 py-0.5 bg-slate-50 text-slate-500 dark:bg-slate-800 dark:text-slate-400 rounded-full text-[9px] font-bold border border-slate-100 dark:border-slate-850">
              ⚡ {factor}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default MoodSummary;