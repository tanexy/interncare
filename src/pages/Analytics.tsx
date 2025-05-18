import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { format, subDays, subWeeks, isAfter } from 'date-fns';
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
    getWaterIntakeAverage
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
  
  const taskCompletionChartData = {
    labels: dateLabels,
    datasets: [
      {
        label: 'Tasks Completed',
        data: generateDailyCompletionData(),
        backgroundColor: 'rgba(79, 70, 229, 0.6)',
        borderColor: 'rgba(79, 70, 229, 1)',
        borderWidth: 1,
      },
    ],
  };
  
  const moodChartData = {
    labels: dateLabels,
    datasets: [
      {
        label: 'Mood Score',
        data: generateMoodData(),
        borderColor: 'rgba(245, 158, 11, 1)',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        tension: 0.3,
        fill: true,
        pointBackgroundColor: 'rgba(245, 158, 11, 1)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
      },
    ],
  };
  
  const sleepStressChartData = {
    labels: dateLabels,
    datasets: [
      {
        label: 'Sleep Hours',
        data: generateSleepData(),
        borderColor: 'rgba(20, 184, 166, 1)',
        backgroundColor: 'rgba(20, 184, 166, 0.1)',
        tension: 0.3,
        yAxisID: 'y',
        pointBackgroundColor: 'rgba(20, 184, 166, 1)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
      },
      {
        label: 'Stress Level',
        data: generateStressData(),
        borderColor: 'rgba(239, 68, 68, 1)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.3,
        yAxisID: 'y1',
        pointBackgroundColor: 'rgba(239, 68, 68, 1)',
        pointBorderColor: '#fff',
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
          'rgba(239, 68, 68, 0.7)',
          'rgba(245, 158, 11, 0.7)',
          'rgba(34, 197, 94, 0.7)',
        ],
        borderColor: [
          'rgba(239, 68, 68, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(34, 197, 94, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };
  
  const sleepStressOptions = {
    responsive: true,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    scales: {
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        title: {
          display: true,
          text: 'Sleep Hours',
        },
        min: 0,
        max: 12,
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
        },
        min: 0,
        max: 10,
      },
    },
  };
  
  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Analytics Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Track your progress and wellness insights
          </p>
        </div>
        <div className="text-gray-900">
          <select
            value={timeRange}
            onChange={e => setTimeRange(e.target.value as 'week' | 'month')}
            className="select"
          >
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
          </select>
        </div>
      </div>
      
      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card">
          <p className="text-sm text-gray-600 dark:text-gray-400">Task Completion</p>
          <div className="flex items-end justify-between mt-2">
            <p className="text-2xl font-semibold text-gray-900">{getCompletedTasksCount(timeRange === 'week' ? 7 : 30)}</p>
            <p className="text-sm text-gray-500">{completionRate.toFixed(0)}%</p>
          </div>
          <div className="w-full h-1.5 bg-gray-200 rounded-full mt-2">
            <div 
              className="h-1.5 bg-indigo-600 rounded-full" 
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>
        
        <div className="card">
          <p className="text-sm text-gray-600 dark:text-gray-900">Avg. Mood</p>
          <div className="flex items-end justify-between mt-2">
            <p className="text-2xl font-semibold text-gray-900">
              {getAverageMood(timeRange === 'week' ? 7 : 30).toFixed(1)}
            </p>
            <p className="text-sm text-gray-500">/10</p>
          </div>
          <div className="w-full h-1.5 bg-gray-200 rounded-full mt-2">
            <div 
              className="h-1.5 bg-amber-500 rounded-full" 
              style={{ width: `${getAverageMood(timeRange === 'week' ? 7 : 30) * 10}%` }}
            />
          </div>
        </div>
        
        <div className="card">
          <p className="text-sm text-gray-600 dark:text-gray-900">Avg. Sleep</p>
          <div className="flex items-end justify-between mt-2">
            <p className="text-2xl font-semibold text-gray-900">
              {getAverageSleep(timeRange === 'week' ? 7 : 30).toFixed(1)}
            </p>
            <p className="text-sm text-gray-500">hours</p>
          </div>
          <div className="w-full h-1.5 bg-gray-200 rounded-full mt-2">
            <div 
              className="h-1.5 bg-teal-500 rounded-full" 
              style={{ width: `${(getAverageSleep(timeRange === 'week' ? 7 : 30) / 10) * 100}%` }}
            />
          </div>
        </div>
        
        <div className="card">
          <p className="text-sm text-gray-600 dark:text-gray-900">Avg. Stress</p>
          <div className="flex items-end justify-between mt-2">
            <p className="text-2xl font-semibold text-gray-900">
              {getStressLevelAverage(timeRange === 'week' ? 7 : 30).toFixed(1)}
            </p>
            <p className="text-sm text-gray-500">/10</p>
          </div>
          <div className="w-full h-1.5 bg-gray-200 rounded-full mt-2">
            <div 
              className="h-1.5 bg-red-500 rounded-full" 
              style={{ width: `${getStressLevelAverage(timeRange === 'week' ? 7 : 30) * 10}%` }}
            />
          </div>
        </div>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-medium mb-4 text-gray-900">Task Completion</h3>
          <div className="h-64">
            {filteredTasks.length > 0 ? (
              <Bar data={taskCompletionChartData} />
            ) : (
              <div className="flex h-full items-center justify-center">
                <p className="text-gray-500">No task data available</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="card">
          <h3 className="text-lg font-medium mb-4 text-gray-900">Mood Tracking</h3>
          <div className="h-64">
            {filteredMoodEntries.length > 0 ? (
              <Line data={moodChartData} />
            ) : (
              <div className="flex h-full items-center justify-center">
                <p className="text-gray-500">No mood data available</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="card">
          <h3 className="text-lg font-medium mb-4 text-gray-900">Sleep vs. Stress</h3>
          <div className="h-64">
            {filteredHealthData.length > 0 ? (
              <Line data={sleepStressChartData} options={sleepStressOptions} />
            ) : (
              <div className="flex h-full items-center justify-center">
                <p className="text-gray-500">No health data available</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="card">
          <h3 className="text-lg font-medium mb-4 text-gray-900">Task Priority Distribution</h3>
          <div className="h-64 flex items-center justify-center">
            {filteredTasks.length > 0 ? (
              <div className="w-3/4 h-full">
                <Doughnut data={priorityChartData} />
              </div>
            ) : (
              <p className="text-gray-500">No task data available</p>
            )}
          </div>
        </div>
      </div>
      
      {/* Insights */}
      <div className="card">
        <h3 className="text-lg font-medium mb-4 ">Insights & Observations</h3>
        
        {tasks.length > 0 || moodEntries.length > 0 || healthData.length > 0 ? (
          <div className="space-y-4">
            {tasks.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-800 dark:text-gray-900">Productivity</h4>
                <p className="text-gray-600 dark:text-gray-900 mt-1">
                  {completionRate >= 75
                    ? `Great job! You've completed ${completionRate.toFixed(0)}% of your tasks in the selected time period.`
                    : completionRate >= 50
                    ? `You've completed ${completionRate.toFixed(0)}% of your tasks in the selected time period.`
                    : `You've completed ${completionRate.toFixed(0)}% of your tasks. Consider breaking down larger tasks into smaller steps.`}
                </p>
              </div>
            )}
            
            {moodEntries.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-800 dark:text-gray-900">Mood</h4>
                <p className="text-gray-600 dark:text-gray-900 mt-1">
                  {getAverageMood(timeRange === 'week' ? 7 : 30) >= 7
                    ? 'Your mood has been positive during this period. Keep up the good work!'
                    : getAverageMood(timeRange === 'week' ? 7 : 30) >= 5
                    ? 'Your mood has been moderate. Look for patterns in your daily activities that might affect your mood.'
                    : 'Your mood has been lower than optimal. Consider activities that bring you joy and boost your mood.'}
                </p>
              </div>
            )}
            
            {healthData.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-800 dark:text-gray-900">Health Patterns</h4>
                <p className="text-gray-600 dark:text-gray-800 mt-1">
                  {getAverageSleep(timeRange === 'week' ? 7 : 30) < 6
                    ? 'Your sleep average is below 6 hours, which might affect your productivity and mood. Try to prioritize sleep.'
                    : 'You\'re averaging a healthy amount of sleep, which is great for your overall wellbeing.'}
                  
                  {getStressLevelAverage(timeRange === 'week' ? 7 : 30) > 7
                    ? ' Your stress levels are high. Consider incorporating stress-reduction activities into your routine.'
                    : ' Your stress levels are being managed well.'}
                  
                  {getWaterIntakeAverage(timeRange === 'week' ? 7 : 30) < 6
                    ? ' Try to increase your water intake for better focus and energy levels.'
                    : ' You\'re staying well hydrated, which is excellent for your health.'}
                </p>
              </div>
            )}
            
            {tasks.length > 0 && moodEntries.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-800 dark:text-gray-900">Correlation Analysis</h4>
                <p className="text-gray-600 dark:text-gray-900 mt-1">
                  {completionRate >= 70 && getAverageMood(timeRange === 'week' ? 7 : 30) >= 7
                    ? 'High task completion appears to correlate with better mood. Completing tasks may be giving you a sense of accomplishment.'
                    : completionRate < 50 && getAverageMood(timeRange === 'week' ? 7 : 30) < 5
                    ? 'Lower task completion seems to correlate with lower mood. Setting smaller, achievable goals might help improve both.'
                    : 'There\'s no strong correlation between your task completion and mood in this period.'}
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-6 text-gray-900">
            <p>Start tracking your tasks, mood, and health to see insights here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Analytics;