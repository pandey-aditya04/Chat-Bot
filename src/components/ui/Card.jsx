import { useTheme } from '../../context/ThemeContext';

const Card = ({ children, className = '', glass = false, hover = false, padding = 'md', onClick }) => {
  const { isDark } = useTheme();

  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const baseClasses = `rounded-2xl transition-all duration-300 ${paddings[padding]}`;

  const glassClasses = glass
    ? (isDark ? 'glass' : 'glass-light')
    : isDark
      ? 'bg-dark-surface border border-dark-border'
      : 'bg-light-surface border border-light-border shadow-sm';

  const hoverClasses = hover
    ? 'hover:scale-[1.02] hover:shadow-xl cursor-pointer'
    : '';

  return (
    <div
      className={`${baseClasses} ${glassClasses} ${hoverClasses} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;
