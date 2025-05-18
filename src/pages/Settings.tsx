import React from 'react';
import { useApp } from '../context/AppContext';
import { Moon, Sun, BellRing, Bell, ShieldCheck, Info } from 'lucide-react';

const Settings: React.FC = () => {
  const { isDarkMode, toggleDarkMode } = useApp();
  
  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="text-gray-900 dark:text-gray-300">
          Customize your InternCare experience
        </p>
      </div>
      
      {/* Settings sections */}
      <div className="space-y-6">
        {/* Appearance */}
        <div className="card">
          <h2 className="text-lg font-medium mb-4 text-gray-900">Appearance</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full">
                  {isDarkMode ? (
                    <Sun size={20} className="text-amber-500" />
                  ) : (
                    <Moon size={20} className="text-indigo-500" />
                  )}
                </div>
                <div>
                  <p className="font-medium">Dark Mode</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Switch between light and dark themes
                  </p>
                </div>
              </div>
              
              <div className="relative inline-block w-12 align-middle select-none">
                <input
                  type="checkbox"
                  name="darkMode"
                  id="darkMode"
                  checked={isDarkMode}
                  onChange={toggleDarkMode}
                  className="sr-only"
                />
                <label
                  htmlFor="darkMode"
                  className={`block h-6 overflow-hidden rounded-full cursor-pointer ${
                    isDarkMode ? 'bg-primary-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`block h-6 w-6 rounded-full bg-white transform transition-transform ${
                      isDarkMode ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
        
        {/* Notifications */}
        <div className="card">
          <h2 className="text-lg font-medium mb-4 text-gray-900">Notifications</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full">
                  <BellRing size={20} className="text-secondary-500" />
                </div>
                <div>
                  <p className="font-medium">Task Reminders</p>
                  <p className="text-sm text-gray-500 dark:text-gray-900">
                    Get notified about upcoming tasks
                  </p>
                </div>
              </div>
              
              <div className="relative inline-block w-12 align-middle select-none">
                <input
                  type="checkbox"
                  name="taskReminders"
                  id="taskReminders"
                  checked={true}
                  className="sr-only"
                />
                <label
                  htmlFor="taskReminders"
                  className="block h-6 overflow-hidden rounded-full cursor-pointer bg-primary-600"
                >
                  <span
                    className="block h-6 w-6 rounded-full bg-white transform transition-transform translate-x-6"
                  />
                </label>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full">
                  <Bell size={20} className="text-amber-500" />
                </div>
                <div>
                  <p className="font-medium">Wellness Check-ins</p>
                  <p className="text-sm text-gray-500 dark:text-gray-900">
                    Daily reminders to log your mood and health
                  </p>
                </div>
              </div>
              
              <div className="relative inline-block w-12 align-middle select-none">
                <input
                  type="checkbox"
                  name="wellnessCheckins"
                  id="wellnessCheckins"
                  checked={true}
                  className="sr-only"
                />
                <label
                  htmlFor="wellnessCheckins"
                  className="block h-6 overflow-hidden rounded-full cursor-pointer bg-primary-600"
                >
                  <span
                    className="block h-6 w-6 rounded-full bg-white transform transition-transform translate-x-6"
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
        
        {/* Privacy */}
        <div className="card">
          <h2 className="text-lg font-medium mb-4 text-gray-900">Privacy & Data</h2>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full">
                <ShieldCheck size={20} className="text-success-500" />
              </div>
              <div>
                <p className="font-medium">Data Storage</p>
                <p className="text-sm text-gray-500 dark:text-gray-900">
                  Your data is stored locally on your device. No data is sent to external servers.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full">
                <Info size={20} className="text-primary-500" />
              </div>
              <div>
                <p className="font-medium">Clear All Data</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                  This will reset all your tasks, mood entries, and health data. This action cannot be undone.
                </p>
                <button className="btn btn-outline text-error-600 border-error-600 hover:bg-error-50">
                  Clear Data
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* About */}
        <div className="card">
          <h2 className="text-lg font-medium mb-4 text-gray-900">About InternCare</h2>
          
          <div className="space-y-3">
            <p className="text-gray-900 dark:text-gray-900">
              InternCare is a wellness and productivity app designed specifically for interns to help them manage stress, track mental and physical wellness, plan daily activities, and receive personalized suggestions.
            </p>
            
            <p className="text-gray-900 dark:text-gray-900">
              Version 1.0.0
            </p>
            
            <div className="pt-2">
              <button className="btn btn-outline">
                Send Feedback
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;