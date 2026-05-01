import { Bot, User } from 'lucide-react';

const ChatMessage = ({ message, primaryColor = '#6366f1', isPreview = false }) => {
  const isBot = message.role === 'bot';

  return (
    <div className={`flex gap-2.5 animate-message-fade ${isBot ? 'justify-start' : 'justify-end'}`}>
      {isBot && (
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-1"
          style={{ backgroundColor: primaryColor + '20' }}
        >
          <Bot className="w-4 h-4" style={{ color: primaryColor }} />
        </div>
      )}
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
          isBot
            ? 'bg-white/10 text-gray-200 rounded-tl-sm'
            : 'text-white rounded-tr-sm'
        }`}
        style={!isBot ? { backgroundColor: primaryColor } : undefined}
      >
        {message.text}
      </div>
      {!isBot && (
        <div className="w-7 h-7 rounded-full bg-gray-600 flex items-center justify-center flex-shrink-0 mt-1">
          <User className="w-4 h-4 text-gray-300" />
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
