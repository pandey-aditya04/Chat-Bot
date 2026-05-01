import { useTheme } from '../../context/ThemeContext';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  loading = false,
  icon: Icon,
  onClick,
  type = 'button',
  ...props
}) => {
  const { isDark } = useTheme();

  const baseClasses = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2';

  const variants = {
    primary: 'bg-gradient-to-r from-primary to-accent hover:from-primary-dark hover:to-primary text-white shadow-[0_8px_30px_rgb(124,58,237,0.3)] hover:shadow-[0_8px_30px_rgb(124,58,237,0.5)] hover:-translate-y-0.5 focus:ring-primary',
    secondary: isDark
      ? 'bg-dark-surface-2 hover:bg-dark-border text-dark-text border border-dark-border hover:shadow-lg focus:ring-primary'
      : 'bg-light-surface-2 hover:bg-light-border text-light-text border border-light-border hover:shadow-sm focus:ring-primary',
    ghost: isDark
      ? 'text-dark-text-secondary hover:text-dark-text hover:bg-dark-surface-2 focus:ring-primary'
      : 'text-light-text-secondary hover:text-light-text hover:bg-light-surface-2 focus:ring-primary',
    danger: 'bg-danger hover:bg-red-600 text-white shadow-lg shadow-danger/25 focus:ring-danger',
    success: 'bg-success hover:bg-emerald-600 text-white shadow-lg shadow-success/25 focus:ring-success',
    outline: isDark
      ? 'border-2 border-primary text-primary hover:bg-primary hover:text-white focus:ring-primary'
      : 'border-2 border-primary text-primary hover:bg-primary hover:text-white focus:ring-primary',
  };

  const sizes = {
    sm: 'px-4 py-2 text-xs gap-1.5',
    md: 'px-6 py-3 text-sm gap-2',
    lg: 'px-8 py-4 text-base gap-2.5',
    xl: 'px-10 py-4 text-lg gap-3 tracking-tight',
  };

  return (
    <button
      type={type}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : Icon ? (
        <Icon className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
      ) : null}
      {children}
    </button>
  );
};

export default Button;
