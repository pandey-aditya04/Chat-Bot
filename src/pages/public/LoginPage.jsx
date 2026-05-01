import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Bot } from 'lucide-react';
import AuthLayout from '../../components/layout/AuthLayout';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../hooks/useToast';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [errors, setErrors] = useState({});
  const { login, loading } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const toast = useToast();

  const validate = () => {
    const errs = {};
    if (!email) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = 'Invalid email address';
    if (!password) errs.password = 'Password is required';
    else if (password.length < 6) errs.password = 'Password must be at least 6 characters';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      await login(email, password);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err) {
      toast.error('Login failed. Please try again.');
    }
  };

  return (
    <AuthLayout>
      <div className="lg:hidden flex items-center gap-2 mb-8">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
          <Bot className="w-5 h-5 text-white" />
        </div>
        <span className={`font-bold text-lg ${isDark ? 'text-dark-text' : 'text-light-text'}`}>
          ChatBot<span className="text-primary">Builder</span>
        </span>
      </div>
      <h2 className={`text-3xl md:text-4xl font-semibold mb-4 ${isDark ? 'text-dark-text' : 'text-light-text'}`}>Welcome back</h2>
      <p className={`text-base leading-relaxed mb-8 ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`}>
        Sign in to your account to continue
      </p>
      <button
        onClick={() => toast.info('OAuth coming soon!')}
        className={`w-full flex items-center justify-center gap-3 py-3 rounded-xl border font-medium text-sm mb-6 transition-colors ${isDark ? 'border-dark-border hover:bg-dark-surface-2 text-dark-text' : 'border-light-border hover:bg-light-surface-2 text-light-text'}`}
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        Continue with Google
      </button>
      <div className="relative mb-6">
        <div className={`absolute inset-0 flex items-center`}>
          <div className={`w-full border-t ${isDark ? 'border-dark-border' : 'border-light-border'}`} />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className={`px-3 ${isDark ? 'bg-dark-bg text-dark-text-secondary' : 'bg-light-bg text-light-text-secondary'}`}>or continue with email</span>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Email" type="email" placeholder="name@example.com" value={email} onChange={e => setEmail(e.target.value)} error={errors.email} icon={Mail} id="login-email" required />
        <Input label="Password" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} error={errors.password} icon={Lock} id="login-password" required />
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} className="w-4 h-4 rounded border-dark-border text-primary focus:ring-primary" />
            <span className={`text-sm ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`}>Remember me</span>
          </label>
          <button type="button" className="text-sm text-primary hover:text-primary-light transition-colors">Forgot password?</button>
        </div>
        <Button type="submit" className="w-full" size="lg" loading={loading}>Sign In</Button>
      </form>
      <p className={`text-sm text-center mt-6 ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`}>
        Don't have an account? <Link to="/signup" className="text-primary font-medium hover:text-primary-light">Sign up</Link>
      </p>
    </AuthLayout>
  );
};

export default LoginPage;
