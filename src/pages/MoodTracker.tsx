import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import MoodForm from '../components/mood/MoodForm';
import HealthForm from '../components/health/HealthForm';
import MoodSummary from '../components/mood/MoodSummary';
import HealthSummary from '../components/health/HealthSummary';
import { format, parseISO, isToday, isYesterday, isThisWeek } from 'date-fns';
import { Calendar, Activity, Sparkles, SmilePlus, Heart, BarChart } from 'lucide-react';
import { EmptyState } from '../components/ui/EmptyState';

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
    <div className="space-y-8 animate-fade-in pb-16">

      {/* Narrative Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <SmilePlus size={14} className="text-stone-400" />
            <span className="text-[10px] font-mono tracking-widest text-stone-400 dark:text-zinc-500 uppercase">
              Mind & body log
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-light tracking-tight text-stone-900 dark:text-white font-serif">
            Wellness Journal
          </h1>
          <p className="text-xs text-stone-400 dark:text-zinc-400 font-light">
            Keep tabs on mental focus, physical energy parameters, and stress loads in an elegant, private ledger.
          </p>
        </div>

        <div className="flex gap-2">
          <button 
            onClick={() => setShowMoodForm(true)}
            className="btn-premium btn-premium-primary"
          >
            Log Mind State
          </button>
          <button 
            onClick={() => setShowHealthForm(true)}
            className="btn-premium btn-premium-secondary"
          >
            Log Health Data
          </button>
        </div>
      </div>

      <div className="divider-premium" />

      {/* Symmetrical tab navigation bar */}
      <div className="flex space-x-6 border-b border-stone-100 dark:border-neutral-800/60">
        <button
          onClick={() => setActiveTab('mood')}
          className={`py-3 px-1 border-b text-[10px] font-bold uppercase tracking-widest transition-all duration-200 ${
            activeTab === 'mood'
              ? 'border-stone-900 dark:border-white text-stone-900 dark:text-white'
              : 'border-transparent text-stone-400 dark:text-zinc-500 hover:text-stone-750'
          }`}
        >
          Mindfulness Journal
        </button>
        <button
          onClick={() => setActiveTab('health')}
          className={`py-3 px-1 border-b text-[10px] font-bold uppercase tracking-widest transition-all duration-200 ${
            activeTab === 'health'
              ? 'border-stone-900 dark:border-white text-stone-900 dark:text-white'
              : 'border-transparent text-stone-400 dark:text-zinc-500 hover:text-stone-750'
          }`}
        >
          Physical Health Metrics
        </button>
      </div>
      
      {/* Mood Tab Timeline */}
      {activeTab === 'mood' && (
        <div className="space-y-8 animate-fade-in pl-1">
          {moodDates.length > 0 ? (
            moodDates.map(date => (
              <div key={date} className="timeline-node">
                <h3 className="text-[10px] font-bold text-stone-400 dark:text-zinc-500 uppercase tracking-wider mb-3">
                  {formatDateHeading(date)}
                </h3>
                <div className="space-y-4">
                  {groupedMoodEntries[date]
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .map(entry => (
                      <MoodSummary key={entry.id} mood={entry} />
                    ))}
                </div>
              </div>
            ))
          ) : (
            <EmptyState
              icon={SmilePlus}
              title="Your mindfulness journal is pristine"
              description="Start tracking your emotional parameters to receive highly optimized AI recommendations and unlock stats milestones."
              action={{
                label: 'Log Your Mood State',
                onClick: () => setShowMoodForm(true)
              }}
            />
          )}
        </div>
      )}
      
      {/* Health Tab Timeline */}
      {activeTab === 'health' && (
        <div className="space-y-8 animate-fade-in pl-1">
          {healthDates.length > 0 ? (
            healthDates.map(date => (
              <div key={date} className="timeline-node">
                <h3 className="text-[10px] font-bold text-stone-400 dark:text-zinc-500 uppercase tracking-wider mb-3">
                  {formatDateHeading(date)}
                </h3>
                <div className="space-y-4">
                  {groupedHealthData[date]
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .map(data => (
                      <HealthSummary key={data.id} health={data} />
                    ))}
                </div>
              </div>
            ))
          ) : (
            <EmptyState
              icon={Activity}
              title="No logged physical health metrics"
              description="Record your sleep hours, water intake, stress, and workouts daily to gain absolute clarity into your wellbeing correlations."
              action={{
                label: 'Record Health Stats',
                onClick: () => setShowHealthForm(true)
              }}
            />
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
