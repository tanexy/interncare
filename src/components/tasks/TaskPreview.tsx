import React, { useState } from 'react';
import { CheckCircle2, Circle, Clock, Calendar, Edit3, Trash2, Tag } from 'lucide-react';
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
  
  return (
    <div className={`
      group py-4 px-1 border-b border-stone-150/40 dark:border-neutral-800/60 transition-all duration-200 animate-slide-up
      ${task.completed ? 'opacity-50' : ''}
    `}>
      <div className="flex items-start gap-4">

        {/* Minimal tactile checklist box */}
        <button 
          onClick={() => toggleTaskComplete(task.id)}
          className="mt-0.5 focus:outline-none transition-transform active:scale-90"
        >
          {task.completed ? (
            <CheckCircle2 size={16} className="text-stone-850 dark:text-zinc-200" />
          ) : (
            <Circle size={16} className="text-stone-300 hover:text-stone-600 dark:text-neutral-700 dark:hover:text-zinc-400" />
          )}
        </button>
        
        <div className="flex-grow min-w-0">

          <div className="flex justify-between items-start gap-4">
            <h3 className={`text-sm font-medium tracking-tight transition-all duration-200
              ${task.completed ? 'line-through text-stone-400 dark:text-zinc-500' : 'text-stone-800 dark:text-zinc-100'}
            `}>
              {task.title}
            </h3>

            {/* Quick clean action links shown on hover */}
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => setIsEditOpen(true)}
                className="p-1 text-stone-400 hover:text-stone-900 dark:hover:text-white transition-all"
              >
                <Edit3 size={12} />
              </button>
              <button
                onClick={() => deleteTask(task.id)}
                className="p-1 text-stone-400 hover:text-rose-500 transition-all"
              >
                <Trash2 size={12} />
              </button>
            </div>
          </div>
          
          {task.description && (
            <p className="mt-1 text-xs text-stone-400 dark:text-zinc-500 font-light leading-relaxed">
              {task.description}
            </p>
          )}
          
          <div className="mt-2.5 flex flex-wrap items-center gap-4 text-[10px] font-semibold text-stone-400 dark:text-zinc-500">

            <span className={`text-[9px] font-extrabold uppercase tracking-widest
              ${task.priority === 'high' ? 'text-rose-500' : task.priority === 'medium' ? 'text-amber-500' : 'text-emerald-500'}
            `}>
              {task.priority}
            </span>

            {task.dueDate && (
              <span className="flex items-center gap-1">
                <Calendar size={11} /> {format(new Date(task.dueDate), 'MMM d, h:mm a')}
              </span>
            )}
            
            {task.timeBlock && (
              <span className="flex items-center gap-1">
                <Clock size={11} />
                {format(new Date(`2000-01-01T${task.timeBlock.start}`), 'h:mm a')} - {format(new Date(`2000-01-01T${task.timeBlock.end}`), 'h:mm a')}
              </span>
            )}
            
            {task.tags && task.tags.length > 0 && (
              <div className="flex items-center gap-1.5">
                {task.tags.map(tag => (
                  <span key={tag} className="text-[9px] font-bold text-stone-500 lowercase bg-stone-100 dark:bg-neutral-800 px-2 py-0.5 rounded-full">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {isEditOpen && (
        <TaskForm taskId={task.id} onClose={() => setIsEditOpen(false)} />
      )}
    </div>
  );
};

export default TaskPreview;
