import React from 'react';
import { MoodEntry } from '../../types';
import { format } from 'date-fns';
import { SmilePlus, Smile, Meh, Frown, Frown as FrownOpen } from 'lucide-react';

interface MoodSummaryProps {
  mood: MoodEntry;
}

const MoodSummary: React.FC<MoodSummaryProps> = ({ mood }) => {
  const getMoodIcon = () => {
    if (mood.score >= 8) return <SmilePlus size={18} className="text-success-500" />;
    if (mood.score >= 6) return <Smile size={18} className="text-primary-500" />;
    if (mood.score >= 4) return <Meh size={18} className="text-warning-500" />;
    if (mood.score >= 2) return <Frown size={18} className="text-warning-600" />;
    return <FrownOpen size={18} className="text-error-500" />;
  };
  
  const getMoodText = () => {
    if (mood.score >= 8) return 'Excellent';
    if (mood.score >= 6) return 'Good';
    if (mood.score >= 4) return 'Neutral';
    if (mood.score >= 2) return 'Not Great';
    return 'Poor';
  };
  
  const getMoodColor = () => {
    if (mood.score >= 8) return 'bg-success-100 dark:bg-success-900/20';
    if (mood.score >= 6) return 'bg-primary-100 dark:bg-primary-900/20';
    if (mood.score >= 4) return 'bg-warning-100 dark:bg-warning-900/20';
    if (mood.score >= 2) return 'bg-warning-200 dark:bg-warning-900/30';
    return 'bg-error-100 dark:bg-error-900/20';
  };
  
  return (
    <div className={`rounded-lg p-3 ${getMoodColor()}`}>
      <div className="flex items-center gap-2">
        <div className="p-1.5 bg-white dark:bg-gray-800 rounded-full">
          {getMoodIcon()}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <p className="font-medium">{getMoodText()}</p>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {format(new Date(mood.date), 'h:mm a')}
            </span>
          </div>
          <div className="mt-1 flex items-center gap-1">
            <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full">
              <div 
                className={`h-1.5 rounded-full ${
                  mood.score >= 8 ? 'bg-success-500' : 
                  mood.score >= 6 ? 'bg-primary-500' :
                  mood.score >= 4 ? 'bg-warning-500' :
                  mood.score >= 2 ? 'bg-warning-600' :
                  'bg-error-500'
                }`}
                style={{ width: `${mood.score * 10}%` }}
              />
            </div>
            <span className="text-xs font-medium">{mood.score}/10</span>
          </div>
        </div>
      </div>
      
      {mood.notes && (
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{mood.notes}</p>
      )}
      
      {mood.factors && mood.factors.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {mood.factors.map(factor => (
            <span key={factor} className="px-1.5 py-0.5 bg-white dark:bg-gray-800 rounded text-xs">
              {factor}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default MoodSummary;