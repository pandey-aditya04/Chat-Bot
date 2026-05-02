import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import LandingPage from '../pages/public/LandingPage';
import LoginPage from '../pages/public/LoginPage';
import SignupPage from '../pages/public/SignupPage';
import PricingPage from '../pages/public/PricingPage';
import DashboardLayout from '../components/layout/DashboardLayout';
import DashboardHome from '../pages/dashboard/DashboardHome';
import BotList from '../pages/dashboard/BotList';
import CreateBot from '../pages/dashboard/CreateBot';
import BotEmbed from '../pages/dashboard/BotEmbed';
import Analytics from '../pages/dashboard/Analytics';
import ChatLogs from '../pages/dashboard/ChatLogs';
import Settings from '../pages/dashboard/Settings';
import ProtectedRoute from './ProtectedRoute';

const PageWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 16, filter: 'blur(4px)' }}
    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
    exit={{ opacity: 0, y: -8, filter: 'blur(2px)' }}
    transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
  >
    {children}
  </motion.div>
);

const AnimatedRoutes = () => {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/dashboard');

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname.split('/')[1]}>
        {/* Public Routes */}
        <Route path="/" element={<PageWrapper><LandingPage /></PageWrapper>} />
        <Route path="/login" element={<PageWrapper><LoginPage /></PageWrapper>} />
        <Route path="/signup" element={<PageWrapper><SignupPage /></PageWrapper>} />
        <Route path="/pricing" element={<PageWrapper><PricingPage /></PageWrapper>} />

        {/* Dashboard Routes - We wrap the entire layout for top-level entry, but sub-pages don't need full wrappers to avoid double animation */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardHome />} />
          <Route path="bots" element={<BotList />} />
          <Route path="bots/new" element={<CreateBot />} />
          <Route path="bots/:botId/embed" element={<BotEmbed />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="logs" element={<ChatLogs />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
};

const AppRouter = () => {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  );
};

export default AppRouter;
