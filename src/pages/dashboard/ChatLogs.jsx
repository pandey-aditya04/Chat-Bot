import { useState, useEffect } from 'react';
import { Search, Download, Bot, User } from 'lucide-react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Skeleton from '../../components/ui/Skeleton';
import { mockChatLogs } from '../../data/mockChatLogs';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../hooks/useToast';

const ChatLogs = () => {
  const { isDark } = useTheme();
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const t = setTimeout(() => { setLoading(false); setSelected(mockChatLogs[0]); }, 800);
    return () => clearTimeout(t);
  }, []);

  const filtered = mockChatLogs.filter(log =>
    log.botName.toLowerCase().includes(search.toLowerCase()) ||
    log.sessionId.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="space-y-3"><Skeleton className="h-20" count={5} /></div>
        <div className="lg:col-span-2"><Skeleton className="h-96" /></div>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-3 gap-6 animate-fade-in" style={{ height: 'calc(100vh - 160px)' }}>
      {/* Left - Conversation List */}
      <div className="flex flex-col">
        <div className="flex items-center gap-2 mb-4">
          <div className={`flex-1 flex items-center gap-2 px-3 py-2.5 rounded-xl ${isDark ? 'bg-dark-surface border border-dark-border' : 'bg-light-surface border border-light-border'}`}>
            <Search className={`w-4 h-4 ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search conversations..." className={`flex-1 bg-transparent text-sm outline-none ${isDark ? 'text-dark-text placeholder-dark-text-secondary' : 'text-light-text placeholder-light-text-secondary'}`} />
          </div>
          <Button variant="secondary" size="sm" icon={Download} onClick={() => toast.info('Export coming soon!')}>Export</Button>
        </div>
        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {filtered.map(log => (
            <div
              key={log.id}
              onClick={() => setSelected(log)}
              className={`p-4 rounded-xl cursor-pointer transition-all ${
                selected?.id === log.id
                  ? 'bg-primary/10 border border-primary/30'
                  : isDark ? 'bg-dark-surface border border-dark-border hover:border-dark-border/80' : 'bg-light-surface border border-light-border hover:shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`text-sm font-medium ${isDark ? 'text-dark-text' : 'text-light-text'}`}>{log.sessionId}</span>
                <Badge variant="default" size="sm">{log.messageCount} msgs</Badge>
              </div>
              <p className={`text-xs ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`}>{log.botName}</p>
              <p className={`text-xs mt-1 ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`}>{log.date}</p>
            </div>
          ))}
          {filtered.length === 0 && (
            <p className={`text-center py-8 text-sm ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`}>No conversations found</p>
          )}
        </div>
      </div>

      {/* Right - Chat View */}
      <div className="lg:col-span-2">
        {selected ? (
          <Card padding="none" className="h-full flex flex-col">
            <div className={`p-4 border-b ${isDark ? 'border-dark-border' : 'border-light-border'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className={`font-semibold ${isDark ? 'text-dark-text' : 'text-light-text'}`}>{selected.sessionId}</h3>
                  <p className={`text-xs mt-0.5 ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`}>{selected.botName} · {selected.date}</p>
                </div>
                <Badge variant="default">{selected.messageCount} messages</Badge>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {selected.messages.map(msg => (
                <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.role === 'bot' && (
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                      <Bot className="w-4 h-4 text-primary" />
                    </div>
                  )}
                  <div className={`max-w-[70%]`}>
                    <div className={`rounded-2xl px-4 py-2.5 text-sm ${
                      msg.role === 'user'
                        ? 'bg-primary text-white rounded-tr-sm'
                        : isDark ? 'bg-dark-surface-2 text-dark-text border border-dark-border rounded-tl-sm' : 'bg-light-surface-2 text-light-text border border-light-border rounded-tl-sm'
                    }`}>
                      {msg.text}
                    </div>
                    <div className="flex items-center gap-2 mt-1 px-1">
                      <span className={`text-xs ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`}>{msg.time}</span>
                      {msg.matched !== undefined && (
                        <Badge variant={msg.matched ? 'success' : 'danger'} size="sm">
                          {msg.matched ? 'Matched' : 'Unmatched'}
                        </Badge>
                      )}
                    </div>
                  </div>
                  {msg.role === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-gray-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                      <User className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        ) : (
          <Card className="h-full flex items-center justify-center">
            <p className={isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}>Select a conversation to view</p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ChatLogs;
