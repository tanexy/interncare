import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import MoodForm from '../components/mood/MoodForm';
import HealthForm from '../components/health/HealthForm';
import MoodSummary from '../components/mood/MoodSummary';
import HealthSummary from '../components/health/HealthSummary';
import { format, parseISO, isToday, isYesterday, isThisWeek } from 'date-fns';
import { Calendar, Activity } from 'lucide-react';

const MoodTracker: React.FC = () => {
  const { moodEntries, healthData } = useApp();
  const [activeTab, setActiveTab] = useState<'mood' | 'health'>('mood');
  const [showMoodForm, setShowMoodForm] = useState(false);
  const [showHealthForm, setShowHealthForm] = useState(false);
  
  // Group entries by date
  const groupedMoodEntries = moodEntries.reduce((groups, entry) => {
    const date = format(parseISO(entry.date), 'yyyy-MM-dd');
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(entry);
    return groups;
  }, {} as Record<string, typeof moodEntries>);
  
  const groupedHealthData = healthData.reduce((groups, data) => {
    const date = format(parseISO(data.date), 'yyyy-MM-dd');
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(data);
    return groups;
  }, {} as Record<string, typeof healthData>);
  
  // Get dates in descending order
  const moodDates = Object.keys(groupedMoodEntries).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );
  
  const healthDates = Object.keys(groupedHealthData).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );
  
  // Format date for display
  const formatDateHeading = (dateStr: string) => {
    const date = new Date(dateStr);
    if (isToday(date)) return 'Today';
    if (isYesterday(date)) return 'Yesterday';
    if (isThisWeek(date)) return format(date, 'EEEE');
    return format(date, 'MMMM d, yyyy');
  };
  
  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Wellness Tracker</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Track your mood and health metrics
          </p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setShowMoodForm(true)}
            className={`btn ${activeTab === 'mood' ? 'btn-primary' : 'btn-outline'}`}
          >
            Log Mood
          </button>
          <button 
            onClick={() => setShowHealthForm(true)}
            className={`btn ${activeTab === 'health' ? 'btn-primary' : 'btn-outline'}`}
          >
            Log Health
          </button>
        </div>
      </div>
      
      {/* Tab navigation */}
      <div className="border-b dark:border-gray-700">
        <div className="flex space-x-8">
          <button
            onClick={() => setActiveTab('mood')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'mood'
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            Mood Journal
          </button>
          <button
            onClick={() => setActiveTab('health')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'health'
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            Health Metrics
          </button>
        </div>
      </div>
      
      {/* Mood tab content */}
      {activeTab === 'mood' && (
        <div className="space-y-6">
          {moodDates.length > 0 ? (
            moodDates.map(date => (
              <div key={date} className="space-y-3">
                <h3 className="font-medium text-gray-700 dark:text-gray-300">
                  {formatDateHeading(date)}
                </h3>
                <div className="space-y-3">
                  {groupedMoodEntries[date]
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .map(entry => (
                      <MoodSummary key={entry.id} mood={entry} />
                    ))}
                </div>
              </div>
            ))
          ) : (
            <div className="py-12 text-center bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <Calendar size={48} className="mx-auto text-gray-400 mb-3" />
              <h3 className="text-lg font-medium text-gray-600 dark:text-gray-300">No mood entries yet</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Start tracking your mood to get personalized insights
              </p>
              <button 
                onClick={() => setShowMoodForm(true)}
                className="mt-4 btn btn-primary"
              >
                Log Your Mood
              </button>
            </div>
          )}
        </div>
      )}
      
      {/* Health tab content */}
      {activeTab === 'health' && (
        <div className="space-y-6">
          {healthDates.length > 0 ? (
            healthDates.map(date => (
              <div key={date} className="space-y-3">
                <h3 className="font-medium text-gray-700 dark:text-gray-300">
                  {formatDateHeading(date)}
                </h3>
                <div className="space-y-3">
                  {groupedHealthData[date]
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .map(data => (
                      <HealthSummary key={data.id} health={data} />
                    ))}
                </div>
              </div>
            ))
          ) : (
            <div className="py-12 text-center bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <Activity size={48} className="mx-auto text-gray-400 mb-3" />
              <h3 className="text-lg font-medium text-gray-600 dark:text-gray-300">No health data yet</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Start tracking your health metrics to get personalized insights
              </p>
              <button 
                onClick={() => setShowHealthForm(true)}
                className="mt-4 btn btn-primary"
              >
                Log Health Data
              </button>
            </div>
          )}
        </div>
      )}
      
      {/* Modal forms */}
      {showMoodForm && <MoodForm onClose={() => setShowMoodForm(false)} />}
      {showHealthForm && <HealthForm onClose={() => setShowHealthForm(false)} />}
    </div>
  );
};

export default MoodTracker;