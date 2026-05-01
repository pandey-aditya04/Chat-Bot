import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Moon, Sun, Bell, ChevronDown, User, Settings, LogOut } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

const Navbar = ({ title, onMenuClick }) => {
  const { isDark, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef(null);
  const notifRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setShowDropdown(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifications(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const notifications = [
    { id: 1, text: 'Acme Support Bot received 15 new messages', time: '2 min ago', read: false },
    { id: 2, text: 'ShopBot Pro has been deployed successfully', time: '1 hour ago', read: false },
    { id: 3, text: 'Your Basic plan renews in 3 days', time: '2 hours ago', read: true },
  ];

  return (
    <header className={`h-20 flex items-center justify-between px-6 md:px-8 ${
      isDark ? 'bg-dark-surface border-b border-dark-border' : 'bg-light-surface border-b border-light-border'
    }`}>
      <div className="flex items-center gap-3">
        <button onClick={onMenuClick} className={`lg:hidden p-2 rounded-xl ${
          isDark ? 'hover:bg-dark-surface-2' : 'hover:bg-light-surface-2'
        }`}>
          <Menu className={`w-5 h-5 ${isDark ? 'text-dark-text' : 'text-light-text'}`} />
        </button>
        <h1 className={`text-lg md:text-xl font-semibold ${isDark ? 'text-dark-text' : 'text-light-text'}`}>
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-2">
        {/* Dark Mode Toggle */}
        <button
          onClick={toggleTheme}
          className={`p-2.5 rounded-xl transition-colors ${
            isDark ? 'hover:bg-dark-surface-2 text-dark-text-secondary hover:text-dark-text' : 'hover:bg-light-surface-2 text-light-text-secondary hover:text-light-text'
          }`}
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className={`p-2.5 rounded-xl transition-colors relative ${
              isDark ? 'hover:bg-dark-surface-2 text-dark-text-secondary hover:text-dark-text' : 'hover:bg-light-surface-2 text-light-text-secondary hover:text-light-text'
            }`}
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-danger rounded-full border-2 border-dark-surface" />
          </button>

          {showNotifications && (
            <div className={`absolute right-0 mt-2 w-80 rounded-xl shadow-xl animate-slide-down ${
              isDark ? 'bg-dark-surface border border-dark-border' : 'bg-light-surface border border-light-border'
            }`}>
              <div className="p-4 border-b border-dark-border/50">
                <h3 className={`font-semibold text-sm ${isDark ? 'text-dark-text' : 'text-light-text'}`}>
                  Notifications
                </h3>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {notifications.map(n => (
                  <div key={n.id} className={`px-4 py-3 flex gap-3 ${
                    isDark ? 'hover:bg-dark-surface-2' : 'hover:bg-light-surface-2'
                  } transition-colors cursor-pointer`}>
                    <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${n.read ? 'bg-transparent' : 'bg-primary'}`} />
                    <div>
                      <p className={`text-sm ${isDark ? 'text-dark-text' : 'text-light-text'}`}>{n.text}</p>
                      <p className={`text-xs mt-0.5 ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`}>{n.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Menu */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className={`flex items-center gap-2 p-1.5 pr-3 rounded-xl transition-colors ${
              isDark ? 'hover:bg-dark-surface-2' : 'hover:bg-light-surface-2'
            }`}
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <span className="text-white text-sm font-semibold">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
            <ChevronDown className={`w-4 h-4 ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`} />
          </button>

          {showDropdown && (
            <div className={`absolute right-0 mt-2 w-56 rounded-xl shadow-xl animate-slide-down ${
              isDark ? 'bg-dark-surface border border-dark-border' : 'bg-light-surface border border-light-border'
            }`}>
              <div className="p-3 border-b border-dark-border/50">
                <p className={`text-sm font-medium ${isDark ? 'text-dark-text' : 'text-light-text'}`}>
                  {user?.name}
                </p>
                <p className={`text-xs ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`}>
                  {user?.email}
                </p>
              </div>
              <div className="py-1">
                <button
                  onClick={() => { navigate('/dashboard/settings'); setShowDropdown(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                    isDark ? 'text-dark-text-secondary hover:text-dark-text hover:bg-dark-surface-2' : 'text-light-text-secondary hover:text-light-text hover:bg-light-surface-2'
                  }`}
                >
                  <User className="w-4 h-4" /> Profile
                </button>
                <button
                  onClick={() => { navigate('/dashboard/settings'); setShowDropdown(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                    isDark ? 'text-dark-text-secondary hover:text-dark-text hover:bg-dark-surface-2' : 'text-light-text-secondary hover:text-light-text hover:bg-light-surface-2'
                  }`}
                >
                  <Settings className="w-4 h-4" /> Settings
                </button>
              </div>
              <div className={`border-t ${isDark ? 'border-dark-border' : 'border-light-border'}`}>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-danger hover:bg-danger/10 transition-colors rounded-b-xl"
                >
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
