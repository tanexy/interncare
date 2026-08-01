import React, { useState } from 'react';
import { X, Moon, Coffee, Heart, Dumbbell, Calendar, Apple } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface HealthFormProps {
  onClose: () => void;
}

const HealthForm: React.FC<HealthFormProps> = ({ onClose }) => {
  const { addHealthData } = useApp();
  
  // Form state
  const [sleepHours, setSleepHours] = useState(7);
  const [stressLevel, setStressLevel] = useState(5);
  const [waterIntake, setWaterIntake] = useState(6);
  const [hasExercise, setHasExercise] = useState(false);
  const [exerciseMinutes, setExerciseMinutes] = useState(30);
  const [exerciseType, setExerciseType] = useState('');
  const [hasMeals, setHasMeals] = useState(false);
  const [breakfast, setBreakfast] = useState(true);
  const [lunch, setLunch] = useState(true);
  const [dinner, setDinner] = useState(true);
  const [snacks, setSnacks] = useState(1);
  const [notes, setNotes] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    addHealthData({
      sleepHours,
      stressLevel,
      waterIntake,
      exercise: hasExercise ? {
        minutes: exerciseMinutes,
        type: exerciseType.trim() || undefined,
      } : undefined,
      meals: hasMeals ? {
        breakfast,
        lunch,
        dinner,
        snacks,
      } : undefined,
      notes: notes.trim() || undefined,
    });
    
    onClose();
  };
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-2xl animate-slide-up max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="sticky top-0 z-10 flex justify-between items-center px-6 py-4 border-b border-slate-50 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <Dumbbell size={16} className="text-teal-500 animate-bounce-light" />
              Daily Health Logger
            </h3>
            <p className="text-[11px] text-slate-400 dark:text-slate-500">Track physical variables to fuel mental sharpness and energy</p>
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
        <form onSubmit={handleSubmit} className="p-6 space-y-6">

          {/* Sleep hours slider */}
          <div>
            <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              <span className="flex items-center gap-1"><Moon size={14} className="text-indigo-400" /> Sleep Duration</span>
              <span className="text-teal-600 dark:text-teal-400 font-extrabold">{sleepHours} Hours</span>
            </div>
            <input
              type="range"
              min="0"
              max="12"
              step="0.5"
              value={sleepHours}
              onChange={e => setSleepHours(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg cursor-pointer accent-teal-500"
            />
            <div className="flex justify-between text-[9px] font-bold text-slate-400 uppercase mt-1 px-0.5">
              <span>Low Rest</span>
              <span>8.0h Ideal</span>
              <span>Deep Rest</span>
            </div>
          </div>
          
          {/* Stress Level slider */}
          <div>
            <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              <span className="flex items-center gap-1"><Heart size={14} className="text-rose-400" /> Current Stress Parameter</span>
              <span className="text-teal-600 dark:text-teal-400 font-extrabold">{stressLevel} out of 10</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={stressLevel}
              onChange={e => setStressLevel(parseInt(e.target.value))}
              className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg cursor-pointer accent-teal-500"
            />
            <div className="flex justify-between text-[9px] font-bold text-slate-400 uppercase mt-1 px-0.5">
              <span>Serene / Calm</span>
              <span>Moderate</span>
              <span>Burnout Alert</span>
            </div>
          </div>
          
          {/* Water intake slider */}
          <div>
            <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              <span className="flex items-center gap-1"><Coffee size={14} className="text-blue-400" /> Water Hydration</span>
              <span className="text-teal-600 dark:text-teal-400 font-extrabold">{waterIntake} Glasses</span>
            </div>
            <input
              type="range"
              min="0"
              max="12"
              value={waterIntake}
              onChange={e => setWaterIntake(parseInt(e.target.value))}
              className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg cursor-pointer accent-teal-500"
            />
            <div className="flex justify-between text-[9px] font-bold text-slate-400 uppercase mt-1 px-0.5">
              <span>Dehydrated</span>
              <span>8 gl Standard</span>
              <span>Hydrated</span>
            </div>
          </div>
          
          {/* Exercise section accordion */}
          <div className="p-4 bg-slate-50/60 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-850 rounded-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="hasExercise"
                  type="checkbox"
                  checked={hasExercise}
                  onChange={e => setHasExercise(e.target.checked)}
                  className="h-4 w-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500"
                />
                <label htmlFor="hasExercise" className="ml-2 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer select-none">
                  Log active workout / exercise today
                </label>
              </div>
              <Dumbbell size={15} className="text-slate-400" />
            </div>
            
            {hasExercise && (
              <div className="space-y-3 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 animate-fade-in">
                <div>
                  <label htmlFor="exerciseMinutes" className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Exercise Duration (minutes)
                  </label>
                  <input
                    id="exerciseMinutes"
                    type="number"
                    min="1"
                    value={exerciseMinutes}
                    onChange={e => setExerciseMinutes(parseInt(e.target.value))}
                    className="input w-full py-1 text-xs"
                  />
                </div>
                
                <div>
                  <label htmlFor="exerciseType" className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Exercise Type / Discipline (optional)
                  </label>
                  <input
                    id="exerciseType"
                    type="text"
                    value={exerciseType}
                    onChange={e => setExerciseType(e.target.value)}
                    placeholder="E.g., Running, Weightlifting, Yoga"
                    className="input w-full py-1.5 text-xs"
                  />
                </div>
              </div>
            )}
          </div>
          
          {/* Meals section accordion */}
          <div className="p-4 bg-slate-50/60 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-850 rounded-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="hasMeals"
                  type="checkbox"
                  checked={hasMeals}
                  onChange={e => setHasMeals(e.target.checked)}
                  className="h-4 w-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500"
                />
                <label htmlFor="hasMeals" className="ml-2 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer select-none">
                  Log nourishment / meals today
                </label>
              </div>
              <Apple size={15} className="text-slate-400" />
            </div>
            
            {hasMeals && (
              <div className="space-y-3.5 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 animate-fade-in">
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center">
                    <input
                      id="breakfast"
                      type="checkbox"
                      checked={breakfast}
                      onChange={e => setBreakfast(e.target.checked)}
                      className="h-4 w-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500"
                    />
                    <label htmlFor="breakfast" className="ml-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Breakfast
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      id="lunch"
                      type="checkbox"
                      checked={lunch}
                      onChange={e => setLunch(e.target.checked)}
                      className="h-4 w-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500"
                    />
                    <label htmlFor="lunch" className="ml-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Lunch
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      id="dinner"
                      type="checkbox"
                      checked={dinner}
                      onChange={e => setDinner(e.target.checked)}
                      className="h-4 w-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500"
                    />
                    <label htmlFor="dinner" className="ml-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Dinner
                    </label>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="snacks" className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Number of snacks
                  </label>
                  <input
                    id="snacks"
                    type="number"
                    min="0"
                    value={snacks}
                    onChange={e => setSnacks(parseInt(e.target.value))}
                    className="input w-24 py-1 text-xs"
                  />
                </div>
              </div>
            )}
          </div>
          
          {/* Notes */}
          <div>
            <label htmlFor="healthNotes" className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Additional health notes (Optional)
            </label>
            <textarea
              id="healthNotes"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="E.g., Felt a bit restless in the afternoon, back pain, took a multivitamin..."
              rows={3}
              className="textarea w-full text-xs"
            />
          </div>
          
          {/* Action buttons */}
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
              Save Health Stats
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HealthForm;