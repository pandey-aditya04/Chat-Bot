import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  // 1. Still checking session (user is undefined) — show spinner, DO NOT redirect yet
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0a0a16]">
        <div className="animate-spin h-8 w-8 border-2 border-violet-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  // 2. Confirmed not logged in (user is explicitly null) — redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 3. User is an object — authenticated
  return children;
}
