import React, { useState } from 'react';
import { PlusCircle, Search, Filter, X, Calendar, CheckSquare, ListTodo, AlertCircle, ArrowUpRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import TaskPreview from '../components/tasks/TaskPreview';
import TaskForm from '../components/tasks/TaskForm';
import { EmptyState } from '../components/ui/EmptyState';

const TaskPlanner: React.FC = () => {
  const { tasks } = useApp();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'pending'>('all');
  const [filterPriority, setFilterPriority] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  
  // Filter tasks based on search and filters
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         (task.description?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
    
    const matchesStatus = filterStatus === 'all' || 
                        (filterStatus === 'completed' && task.completed) ||
                        (filterStatus === 'pending' && !task.completed);
    
    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });
  
  // Sort tasks: pending first, then by priority, then by due date
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    
    if (!a.completed && !b.completed) {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
      if (priorityDiff !== 0) return priorityDiff;
      
      if (a.dueDate && b.dueDate) {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
      
      if (a.dueDate) return -1;
      if (b.dueDate) return 1;
    }
    
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const totalCount = tasks.length;
  const completedCount = tasks.filter(t => t.completed).length;
  const pendingCount = totalCount - completedCount;
  const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  
  return (
    <div className="space-y-8 animate-fade-in pb-16">

      {/* Narrative Page Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <CheckSquare size={14} className="text-stone-400" />
            <span className="text-[10px] font-mono tracking-widest text-stone-400 dark:text-zinc-500 uppercase">
              WORK backlog
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-light tracking-tight text-stone-900 dark:text-white font-serif">
            Tasks & Focus Planner
          </h1>
          <p className="text-xs text-stone-400 dark:text-zinc-400 font-light">
            An uncluttered list layout designed to balance parameters, milestones, and task velocity.
          </p>
        </div>

        <button 
          onClick={() => setIsFormOpen(true)}
          className="btn-premium btn-premium-primary self-start md:self-auto"
        >
          <PlusCircle size={14} /> Schedule Task
        </button>
      </div>

      <div className="divider-premium" />

      {/* Narrative stats text rather than boxes */}
      <div className="flex flex-wrap gap-10 text-xs font-light text-stone-500 dark:text-zinc-400">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-stone-400 dark:text-zinc-500 font-medium">Progress velocity</p>
          <p className="text-lg font-semibold text-stone-800 dark:text-zinc-200 mt-0.5">{completionRate}% complete</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wider text-stone-400 dark:text-zinc-500 font-medium">Pending items</p>
          <p className="text-lg font-semibold text-stone-800 dark:text-zinc-200 mt-0.5">{pendingCount} focus tasks</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wider text-stone-400 dark:text-zinc-500 font-medium">Completed backlog</p>
          <p className="text-lg font-semibold text-stone-800 dark:text-zinc-200 mt-0.5">{completedCount} resolved</p>
        </div>
      </div>

      {/* Minimalistic Inline Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between py-2 border-b border-stone-100 dark:border-neutral-800/60">
        <div className="relative w-full sm:max-w-xs">
          <Search size={14} className="absolute left-3 top-2.5 text-stone-400" />
          <input
            type="text"
            placeholder="Search keywords..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="input-premium pl-8 py-1.5 text-xs w-full bg-transparent border-none"
          />
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          {/* Custom micro selector buttons instead of raw selects */}
          <div className="flex rounded-lg bg-stone-100/50 dark:bg-neutral-900/40 p-1 border border-stone-200/20">
            {['all', 'pending', 'completed'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status as any)}
                className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all
                  ${filterStatus === status
                    ? 'bg-white dark:bg-neutral-800 text-stone-900 dark:text-white shadow-sm'
                    : 'text-stone-400 hover:text-stone-700'}
                `}
              >
                {status}
              </button>
            ))}
          </div>

          <div className="flex rounded-lg bg-stone-100/50 dark:bg-neutral-900/40 p-1 border border-stone-200/20">
            {['all', 'high', 'medium'].map((prio) => (
              <button
                key={prio}
                onClick={() => setFilterPriority(prio as any)}
                className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all
                  ${filterPriority === prio
                    ? 'bg-white dark:bg-neutral-800 text-stone-900 dark:text-white shadow-sm'
                    : 'text-stone-400 hover:text-stone-700'}
                `}
              >
                {prio}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Backlog rows */}
      <div className="space-y-1.5 pt-2">
        {sortedTasks.length > 0 ? (
          sortedTasks.map(task => (
            <TaskPreview key={task.id} task={task} />
          ))
        ) : (
          <EmptyState
            icon={Calendar}
            title="All cleared"
            description="No matching backlog tasks found. Add a new focus priority to begin planning."
          />
        )}
      </div>
      
      {/* Modal form */}
      {isFormOpen && (
        <TaskForm onClose={() => setIsFormOpen(false)} />
      )}
    </div>
  );
};

export default TaskPlanner;
