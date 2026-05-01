import { useState } from 'react';
import { User, Shield, CreditCard, Bell, Save, Upload, Camera } from 'lucide-react';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../hooks/useToast';

const tabs = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'billing', label: 'Billing', icon: CreditCard },
  { id: 'notifications', label: 'Notifications', icon: Bell },
];

const Settings = () => {
  const { user, updateProfile } = useAuth();
  const { isDark } = useTheme();
  const toast = useToast();
  const [activeTab, setActiveTab] = useState('profile');
  const [profile, setProfile] = useState({ name: user?.name || '', email: user?.email || '', timezone: user?.timezone || 'America/New_York' });
  const [security, setSecurity] = useState({ currentPassword: '', newPassword: '', confirmPassword: '', twoFa: false });
  const [notifications, setNotifications] = useState({ weeklyReport: true, newConversation: true, botErrors: true });

  const handleSaveProfile = () => { updateProfile({ name: profile.name }); toast.success('Profile updated!'); };
  const handleSaveSecurity = () => {
    if (security.newPassword && security.newPassword !== security.confirmPassword) { toast.error('Passwords do not match'); return; }
    toast.success('Security settings saved!');
    setSecurity({ currentPassword: '', newPassword: '', confirmPassword: '', twoFa: security.twoFa });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      {/* Tabs */}
      <div className={`flex gap-1 p-1 rounded-xl ${isDark ? 'bg-dark-surface border border-dark-border' : 'bg-light-surface-2 border border-light-border'}`}>
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
            activeTab === tab.id ? 'bg-primary text-white shadow-lg shadow-primary/25' : isDark ? 'text-dark-text-secondary hover:text-dark-text' : 'text-light-text-secondary hover:text-light-text'
          }`}>
            <tab.icon className="w-4 h-4" />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {activeTab === 'profile' && (
        <Card>
          <h3 className={`text-lg font-semibold mb-6 ${isDark ? 'text-dark-text' : 'text-light-text'}`}>Profile Settings</h3>
          <div className="flex items-center gap-6 mb-8">
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <span className="text-2xl font-bold text-white">{user?.name?.charAt(0)?.toUpperCase()}</span>
              </div>
              <button onClick={() => toast.info('Photo upload coming soon!')} className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-lg">
                <Camera className="w-4 h-4 text-white" />
              </button>
            </div>
            <div>
              <h4 className={`font-semibold ${isDark ? 'text-dark-text' : 'text-light-text'}`}>{user?.name}</h4>
              <p className={`text-sm ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`}>{user?.email}</p>
              <Badge variant="purple" className="mt-1">{user?.plan} Plan</Badge>
            </div>
          </div>
          <div className="space-y-4">
            <Input label="Full Name" value={profile.name} onChange={e => setProfile(p => ({ ...p, name: e.target.value }))} id="settings-name" />
            <Input label="Email" value={profile.email} disabled id="settings-email" />
            <div className="space-y-1.5">
              <label className={`block text-sm font-medium ${isDark ? 'text-dark-text' : 'text-light-text'}`}>Timezone</label>
              <select value={profile.timezone} onChange={e => setProfile(p => ({ ...p, timezone: e.target.value }))} className={`w-full rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 ${isDark ? 'bg-dark-surface-2 border border-dark-border text-dark-text' : 'bg-light-surface-2 border border-light-border text-light-text'}`}>
                {['America/New_York','America/Chicago','America/Denver','America/Los_Angeles','Europe/London','Europe/Paris','Asia/Tokyo'].map(tz => <option key={tz} value={tz}>{tz}</option>)}
              </select>
            </div>
            <Button icon={Save} onClick={handleSaveProfile}>Save Changes</Button>
          </div>
        </Card>
      )}

      {activeTab === 'security' && (
        <Card>
          <h3 className={`text-lg font-semibold mb-6 ${isDark ? 'text-dark-text' : 'text-light-text'}`}>Security Settings</h3>
          <div className="space-y-4">
            <Input label="Current Password" type="password" value={security.currentPassword} onChange={e => setSecurity(p => ({ ...p, currentPassword: e.target.value }))} id="sec-current" />
            <Input label="New Password" type="password" value={security.newPassword} onChange={e => setSecurity(p => ({ ...p, newPassword: e.target.value }))} id="sec-new" />
            <Input label="Confirm Password" type="password" value={security.confirmPassword} onChange={e => setSecurity(p => ({ ...p, confirmPassword: e.target.value }))} id="sec-confirm" />
            <div className={`flex items-center justify-between p-4 rounded-xl ${isDark ? 'bg-dark-surface-2 border border-dark-border' : 'bg-light-surface-2 border border-light-border'}`}>
              <div>
                <p className={`text-sm font-medium ${isDark ? 'text-dark-text' : 'text-light-text'}`}>Two-Factor Authentication</p>
                <p className={`text-xs mt-0.5 ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`}>Add an extra layer of security</p>
              </div>
              <button onClick={() => { setSecurity(p => ({ ...p, twoFa: !p.twoFa })); toast.info('2FA coming soon!'); }} className={`relative w-12 h-6 rounded-full transition-colors ${security.twoFa ? 'bg-primary' : isDark ? 'bg-dark-border' : 'bg-gray-300'}`}>
                <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${security.twoFa ? 'translate-x-6.5' : 'translate-x-0.5'}`} />
              </button>
            </div>
            <Button icon={Save} onClick={handleSaveSecurity}>Update Password</Button>
          </div>
        </Card>
      )}

      {activeTab === 'billing' && (
        <div className="space-y-6">
          <Card>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className={`text-lg font-semibold ${isDark ? 'text-dark-text' : 'text-light-text'}`}>Current Plan</h3>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="purple" size="lg">{user?.plan || 'Free'}</Badge>
                </div>
              </div>
              <Button variant="outline" onClick={() => toast.info('Upgrade flow coming soon!')}>Upgrade Plan</Button>
            </div>
            <div className="space-y-4">
              {[{ label: 'Chatbots', used: 3, total: 5 }, { label: 'Messages', used: 2847, total: 5000 }, { label: 'FAQs', used: 31, total: 999 }].map((item, i) => (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className={isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}>{item.label}</span>
                    <span className={isDark ? 'text-dark-text' : 'text-light-text'}>{item.used.toLocaleString()} / {item.total === 999 ? '∞' : item.total.toLocaleString()}</span>
                  </div>
                  <div className={`h-2 rounded-full overflow-hidden ${isDark ? 'bg-dark-surface-2' : 'bg-light-surface-2'}`}>
                    <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${Math.min((item.used / item.total) * 100, 100)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </Card>
          <Card>
            <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-dark-text' : 'text-light-text'}`}>Payment Method</h3>
            <div className={`flex items-center gap-4 p-4 rounded-xl ${isDark ? 'bg-dark-surface-2 border border-dark-border' : 'bg-light-surface-2 border border-light-border'}`}>
              <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-blue-400 rounded-lg flex items-center justify-center text-white text-xs font-bold">VISA</div>
              <div>
                <p className={`text-sm font-medium ${isDark ? 'text-dark-text' : 'text-light-text'}`}>•••• •••• •••• 4242</p>
                <p className={`text-xs ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`}>Expires 12/25</p>
              </div>
            </div>
          </Card>
          <Card>
            <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-dark-text' : 'text-light-text'}`}>Invoice History</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className={isDark ? 'border-b border-dark-border' : 'border-b border-light-border'}>
                    {['Date','Amount','Status'].map(h => <th key={h} className={`text-left text-xs font-medium uppercase tracking-wider px-4 py-3 ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`}>{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {[{ date: 'Apr 1, 2024', amount: '$19.00', status: 'Paid' }, { date: 'Mar 1, 2024', amount: '$19.00', status: 'Paid' }, { date: 'Feb 1, 2024', amount: '$19.00', status: 'Paid' }].map((inv, i) => (
                    <tr key={i} className={isDark ? 'border-b border-dark-border/50' : 'border-b border-light-border/50'}>
                      <td className={`px-4 py-3 text-sm ${isDark ? 'text-dark-text' : 'text-light-text'}`}>{inv.date}</td>
                      <td className={`px-4 py-3 text-sm ${isDark ? 'text-dark-text' : 'text-light-text'}`}>{inv.amount}</td>
                      <td className="px-4 py-3"><Badge variant="success" size="sm">{inv.status}</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'notifications' && (
        <Card>
          <h3 className={`text-lg font-semibold mb-6 ${isDark ? 'text-dark-text' : 'text-light-text'}`}>Notification Preferences</h3>
          <div className="space-y-4">
            {[
              { key: 'weeklyReport', label: 'Weekly Report', desc: 'Receive a weekly summary of your bot performance' },
              { key: 'newConversation', label: 'New Conversations', desc: 'Get notified when users start new conversations' },
              { key: 'botErrors', label: 'Bot Errors', desc: 'Get alerted when your bot encounters errors' },
            ].map(item => (
              <div key={item.key} className={`flex items-center justify-between p-4 rounded-xl ${isDark ? 'bg-dark-surface-2 border border-dark-border' : 'bg-light-surface-2 border border-light-border'}`}>
                <div>
                  <p className={`text-sm font-medium ${isDark ? 'text-dark-text' : 'text-light-text'}`}>{item.label}</p>
                  <p className={`text-xs mt-0.5 ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`}>{item.desc}</p>
                </div>
                <button onClick={() => setNotifications(p => ({ ...p, [item.key]: !p[item.key] }))} className={`relative w-12 h-6 rounded-full transition-colors ${notifications[item.key] ? 'bg-primary' : isDark ? 'bg-dark-border' : 'bg-gray-300'}`}>
                  <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${notifications[item.key] ? 'translate-x-6.5' : 'translate-x-0.5'}`} />
                </button>
              </div>
            ))}
            <Button icon={Save} onClick={() => toast.success('Notification preferences saved!')}>Save Preferences</Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Settings;
