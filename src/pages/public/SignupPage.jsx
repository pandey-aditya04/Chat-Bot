import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, Bot, ArrowRight, Code2 } from 'lucide-react';
import AuthLayout from '../../components/layout/AuthLayout';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../hooks/useToast';

const SignupPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const { signup, loading } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const toast = useToast();

  const validate = () => {
    const errs = {};
    if (!name.trim()) errs.name = 'Name is required';
    if (!email) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = 'Invalid email';
    if (!password) errs.password = 'Password is required';
    else if (password.length < 6) errs.password = 'Min 6 characters';
    if (password !== confirmPassword) errs.confirmPassword = 'Passwords do not match';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      await signup(name, email, password);
      toast.success('Welcome to ChatBot Builder! 🚀');
      navigate('/dashboard');
    } catch { toast.error('Signup failed. Please try again.'); }
  };

  return (
    <AuthLayout>
      <div className="lg:hidden flex items-center gap-2.5 mb-10">
        <div className="w-10 h-10 rounded-xl bg-brand flex items-center justify-center shadow-glow-brand">
          <Bot className="w-6 h-6 text-white" />
        </div>
        <span className="font-bold text-xl tracking-tight text-text-primary">
          ChatBot<span className="gradient-text">Builder</span>
        </span>
      </div>

      <div className="mb-10">
        <h2 className="text-4xl font-black tracking-tight text-text-primary mb-3">Get Started</h2>
        <p className="text-text-secondary text-sm">Create your account to build your first AI chatbot.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <button 
          onClick={() => toast.info('OAuth integration coming soon!')}
          className="flex items-center justify-center gap-3 py-3 rounded-xl border border-border bg-surface-raised hover:bg-surface-overlay transition-all text-xs font-black uppercase tracking-widest shadow-sm"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Google
        </button>
        <button 
          onClick={() => toast.info('GitHub login coming soon!')}
          className="flex items-center justify-center gap-3 py-3 rounded-xl border border-border bg-surface-raised hover:bg-surface-overlay transition-all text-xs font-black uppercase tracking-widest shadow-sm"
        >
          <Code2 className="w-4 h-4" />
          GitHub
        </button>
      </div>

      <div className="relative mb-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-surface text-text-muted font-bold uppercase tracking-widest">or sign up</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Full Name" placeholder="John Doe" value={name} onChange={e => setName(e.target.value)} error={errors.name} icon={User} id="signup-name" required />
        <Input label="Email Address" type="email" placeholder="name@example.com" value={email} onChange={e => setEmail(e.target.value)} error={errors.email} icon={Mail} id="signup-email" required />
        <Input label="Password" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} error={errors.password} icon={Lock} id="signup-password" required />
        <Input label="Confirm Password" type="password" placeholder="••••••••" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} error={errors.confirmPassword} icon={Lock} id="signup-confirm" required />
        
        <div className="pt-2">
          <Button type="submit" className="w-full shadow-glow-brand py-4 font-black uppercase tracking-widest text-xs" size="lg" loading={loading} icon={ArrowRight}>
            Create Account
          </Button>
        </div>
      </form>

      <p className="text-xs font-bold text-center mt-10 text-text-secondary">
        Already have an account? <Link to="/login" className="text-brand hover:text-brand-hover transition-colors ml-1">Sign in</Link>
      </p>
    </AuthLayout>
  );
};

export default SignupPage;
