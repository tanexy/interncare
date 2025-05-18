import React from 'react';
import { HealthData } from '../../types';
import { format } from 'date-fns';
import { 
  Coffee, 
  Dumbbell, 
  Moon,
  Heart 
} from 'lucide-react';

interface HealthSummaryProps {
  health: HealthData;
}

const HealthSummary: React.FC<HealthSummaryProps> = ({ health }) => {
  return (
    <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-3">
      <div className="flex justify-between items-center">
        <h3 className="font-medium text-gray-800 dark:text-gray-900">Health Stats</h3>
        <span className="text-xs text-gray-500 dark:text-gray-800">
          {format(new Date(health.date), 'MMM d')}
        </span>
      </div>
      
      <div className="mt-3 grid grid-cols-2 gap-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-white dark:bg-gray-800 rounded-full">
            <Moon size={16} className="text-indigo-500" />
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-900">Sleep</p>
            <p className="font-medium">{health.sleepHours} hrs</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-white dark:bg-gray-800 rounded-full">
            <Coffee size={16} className="text-blue-500" />
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-800">Water</p>
            <p className="font-medium">{health.waterIntake} glasses</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-white dark:bg-gray-800 rounded-full">
            <Heart size={16} className="text-red-500" />
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-800">Stress</p>
            <p className="font-medium">{health.stressLevel}/10</p>
          </div>
        </div>
        
        {health.exercise && (
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-white dark:bg-gray-800 rounded-full">
              <Dumbbell size={16} className="text-green-500" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-800">Exercise</p>
              <p className="font-medium">{health.exercise.minutes} min</p>
            </div>
          </div>
        )}
      </div>
      
      {health.notes && (
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{health.notes}</p>
      )}
    </div>
  );
};

export default HealthSummary;