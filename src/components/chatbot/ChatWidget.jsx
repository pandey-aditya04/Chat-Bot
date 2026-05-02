import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, Minus } from 'lucide-react';
import ChatMessage from './ChatMessage';
import TypingIndicator from './TypingIndicator';

const ChatWidget = ({
  faqs = [],
  primaryColor = '#6366f1',
  position = 'Right',
  welcomeMessage = 'Hi! How can I help you today?',
  chatWindowTitle = 'Support Chat',
  fallbackMessage = "I'm not sure about that. Please contact our support team.",
  launcherIcon = 'Chat Bubble',
  isOpen: controlledOpen,
  onToggle,
  inline = false,
  className = '',
}) => {
  const [isOpenState, setIsOpenState] = useState(false);
  const isOpen = controlledOpen !== undefined ? controlledOpen : isOpenState;
  const [messages, setMessages] = useState([
    { id: 'welcome', role: 'bot', text: welcomeMessage, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Focus input when chat opens, but only if not inline to avoid scroll jump on load
  useEffect(() => {
    if (isOpen && !inline && inputRef.current) {
      const timer = setTimeout(() => inputRef.current?.focus(), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen, inline]);

  // Scroll to bottom when messages change, but avoid on first load
  useEffect(() => {
    if (messages.length > 1 || isTyping) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [messages, isTyping]);

  const matchFAQ = (query) => {
    const lowerQuery = query.toLowerCase().trim();
    
    // Check for basic greetings first
    const greetings = ['hi', 'hello', 'hey', 'how are you', 'howdy', 'hola'];
    if (greetings.some(g => lowerQuery.includes(g))) {
      return { answer: "Hi there! 👋 I'm doing great, thanks for asking! How can I help you today?" };
    }

    const words = lowerQuery.replace(/[?!.,]/g, '').split(/\s+/).filter(w => w.length >= 2);
    let bestMatch = null;
    let bestScore = 0;

    for (const faq of faqs) {
      const faqWords = faq.question.toLowerCase().replace(/[?!.,]/g, '').split(/\s+/);
      let score = 0;
      for (const word of words) {
        if (faqWords.some(fw => fw.includes(word) || word.includes(fw))) {
          score++;
        }
      }
      if (score > bestScore) {
        bestScore = score;
        bestMatch = faq;
      }
    }

    return bestScore >= 1 ? bestMatch : null;
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg = {
      id: Date.now().toString(),
      role: 'user',
      text: input.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const match = matchFAQ(userMsg.text);
      const botMsg = {
        id: (Date.now() + 1).toString(),
        role: 'bot',
        text: match ? match.answer : fallbackMessage,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setIsTyping(false);
      setMessages(prev => [...prev, botMsg]);
    }, 800);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleOpen = () => {
    if (onToggle) onToggle();
    else setIsOpenState(prev => !prev);
  };

  const LauncherIcons = {
    'Chat Bubble': MessageCircle,
    'Robot': Bot,
    'Headphones': MessageCircle,
    'Custom': MessageCircle,
  };
  const LauncherIcon = LauncherIcons[launcherIcon] || MessageCircle;

  const positionClasses = position === 'Left' ? 'left-5' : 'right-5';

  if (inline) {
    return (
      <div className={`w-full max-w-sm mx-auto rounded-2xl overflow-hidden shadow-2xl flex flex-col bg-[#0d0d1a] ${className}`}
        style={{ height: '480px', border: `1px solid ${primaryColor}30` }}>
        {/* Header */}
        <div className="px-4 py-3 flex items-center gap-3" style={{ backgroundColor: primaryColor }}>
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h4 className="text-white font-semibold text-sm">{chatWindowTitle}</h4>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-white/70 text-xs">Online</span>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
          {messages.map(msg => (
            <ChatMessage key={msg.id} message={msg} primaryColor={primaryColor} />
          ))}
          {isTyping && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-3 border-t border-white/10">
          <div className="flex items-center gap-2 bg-white/5 rounded-xl px-3 py-2 border border-white/10">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              className="flex-1 bg-transparent text-white text-sm outline-none placeholder-gray-500"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className="p-1.5 rounded-lg transition-colors disabled:opacity-30"
              style={{ backgroundColor: input.trim() ? primaryColor : 'transparent' }}
            >
              <Send className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`fixed bottom-5 ${positionClasses} z-50`}>
      {/* Chat Window */}
      {isOpen && (
        <div className={`absolute bottom-16 ${position === 'Left' ? 'left-0' : 'right-0'} w-[380px] animate-chat-open`}>
          <div className="rounded-2xl overflow-hidden shadow-2xl flex flex-col bg-[#0d0d1a]" style={{ height: '520px', border: `1px solid ${primaryColor}30` }}>
            {/* Header */}
            <div className="px-4 py-3 flex items-center gap-3" style={{ backgroundColor: primaryColor }}>
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="text-white font-semibold text-sm">{chatWindowTitle}</h4>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-white/70 text-xs">Online</span>
                </div>
              </div>
              <button onClick={toggleOpen} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors">
                <Minus className="w-4 h-4 text-white" />
              </button>
              <button onClick={toggleOpen} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors">
                <X className="w-4 h-4 text-white" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
              {messages.map(msg => (
                <ChatMessage key={msg.id} message={msg} primaryColor={primaryColor} />
              ))}
              {isTyping && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t border-white/10">
              <div className="flex items-center gap-2 bg-white/5 rounded-xl px-3 py-2 border border-white/10">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your message..."
                  className="flex-1 bg-transparent text-white text-sm outline-none placeholder-gray-500"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className="p-1.5 rounded-lg transition-colors disabled:opacity-30"
                  style={{ backgroundColor: input.trim() ? primaryColor : 'transparent' }}
                >
                  <Send className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Launcher */}
      <button
        onClick={toggleOpen}
        className="w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-110 animate-pulse-glow"
        style={{ backgroundColor: primaryColor }}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <LauncherIcon className="w-6 h-6 text-white" />
        )}
      </button>
    </div>
  );
};

export default ChatWidget;
