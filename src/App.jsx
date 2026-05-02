import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { BotProvider } from './context/BotContext';
import AppRouter from './router/AppRouter';

function App() {
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
