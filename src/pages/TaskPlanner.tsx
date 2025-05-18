import React, { useState } from 'react';
import { PlusCircle, Search, Filter, X, Calendar } from 'lucide-react';
import { useApp } from '../context/AppContext';
import TaskPreview from '../components/tasks/TaskPreview';
import TaskForm from '../components/tasks/TaskForm';

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
  
  return (
    <div className="animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-400">Task Planner</h1>
          <p className="text-gray-900 dark:text-gray-400">
            Manage your tasks and keep track of your progress
          </p>
        </div>
        <button 
          onClick={() => setIsFormOpen(true)}
          className="btn btn-primary"
        >
          <PlusCircle size={18} className="mr-2" />
          New Task
        </button>
      </div>
      
      {/* Search and filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="input pl-10 w-full"
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <X size={18} className="text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>
        
        <div className="flex gap-3">
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value as 'all' | 'completed' | 'pending')}
            className="select"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
          
          <select
            value={filterPriority}
            onChange={e => setFilterPriority(e.target.value as 'all' | 'high' | 'medium' | 'low')}
            className="select"
          >
            <option value="all">All Priority</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>
      
      {/* Task List */}
      <div className="space-y-4">
        {sortedTasks.length > 0 ? (
          sortedTasks.map(task => (
            <TaskPreview key={task.id} task={task} />
          ))
        ) : (
          <div className="py-12 text-center bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <Calendar size={48} className="mx-auto text-gray-400 mb-3" />
            <h3 className="text-lg font-medium text-gray-600 dark:text-gray-300">No tasks found</h3>
            <p className="text-gray-500 dark:text-gray-400">
              {searchTerm || filterStatus !== 'all' || filterPriority !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Start by creating your first task'}
            </p>
            {!searchTerm && filterStatus === 'all' && filterPriority === 'all' && (
              <button 
                onClick={() => setIsFormOpen(true)}
                className="mt-4 btn btn-primary"
              >
                Create Task
              </button>
            )}
          </div>
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