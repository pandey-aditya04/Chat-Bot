import { Bot, Zap, Globe, Shield } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { motion } from 'framer-motion';

const AuthLayout = ({ children }) => {
  const { isDark } = useTheme();

  return (
    <div className={`min-h-screen flex ${isDark ? 'bg-surface text-text-primary' : 'light bg-surface text-text-primary'}`}>
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-brand">
        <div className="absolute inset-0 bg-gradient-to-br from-brand via-accent to-purple-600 opacity-90" />
        
        {/* Animated Orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-white rounded-full blur-[120px] opacity-30" 
          />
          <motion.div 
            animate={{ 
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            className="absolute bottom-[-10%] right-[-10%] w-[70%] h-[70%] bg-accent rounded-full blur-[150px] opacity-20" 
          />
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center w-full p-16">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="w-24 h-24 rounded-3xl bg-white/10 backdrop-blur-2xl border border-white/20 flex items-center justify-center mb-10 shadow-2xl"
          >
            <Bot className="w-12 h-12 text-white" />
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
            className="text-5xl md:text-6xl font-black text-white text-center mb-6 tracking-tight"
          >
            ChatBot Builder
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
            className="text-lg leading-relaxed text-white/80 text-center max-w-md font-medium"
          >
            Deploy intelligent AI assistants to your website in seconds. No code, no complexity.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
            className="mt-16 grid grid-cols-3 gap-10 text-center"
          >
            {[
              { num: '10K+', label: 'Active Bots', icon: Bot },
              { num: '2M+', label: 'Messages', icon: Zap },
              { num: '99.9%', label: 'Uptime', icon: Shield },
            ].map((stat, i) => (
              <div key={i} className="text-white">
                <div className="text-2xl font-black">{stat.num}</div>
                <div className="text-[10px] font-black uppercase tracking-widest text-white/50 mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 bg-surface">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
          className="w-full max-w-md"
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
};

export default AuthLayout;
