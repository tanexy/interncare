import React, { createContext, useContext, useEffect, useState } from 'react';
import { format, subDays } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import {
  Task,
  MoodEntry,
  HealthData,
  SuggestionType,
  TeamMember,
  ActivityEvent,
  Announcement,
  Achievement,
  DepartmentStats
} from '../types';
import { generateSuggestions } from '../utils/suggestionUtils';

interface AppContextType {
  // Existing Tasks
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'completed' | 'createdAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTaskComplete: (id: string) => void;
  
  // Existing Mood & Health tracking
  moodEntries: MoodEntry[];
  addMoodEntry: (entry: Omit<MoodEntry, 'id' | 'date'>) => void;
  
  // Existing Health data
  healthData: HealthData[];
  addHealthData: (data: Omit<HealthData, 'id' | 'date'>) => void;
  
  // Existing Suggestions
  suggestions: SuggestionType[];
  
  // Existing Stats & Analytics
  getCompletedTasksCount: (days?: number) => number;
  getAverageMood: (days?: number) => number;
  getAverageSleep: (days?: number) => number;
  getWaterIntakeAverage: (days?: number) => number;
  getStressLevelAverage: (days?: number) => number;
  
  // Existing Theme
  isDarkMode: boolean;
  toggleDarkMode: () => void;

  // PREMIUM REDESIGN EXTENSIONS
  connectionStatus: 'connected' | 'reconnecting' | 'offline';
  setConnectionStatus: (status: 'connected' | 'reconnecting' | 'offline') => void;

  teamMembers: TeamMember[];
  updateMemberStatus: (id: string, status: TeamMember['status']) => void;

  activityEvents: ActivityEvent[];
  triggerSimulatedActivity: () => void;

  announcements: Announcement[];
  addAnnouncement: (announcement: Omit<Announcement, 'id' | 'date' | 'pinned'>) => void;
  dismissAnnouncement: (id: string) => void;

  achievements: Achievement[];
  unlockAchievement: (id: string) => void;

  departmentStats: DepartmentStats[];

  // AI Suggestions Streaming Experience
  aiState: {
    status: 'idle' | 'loading' | 'streaming' | 'success' | 'error';
    streamText: string;
    suggestions: SuggestionType[];
  };
  triggerAIGenerator: () => void;

  // Global actions
  clearAllData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Initial Team Members for Presence
const INITIAL_MEMBERS: TeamMember[] = [
  { id: 'm1', name: 'Sarah Jenkins', role: 'Supervisor', avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', status: 'online', currentActivity: 'Reviewing Weekly Mood Trends' },
  { id: 'm2', name: 'Alex Rivera', role: 'Intern', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', status: 'online', currentActivity: 'Designing UI Mockups' },
  { id: 'm3', name: 'David Kim', role: 'Mentor', avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', status: 'away', lastActive: '10m ago', currentActivity: 'In a Coffee Break' },
  { id: 'm4', name: 'Elena Rostova', role: 'Intern', avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150', status: 'busy', currentActivity: 'Debugging Supabase Sync' },
  { id: 'm5', name: 'Marcus Vance', role: 'Supervisor', avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150', status: 'offline', lastActive: '1h ago' }
];

// Initial Supervisor Announcements
const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'a1',
    author: 'Sarah Jenkins',
    authorRole: 'Supervisor',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    title: 'Weekly Mindfulness Seminar 🧘‍♀️',
    content: 'Hi team! Remember to join our wellness and breathwork seminar this Thursday at 3:00 PM. Taking these 30 minutes is incredibly beneficial for keeping mental focus and avoiding burnout.',
    date: new Date(Date.now() - 3600000 * 4).toISOString(), // 4h ago
    pinned: true,
  },
  {
    id: 'a2',
    author: 'Marcus Vance',
    authorRole: 'Supervisor',
    authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    title: 'Midterm Internship Reviews',
    content: 'Midterm feedback forms have been sent. Please make sure your logged work tasks are complete and mood logs up to date by Friday so we have accurate analytics.',
    date: new Date(Date.now() - 3600000 * 24).toISOString(), // 24h ago
    pinned: false,
  }
];

// Initial Realtime Activity Log
const INITIAL_ACTIVITIES: ActivityEvent[] = [
  { id: 'act1', userId: 'm2', userName: 'Alex Rivera', userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', type: 'task_complete', detail: 'completed the "Revamp Layout Grid" task', timestamp: new Date(Date.now() - 60000 * 15).toISOString() }, // 15m ago
  { id: 'act2', userId: 'm4', userName: 'Elena Rostova', userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150', type: 'mood', detail: 'logged an "Excellent" mood check-in (9/10)', timestamp: new Date(Date.now() - 60000 * 45).toISOString() }, // 45m ago
  { id: 'act3', userId: 'm1', userName: 'Sarah Jenkins', userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', type: 'achievement', detail: 'unlocked the "Wellness Champion" leadership badge', timestamp: new Date(Date.now() - 3600000 * 2).toISOString() } // 2h ago
];

// Initial System Achievements
const INITIAL_ACHIEVEMENTS: Achievement[] = [
  { id: 'ach1', title: 'Perfect Streak', description: 'Log your mood 3 days in a row', iconName: 'streak', target: 3, progress: 1 },
  { id: 'ach2', title: 'Deep Rest', description: 'Log 8+ hours of sleep twice', iconName: 'sleep', target: 2, progress: 0 },
  { id: 'ach3', title: 'Hydration Hero', description: 'Meet the 8-glasses water target', iconName: 'water', target: 1, progress: 0 },
  { id: 'ach4', title: 'Productivity King', description: 'Complete 10 tasks successfully', iconName: 'task', target: 10, progress: 3 },
  { id: 'ach5', title: 'Mind Journaler', description: 'Add detailed thoughts to your mood logs 3 times', iconName: 'mood', target: 3, progress: 1 }
];

// Department wellbeing benchmark metrics
const DEPARTMENT_STATS: DepartmentStats[] = [
  { name: 'Engineering', avgMood: 7.8, taskCompletion: 84, stressLevel: 4.2 },
  { name: 'Product & Design', avgMood: 8.5, taskCompletion: 92, stressLevel: 3.5 },
  { name: 'Marketing', avgMood: 7.2, taskCompletion: 76, stressLevel: 5.1 },
  { name: 'Operations', avgMood: 6.9, taskCompletion: 80, stressLevel: 4.8 }
];

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

  // PREMIUM REDESIGN EXTEND STATES
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'reconnecting' | 'offline'>('connected');
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(INITIAL_MEMBERS);
  const [activityEvents, setActivityEvents] = useState<ActivityEvent[]>(INITIAL_ACTIVITIES);
  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    const savedAnn = localStorage.getItem('interncare-announcements');
    return savedAnn ? JSON.parse(savedAnn) : INITIAL_ANNOUNCEMENTS;
  });
  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    const savedAch = localStorage.getItem('interncare-achievements');
    return savedAch ? JSON.parse(savedAch) : INITIAL_ACHIEVEMENTS;
  });

  const [aiState, setAiState] = useState<{
    status: 'idle' | 'loading' | 'streaming' | 'success' | 'error';
    streamText: string;
    suggestions: SuggestionType[];
  }>({
    status: 'idle',
    streamText: '',
    suggestions: []
  });

  // Save to localStorage when state changes
  useEffect(() => {
    localStorage.setItem('interncare-tasks', JSON.stringify(tasks));
  }, [tasks]);
  
  useEffect(() => {
    localStorage.setItem('interncare-moods', JSON.stringify(moodEntries));

    // Update streak achievement progress based on mood entry length
    setAchievements(prev => prev.map(ach => {
      if (ach.iconName === 'streak') {
        const newProgress = Math.min(moodEntries.length, ach.target);
        return {
          ...ach,
          progress: newProgress,
          unlockedAt: newProgress >= ach.target ? new Date().toISOString() : ach.unlockedAt
        };
      }
      return ach;
    }));
  }, [moodEntries]);
  
  useEffect(() => {
    localStorage.setItem('interncare-health', JSON.stringify(healthData));

    // Update sleep and water achievements
    setAchievements(prev => prev.map(ach => {
      if (ach.iconName === 'sleep') {
        const goodSleepDays = healthData.filter(h => h.sleepHours >= 8).length;
        const newProgress = Math.min(goodSleepDays, ach.target);
        return {
          ...ach,
          progress: newProgress,
          unlockedAt: newProgress >= ach.target ? new Date().toISOString() : ach.unlockedAt
        };
      }
      if (ach.iconName === 'water') {
        const goodWaterDays = healthData.filter(h => h.waterIntake >= 8).length;
        const newProgress = Math.min(goodWaterDays, ach.target);
        return {
          ...ach,
          progress: newProgress,
          unlockedAt: newProgress >= ach.target ? new Date().toISOString() : ach.unlockedAt
        };
      }
      return ach;
    }));
  }, [healthData]);
  
  useEffect(() => {
    localStorage.setItem('interncare-dark-mode', JSON.stringify(isDarkMode));
    if (isDarkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem('interncare-announcements', JSON.stringify(announcements));
  }, [announcements]);

  useEffect(() => {
    localStorage.setItem('interncare-achievements', JSON.stringify(achievements));
  }, [achievements]);
  
  // Generate suggestions based on health data and tasks (standard business logic preserved)
  useEffect(() => {
    const newSuggestions = generateSuggestions(healthData, moodEntries, tasks);
    setSuggestions(newSuggestions);
    localStorage.setItem('interncare-suggestions', JSON.stringify(newSuggestions));
  }, [healthData, moodEntries, tasks]);

  // Periodic simulation for live collaborative feel
  useEffect(() => {
    const interval = setInterval(() => {
      // 1. Randomly simulate presence change
      setTeamMembers(prev => prev.map(member => {
        if (Math.random() > 0.8) {
          const statuses: TeamMember['status'][] = ['online', 'away', 'busy', 'offline'];
          const newStatus = statuses[Math.floor(Math.random() * statuses.length)];
          return {
            ...member,
            status: newStatus,
            lastActive: newStatus === 'offline' ? 'Just now' : undefined
          };
        }
        return member;
      }));

      // 2. Randomly simulate activity feed update
      if (Math.random() > 0.85) {
        triggerSimulatedActivity();
      }
    }, 20000); // Check every 20 seconds

    return () => clearInterval(interval);
  }, []);

  // Task management functions
  const addTask = (taskData: Omit<Task, 'id' | 'completed' | 'createdAt'>) => {
    const newTask: Task = {
      id: uuidv4(),
      completed: false,
      createdAt: new Date().toISOString(),
      ...taskData,
    };
    setTasks(prevTasks => [...prevTasks, newTask]);

    // Push simulation event
    const newAct: ActivityEvent = {
      id: uuidv4(),
      userId: 'user-me',
      userName: 'You (Intern)',
      userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      type: 'task_complete',
      detail: `created a new task: "${newTask.title}"`,
      timestamp: new Date().toISOString()
    };
    setActivityEvents(prev => [newAct, ...prev.slice(0, 9)]);
  };
  
  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prevTasks =>
      prevTasks.map(task => (task.id === id ? { ...task, ...updates } : task))
    );
  };
  
  const deleteTask = (id: string) => {
    const taskToDelete = tasks.find(t => t.id === id);
    setTasks(prevTasks => prevTasks.filter(task => task.id !== id));

    if (taskToDelete) {
      const newAct: ActivityEvent = {
        id: uuidv4(),
        userId: 'user-me',
        userName: 'You (Intern)',
        userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        type: 'task_complete',
        detail: `deleted task: "${taskToDelete.title}"`,
        timestamp: new Date().toISOString()
      };
      setActivityEvents(prev => [newAct, ...prev.slice(0, 9)]);
    }
  };
  
  const toggleTaskComplete = (id: string) => {
    setTasks(prevTasks => {
      const updated = prevTasks.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      );

      const toggledTask = updated.find(t => t.id === id);
      if (toggledTask) {
        const newAct: ActivityEvent = {
          id: uuidv4(),
          userId: 'user-me',
          userName: 'You (Intern)',
          userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
          type: 'task_complete',
          detail: toggledTask.completed
            ? `completed the task: "${toggledTask.title}" 🎉`
            : `marked the task "${toggledTask.title}" as pending`,
          timestamp: new Date().toISOString()
        };
        setActivityEvents(prev => [newAct, ...prev.slice(0, 9)]);

        // Update total tasks achievement
        if (toggledTask.completed) {
          setAchievements(prevAch => prevAch.map(ach => {
            if (ach.iconName === 'task') {
              const newProgress = Math.min(ach.progress + 1, ach.target);
              return {
                ...ach,
                progress: newProgress,
                unlockedAt: newProgress >= ach.target ? new Date().toISOString() : ach.unlockedAt
              };
            }
            return ach;
          }));
        }
      }
      return updated;
    });
  };
  
  // Mood tracking functions
  const addMoodEntry = (entryData: Omit<MoodEntry, 'id' | 'date'>) => {
    const newEntry: MoodEntry = {
      id: uuidv4(),
      date: new Date().toISOString(),
      ...entryData,
    };
    setMoodEntries(prevEntries => [...prevEntries, newEntry]);

    const scoreText = newEntry.score >= 8 ? 'Excellent' : newEntry.score >= 6 ? 'Good' : newEntry.score >= 4 ? 'Neutral' : 'Challenging';
    const newAct: ActivityEvent = {
      id: uuidv4(),
      userId: 'user-me',
      userName: 'You (Intern)',
      userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      type: 'mood',
      detail: `submitted a mood check-in: Feeling "${scoreText}" (${newEntry.score}/10)`,
      timestamp: new Date().toISOString()
    };
    setActivityEvents(prev => [newAct, ...prev.slice(0, 9)]);

    // Check mind journaler progress if notes present
    if (newEntry.notes) {
      setAchievements(prev => prev.map(ach => {
        if (ach.iconName === 'mood') {
          const newProgress = Math.min(ach.progress + 1, ach.target);
          return {
            ...ach,
            progress: newProgress,
            unlockedAt: newProgress >= ach.target ? new Date().toISOString() : ach.unlockedAt
          };
        }
        return ach;
      }));
    }
  };
  
  // Health tracking functions
  const addHealthData = (data: Omit<HealthData, 'id' | 'date'>) => {
    const newData: HealthData = {
      id: uuidv4(),
      date: new Date().toISOString(),
      ...data,
    };
    setHealthData(prevData => [...prevData, newData]);

    const newAct: ActivityEvent = {
      id: uuidv4(),
      userId: 'user-me',
      userName: 'You (Intern)',
      userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      type: 'health_log',
      detail: `logged health metrics: ${newData.sleepHours}h sleep, ${newData.waterIntake} gl water, stress ${newData.stressLevel}/10`,
      timestamp: new Date().toISOString()
    };
    setActivityEvents(prev => [newAct, ...prev.slice(0, 9)]);
  };
  
  // Analytics functions
  const getCompletedTasksCount = (days = 7) => {
    const cutoffDate = subDays(new Date(), days);
    return tasks.filter(
      task => task.completed && new Date(task.createdAt) >= cutoffDate
    ).length;
  };
  
  const getAverageMood = (days = 7) => {
    const cutoffDate = subDays(new Date(), days);
    const recentEntries = moodEntries.filter(
      entry => new Date(entry.date) >= cutoffDate
    );
    if (recentEntries.length === 0) return 0;
    const sum = recentEntries.reduce((acc, entry) => acc + entry.score, 0);
    return sum / recentEntries.length;
  };
  
  const getAverageSleep = (days = 7) => {
    const cutoffDate = subDays(new Date(), days);
    const recentData = healthData.filter(
      data => new Date(data.date) >= cutoffDate
    );
    if (recentData.length === 0) return 0;
    const sum = recentData.reduce((acc, data) => acc + data.sleepHours, 0);
    return sum / recentData.length;
  };
  
  const getWaterIntakeAverage = (days = 7) => {
    const cutoffDate = subDays(new Date(), days);
    const recentData = healthData.filter(
      data => new Date(data.date) >= cutoffDate
    );
    if (recentData.length === 0) return 0;
    const sum = recentData.reduce((acc, data) => acc + data.waterIntake, 0);
    return sum / recentData.length;
  };
  
  const getStressLevelAverage = (days = 7) => {
    const cutoffDate = subDays(new Date(), days);
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

  // NEW PREMIUM LOGICS
  const updateMemberStatus = (id: string, status: TeamMember['status']) => {
    setTeamMembers(prev => prev.map(m => m.id === id ? { ...m, status } : m));
  };

  const triggerSimulatedActivity = () => {
    // Pick random team member
    const activeMembers = teamMembers.filter(m => m.id !== 'user-me' && m.status !== 'offline');
    if (activeMembers.length === 0) return;
    const member = activeMembers[Math.floor(Math.random() * activeMembers.length)];

    const simulatedDetails = [
      { type: 'task_complete', detail: 'finished compiling the "Supabase Realtime Feed" component ✅' },
      { type: 'mood', detail: 'shared a positive 9/10 mood check-in' },
      { type: 'health_log', detail: 'completed their morning yoga session 🧘‍♂️' },
      { type: 'achievement', detail: 'earned the "Deep Sleep Practitioner" achievement' },
      { type: 'task_complete', detail: 'created a new high priority ticket "Prepare Demo Deck"' }
    ];

    const pick = simulatedDetails[Math.floor(Math.random() * simulatedDetails.length)];

    const newAct: ActivityEvent = {
      id: uuidv4(),
      userId: member.id,
      userName: member.name,
      userAvatar: member.avatarUrl,
      type: pick.type as any,
      detail: pick.detail,
      timestamp: new Date().toISOString()
    };

    setActivityEvents(prev => [newAct, ...prev.slice(0, 9)]);
  };

  const addAnnouncement = (annData: Omit<Announcement, 'id' | 'date' | 'pinned'>) => {
    const newAnn: Announcement = {
      id: uuidv4(),
      date: new Date().toISOString(),
      pinned: false,
      ...annData
    };
    setAnnouncements(prev => [newAnn, ...prev]);
  };

  const dismissAnnouncement = (id: string) => {
    setAnnouncements(prev => prev.filter(ann => ann.id !== id));
  };

  const unlockAchievement = (id: string) => {
    setAchievements(prev => prev.map(ach => ach.id === id ? { ...ach, unlockedAt: new Date().toISOString(), progress: ach.target } : ach));
  };

  // Chat-GPT / Gemini Streaming Experience Simulation
  const triggerAIGenerator = () => {
    setAiState(prev => ({
      ...prev,
      status: 'loading',
      streamText: ''
    }));

    // Step 1: Simulated thinking/loading
    setTimeout(() => {
      setAiState(prev => ({
        ...prev,
        status: 'streaming'
      }));

      // Step 2: Streaming output simulation text
      const fullMessage = "Based on your recent logs, I noticed your sleep has decreased to 5.8 hours on average while your pending task list expanded. Here are my personalized recommendations:\n\n1. 🛑 *Task Cap*: Try setting a hard limit of 3 priorities today.\n2. ☕ *Caffeine curfew*: Stop caffeine intake by 2:00 PM to assist deep sleep cycles.\n3. 🚶‍♂️ *Micro-recess*: Plan a 10-minute walk after lunch to release physical stress.\n\nKeep up the wonderful work! InternCare AI has logged these custom tips for you.";

      let index = 0;
      const interval = setInterval(() => {
        if (index < fullMessage.length) {
          const chunk = fullMessage.slice(0, index + 3);
          setAiState(prev => ({
            ...prev,
            streamText: chunk
          }));
          index += 3;
        } else {
          clearInterval(interval);

          // Seed streaming AI recommendations into Suggestions State
          const streamSuggestions: SuggestionType[] = [
            { id: uuidv4(), type: 'sleep', message: 'Caffeine curfew: Avoid caffeinated beverages after 2:00 PM.', priority: 'high', createdAt: new Date().toISOString() },
            { id: uuidv4(), type: 'productivity', message: 'Priority Cap: Select exactly 3 tasks for your daily focus.', priority: 'medium', createdAt: new Date().toISOString() },
            { id: uuidv4(), type: 'stress', message: 'Take a 10-minute quiet walk outdoors after lunchtime.', priority: 'low', createdAt: new Date().toISOString() }
          ];

          setAiState(prev => ({
            ...prev,
            status: 'success',
            streamText: fullMessage,
            suggestions: streamSuggestions
          }));

          // Merge them into suggestions context so they populate everywhere
          setSuggestions(prev => [...streamSuggestions, ...prev]);
        }
      }, 15);
    }, 1200);
  };

  const clearAllData = () => {
    localStorage.removeItem('interncare-tasks');
    localStorage.removeItem('interncare-moods');
    localStorage.removeItem('interncare-health');
    localStorage.removeItem('interncare-suggestions');
    localStorage.removeItem('interncare-announcements');
    localStorage.removeItem('interncare-achievements');

    setTasks([]);
    setMoodEntries([]);
    setHealthData([]);
    setSuggestions([]);
    setAnnouncements(INITIAL_ANNOUNCEMENTS);
    setAchievements(INITIAL_ACHIEVEMENTS);
    setAiState({ status: 'idle', streamText: '', suggestions: [] });
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

    // premium redesign extensions
    connectionStatus,
    setConnectionStatus,
    teamMembers,
    updateMemberStatus,
    activityEvents,
    triggerSimulatedActivity,
    announcements,
    addAnnouncement,
    dismissAnnouncement,
    achievements,
    unlockAchievement,
    departmentStats: DEPARTMENT_STATS,
    aiState,
    triggerAIGenerator,
    clearAllData
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