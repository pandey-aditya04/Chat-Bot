import { useEffect } from 'react';
import { X } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const Modal = ({ isOpen, onClose, title, children, size = 'md', showClose = true }) => {
  const { isDark } = useTheme();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative w-full ${sizes[size]} animate-scale-in ${
        isDark
          ? 'bg-dark-surface border border-dark-border'
          : 'bg-light-surface border border-light-border shadow-2xl'
      } rounded-2xl`}>
        {(title || showClose) && (
          <div className={`flex items-center justify-between p-6 pb-0`}>
            {title && (
              <h3 className={`text-lg font-semibold ${isDark ? 'text-dark-text' : 'text-light-text'}`}>
                {title}
              </h3>
            )}
            {showClose && (
              <button
                onClick={onClose}
                className={`p-2 rounded-xl transition-colors ${
                  isDark ? 'hover:bg-dark-surface-2 text-dark-text-secondary' : 'hover:bg-light-surface-2 text-light-text-secondary'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        )}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
