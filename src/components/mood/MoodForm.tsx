import React, { useState } from 'react';
import { X, Smile, SmilePlus, Meh, Frown, Frown as FrownOpen } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface MoodFormProps {
  onClose: () => void;
}

const MoodForm: React.FC<MoodFormProps> = ({ onClose }) => {
  const { addMoodEntry } = useApp();
  const [score, setScore] = useState(5);
  const [notes, setNotes] = useState('');
  const [factors, setFactors] = useState<string[]>([]);
  
  // Predefined factors that might affect mood
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
  
  const getMoodIcon = () => {
    if (score >= 8) return <SmilePlus size={24} className="text-success-500" />;
    if (score >= 6) return <Smile size={24} className="text-primary-500" />;
    if (score >= 4) return <Meh size={24} className="text-warning-500" />;
    if (score >= 2) return <Frown size={24} className="text-warning-600" />;
    return <FrownOpen size={24} className="text-error-500" />;
  };
  
  const getMoodText = () => {
    if (score >= 8) return 'Excellent';
    if (score >= 6) return 'Good';
    if (score >= 4) return 'Neutral';
    if (score >= 2) return 'Not Great';
    return 'Poor';
  };
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-40">
      <div className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-lg animate-fade-in">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
          <h3 className="text-lg font-semibold">How are you feeling?</h3>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div className="text-center py-4">
            <div className="flex justify-center mb-3">
              {getMoodIcon()}
            </div>
            <p className="text-lg font-medium mb-3">{getMoodText()}</p>
            <div className="flex items-center gap-2 max-w-xs mx-auto">
              <span className="text-xs">Low</span>
              <input
                type="range"
                min="1"
                max="10"
                value={score}
                onChange={e => setScore(parseInt(e.target.value))}
                className="w-full appearance-none h-2 bg-gray-200 dark:bg-gray-700 rounded-full"
                style={{
                  background: `linear-gradient(to right, 
                    ${score <= 3 ? '#EF4444' : score <= 5 ? '#F97316' : score <= 7 ? '#14B8A6' : '#22C55E'} 
                    0%, 
                    ${score <= 3 ? '#EF4444' : score <= 5 ? '#F97316' : score <= 7 ? '#14B8A6' : '#22C55E'} 
                    ${score * 10}%, 
                    #E5E7EB ${score * 10}%, 
                    #E5E7EB 100%)`
                }}
              />
              <span className="text-xs">High</span>
            </div>
            <div className="text-center mt-1 text-sm text-gray-500">
              {score}/10
            </div>
          </div>
          
          <div>
            <label htmlFor="notes" className="block text-sm font-medium mb-1">
              What's on your mind? (Optional)
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Add notes about how you're feeling..."
              rows={3}
              className="textarea w-full"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">
              What factors affected your mood today? (Optional)
            </label>
            <div className="flex flex-wrap gap-2">
              {commonFactors.map(factor => (
                <button
                  key={factor}
                  type="button"
                  onClick={() => toggleFactor(factor)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors
                    ${factors.includes(factor) 
                      ? 'bg-primary-100 text-primary-800 dark:bg-primary-800/60 dark:text-primary-200' 
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}
                  `}
                >
                  {factor}
                </button>
              ))}
            </div>
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

export default MoodForm;