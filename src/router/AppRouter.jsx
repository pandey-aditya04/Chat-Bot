import { BrowserRouter, Routes, Route } from 'react-router-dom';
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

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/pricing" element={<PricingPage />} />

        {/* Dashboard Routes */}
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
    </BrowserRouter>
  );
};

export default AppRouter;
