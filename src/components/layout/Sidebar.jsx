import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Bot, BarChart2, MessageSquare, Code2,
  Settings, ChevronLeft, ChevronRight, LogOut, Sparkles, X
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

const menuItems = [
  { label: 'Dashboard', icon: LayoutDashboard, route: '/dashboard' },
  { label: 'My Bots', icon: Bot, route: '/dashboard/bots' },
  { label: 'Analytics', icon: BarChart2, route: '/dashboard/analytics' },
  { label: 'Chat Logs', icon: MessageSquare, route: '/dashboard/logs' },
  { label: 'Embed', icon: Code2, route: '/dashboard/bots' },
  { label: 'Settings', icon: Settings, route: '/dashboard/settings' },
];

const Sidebar = ({ isOpen, onClose }) => {
  const [collapsed, setCollapsed] = useState(false);
  const { isDark } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />
      )}

      <aside className={`fixed top-0 left-0 h-screen z-50 flex flex-col transition-all duration-300 ${
        collapsed ? 'w-20' : 'w-64'
      } ${
        isDark
          ? 'bg-dark-surface border-r border-dark-border'
          : 'bg-light-surface border-r border-light-border'
      } ${
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        {/* Header */}
        <div className={`flex items-center ${collapsed ? 'justify-center' : 'justify-between'} p-6 h-20`}>
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <span className={`font-bold text-lg ${isDark ? 'text-dark-text' : 'text-light-text'}`}>
                ChatBot<span className="text-primary">Builder</span>
              </span>
            </div>
          )}
          {collapsed && (
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
          )}
          <button className="lg:hidden p-1.5" onClick={onClose}>
            <X className={`w-5 h-5 ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`} />
          </button>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {menuItems.map(item => (
            <NavLink
              key={item.route + item.label}
              to={item.route}
              end={item.route === '/dashboard'}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
                  collapsed ? 'justify-center' : ''
                } ${
                  isActive
                    ? `bg-primary/10 text-primary font-medium`
                    : isDark
                      ? 'text-dark-text-secondary hover:text-dark-text hover:bg-dark-surface-2'
                      : 'text-light-text-secondary hover:text-light-text hover:bg-light-surface-2'
                }`
              }
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span className="text-sm">{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Upgrade Card */}
        {!collapsed && (
          <div className="px-4 pb-6">
            <div className="bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl p-5 border border-primary/20">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className={`text-sm font-semibold ${isDark ? 'text-dark-text' : 'text-light-text'}`}>
                  Upgrade Plan
                </span>
              </div>
              <p className={`text-xs mb-3 ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`}>
                Get more bots & unlimited messages
              </p>
              <button
                onClick={() => { navigate('/pricing'); onClose?.(); }}
                className="w-full py-2 bg-primary hover:bg-primary-dark text-white text-xs font-medium rounded-lg transition-colors"
              >
                Upgrade Now
              </button>
            </div>
          </div>
        )}

        {/* User Section */}
        <div className={`p-4 border-t ${isDark ? 'border-dark-border' : 'border-light-border'}`}>
          <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-4'}`}>
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
              <span className="text-white text-sm font-semibold">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium truncate ${isDark ? 'text-dark-text' : 'text-light-text'}`}>
                  {user?.name || 'User'}
                </p>
                <p className={`text-xs truncate ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`}>
                  {user?.email || ''}
                </p>
              </div>
            )}
            {!collapsed && (
              <button
                onClick={handleLogout}
                className={`p-2 rounded-lg transition-colors ${
                  isDark ? 'hover:bg-dark-surface-2 text-dark-text-secondary' : 'hover:bg-light-surface-2 text-light-text-secondary'
                }`}
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Collapse Toggle - desktop only */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`hidden lg:flex absolute -right-3 top-20 w-6 h-6 rounded-full items-center justify-center ${
            isDark
              ? 'bg-dark-surface-2 border border-dark-border text-dark-text-secondary hover:text-dark-text'
              : 'bg-light-surface border border-light-border text-light-text-secondary hover:text-light-text shadow-sm'
          } transition-colors`}
        >
          {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
        </button>
      </aside>
    </>
  );
};

export default Sidebar;
