import toast from 'react-hot-toast';

export const useToast = () => {
  const success = (message) => {
    toast.success(message, {
      style: {
        background: '#1a1a2e',
        color: '#e2e8f0',
        border: '1px solid #2d2d50',
        borderRadius: '12px',
        padding: '12px 16px',
        fontSize: '14px',
      },
      iconTheme: {
        primary: '#10b981',
        secondary: '#1a1a2e',
      },
      duration: 3000,
    });
  };

  const error = (message) => {
    toast.error(message, {
      style: {
        background: '#1a1a2e',
        color: '#e2e8f0',
        border: '1px solid #2d2d50',
        borderRadius: '12px',
        padding: '12px 16px',
        fontSize: '14px',
      },
      iconTheme: {
        primary: '#ef4444',
        secondary: '#1a1a2e',
      },
      duration: 4000,
    });
  };

  const info = (message) => {
    toast(message, {
      icon: 'ℹ️',
      style: {
        background: '#1a1a2e',
        color: '#e2e8f0',
        border: '1px solid #2d2d50',
        borderRadius: '12px',
        padding: '12px 16px',
        fontSize: '14px',
      },
      duration: 3000,
    });
  };

  return { success, error, info };
};
