import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const Input = ({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  required = false,
  disabled = false,
  icon: Icon,
  className = '',
  id,
  ...props
}) => {
  const { isDark } = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  const inputClasses = `w-full rounded-xl px-4 py-3.5 text-sm font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary ${
    Icon ? 'pl-11' : ''
  } ${isPassword ? 'pr-11' : ''} ${
    isDark
      ? 'bg-dark-surface-2 border border-dark-border text-dark-text placeholder-dark-text-secondary'
      : 'bg-light-surface-2 border border-light-border text-light-text placeholder-light-text-secondary'
  } ${error ? 'border-danger focus:ring-danger/50' : ''} ${
    disabled ? 'opacity-50 cursor-not-allowed' : ''
  }`;

  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label htmlFor={id} className={`block text-sm font-medium ${isDark ? 'text-dark-text' : 'text-light-text'}`}>
          {label}
          {required && <span className="text-danger ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`} />
        )}
        <input
          id={id}
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          className={inputClasses}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className={`absolute right-3.5 top-1/2 -translate-y-1/2 ${isDark ? 'text-dark-text-secondary hover:text-dark-text' : 'text-light-text-secondary hover:text-light-text'} transition-colors`}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>
      {error && <p className="text-danger text-xs mt-1">{error}</p>}
    </div>
  );
};

export default Input;
