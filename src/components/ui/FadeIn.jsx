import { motion } from 'framer-motion';

const FadeIn = ({ 
  children, 
  delay = 0, 
  direction = 'up', 
  fullWidth = false,
  className = ''
}) => {
  const directions = {
    up: { y: 24, x: 0 },
    down: { y: -24, x: 0 },
    left: { x: -24, y: 0 },
    right: { x: 24, y: 0 },
    none: { x: 0, y: 0 }
  };

  return (
    <motion.div
      initial={{ 
        opacity: 0, 
        ...directions[direction] 
      }}
      whileInView={{ 
        opacity: 1, 
        y: 0, 
        x: 0 
      }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ 
        duration: 0.55, 
        delay, 
        ease: [0.22, 1, 0.36, 1] 
      }}
      className={`${fullWidth ? 'w-full' : ''} ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default FadeIn;
