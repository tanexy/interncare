import { Task, MoodEntry, HealthData, SuggestionType } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { differenceInDays, subDays } from 'date-fns';

export const generateSuggestions = (
  healthData: HealthData[],
  moodEntries: MoodEntry[],
  tasks: Task[]
): SuggestionType[] => {
  const suggestions: SuggestionType[] = [];
  const now = new Date();
  const weekAgo = subDays(now, 7);
  
  // Get recent data
  const recentHealth = healthData
    .filter(data => new Date(data.date) >= weekAgo)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
  const recentMood = moodEntries
    .filter(entry => new Date(entry.date) >= weekAgo)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
  const recentTasks = tasks
    .filter(task => new Date(task.createdAt) >= weekAgo)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  
  // Check sleep patterns
  if (recentHealth.length >= 3) {
    const lowSleepDays = recentHealth.filter(data => data.sleepHours < 6).length;
    
    if (lowSleepDays >= 3) {
      suggestions.push({
        id: uuidv4(),
        type: 'sleep',
        message: 'You\'ve been getting less than 6 hours of sleep for several days. Try to prioritize rest and aim for 7-8 hours.',
        priority: 'high',
        createdAt: new Date().toISOString(),
      });
    } else if (lowSleepDays >= 1) {
      suggestions.push({
        id: uuidv4(),
        type: 'sleep',
        message: 'Your sleep has been a bit low recently. Consider going to bed 30 minutes earlier tonight.',
        priority: 'medium',
        createdAt: new Date().toISOString(),
      });
    }
  }
  
  // Check water intake
  if (recentHealth.length > 0) {
    const avgWaterIntake = recentHealth.reduce((sum, data) => sum + data.waterIntake, 0) / recentHealth.length;
    
    if (avgWaterIntake < 6) {
      suggestions.push({
        id: uuidv4(),
        type: 'water',
        message: 'Your water intake has been low. Try to drink at least 8 glasses of water daily for better focus and energy.',
        priority: 'medium',
        createdAt: new Date().toISOString(),
      });
    }
  }
  
  // Check stress levels
  if (recentHealth.length >= 2) {
    const highStressDays = recentHealth.filter(data => data.stressLevel > 7).length;
    
    if (highStressDays >= 2) {
      suggestions.push({
        id: uuidv4(),
        type: 'stress',
        message: 'Your stress levels have been high lately. Consider taking short breaks, practicing mindfulness, or going for a walk.',
        priority: 'high',
        createdAt: new Date().toISOString(),
      });
    }
  }
  
  // Check mood patterns
  if (recentMood.length >= 3) {
    const lowMoodDays = recentMood.filter(entry => entry.score < 5).length;
    
    if (lowMoodDays >= 2) {
      suggestions.push({
        id: uuidv4(),
        type: 'general',
        message: 'Your mood has been lower than usual. Consider talking to someone, doing something you enjoy, or taking a break if possible.',
        priority: 'high',
        createdAt: new Date().toISOString(),
      });
    }
  }
  
  // Check productivity and task completion
  const completedTasks = recentTasks.filter(task => task.completed).length;
  const totalTasks = recentTasks.length;
  
  if (totalTasks > 0) {
    const completionRate = completedTasks / totalTasks;
    
    if (completionRate < 0.4 && totalTasks > 5) {
      suggestions.push({
        id: uuidv4(),
        type: 'productivity',
        message: 'Your task completion rate is low. Try breaking down larger tasks into smaller, manageable steps.',
        priority: 'medium',
        createdAt: new Date().toISOString(),
      });
    } else if (completionRate > 0.8 && totalTasks > 5) {
      suggestions.push({
        id: uuidv4(),
        type: 'productivity',
        message: 'Great job completing your tasks! Your productivity has been excellent.',
        priority: 'low',
        createdAt: new Date().toISOString(),
      });
    }
  }
  
  // Check if user hasn't been logging data
  const lastHealthEntry = recentHealth.length > 0 ? new Date(recentHealth[0].date) : null;
  const lastMoodEntry = recentMood.length > 0 ? new Date(recentMood[0].date) : null;
  
  if (lastHealthEntry && differenceInDays(now, lastHealthEntry) > 1) {
    suggestions.push({
      id: uuidv4(),
      type: 'general',
      message: 'Remember to log your health data daily for more accurate insights and suggestions.',
      priority: 'medium',
      createdAt: new Date().toISOString(),
    });
  }
  
  if (lastMoodEntry && differenceInDays(now, lastMoodEntry) > 1) {
    suggestions.push({
      id: uuidv4(),
      type: 'general',
      message: 'Don\'t forget to track your mood daily. Regular tracking helps identify patterns and improve well-being.',
      priority: 'medium',
      createdAt: new Date().toISOString(),
    });
  }
  
  // Add daily motivation
  const motivationalMessages = [
    'Small steps lead to big changes. Keep going!',
    'Your wellbeing matters. Take time for yourself today.',
    'Progress isn\'t always linear. Be kind to yourself.',
    'Every small healthy choice adds up over time.',
    'Your future self will thank you for the good habits you build today.',
  ];
  
  suggestions.push({
    id: uuidv4(),
    type: 'general',
    message: motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)],
    priority: 'low',
    createdAt: new Date().toISOString(),
  });
  
  return suggestions;
};