// Task types
export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  completed: boolean;
  timeBlock?: {
    start: string;
    end: string;
  };
  tags?: string[];
  createdAt: string;
}

// Mood tracking types
export interface MoodEntry {
  id: string;
  date: string;
  score: number; // 1-10 scale
  notes?: string;
  factors?: string[]; // What contributed to this mood
}

// Health tracking types
export interface HealthData {
  id: string;
  date: string;
  sleepHours: number;
  stressLevel: number; // 1-10 scale
  waterIntake: number; // glasses or oz
  exercise?: {
    minutes: number;
    type?: string;
  };
  meals?: {
    breakfast: boolean;
    lunch: boolean;
    dinner: boolean;
    snacks: number;
  };
  notes?: string;
}

// Suggestion types
export interface SuggestionType {
  id: string;
  type: 'sleep' | 'stress' | 'productivity' | 'water' | 'exercise' | 'general';
  message: string;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  dismissed?: boolean;
}

// Analytics types
export interface WeeklyStats {
  taskCompletion: number; // percentage
  averageMood: number;
  averageSleep: number;
  averageStress: number;
  waterIntakeAverage: number;
  productiveHours?: number;
}

// Chart data types
export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string;
    borderWidth?: number;
  }[];
}