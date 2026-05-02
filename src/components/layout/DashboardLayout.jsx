import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { useTheme } from '../../context/ThemeContext';

const pageTitles = {
  '/dashboard': 'Dashboard',
  '/dashboard/bots': 'My Chatbots',
  '/dashboard/bots/new': 'Create New Bot',
  '/dashboard/analytics': 'Analytics',
  '/dashboard/logs': 'Chat Logs',
  '/dashboard/settings': 'Settings',
};

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isDark } = useTheme();
  const location = useLocation();

  const title = pageTitles[location.pathname] ||
    (location.pathname.includes('/embed') ? 'Embed Code' : 'Dashboard');

  return (
    <div className={`min-h-screen ${isDark ? 'bg-surface text-text-primary' : 'light bg-surface text-text-primary'}`}>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="lg:ml-64 transition-all duration-300">
        <Navbar title={title} onMenuClick={() => setSidebarOpen(true)} />
        <main className="max-w-6xl mx-auto px-6 py-8 md:px-12 md:py-12">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
