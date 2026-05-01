import { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';

const Tooltip = ({ children, content, position = 'top' }) => {
  const [show, setShow] = useState(false);
  const { isDark } = useTheme();

  const positions = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  return (
    <div className="relative inline-flex" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      {children}
      {show && (
        <div className={`absolute z-50 px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap animate-fade-in ${positions[position]} ${
          isDark ? 'bg-dark-surface-2 text-dark-text border border-dark-border' : 'bg-gray-800 text-white'
        }`}>
          {content}
        </div>
      )}
    </div>
  );
};

export default Tooltip;
