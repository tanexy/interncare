import React, { useState } from 'react';
import { X } from 'lucide-react';
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
        type: exerciseType || undefined,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-40">
      <div className="relative w-full max-w-lg bg-white dark:bg-gray-800 rounded-lg shadow-lg animate-fade-in max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 flex justify-between items-center p-4 border-b dark:border-gray-700 bg-white dark:bg-gray-800">
          <h3 className="text-lg font-semibold">Log Health Data</h3>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-6">
          {/* Sleep Section */}
          <div>
            <label htmlFor="sleepHours" className="block text-sm font-medium mb-1">
              Hours of Sleep <span className="text-error-500">*</span>
            </label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="0"
                max="12"
                step="0.5"
                value={sleepHours}
                onChange={e => setSleepHours(parseFloat(e.target.value))}
                className="flex-1 appearance-none h-2 bg-gray-200 dark:bg-gray-700 rounded-full"
              />
              <span className="font-medium text-lg w-12 text-center">{sleepHours}</span>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0</span>
              <span>6</span>
              <span>12</span>
            </div>
          </div>
          
          {/* Stress Section */}
          <div>
            <label htmlFor="stressLevel" className="block text-sm font-medium mb-1">
              Stress Level <span className="text-error-500">*</span>
            </label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="1"
                max="10"
                value={stressLevel}
                onChange={e => setStressLevel(parseInt(e.target.value))}
                className="flex-1 appearance-none h-2 bg-gray-200 dark:bg-gray-700 rounded-full"
              />
              <span className="font-medium text-lg w-12 text-center">{stressLevel}</span>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Low</span>
              <span>Medium</span>
              <span>High</span>
            </div>
          </div>
          
          {/* Water Section */}
          <div>
            <label htmlFor="waterIntake" className="block text-sm font-medium mb-1">
              Water Intake (glasses) <span className="text-error-500">*</span>
            </label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="0"
                max="12"
                value={waterIntake}
                onChange={e => setWaterIntake(parseInt(e.target.value))}
                className="flex-1 appearance-none h-2 bg-gray-200 dark:bg-gray-700 rounded-full"
              />
              <span className="font-medium text-lg w-12 text-center">{waterIntake}</span>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0</span>
              <span>6</span>
              <span>12+</span>
            </div>
          </div>
          
          {/* Exercise Section */}
          <div>
            <div className="flex items-center mb-2">
              <input
                id="hasExercise"
                type="checkbox"
                checked={hasExercise}
                onChange={e => setHasExercise(e.target.checked)}
                className="h-4 w-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
              />
              <label htmlFor="hasExercise" className="ml-2 text-sm font-medium">
                I exercised today
              </label>
            </div>
            
            {hasExercise && (
              <div className="ml-6 space-y-3 mt-3">
                <div>
                  <label htmlFor="exerciseMinutes" className="block text-sm font-medium mb-1">
                    Exercise Duration (minutes)
                  </label>
                  <input
                    id="exerciseMinutes"
                    type="number"
                    min="1"
                    value={exerciseMinutes}
                    onChange={e => setExerciseMinutes(parseInt(e.target.value))}
                    className="input w-full"
                  />
                </div>
                
                <div>
                  <label htmlFor="exerciseType" className="block text-sm font-medium mb-1">
                    Exercise Type (optional)
                  </label>
                  <input
                    id="exerciseType"
                    type="text"
                    value={exerciseType}
                    onChange={e => setExerciseType(e.target.value)}
                    placeholder="e.g., Running, Yoga, Weights"
                    className="input w-full"
                  />
                </div>
              </div>
            )}
          </div>
          
          {/* Meals Section */}
          <div>
            <div className="flex items-center mb-2">
              <input
                id="hasMeals"
                type="checkbox"
                checked={hasMeals}
                onChange={e => setHasMeals(e.target.checked)}
                className="h-4 w-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
              />
              <label htmlFor="hasMeals" className="ml-2 text-sm font-medium">
                Log meal information
              </label>
            </div>
            
            {hasMeals && (
              <div className="ml-6 space-y-3 mt-3">
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center">
                    <input
                      id="breakfast"
                      type="checkbox"
                      checked={breakfast}
                      onChange={e => setBreakfast(e.target.checked)}
                      className="h-4 w-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
                    />
                    <label htmlFor="breakfast" className="ml-2 text-sm">
                      Breakfast
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      id="lunch"
                      type="checkbox"
                      checked={lunch}
                      onChange={e => setLunch(e.target.checked)}
                      className="h-4 w-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
                    />
                    <label htmlFor="lunch" className="ml-2 text-sm">
                      Lunch
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      id="dinner"
                      type="checkbox"
                      checked={dinner}
                      onChange={e => setDinner(e.target.checked)}
                      className="h-4 w-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
                    />
                    <label htmlFor="dinner" className="ml-2 text-sm">
                      Dinner
                    </label>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="snacks" className="block text-sm font-medium mb-1">
                    Number of Snacks
                  </label>
                  <input
                    id="snacks"
                    type="number"
                    min="0"
                    value={snacks}
                    onChange={e => setSnacks(parseInt(e.target.value))}
                    className="input w-20"
                  />
                </div>
              </div>
            )}
          </div>
          
          {/* Notes Section */}
          <div>
            <label htmlFor="healthNotes" className="block text-sm font-medium mb-1">
              Additional Notes (Optional)
            </label>
            <textarea
              id="healthNotes"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Any other health information you want to track..."
              rows={3}
              className="textarea w-full"
            />
          </div>
          
          <div className="pt-2 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-outline"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HealthForm;