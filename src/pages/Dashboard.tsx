import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Clock, Calendar, Smile, User2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import TaskPreview from '../components/tasks/TaskPreview';
import MoodSummary from '../components/mood/MoodSummary';
import HealthSummary from '../components/health/HealthSummary';
import SuggestionsList from '../components/suggestions/SuggestionsList';
import { format } from 'date-fns';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { 
    tasks, 
    suggestions, 
    moodEntries, 
    healthData, 
    getCompletedTasksCount, 
    getAverageMood 
  } = useApp();
  
  // Get today's date
  const today = new Date();
  const formattedDate = format(today, 'EEEE, MMMM d, yyyy');
  
  // Get pending tasks for today
  const pendingTasks = tasks
    .filter(task => !task.completed)
    .sort((a, b) => {
      // Sort by priority first
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
      
      // Otherwise sort by creation date
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    })
    .slice(0, 3); // Only show top 3
  
  // Get latest mood entry
  const latestMood = moodEntries.length > 0 
    ? moodEntries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0] 
    : null;
    
  // Get latest health data
  const latestHealth = healthData.length > 0
    ? healthData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]
    : null;
    
  // Get key metrics
  const completedTasksCount = getCompletedTasksCount(7);
  const averageMood = getAverageMood(7);
  
  // Get priority suggestions
  const prioritySuggestions = suggestions
    .filter(suggestion => !suggestion.dismissed)
    .sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    })
    .slice(0, 3);
  
  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Welcome to InternCare</h1>
          <p className="text-gray-900 dark:text-gray-700">{formattedDate}</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => navigate('/tasks')}
            className="btn btn-primary"
          >
            <PlusCircle size={18} className="mr-2" />
            New Task
          </button>
          <button 
            onClick={() => navigate('/mood')}
            className="btn btn-secondary"
          >
            <Smile size={18} className="mr-2" />
            Log Mood
          </button>
        </div>
      </div>
      
      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/30 dark:to-primary-800/20 dark:text-white">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-primary-100 dark:bg-primary-800/40">
              <Calendar size={24} className="text-primary-600 dark:text-primary-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600 dark:text-gray-900">Tasks Completed</p>
              <p className="text-2xl font-semibold">{completedTasksCount}</p>
            </div>
          </div>
        </div>
        
        <div className="card bg-gradient-to-br from-secondary-50 to-secondary-100 dark:from-secondary-900/30 dark:to-secondary-800/20 dark:text-white">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-secondary-100 dark:bg-secondary-800/40">
              <Clock size={24} className="text-secondary-600 dark:text-secondary-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600 dark:text-gray-900">Pending Tasks</p>
              <p className="text-2xl font-semibold">{tasks.filter(t => !t.completed).length}</p>
            </div>
          </div>
        </div>
        
        <div className="card bg-gradient-to-br from-accent-50 to-accent-100 dark:from-accent-900/30 dark:to-accent-800/20 dark:text-white">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-accent-100 dark:bg-accent-800/40">
              <Smile size={24} className="text-accent-600 dark:text-accent-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600 dark:text-gray-900">Avg Mood</p>
              <p className="text-2xl font-semibold">
                {averageMood ? averageMood.toFixed(1) : 'N/A'}
              </p>
            </div>
          </div>
        </div>
        
        <div className="card bg-gradient-to-br from-success-50 to-success-100 dark:from-success-900/30 dark:to-success-800/20 dark:text-white">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-success-100 dark:bg-success-800/40">
              <User2 size={24} className="text-success-600 dark:text-success-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600 dark:text-gray-900">Streak</p>
              <p className="text-2xl font-semibold">
                {moodEntries.length > 0 ? moodEntries.length : 0}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tasks section */}
        <div className="col-span-1 lg:col-span-2 card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-950">Priority Tasks</h2>
            <button 
              onClick={() => navigate('/tasks')}
              className="text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300 text-sm font-medium"
            >
              View All
            </button>
          </div>
          
          {pendingTasks.length > 0 ? (
            <div className="space-y-3">
              {pendingTasks.map(task => (
                <TaskPreview key={task.id} task={task} />
              ))}
            </div>
          ) : (
            <div className="py-8 text-center bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <p className="text-gray-500 dark:text-gray-900">No pending tasks</p>
              <button 
                onClick={() => navigate('/tasks')}
                className="mt-2 btn btn-outline text-sm px-3 py-1"
              >
                Create Task
              </button>
            </div>
          )}
        </div>
        
        {/* Wellness section */}
        <div className="col-span-1 space-y-6">
          {/* Suggestions */}
          <div className="card">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Suggestions</h2>
            </div>
            
            {prioritySuggestions.length > 0 ? (
              <SuggestionsList suggestions={prioritySuggestions} />
            ) : (
              <div className="py-6 text-center bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <p className="text-gray-500 dark:text-gray-900">No active suggestions</p>
              </div>
            )}
          </div>
          
          {/* Mood & Health Summary */}
          <div className="card">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Today's Wellness</h2>
              <button 
                onClick={() => navigate('/mood')}
                className="text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300 text-sm font-medium"
              >
                Log Data
              </button>
            </div>
            
            {(latestMood || latestHealth) ? (
              <div className="space-y-4 text-gray-700">
                {latestMood && (
                  <MoodSummary mood={latestMood} />
                )}
                
                {latestHealth && (
                  <HealthSummary health={latestHealth} />
                )}
              </div>
            ) : (
              <div className="py-6 text-center bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <p className="text-gray-500 dark:text-gray-900">No wellness data recorded yet</p>
                <button 
                  onClick={() => navigate('/mood')}
                  className="mt-2 btn btn-outline text-sm px-3 py-1"
                >
                  Log Now
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;