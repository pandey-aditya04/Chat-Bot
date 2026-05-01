import { useTheme } from '../../context/ThemeContext';
import Card from '../ui/Card';

const StatsCard = ({ title, value, icon: Icon, trend, trendValue, color = 'primary' }) => {
  const { isDark } = useTheme();

  const colors = {
    primary: { bg: 'bg-primary/10', text: 'text-primary', icon: 'text-primary' },
    success: { bg: 'bg-success/10', text: 'text-success', icon: 'text-success' },
    accent: { bg: 'bg-accent/10', text: 'text-accent', icon: 'text-accent' },
    warning: { bg: 'bg-warning/10', text: 'text-warning', icon: 'text-warning' },
    danger: { bg: 'bg-danger/10', text: 'text-danger', icon: 'text-danger' },
    info: { bg: 'bg-info/10', text: 'text-info', icon: 'text-info' },
  };

  const c = colors[color] || colors.primary;

  return (
    <Card hover>
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className={`text-sm font-medium ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`}>
            {title}
          </p>
          <p className={`text-3xl font-bold tracking-tight ${isDark ? 'text-dark-text' : 'text-light-text'}`}>
            {typeof value === 'number' ? value.toLocaleString() : value}
          </p>
          {trend && (
            <div className="flex items-center gap-1.5">
              <span className={`text-xs font-medium ${trend === 'up' ? 'text-success' : trend === 'down' ? 'text-danger' : 'text-dark-text-secondary'}`}>
                {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'} {trendValue}
              </span>
              <span className={`text-xs ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`}>
                vs last month
              </span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-xl ${c.bg}`}>
          <Icon className={`w-6 h-6 ${c.icon}`} />
        </div>
      </div>
    </Card>
  );
};

export default StatsCard;
