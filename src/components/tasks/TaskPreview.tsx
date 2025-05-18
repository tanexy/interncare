import React from 'react';
import { CheckCircle2, Circle, Clock, CalendarClock } from 'lucide-react';
import { Task } from '../../types';
import { useApp } from '../../context/AppContext';
import { format } from 'date-fns';

interface TaskPreviewProps {
  task: Task;
}

const TaskPreview: React.FC<TaskPreviewProps> = ({ task }) => {
  const { toggleTaskComplete } = useApp();
  
  const getPriorityBadge = () => {
    switch(task.priority) {
      case 'high':
        return <span className="badge bg-error-100 text-error-800 dark:bg-error-900/60 dark:text-error-300">High</span>;
      case 'medium':
        return <span className="badge bg-warning-100 text-warning-800 dark:bg-warning-900/60 dark:text-warning-300">Medium</span>;
      case 'low':
        return <span className="badge bg-success-100 text-success-800 dark:bg-success-900/60 dark:text-success-300">Low</span>;
      default:
        return null;
    }
  };
  
  return (
    <div className={`
      p-4 border rounded-lg transition-all
      ${task.completed 
        ? 'bg-gray-50 dark:bg-gray-800/30 border-gray-200 dark:border-gray-700' 
        : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-md'}
    `}>
      <div className="flex items-start gap-3">
        <button 
          onClick={() => toggleTaskComplete(task.id)}
          className="mt-0.5 focus:outline-none"
        >
          {task.completed ? (
            <CheckCircle2 size={20} className="text-primary-600 dark:text-primary-400" />
          ) : (
            <Circle size={20} className="text-gray-400 hover:text-primary-600 dark:hover:text-primary-400" />
          )}
        </button>
        
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap justify-between items-start gap-2">
            <h3 className={`text-base font-medium ${task.completed ? 'line-through text-gray-500 dark:text-gray-400' : ''}`}>
              {task.title}
            </h3>
            {getPriorityBadge()}
          </div>
          
          {task.description && (
            <p className={`mt-1 text-sm ${task.completed ? 'text-gray-400 dark:text-gray-500' : 'text-gray-600 dark:text-gray-300'}`}>
              {task.description}
            </p>
          )}
          
          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
            {task.dueDate && (
              <div className="flex items-center">
                <CalendarClock size={14} className="mr-1" />
                <span>{format(new Date(task.dueDate), 'MMM d, h:mm a')}</span>
              </div>
            )}
            
            {task.timeBlock && (
              <div className="flex items-center">
                <Clock size={14} className="mr-1" />
                <span>
                  {format(new Date(task.timeBlock.start), 'h:mm a')} - 
                  {format(new Date(task.timeBlock.end), 'h:mm a')}
                </span>
              </div>
            )}
            
            {task.tags && task.tags.length > 0 && (
              <div className="flex items-center gap-1 flex-wrap">
                {task.tags.map(tag => (
                  <span key={tag} className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskPreview;