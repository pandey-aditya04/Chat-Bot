import { useNavigate } from 'react-router-dom';
import { Bot, MessageSquare, Activity, Zap, Plus, ArrowRight, Sparkles } from 'lucide-react';
import StatsCard from '../../components/analytics/StatsCard';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { useBots } from '../../context/BotContext';
import { useTheme } from '../../context/ThemeContext';
import { formatDate } from '../../utils/formatDate';

const DashboardHome = () => {
  const { bots, loading, getBotStats } = useBots();
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const stats = getBotStats();
  const recentBots = bots.slice(0, 3);
  const hasBots = bots.length > 0;

  const statusVariant = { Active: 'success', Draft: 'warning', Paused: 'default' };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Total Bots" value={stats.totalBots} icon={Bot} color="primary" trend="up" trendValue="2 new" />
        <StatsCard title="Total Conversations" value={stats.totalConversations} icon={MessageSquare} color="accent" trend="up" trendValue="+12%" />
        <StatsCard title="Messages This Month" value={2847} icon={Activity} color="success" trend="up" trendValue="+8%" />
        <StatsCard title="Active Bots" value={stats.activeBots} icon={Zap} color="warning" trend="stable" trendValue="No change" />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent Bots */}
        <div className="lg:col-span-2">
          <Card padding="none">
            <div className="p-6 pb-3 flex items-center justify-between">
              <h3 className={`text-lg font-semibold ${isDark ? 'text-dark-text' : 'text-light-text'}`}>Recent Bots</h3>
              <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard/bots')}>View All <ArrowRight className="w-3.5 h-3.5" /></Button>
            </div>
            {hasBots ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className={isDark ? 'border-b border-dark-border' : 'border-b border-light-border'}>
                      {['Name','Status','Created','Actions'].map(h => (
                        <th key={h} className={`text-left text-xs font-medium uppercase tracking-wider px-6 py-3 ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {recentBots.map(bot => (
                      <tr key={bot.id} className={`${isDark ? 'border-b border-dark-border/50 hover:bg-dark-surface-2/50' : 'border-b border-light-border/50 hover:bg-light-surface-2/50'} transition-colors`}>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center"><Bot className="w-5 h-5 text-primary" /></div>
                            <div>
                              <p className={`text-sm font-medium ${isDark ? 'text-dark-text' : 'text-light-text'}`}>{bot.name}</p>
                              <p className={`text-xs ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`}>{bot.website}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4"><Badge variant={statusVariant[bot.status]}>{bot.status}</Badge></td>
                        <td className={`px-6 py-4 text-sm ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`}>{formatDate(bot.created)}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" onClick={() => navigate(`/dashboard/bots/${bot.id}/embed`)}>Embed</Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-12 text-center">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4"><Bot className="w-8 h-8 text-primary" /></div>
                <h4 className={`font-semibold mb-2 ${isDark ? 'text-dark-text' : 'text-light-text'}`}>No bots yet</h4>
                <p className={`text-base leading-relaxed mb-4 ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`}>Create your first chatbot to get started</p>
                <Button icon={Plus} onClick={() => navigate('/dashboard/bots/new')}>Create Bot</Button>
              </div>
            )}
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
            <div className="flex items-center gap-3 mb-3">
              <Sparkles className="w-5 h-5 text-primary" />
              <h4 className={`font-semibold ${isDark ? 'text-dark-text' : 'text-light-text'}`}>Quick Start</h4>
            </div>
            <p className={`text-base leading-relaxed mb-4 ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`}>Create your first AI chatbot in under 5 minutes.</p>
            <Button className="w-full" icon={Plus} onClick={() => navigate('/dashboard/bots/new')}>Create New Bot</Button>
          </Card>

          <Card>
            <h4 className={`font-semibold mb-3 ${isDark ? 'text-dark-text' : 'text-light-text'}`}>Getting Started</h4>
            <ul className="space-y-3">
              {[
                { label: 'Create your first bot', done: hasBots },
                { label: 'Add FAQ questions', done: bots.some(b => b.faqCount > 0) },
                { label: 'Customize appearance', done: true },
                { label: 'Embed on website', done: false },
              ].map((item,i) => (
                <li key={i} className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${item.done ? 'bg-success text-white' : isDark ? 'border border-dark-border' : 'border border-light-border'}`}>
                    {item.done && '✓'}
                  </div>
                  <span className={`text-sm ${item.done ? (isDark ? 'text-dark-text-secondary line-through' : 'text-light-text-secondary line-through') : (isDark ? 'text-dark-text' : 'text-light-text')}`}>{item.label}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
