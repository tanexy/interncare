import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, LayoutDashboard, CheckSquare, SmilePlus, BarChart3, Settings, Moon, Sun } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isDarkMode, toggleDarkMode } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  
  const navItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/' },
    { name: 'Tasks', icon: <CheckSquare size={20} />, path: '/tasks' },
    { name: 'Mood Tracker', icon: <SmilePlus size={20} />, path: '/mood' },
    { name: 'Analytics', icon: <BarChart3 size={20} />, path: '/analytics' },
    { name: 'Settings', icon: <Settings size={20} />, path: '/settings' },
  ];
  
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  
  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-gray-900 text-white' : 'bg-gray-50 text-blue-200'}`}>
      {/* Mobile Header */}
      <header className="lg:hidden flex items-center justify-between p-4 border-b bg-white dark:bg-gray-800 dark:border-gray-700 shadow-sm">
        <div className="flex items-center">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <h1 className="ml-3 text-xl font-semibold">InternCare</h1>
        </div>
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </header>
      
      {/* Sidebar */}
      <div className="flex">
        <aside
          className={`
            fixed top-0 left-0 z-40 h-screen transition-transform lg:translate-x-0 lg:w-64
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            lg:block bg-white dark:bg-gray-800 border-r dark:border-gray-700
          `}
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center gap-2 p-5 border-b dark:border-gray-700">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center">
                <span className="text-white font-bold">IC</span>
              </div>
              <h1 className="text-xl font-semibold">InternCare</h1>
            </div>
            
            <nav className="flex-1 p-4 space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => {
                    navigate(item.path);
                    setSidebarOpen(false);
                  }}
                  className={`
                    flex items-center w-full px-4 py-3 text-left rounded-md transition-colors
                    ${location.pathname === item.path 
                      ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400' 
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700'}
                  `}
                >
                  <span className="mr-3">{item.icon}</span>
                  <span>{item.name}</span>
                </button>
              ))}
            </nav>
            
            <div className="p-4 border-t dark:border-gray-700">
              <button
                onClick={toggleDarkMode}
                className="flex items-center w-full px-4 py-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {isDarkMode ? (
                  <>
                    <Sun size={20} className="mr-3" />
                    <span>Light Mode</span>
                  </>
                ) : (
                  <>
                    <Moon size={20} className="mr-3" />
                    <span>Dark Mode</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </aside>
        
        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 z-30 bg-black/50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        
        {/* Main content */}
        <main className="flex-1 lg:ml-64 pt-5 px-4 md:px-6 pb-10 transition-all">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;