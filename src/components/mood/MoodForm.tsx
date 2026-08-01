import React, { useState } from 'react';
import { X, Smile, Meh, Frown, Sparkles, Heart } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface MoodFormProps {
  onClose: () => void;
}

const MoodForm: React.FC<MoodFormProps> = ({ onClose }) => {
  const { addMoodEntry } = useApp();
  const [score, setScore] = useState(7);
  const [notes, setNotes] = useState('');
  const [factors, setFactors] = useState<string[]>([]);
  
  const commonFactors = [
    'Work', 'Sleep', 'Exercise', 'Food', 'Social', 'Weather', 
    'Stress', 'Relaxation', 'Achievement', 'Health'
  ];
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addMoodEntry({
      score,
      notes: notes.trim() || undefined,
      factors: factors.length > 0 ? factors : undefined,
    });
    onClose();
  };
  
  const toggleFactor = (factor: string) => {
    if (factors.includes(factor)) {
      setFactors(factors.filter(f => f !== factor));
    } else {
      setFactors([...factors, factor]);
    }
  };
  
  const getMoodEmoji = () => {
    if (score >= 9) return '😄';
    if (score >= 7) return '🙂';
    if (score >= 5) return '😐';
    if (score >= 3) return '😔';
    return '😫';
  };
  
  const getMoodText = () => {
    if (score >= 9) return 'Incredible / Energized';
    if (score >= 7) return 'Good / Content';
    if (score >= 5) return 'Neutral / Calm';
    if (score >= 3) return 'Challenging / Low';
    return 'Overwhelmed / Critical';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-2xl animate-slide-up overflow-hidden">

        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-50 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <Heart size={16} className="text-rose-500 fill-rose-500 animate-pulse-light" />
              Mood & Mindfulness Journal
            </h3>
            <p className="text-[11px] text-slate-400 dark:text-slate-500">Record your current emotional state for advanced insights</p>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-950 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">

          <div className="text-center py-4 bg-slate-50/60 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-850 rounded-2xl p-4">
            <div className="text-4xl mb-2.5 transition-all duration-300 transform hover:scale-115 select-none">
              {getMoodEmoji()}
            </div>
            <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{getMoodText()}</p>
            <p className="text-xs text-slate-400 mt-0.5">Rating: <span className="font-bold text-teal-500">{score} out of 10</span></p>

            <div className="mt-4 px-2">
              <input
                type="range"
                min="1"
                max="10"
                value={score}
                onChange={e => setScore(parseInt(e.target.value))}
                className="w-full h-1.5 accent-teal-500 bg-slate-200 dark:bg-slate-850 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-1.5 px-0.5">
                <span>Low focus</span>
                <span>Balanced</span>
                <span>Vibrant</span>
              </div>
            </div>
          </div>
          
          <div>
            <label htmlFor="notes" className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Journal Notes (Optional)
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="What factors are currently playing into your mental space today? Anything you'd like to capture?"
              rows={3}
              className="textarea w-full text-xs"
            />
          </div>
          
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Affecting Factors (Optional)
            </label>
            <div className="flex flex-wrap gap-1.5">
              {commonFactors.map(factor => {
                const isSelected = factors.includes(factor);
                return (
                  <button
                    key={factor}
                    type="button"
                    onClick={() => toggleFactor(factor)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200
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
          
          {/* Actions */}
          <div className="pt-3 border-t border-slate-50 dark:border-slate-800/80 flex justify-end gap-3 bg-white dark:bg-slate-900">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-outline text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary text-xs"
            >
              Save Journal Check-In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MoodForm;