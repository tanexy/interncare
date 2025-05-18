import React from 'react';
import { SuggestionType } from '../../types';
import { 
  BedSingle, 
  Coffee, 
  Brain, 
  Lightbulb,
  Dumbbell, 
  CheckCircle
} from 'lucide-react';

interface SuggestionsListProps {
  suggestions: SuggestionType[];
}

const SuggestionsList: React.FC<SuggestionsListProps> = ({ suggestions }) => {
  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'sleep':
        return <BedSingle size={18} className="text-indigo-500" />;
      case 'water':
        return <Coffee size={18} className="text-blue-500" />;
      case 'stress':
        return <Brain size={18} className="text-purple-500" />;
      case 'productivity':
        return <CheckCircle size={18} className="text-green-500" />;
      case 'exercise':
        return <Dumbbell size={18} className="text-orange-500" />;
      default:
        return <Lightbulb size={18} className="text-amber-500" />;
    }
  };
  
  const getSuggestionColor = (type: string) => {
    switch (type) {
      case 'sleep':
        return 'bg-indigo-50 dark:bg-indigo-900/20';
      case 'water':
        return 'bg-blue-50 dark:bg-blue-900/20';
      case 'stress':
        return 'bg-purple-50 dark:bg-purple-900/20';
      case 'productivity':
        return 'bg-green-50 dark:bg-green-900/20';
      case 'exercise':
        return 'bg-orange-50 dark:bg-orange-900/20';
      default:
        return 'bg-amber-50 dark:bg-amber-900/20';
    }
  };
  
  return (
    <div className="space-y-3">
      {suggestions.map(suggestion => (
        <div 
          key={suggestion.id}
          className={`p-3 rounded-lg ${getSuggestionColor(suggestion.type)} animate-fade-in`}
        >
          <div className="flex gap-3">
            <div className="p-1.5 bg-white dark:bg-gray-800 rounded-full">
              {getSuggestionIcon(suggestion.type)}
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-800 dark:text-gray-900">
                {suggestion.message}
              </p>
              <div className="mt-1.5 flex justify-between items-center">
                {suggestion.priority === 'high' && (
                  <span className="badge badge-error text-xs">Priority</span>
                )}
                {suggestion.priority === 'medium' && (
                  <span className="badge badge-warning text-xs">Recommended</span>
                )}
                {suggestion.priority === 'low' && (
                  <span className="badge badge-secondary text-xs">Tip</span>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SuggestionsList;