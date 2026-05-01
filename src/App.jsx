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
          <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
        </BotProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
