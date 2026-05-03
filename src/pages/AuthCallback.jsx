import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function AuthCallback() {
  const navigate = useNavigate();
  const handled = useRef(false);

  useEffect(() => {
    const handleCallback = async () => {
      if (handled.current) return;
      handled.current = true;

      // 1. Wait for Supabase to exchange the OAuth code/fragment for a session
      const { data: { session }, error } = await supabase.auth.getSession();

      if (session) {
        // Manually sync before navigating to ensure Dashboard can start API calls immediately
        localStorage.setItem('token', session.access_token);
        localStorage.setItem('user', JSON.stringify({
          id: session.user.id,
          email: session.user.email,
          name: session.user.user_metadata?.full_name || 'User'
        }));
        navigate('/dashboard', { replace: true });
      } else {
        // Session not ready yet — wait for the auth state change to SIGNED_IN
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          (event, session) => {
            if (event === 'SIGNED_IN' && session) {
              localStorage.setItem('token', session.access_token);
              localStorage.setItem('user', JSON.stringify({
                id: session.user.id,
                email: session.user.email,
                name: session.user.user_metadata?.full_name || 'User'
              }));
              subscription.unsubscribe();
              navigate('/dashboard', { replace: true });
            }
          }
        );

        // Timeout fallback
        setTimeout(() => {
          subscription.unsubscribe();
          if (!handled.current || window.location.pathname === '/auth/callback') {
            navigate('/login', { replace: true });
          }
        }, 5000);
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-950'>
      <div className='animate-spin h-10 w-10 border-2 border-violet-500 border-t-transparent rounded-full mb-4' />
      <p className='text-gray-400 text-sm'>Completing sign in...</p>
    </div>
  );
}
