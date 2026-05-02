import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Moon, Sun, Bell, ChevronDown, User, Settings, LogOut } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

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
    <header className={`h-20 flex items-center justify-between px-6 md:px-10 sticky top-0 z-30 backdrop-blur-xl border-b border-border ${
      isDark ? 'bg-surface/80' : 'bg-surface/80'
    }`}>
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick} 
          className="lg:hidden p-2.5 rounded-xl hover:bg-surface-overlay border border-border text-text-primary transition-all"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-black tracking-tight text-text-primary">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-3">
        {/* Dark Mode Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-xl transition-all border border-border bg-surface-raised hover:bg-surface-overlay text-text-secondary hover:text-text-primary"
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2.5 rounded-xl transition-all border border-border bg-surface-raised hover:bg-surface-overlay text-text-secondary hover:text-text-primary relative"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-brand rounded-full border-2 border-surface" />
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-3 w-80 rounded-2xl shadow-2xl bg-surface-raised border border-border overflow-hidden"
              >
                <div className="p-5 border-b border-border bg-surface-overlay/50">
                  <h3 className="font-black text-xs uppercase tracking-widest text-text-primary">
                    Notifications
                  </h3>
                </div>
                <div className="max-h-80 overflow-y-auto divide-y divide-border">
                  {notifications.map(n => (
                    <div key={n.id} className="p-5 flex gap-4 hover:bg-surface-overlay transition-colors cursor-pointer group">
                      <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${n.read ? 'bg-transparent' : 'bg-brand shadow-glow-brand'}`} />
                      <div>
                        <p className="text-sm font-medium leading-snug group-hover:text-brand transition-colors">{n.text}</p>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted mt-2">{n.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User Menu */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-3 p-1.5 pr-4 rounded-xl transition-all border border-border bg-surface-raised hover:bg-surface-overlay group"
          >
            <div className="w-9 h-9 rounded-full bg-brand flex items-center justify-center shadow-glow-brand">
              <span className="text-white text-sm font-black">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-black truncate max-w-[100px] leading-none mb-1">{user?.name}</p>
              <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider leading-none">Account</p>
            </div>
            <ChevronDown className="w-4 h-4 text-text-muted group-hover:text-text-primary transition-colors" />
          </button>

          <AnimatePresence>
            {showDropdown && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-3 w-64 rounded-2xl shadow-2xl bg-surface-raised border border-border overflow-hidden"
              >
                <div className="p-5 border-b border-border bg-surface-overlay/50">
                  <p className="text-sm font-black truncate">{user?.name}</p>
                  <p className="text-xs font-medium text-text-muted truncate mt-1">{user?.email}</p>
                </div>
                <div className="p-2">
                  <button
                    onClick={() => { navigate('/dashboard/settings'); setShowDropdown(false); }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl hover:bg-surface-overlay text-text-secondary hover:text-text-primary transition-all"
                  >
                    <User className="w-4.5 h-4.5" /> Profile Settings
                  </button>
                  <button
                    onClick={() => { navigate('/dashboard/settings'); setShowDropdown(false); }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl hover:bg-surface-overlay text-text-secondary hover:text-text-primary transition-all"
                  >
                    <Settings className="w-4.5 h-4.5" /> Billing & Usage
                  </button>
                </div>
                <div className="p-2 bg-surface-overlay/50 border-t border-border">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-danger hover:bg-danger/10 transition-all rounded-xl"
                  >
                    <LogOut className="w-4.5 h-4.5" /> Sign Out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
