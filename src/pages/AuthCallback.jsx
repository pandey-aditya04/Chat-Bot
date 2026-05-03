import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Supabase automatically reads the token from the URL hash
    // onAuthStateChange in AuthContext will fire and set the user
    // We just need to wait and redirect
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if ((event === 'SIGNED_IN' || event === 'INITIAL_SESSION') && session) {
          navigate('/dashboard', { replace: true });
        } else if (event === 'SIGNED_OUT') {
          navigate('/login', { replace: true });
        }
      }
    );

    // Fallback: If no event fires in 5 seconds, go back to login
    const timeout = setTimeout(() => {
      navigate('/login', { replace: true });
    }, 5000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, [navigate]);

  return (
    <div className='flex items-center justify-center min-h-screen bg-[#0a0a16]'>
      <div className='text-center'>
        <div className='animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full mx-auto mb-6' />
        <p className='text-text-secondary font-medium'>Completing sign in...</p>
      </div>
    </div>
  );
};

export default AuthCallback;
