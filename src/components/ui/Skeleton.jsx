import { useTheme } from '../../context/ThemeContext';

const Skeleton = ({ className = '', variant = 'rectangular', count = 1 }) => {
  const { isDark } = useTheme();

  const baseClasses = `animate-pulse rounded-xl ${
    isDark ? 'bg-dark-surface-2' : 'bg-light-surface-2'
  }`;

  const variants = {
    rectangular: '',
    circular: '!rounded-full',
    text: 'h-4',
  };

  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`${baseClasses} ${variants[variant]} ${className}`}
        />
      ))}
    </>
  );
};

export default Skeleton;
