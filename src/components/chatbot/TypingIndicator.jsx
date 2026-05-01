const TypingIndicator = () => {
  return (
    <div className="flex items-center gap-1 px-4 py-3">
      <div className="w-2 h-2 rounded-full bg-primary/60" style={{ animation: 'typingDot 1.4s ease-in-out infinite' }} />
      <div className="w-2 h-2 rounded-full bg-primary/60" style={{ animation: 'typingDot 1.4s ease-in-out infinite 0.2s' }} />
      <div className="w-2 h-2 rounded-full bg-primary/60" style={{ animation: 'typingDot 1.4s ease-in-out infinite 0.4s' }} />
    </div>
  );
};

export default TypingIndicator;
