import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { format, subDays, isAfter } from 'date-fns';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend, 
  BarElement, 
  ArcElement,
} from 'chart.js';
import {
  BarChart2,
  TrendingUp,
  Moon,
  Activity,
  Smile,
  Clock,
  Heart,
  Coffee,
  Calendar,
  Sparkles,
  Award
} from 'lucide-react';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
  ArcElement
);

const Analytics: React.FC = () => {
  const { 
    tasks, 
    moodEntries, 
    healthData,
    getCompletedTasksCount,
    getAverageMood,
    getAverageSleep,
    getStressLevelAverage,
    getWaterIntakeAverage,
    isDarkMode
  } = useApp();
  
  const [timeRange, setTimeRange] = useState<'week' | 'month'>('week');
  
  // Get date range based on selected time range
  const getDateRangeStart = () => {
    return timeRange === 'week' ? subDays(new Date(), 6) : subDays(new Date(), 29);
  };
  
  // Filter data based on time range
  const filteredTasks = tasks.filter(task => 
    isAfter(new Date(task.createdAt), getDateRangeStart())
  );
  
  const filteredMoodEntries = moodEntries.filter(entry => 
    isAfter(new Date(entry.date), getDateRangeStart())
  );
  
  const filteredHealthData = healthData.filter(data => 
    isAfter(new Date(data.date), getDateRangeStart())
  );
  
  // Task Completion Rate
  const completionRate = filteredTasks.length > 0 
    ? (filteredTasks.filter(task => task.completed).length / filteredTasks.length) * 100 
    : 0;
  
  // Priority distribution
  const priorityDistribution = {
    high: filteredTasks.filter(task => task.priority === 'high').length,
    medium: filteredTasks.filter(task => task.priority === 'medium').length,
    low: filteredTasks.filter(task => task.priority === 'low').length,
  };
  
  // Generate date labels for the charts
  const generateDateLabels = () => {
    const labels = [];
    const daysToShow = timeRange === 'week' ? 7 : 30;
    
    for (let i = daysToShow - 1; i >= 0; i--) {
      const date = subDays(new Date(), i);
      labels.push(format(date, 'MMM d'));
    }
    
    return labels;
  };
  
  const dateLabels = generateDateLabels();
  
  // Generate daily completion data
  const generateDailyCompletionData = () => {
    const data = Array(dateLabels.length).fill(0);
    
    filteredTasks.forEach(task => {
      if (task.completed) {
        const taskDate = format(new Date(task.createdAt), 'MMM d');
        const index = dateLabels.indexOf(taskDate);
        if (index !== -1) {
          data[index]++;
        }
      }
    });
    
    return data;
  };
  
  // Generate mood data
  const generateMoodData = () => {
    const data = Array(dateLabels.length).fill(null);
    
    dateLabels.forEach((label, index) => {
      const entriesForDate = filteredMoodEntries.filter(entry => 
        format(new Date(entry.date), 'MMM d') === label
      );
      
      if (entriesForDate.length > 0) {
        const sum = entriesForDate.reduce((acc, entry) => acc + entry.score, 0);
        data[index] = sum / entriesForDate.length;
      }
    });
    
    return data;
  };
  
  // Generate sleep data
  const generateSleepData = () => {
    const data = Array(dateLabels.length).fill(null);
    
    dateLabels.forEach((label, index) => {
      const entriesForDate = filteredHealthData.filter(entry => 
        format(new Date(entry.date), 'MMM d') === label
      );
      
      if (entriesForDate.length > 0) {
        const sum = entriesForDate.reduce((acc, entry) => acc + entry.sleepHours, 0);
        data[index] = sum / entriesForDate.length;
      }
    });
    
    return data;
  };
  
  // Generate stress data
  const generateStressData = () => {
    const data = Array(dateLabels.length).fill(null);
    
    dateLabels.forEach((label, index) => {
      const entriesForDate = filteredHealthData.filter(entry => 
        format(new Date(entry.date), 'MMM d') === label
      );
      
      if (entriesForDate.length > 0) {
        const sum = entriesForDate.reduce((acc, entry) => acc + entry.stressLevel, 0);
        data[index] = sum / entriesForDate.length;
      }
    });
    
    return data;
  };

  // PREMIUM STYLING FOR CHARTS (Theme Adaptive)
  const textColor = isDarkMode ? '#cbd5e1' : '#475569';
  const gridColor = isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)';
  
  const taskCompletionChartData = {
    labels: dateLabels,
    datasets: [
      {
        label: 'Tasks Completed',
        data: generateDailyCompletionData(),
        backgroundColor: 'rgba(20, 184, 166, 0.65)',
        borderColor: 'rgba(20, 184, 166, 1)',
        borderWidth: 1.5,
        borderRadius: 6,
      },
    ],
  };

  const chartOptionsBase = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: textColor,
          font: { family: 'Plus Jakarta Sans', weight: 'bold' as const, size: 11 }
        }
      }
    },
    scales: {
      x: {
        grid: { color: gridColor },
        ticks: { color: textColor, font: { family: 'Inter', size: 10 } }
      },
      y: {
        grid: { color: gridColor },
        ticks: { color: textColor, font: { family: 'Inter', size: 10 } }
      }
    }
  };
  
  const moodChartData = {
    labels: dateLabels,
    datasets: [
      {
        label: 'Mood Tracker (1-10)',
        data: generateMoodData(),
        borderColor: 'rgba(245, 158, 11, 1)',
        backgroundColor: 'rgba(245, 158, 11, 0.07)',
        tension: 0.35,
        fill: true,
        pointBackgroundColor: 'rgba(245, 158, 11, 1)',
        pointBorderColor: isDarkMode ? '#0f172a' : '#fff',
        pointBorderWidth: 2,
        pointRadius: 4.5,
      },
    ],
  };
  
  const sleepStressChartData = {
    labels: dateLabels,
    datasets: [
      {
        label: 'Sleep Hours',
        data: generateSleepData(),
        borderColor: 'rgba(99, 102, 241, 1)',
        backgroundColor: 'rgba(99, 102, 241, 0.05)',
        tension: 0.35,
        yAxisID: 'y',
        pointBackgroundColor: 'rgba(99, 102, 241, 1)',
        pointBorderColor: isDarkMode ? '#0f172a' : '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
      },
      {
        label: 'Stress Level',
        data: generateStressData(),
        borderColor: 'rgba(244, 63, 94, 1)',
        backgroundColor: 'rgba(244, 63, 94, 0.05)',
        tension: 0.35,
        yAxisID: 'y1',
        pointBackgroundColor: 'rgba(244, 63, 94, 1)',
        pointBorderColor: isDarkMode ? '#0f172a' : '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
      },
    ],
  };
  
  const priorityChartData = {
    labels: ['High', 'Medium', 'Low'],
    datasets: [
      {
        data: [
          priorityDistribution.high, 
          priorityDistribution.medium, 
          priorityDistribution.low
        ],
        backgroundColor: [
          'rgba(244, 63, 94, 0.65)',
          'rgba(245, 158, 11, 0.65)',
          'rgba(16, 185, 129, 0.65)',
        ],
        borderColor: isDarkMode ? '#0f172a' : '#fff',
        borderWidth: 2,
      },
    ],
  };
  
  const sleepStressOptions = {
    ...chartOptionsBase,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    scales: {
      x: {
        grid: { color: gridColor },
        ticks: { color: textColor, font: { family: 'Inter', size: 10 } }
      },
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        grid: { color: gridColor },
        title: {
          display: true,
          text: 'Sleep Hours',
          color: textColor,
          font: { family: 'Plus Jakarta Sans', weight: 'bold' as const, size: 10 }
        },
        min: 0,
        max: 12,
        ticks: { color: textColor }
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        grid: {
          drawOnChartArea: false,
        },
        title: {
          display: true,
          text: 'Stress Level',
          color: textColor,
          font: { family: 'Plus Jakarta Sans', weight: 'bold' as const, size: 10 }
        },
        min: 0,
        max: 10,
        ticks: { color: textColor }
      },
    },
  };

  const donutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: textColor,
          font: { family: 'Plus Jakarta Sans', weight: 'bold' as const, size: 11 }
        }
      }
    }
  };
  
  return (
    <div className="space-y-8">

      {/* Header Row */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">Analytics & Insights</h1>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">
            Advanced overview of task productivity and health variable trends over time
          </p>
        </div>
        <div>
          <select
            value={timeRange}
            onChange={e => setTimeRange(e.target.value as 'week' | 'month')}
            className="select py-1.5 px-3 text-xs bg-white dark:bg-slate-900"
            aria-label="Filter timeline range"
          >
            <option value="week">📅 Last 7 Days Range</option>
            <option value="month">📅 Last 30 Days Range</option>
          </select>
        </div>
      </div>
      
      {/* Dynamic Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        {/* Task completion rate card */}
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
            <TrendingUp size={12} className="text-teal-500" /> Completed Tasks
          </p>
          <div className="flex items-baseline justify-between mt-2.5">
            <p className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">
              {getCompletedTasksCount(timeRange === 'week' ? 7 : 30)}
            </p>
            <p className="text-xs font-bold text-teal-600 dark:text-teal-400">{completionRate.toFixed(0)}% rate</p>
          </div>
          <div className="w-full h-1 bg-slate-100 dark:bg-slate-800 rounded-full mt-3.5 overflow-hidden">
            <div 
              className="h-1 bg-teal-500 rounded-full"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>
        
        {/* Mood Avg card */}
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
            <Smile size={12} className="text-amber-500" /> Average Mood
          </p>
          <div className="flex items-baseline justify-between mt-2.5">
            <p className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">
              {getAverageMood(timeRange === 'week' ? 7 : 30).toFixed(1)}
            </p>
            <p className="text-xs text-slate-400">out of 10</p>
          </div>
          <div className="w-full h-1 bg-slate-100 dark:bg-slate-800 rounded-full mt-3.5 overflow-hidden">
            <div 
              className="h-1 bg-amber-500 rounded-full"
              style={{ width: `${getAverageMood(timeRange === 'week' ? 7 : 30) * 10}%` }}
            />
          </div>
        </div>
        
        {/* Sleep Avg card */}
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
            <Moon size={12} className="text-indigo-500" /> Average Sleep
          </p>
          <div className="flex items-baseline justify-between mt-2.5">
            <p className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">
              {getAverageSleep(timeRange === 'week' ? 7 : 30).toFixed(1)}
            </p>
            <p className="text-xs text-slate-400">hours/night</p>
          </div>
          <div className="w-full h-1 bg-slate-100 dark:bg-slate-800 rounded-full mt-3.5 overflow-hidden">
            <div 
              className="h-1 bg-indigo-500 rounded-full"
              style={{ width: `${(getAverageSleep(timeRange === 'week' ? 7 : 30) / 10) * 100}%` }}
            />
          </div>
        </div>
        
        {/* Stress Avg card */}
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
            <Heart size={12} className="text-rose-500" /> Average Stress
          </p>
          <div className="flex items-baseline justify-between mt-2.5">
            <p className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">
              {getStressLevelAverage(timeRange === 'week' ? 7 : 30).toFixed(1)}
            </p>
            <p className="text-xs text-slate-400">out of 10</p>
          </div>
          <div className="w-full h-1 bg-slate-100 dark:bg-slate-800 rounded-full mt-3.5 overflow-hidden">
            <div 
              className="h-1 bg-rose-500 rounded-full"
              style={{ width: `${getStressLevelAverage(timeRange === 'week' ? 7 : 30) * 10}%` }}
            />
          </div>
        </div>

      </div>
      
      {/* 2-Column Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Task Completion Bar Chart */}
        <div className="card">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Task Completion Trends</h3>
          <div className="h-64">
            {filteredTasks.length > 0 ? (
              <Bar data={taskCompletionChartData} options={chartOptionsBase} />
            ) : (
              <div className="flex h-full items-center justify-center text-xs text-slate-400">
                No task records found in this range
              </div>
            )}
          </div>
        </div>
        
        {/* Mood Journal Line Chart */}
        <div className="card">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Mindfulness Tracking Curves</h3>
          <div className="h-64">
            {filteredMoodEntries.length > 0 ? (
              <Line data={moodChartData} options={chartOptionsBase} />
            ) : (
              <div className="flex h-full items-center justify-center text-xs text-slate-400">
                No mindfulness log records found in this range
              </div>
            )}
          </div>
        </div>
        
        {/* Sleep vs. Stress Dual Axis Line Chart */}
        <div className="card">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Sleep Quality vs Stress Index</h3>
          <div className="h-64">
            {filteredHealthData.length > 0 ? (
              <Line data={sleepStressChartData} options={sleepStressOptions} />
            ) : (
              <div className="flex h-full items-center justify-center text-xs text-slate-400">
                No health variables recorded in this range
              </div>
            )}
          </div>
        </div>
        
        {/* Priority Doughnut Chart */}
        <div className="card">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Task Distribution Profile</h3>
          <div className="h-64 flex items-center justify-center">
            {filteredTasks.length > 0 ? (
              <div className="w-full h-full relative p-2">
                <Doughnut data={priorityChartData} options={donutOptions} />
              </div>
            ) : (
              <div className="text-xs text-slate-400">
                No task priority details recorded
              </div>
            )}
          </div>
        </div>

      </div>
      
      {/* AI Observations and Correlations */}
      <div className="card bg-gradient-to-br from-teal-500/5 to-indigo-500/5 border border-teal-500/10">
        <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5 mb-5">
          <Sparkles size={16} className="text-teal-500" />
          Analytics & Observations Notice
        </h3>
        
        {tasks.length > 0 || moodEntries.length > 0 || healthData.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs leading-relaxed">
            
            {/* Row 1: Productivity & Mood */}
            <div className="p-4 bg-white/70 dark:bg-slate-900/60 rounded-2xl border border-slate-100 dark:border-slate-800">
              <h4 className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1 mb-1.5 uppercase tracking-wider text-[10px]">
                🚀 Productivity Analysis
              </h4>
              <p className="text-slate-500 dark:text-slate-400">
                {completionRate >= 75
                  ? `Spectacular! You have completed ${completionRate.toFixed(0)}% of scheduled tasks. This level of output shows optimal focus.`
                  : completionRate >= 50
                  ? `Steady pacing. You resolved ${completionRate.toFixed(0)}% of your tasks. Breaking down blockers will elevate your throughput.`
                  : `You've executed ${completionRate.toFixed(0)}% of tasks. Consider prioritizing 1 high-impact item daily to rebuild inertia.`}
              </p>
            </div>

            <div className="p-4 bg-white/70 dark:bg-slate-900/60 rounded-2xl border border-slate-100 dark:border-slate-800">
              <h4 className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1 mb-1.5 uppercase tracking-wider text-[10px]">
                🧠 Mindfulness Index
              </h4>
              <p className="text-slate-500 dark:text-slate-400">
                {getAverageMood(timeRange === 'week' ? 7 : 30) >= 7
                  ? 'Your mental state has hovered around positive values. Consistently check in to preserve this psychological safety margin.'
                  : getAverageMood(timeRange === 'week' ? 7 : 30) >= 5
                  ? 'Moderate mental variance logged. Identify if specific tasks or lack of deep sleep cycles correlate with lower scores.'
                  : 'Your mental check-ins indicate heavy stress. Leverage the AI assistant recommendations or discuss workloads with your supervisor.'}
              </p>
            </div>
            
            {/* Row 2: Sleep & Health and Core Correlations */}
            <div className="p-4 bg-white/70 dark:bg-slate-900/60 rounded-2xl border border-slate-100 dark:border-slate-800">
              <h4 className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1 mb-1.5 uppercase tracking-wider text-[10px]">
                🛌 Physical Sleep & Hydration
              </h4>
              <p className="text-slate-500 dark:text-slate-400">
                {getAverageSleep(timeRange === 'week' ? 7 : 30) < 6.5
                  ? 'Your sleep averages less than 6.5 hours. Chronic low sleep reduces memory storage and escalates anxiety index.'
                  : 'You are averaging a healthy amount of rest, which assists cell rejuvenation and keeps cortisol stress levels managed.'}

                {getWaterIntakeAverage(timeRange === 'week' ? 7 : 30) < 6
                  ? ' Hydration is low. Try adding a water check-in at 10:00 AM and 3:00 PM for mental clarity.'
                  : ' Excellent hydration parameters. Staying hydrated regulates energy levels.'}
              </p>
            </div>

            <div className="p-4 bg-white/70 dark:bg-slate-900/60 rounded-2xl border border-slate-100 dark:border-slate-800">
              <h4 className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1 mb-1.5 uppercase tracking-wider text-[10px]">
                📊 Log Correlations
              </h4>
              <p className="text-slate-500 dark:text-slate-400">
                {completionRate >= 70 && getAverageMood(timeRange === 'week' ? 7 : 30) >= 7
                  ? 'Positive Mood & High Output correlation: Completing work goals is boosting your confidence and mental satisfaction.'
                  : completionRate < 50 && getAverageMood(timeRange === 'week' ? 7 : 30) < 5
                  ? 'Low Output & Low Mood correlation: Set smaller, bite-sized tasks. Achieving micro-wins is highly effective for improving mood.'
                  : 'Independent variables: Your task completion velocity and logged mood state are currently operating independently.'}
              </p>
            </div>

          </div>
        ) : (
          <div className="text-center py-6 text-xs text-slate-400">
            Start logging daily mood entries, sleep metrics, and checklist items to generate premium correlations here.
          </div>
        )}
      </div>

    </div>
  );
};

export default Analytics;