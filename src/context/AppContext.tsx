import React, { createContext, useContext, useEffect, useState } from 'react';
import { format } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import { Task, MoodEntry, HealthData, SuggestionType } from '../types';
import { generateSuggestions } from '../utils/suggestionUtils';

interface AppContextType {
  // Tasks
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'completed' | 'createdAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTaskComplete: (id: string) => void;
  
  // Mood & Health tracking
  moodEntries: MoodEntry[];
  addMoodEntry: (entry: Omit<MoodEntry, 'id' | 'date'>) => void;
  
  // Health data
  healthData: HealthData[];
  addHealthData: (data: Omit<HealthData, 'id' | 'date'>) => void;
  
  // Suggestions
  suggestions: SuggestionType[];
  
  // Stats & Analytics
  getCompletedTasksCount: (days?: number) => number;
  getAverageMood: (days?: number) => number;
  getAverageSleep: (days?: number) => number;
  getWaterIntakeAverage: (days?: number) => number;
  getStressLevelAverage: (days?: number) => number;
  
  // Theme and UI
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize state from localStorage or with defaults
  const [tasks, setTasks] = useState<Task[]>(() => {
    const savedTasks = localStorage.getItem('interncare-tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>(() => {
    const savedMoods = localStorage.getItem('interncare-moods');
    return savedMoods ? JSON.parse(savedMoods) : [];
  });
  
  const [healthData, setHealthData] = useState<HealthData[]>(() => {
    const savedHealth = localStorage.getItem('interncare-health');
    return savedHealth ? JSON.parse(savedHealth) : [];
  });
  
  const [suggestions, setSuggestions] = useState<SuggestionType[]>(() => {
    const savedSuggestions = localStorage.getItem('interncare-suggestions');
    return savedSuggestions ? JSON.parse(savedSuggestions) : [];
  });
  
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const savedMode = localStorage.getItem('interncare-dark-mode');
    return savedMode ? JSON.parse(savedMode) : false;
  });

  // Save to localStorage when state changes
  useEffect(() => {
    localStorage.setItem('interncare-tasks', JSON.stringify(tasks));
  }, [tasks]);
  
  useEffect(() => {
    localStorage.setItem('interncare-moods', JSON.stringify(moodEntries));
  }, [moodEntries]);
  
  useEffect(() => {
    localStorage.setItem('interncare-health', JSON.stringify(healthData));
  }, [healthData]);
  
  useEffect(() => {
    localStorage.setItem('interncare-dark-mode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);
  
  // Generate suggestions based on health data and tasks
  useEffect(() => {
    const newSuggestions = generateSuggestions(healthData, moodEntries, tasks);
    setSuggestions(newSuggestions);
    localStorage.setItem('interncare-suggestions', JSON.stringify(newSuggestions));
  }, [healthData, moodEntries, tasks]);

  // Task management functions
  const addTask = (taskData: Omit<Task, 'id' | 'completed' | 'createdAt'>) => {
    const newTask: Task = {
      id: uuidv4(),
      completed: false,
      createdAt: new Date().toISOString(),
      ...taskData,
    };
    setTasks(prevTasks => [...prevTasks, newTask]);
  };
  
  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prevTasks =>
      prevTasks.map(task => (task.id === id ? { ...task, ...updates } : task))
    );
  };
  
  const deleteTask = (id: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
  };
  
  const toggleTaskComplete = (id: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };
  
  // Mood tracking functions
  const addMoodEntry = (entryData: Omit<MoodEntry, 'id' | 'date'>) => {
    const newEntry: MoodEntry = {
      id: uuidv4(),
      date: new Date().toISOString(),
      ...entryData,
    };
    setMoodEntries(prevEntries => [...prevEntries, newEntry]);
  };
  
  // Health tracking functions
  const addHealthData = (data: Omit<HealthData, 'id' | 'date'>) => {
    const newData: HealthData = {
      id: uuidv4(),
      date: new Date().toISOString(),
      ...data,
    };
    setHealthData(prevData => [...prevData, newData]);
  };
  
  // Analytics functions
  const getCompletedTasksCount = (days = 7) => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return tasks.filter(
      task => task.completed && new Date(task.createdAt) >= cutoffDate
    ).length;
  };
  
  const getAverageMood = (days = 7) => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    const recentEntries = moodEntries.filter(
      entry => new Date(entry.date) >= cutoffDate
    );
    
    if (recentEntries.length === 0) return 0;
    
    const sum = recentEntries.reduce((acc, entry) => acc + entry.score, 0);
    return sum / recentEntries.length;
  };
  
  const getAverageSleep = (days = 7) => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    const recentData = healthData.filter(
      data => new Date(data.date) >= cutoffDate
    );
    
    if (recentData.length === 0) return 0;
    
    const sum = recentData.reduce((acc, data) => acc + data.sleepHours, 0);
    return sum / recentData.length;
  };
  
  const getWaterIntakeAverage = (days = 7) => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    const recentData = healthData.filter(
      data => new Date(data.date) >= cutoffDate
    );
    
    if (recentData.length === 0) return 0;
    
    const sum = recentData.reduce((acc, data) => acc + data.waterIntake, 0);
    return sum / recentData.length;
  };
  
  const getStressLevelAverage = (days = 7) => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    const recentData = healthData.filter(
      data => new Date(data.date) >= cutoffDate
    );
    
    if (recentData.length === 0) return 0;
    
    const sum = recentData.reduce((acc, data) => acc + data.stressLevel, 0);
    return sum / recentData.length;
  };
  
  // Theme toggle
  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };
  
  const value = {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskComplete,
    moodEntries,
    addMoodEntry,
    healthData,
    addHealthData,
    suggestions,
    getCompletedTasksCount,
    getAverageMood,
    getAverageSleep,
    getWaterIntakeAverage,
    getStressLevelAverage,
    isDarkMode,
    toggleDarkMode,
  };
  
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Custom hook for using the context
export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};