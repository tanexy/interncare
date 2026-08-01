import React, { useState } from 'react';
import { CheckCircle2, Circle, Clock, Calendar, Edit3, Trash2, Tag, CalendarClock } from 'lucide-react';
import { Task } from '../../types';
import { useApp } from '../../context/AppContext';
import { format } from 'date-fns';
import TaskForm from './TaskForm';

interface TaskPreviewProps {
  task: Task;
}

const TaskPreview: React.FC<TaskPreviewProps> = ({ task }) => {
  const { toggleTaskComplete, deleteTask } = useApp();
  const [isEditOpen, setIsEditOpen] = useState(false);
  
  const getPriorityColors = () => {
    switch(task.priority) {
      case 'high':
        return {
          bg: 'bg-rose-50/70 dark:bg-rose-950/10',
          border: 'border-rose-100/50 dark:border-rose-950/30',
          text: 'text-rose-600 dark:text-rose-400',
          badge: 'bg-rose-500/10 text-rose-700 dark:text-rose-300'
        };
      case 'medium':
        return {
          bg: 'bg-amber-50/70 dark:bg-amber-950/10',
          border: 'border-amber-100/50 dark:border-amber-950/30',
          text: 'text-amber-600 dark:text-amber-400',
          badge: 'bg-amber-500/10 text-amber-700 dark:text-amber-300'
        };
      case 'low':
        return {
          bg: 'bg-emerald-50/70 dark:bg-emerald-950/10',
          border: 'border-emerald-100/50 dark:border-emerald-950/30',
          text: 'text-emerald-600 dark:text-emerald-400',
          badge: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
        };
      default:
        return {
          bg: 'bg-slate-50/70 dark:bg-slate-900/40',
          border: 'border-slate-100 dark:border-slate-800',
          text: 'text-slate-600 dark:text-slate-400',
          badge: 'bg-slate-100 text-slate-700'
        };
    }
  };

  const colors = getPriorityColors();
  
  return (
    <div className={`
      group p-4 rounded-2xl border transition-all duration-300 animate-slide-up
      ${task.completed 
        ? 'bg-slate-50/50 dark:bg-slate-950/20 border-slate-100 dark:border-slate-900'
        : `bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800/80 hover:shadow-md hover:border-slate-200/80 dark:hover:border-slate-700/80`
      }
    `}>
      <div className="flex items-start gap-4">

        {/* Sleek Complete Checkbox Button */}
        <button 
          onClick={() => toggleTaskComplete(task.id)}
          className="mt-1 focus:outline-none transition-transform active:scale-90"
          aria-label={task.completed ? "Mark task pending" : "Mark task complete"}
        >
          {task.completed ? (
            <CheckCircle2 size={19} className="text-teal-500 dark:text-teal-400 animate-pulse-light" />
          ) : (
            <Circle size={19} className="text-slate-300 hover:text-teal-500 dark:text-slate-600 dark:hover:text-teal-400 transition-colors" />
          )}
        </button>
        
        <div className="flex-1 min-w-0">

          {/* Header Row: Title and Badges */}
          <div className="flex justify-between items-start gap-4">
            <h3 className={`text-sm md:text-base font-semibold leading-snug tracking-tight transition-all duration-200
              ${task.completed ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-800 dark:text-slate-100'}
            `}>
              {task.title}
            </h3>

            {/* Action buttons shown on hover on desktop */}
            <div className="flex items-center gap-1.5 opacity-60 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => setIsEditOpen(true)}
                className="p-1 text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                title="Edit task details"
              >
                <Edit3 size={13} />
              </button>
              <button
                onClick={() => deleteTask(task.id)}
                className="p-1 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                title="Delete task permanently"
              >
                <Trash2 size={13} />
              </button>
            </div>
          </div>
          
          {/* Description */}
          {task.description && (
            <p className={`mt-1 text-xs leading-relaxed max-w-2xl
              ${task.completed ? 'text-slate-400 dark:text-slate-500' : 'text-slate-500 dark:text-slate-400'}
            `}>
              {task.description}
            </p>
          )}
          
          {/* Bottom Metas Row */}
          <div className="mt-3 flex flex-wrap items-center gap-3.5 text-[10px] md:text-xs font-semibold text-slate-400 dark:text-slate-500">

            {/* Priority Badge */}
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${colors.badge}`}>
              {task.priority}
            </span>

            {/* Due Date Indicator */}
            {task.dueDate && (
              <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                <Calendar size={13} className="text-teal-500" />
                <span>Due {format(new Date(task.dueDate), 'MMM d, h:mm a')}</span>
              </div>
            )}
            
            {/* Time Block Indicator */}
            {task.timeBlock && (
              <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                <Clock size={13} className="text-indigo-400" />
                <span>
                  Block: {format(new Date(`2000-01-01T${task.timeBlock.start}`), 'h:mm a')} - {format(new Date(`2000-01-01T${task.timeBlock.end}`), 'h:mm a')}
                </span>
              </div>
            )}
            
            {/* Tags list */}
            {task.tags && task.tags.length > 0 && (
              <div className="flex items-center gap-1 flex-wrap">
                {task.tags.map(tag => (
                  <span key={tag} className="inline-flex items-center gap-0.5 px-2 py-0.5 bg-slate-50 text-slate-500 dark:bg-slate-800 dark:text-slate-400 rounded-full border border-slate-100 dark:border-slate-800 text-[9px] font-bold">
                    <Tag size={9} />
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Embedded edit drawer modal */}
      {isEditOpen && (
        <TaskForm taskId={task.id} onClose={() => setIsEditOpen(false)} />
      )}
    </div>
  );
};

export default TaskPreview;