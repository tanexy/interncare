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
    // Search term filter
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         (task.description?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
    
    // Status filter
    const matchesStatus = filterStatus === 'all' || 
                        (filterStatus === 'completed' && task.completed) ||
                        (filterStatus === 'pending' && !task.completed);
    
    // Priority filter
    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });
  
  // Sort tasks: pending first, then by priority, then by due date
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    // Completed vs pending
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    
    // Sort by priority for pending tasks
    if (!a.completed && !b.completed) {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
      if (priorityDiff !== 0) return priorityDiff;
      
      // Then by due date if present
      if (a.dueDate && b.dueDate) {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
      
      // If only one has due date, it comes first
      if (a.dueDate) return -1;
      if (b.dueDate) return 1;
    }
    
    // Default sort by creation date (newest first)
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const totalCount = tasks.length;
  const completedCount = tasks.filter(t => t.completed).length;
  const pendingCount = totalCount - completedCount;
  const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  
  return (
    <div className="space-y-6">

      {/* Header and Summary Cards */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">Task Planner</h1>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">
            Design your day, track achievements, and balance workload parameters
          </p>
        </div>
        <button 
          onClick={() => setIsFormOpen(true)}
          className="btn btn-primary self-start md:self-auto shadow-sm text-xs font-semibold"
        >
          <PlusCircle size={15} className="mr-2" />
          Create Task
        </button>
      </div>

      {/* Mini Stats Summary Blocks */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

        {/* Completed Stats */}
        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Completed Tasks</p>
            <p className="text-xl font-extrabold text-slate-800 dark:text-slate-100">{completedCount}</p>
          </div>
          <div className="p-2.5 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400">
            <CheckSquare size={18} />
          </div>
        </div>

        {/* Pending Stats */}
        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pending focus</p>
            <p className="text-xl font-extrabold text-slate-800 dark:text-slate-100">{pendingCount}</p>
          </div>
          <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
            <ListTodo size={18} />
          </div>
        </div>

        {/* Progress gauge */}
        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl flex items-center justify-between shadow-sm">
          <div className="space-y-1.5 flex-1 pr-4">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Completion velocity</p>
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold text-slate-800 dark:text-slate-100">{completionRate}%</span>
              <span className="text-[9px] font-bold text-emerald-500 flex items-center gap-0.5"><ArrowUpRight size={10} /> Active</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-1 rounded-full overflow-hidden">
              <div className="bg-teal-500 h-1 rounded-full" style={{ width: `${completionRate}%` }}></div>
            </div>
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <AlertCircle size={18} />
          </div>
        </div>

      </div>
      
      {/* Search and Filter Row */}
      <div className="p-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search size={16} />
          </div>
          <input
            type="text"
            placeholder="Search tasks by title, context or keywords..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="input pl-10 w-full text-xs"
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>
        
        <div className="flex gap-2">

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value as 'all' | 'completed' | 'pending')}
            className="select py-1.5 text-xs bg-slate-50 dark:bg-slate-950"
            aria-label="Filter by Status"
          >
            <option value="all">All Statuses</option>
            <option value="pending">⏳ Pending Focus</option>
            <option value="completed">✅ Done Tasks</option>
          </select>
          
          {/* Priority Filter */}
          <select
            value={filterPriority}
            onChange={e => setFilterPriority(e.target.value as 'all' | 'high' | 'medium' | 'low')}
            className="select py-1.5 text-xs bg-slate-50 dark:bg-slate-950"
            aria-label="Filter by Priority"
          >
            <option value="all">All Priorities</option>
            <option value="high">🔴 High Priority</option>
            <option value="medium">🟡 Medium Priority</option>
            <option value="low">🟢 Low Priority</option>
          </select>

        </div>
      </div>
      
      {/* Task List Grid */}
      <div className="space-y-3.5 pt-1">
        {sortedTasks.length > 0 ? (
          sortedTasks.map(task => (
            <TaskPreview key={task.id} task={task} />
          ))
        ) : (
          <EmptyState
            icon={Calendar}
            title="No tasks matching parameters"
            description={
              searchTerm || filterStatus !== 'all' || filterPriority !== 'all'
                ? 'Try adjusting your search query, clearing filter categories, or reset priority ranges'
                : 'Start designing your work pipeline by adding high focus tasks'
            }
            action={
              !searchTerm && filterStatus === 'all' && filterPriority === 'all'
                ? {
                    label: 'Schedule First Task',
                    onClick: () => setIsFormOpen(true)
                  }
                : undefined
            }
          />
        )}
      </div>
      
      {/* Task Form Modal */}
      {isFormOpen && (
        <TaskForm onClose={() => setIsFormOpen(false)} />
      )}
    </div>
  );
};

export default TaskPlanner;