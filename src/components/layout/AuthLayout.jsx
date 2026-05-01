import { Bot } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const AuthLayout = ({ children }) => {
  const { isDark } = useTheme();

  return (
    <div className={`min-h-screen flex ${isDark ? 'bg-dark-bg' : 'bg-light-bg'}`}>
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-primary via-accent to-purple-600">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 flex flex-col items-center justify-center w-full p-12">
          <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur flex items-center justify-center mb-8">
            <Bot className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white text-center mb-4">
            ChatBot Builder
          </h1>
          <p className="text-base leading-relaxed text-white/80 text-center max-w-md">
            Build intelligent chatbots in minutes. No coding required.
          </p>
          <div className="mt-12 grid grid-cols-3 gap-6 text-center">
            {[
              { num: '10K+', label: 'Active Bots' },
              { num: '2M+', label: 'Messages' },
              { num: '99.9%', label: 'Uptime' },
            ].map((stat, i) => (
              <div key={i} className="text-white">
                <div className="text-2xl font-bold">{stat.num}</div>
                <div className="text-sm text-white/60 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
