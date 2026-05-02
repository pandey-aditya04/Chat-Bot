import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { BotProvider } from './context/BotContext';
import AppRouter from './router/AppRouter';

gsap.registerPlugin(ScrollTrigger);

function App() {
  useEffect(() => {
    // Initialize Lenis
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    // Pipe to GSAP
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(lenis.raf);
    };
  }, []);

  return (
    <ThemeProvider>
      <AuthProvider>
        <BotProvider>
          <AppRouter />
          <Toaster 
            position="bottom-right" 
            toastOptions={{ 
              duration: 3000,
              style: {
                background: '#1e1e35',
                color: '#f1f5f9',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '12px',
                fontSize: '0.875rem',
                padding: '12px 16px',
              },
              success: {
                iconTheme: {
                  primary: '#10b981',
                  secondary: 'white',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: 'white',
                },
              },
            }} 
          />
        </BotProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
