import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Plus, X, Check, Bot, Upload, Save } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import ChatWidget from '../../components/chatbot/ChatWidget';
import { useBots } from '../../context/BotContext';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../hooks/useToast';

const stepLabels = ['Basic Info', 'FAQs', 'Behavior', 'Appearance', 'Preview'];

const CreateBot = () => {
  const navigate = useNavigate();
  const { addBot } = useBots();
  const { isDark } = useTheme();
  const toast = useToast();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    name: '', website: '', description: '',
    faqs: [{ question: '', answer: '' }],
    tone: 'Friendly', fallbackMessage: "I'm not sure about that. Please contact our support team.",
    customInstructions: '', maxResponseLength: 'Medium',
    primaryColor: '#6366f1', chatPosition: 'Right',
    welcomeMessage: 'Hi! How can I help you today?', chatWindowTitle: 'Support Chat',
    launcherIcon: 'Chat Bubble', avatar: null,
  });
  const [errors, setErrors] = useState({});

  const updateForm = (key, val) => setForm(p => ({ ...p, [key]: val }));

  const validateStep = () => {
    const errs = {};
    if (step === 0) {
      if (!form.name.trim()) errs.name = 'Bot name is required';
      if (!form.website.trim()) errs.website = 'Website URL is required';
    } else if (step === 1) {
      if (form.faqs.length === 0) errs.faqs = 'Add at least one FAQ';
      form.faqs.forEach((f, i) => {
        if (!f.question.trim()) errs[`faq_q_${i}`] = 'Question required';
        if (!f.answer.trim()) errs[`faq_a_${i}`] = 'Answer required';
      });
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const next = () => { if (validateStep()) setStep(s => Math.min(s + 1, 4)); };
  const prev = () => setStep(s => Math.max(s - 1, 0));

  const addFaq = () => updateForm('faqs', [...form.faqs, { question: '', answer: '' }]);
  const removeFaq = (i) => updateForm('faqs', form.faqs.filter((_, idx) => idx !== i));
  const updateFaq = (i, key, val) => {
    const updated = [...form.faqs];
    updated[i] = { ...updated[i], [key]: val };
    updateForm('faqs', updated);
  };

  const handlePublish = () => {
    const bot = addBot({
      name: form.name, website: form.website, description: form.description,
      faqs: form.faqs, status: 'Active', tone: form.tone,
      fallbackMessage: form.fallbackMessage, primaryColor: form.primaryColor,
      chatPosition: form.chatPosition, welcomeMessage: form.welcomeMessage,
      chatWindowTitle: form.chatWindowTitle, launcherIcon: form.launcherIcon,
      maxResponseLength: form.maxResponseLength,
    });
    toast.success('Bot published successfully! 🎉');
    navigate(`/dashboard/bots/${bot.id}/embed`);
  };

  const handleSaveDraft = () => {
    addBot({ ...form, status: 'Draft', faqs: form.faqs });
    toast.success('Bot saved as draft');
    navigate('/dashboard/bots');
  };

  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      {/* Stepper */}
      <div className="flex items-center justify-between mb-8">
        {stepLabels.map((label, i) => (
          <div key={i} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                i < step ? 'bg-success text-white' : i === step ? 'bg-primary text-white shadow-lg shadow-primary/30' : isDark ? 'bg-dark-surface-2 text-dark-text-secondary border border-dark-border' : 'bg-light-surface-2 text-light-text-secondary border border-light-border'
              }`}>
                {i < step ? <Check className="w-5 h-5" /> : i + 1}
              </div>
              <span className={`text-xs mt-2 font-medium hidden sm:block ${i <= step ? 'text-primary' : isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`}>{label}</span>
            </div>
            {i < 4 && <div className={`flex-1 h-0.5 mx-2 ${i < step ? 'bg-success' : isDark ? 'bg-dark-border' : 'bg-light-border'}`} />}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <Card className="mb-6">
        {step === 0 && (
          <div className="space-y-5">
            <h3 className={`text-lg font-semibold ${isDark ? 'text-dark-text' : 'text-light-text'}`}>Basic Information</h3>
            <Input label="Bot Name" placeholder="e.g. Support Bot" value={form.name} onChange={e => updateForm('name', e.target.value)} error={errors.name} required id="bot-name" />
            <Input label="Website URL" type="url" placeholder="https://yourwebsite.com" value={form.website} onChange={e => updateForm('website', e.target.value)} error={errors.website} required id="bot-website" />
            <div className="space-y-1.5">
              <label className={`block text-sm font-medium ${isDark ? 'text-dark-text' : 'text-light-text'}`}>Description</label>
              <textarea value={form.description} onChange={e => updateForm('description', e.target.value)} placeholder="Describe what this chatbot does..." rows={3} className={`w-full rounded-xl px-4 py-3 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/50 ${isDark ? 'bg-dark-surface-2 border border-dark-border text-dark-text placeholder-dark-text-secondary' : 'bg-light-surface-2 border border-light-border text-light-text placeholder-light-text-secondary'}`} />
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className={`text-lg font-semibold ${isDark ? 'text-dark-text' : 'text-light-text'}`}>FAQ Questions</h3>
                <p className={`text-sm mt-1 ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`}>{form.faqs.length} question{form.faqs.length !== 1 ? 's' : ''} added</p>
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" size="sm" icon={Upload} onClick={() => toast.info('CSV import coming soon!')}>Import CSV</Button>
                <Button variant="secondary" size="sm" icon={Plus} onClick={addFaq}>Add FAQ</Button>
              </div>
            </div>
            {errors.faqs && <p className="text-danger text-sm">{errors.faqs}</p>}
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
              {form.faqs.map((faq, i) => (
                <div key={i} className={`rounded-xl p-4 ${isDark ? 'bg-dark-surface-2 border border-dark-border' : 'bg-light-surface-2 border border-light-border'}`}>
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-xs font-medium ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`}>FAQ #{i + 1}</span>
                    {form.faqs.length > 1 && (
                      <button onClick={() => removeFaq(i)} className="p-1 rounded-lg hover:bg-danger/10 text-danger transition-colors"><X className="w-4 h-4" /></button>
                    )}
                  </div>
                  <div className="space-y-3">
                    <Input placeholder="Enter question..." value={faq.question} onChange={e => updateFaq(i, 'question', e.target.value)} error={errors[`faq_q_${i}`]} id={`faq-q-${i}`} />
                    <textarea value={faq.answer} onChange={e => updateFaq(i, 'answer', e.target.value)} placeholder="Enter answer..." rows={2} className={`w-full rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 ${isDark ? 'bg-dark-bg border border-dark-border text-dark-text placeholder-dark-text-secondary' : 'bg-white border border-light-border text-light-text placeholder-light-text-secondary'} ${errors[`faq_a_${i}`] ? 'border-danger' : ''}`} />
                    {errors[`faq_a_${i}`] && <p className="text-danger text-xs">{errors[`faq_a_${i}`]}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <h3 className={`text-lg font-semibold ${isDark ? 'text-dark-text' : 'text-light-text'}`}>Bot Behavior</h3>
            <div className="space-y-1.5">
              <label className={`block text-sm font-medium ${isDark ? 'text-dark-text' : 'text-light-text'}`}>Tone</label>
              <select value={form.tone} onChange={e => updateForm('tone', e.target.value)} className={`w-full rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 ${isDark ? 'bg-dark-surface-2 border border-dark-border text-dark-text' : 'bg-light-surface-2 border border-light-border text-light-text'}`}>
                {['Friendly','Formal','Professional','Sales-Focused','Casual'].map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <Input label="Fallback Message" value={form.fallbackMessage} onChange={e => updateForm('fallbackMessage', e.target.value)} id="fallback" />
            <div className="space-y-1.5">
              <label className={`block text-sm font-medium ${isDark ? 'text-dark-text' : 'text-light-text'}`}>Custom Instructions</label>
              <textarea value={form.customInstructions} onChange={e => updateForm('customInstructions', e.target.value)} placeholder="e.g. Always recommend contacting support for billing issues." rows={3} className={`w-full rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 ${isDark ? 'bg-dark-surface-2 border border-dark-border text-dark-text placeholder-dark-text-secondary' : 'bg-light-surface-2 border border-light-border text-light-text placeholder-light-text-secondary'}`} />
            </div>
            <div className="space-y-1.5">
              <label className={`block text-sm font-medium ${isDark ? 'text-dark-text' : 'text-light-text'}`}>Max Response Length</label>
              <select value={form.maxResponseLength} onChange={e => updateForm('maxResponseLength', e.target.value)} className={`w-full rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 ${isDark ? 'bg-dark-surface-2 border border-dark-border text-dark-text' : 'bg-light-surface-2 border border-light-border text-light-text'}`}>
                {['Short','Medium','Detailed'].map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-5">
              <h3 className={`text-lg font-semibold ${isDark ? 'text-dark-text' : 'text-light-text'}`}>Appearance</h3>
              <div className="space-y-1.5">
                <label className={`block text-sm font-medium ${isDark ? 'text-dark-text' : 'text-light-text'}`}>Primary Color</label>
                <div className="flex items-center gap-3">
                  <input type="color" value={form.primaryColor} onChange={e => updateForm('primaryColor', e.target.value)} className="w-12 h-12 rounded-xl cursor-pointer border-0" />
                  <span className={`text-sm font-mono ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`}>{form.primaryColor}</span>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className={`block text-sm font-medium ${isDark ? 'text-dark-text' : 'text-light-text'}`}>Chat Position</label>
                <div className="flex gap-3">
                  {['Left','Right'].map(pos => (
                    <button key={pos} onClick={() => updateForm('chatPosition', pos)} className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${form.chatPosition === pos ? 'bg-primary text-white' : isDark ? 'bg-dark-surface-2 text-dark-text-secondary border border-dark-border' : 'bg-light-surface-2 text-light-text-secondary border border-light-border'}`}>{pos}</button>
                  ))}
                </div>
              </div>
              <Input label="Welcome Message" value={form.welcomeMessage} onChange={e => updateForm('welcomeMessage', e.target.value)} id="welcome" />
              <Input label="Chat Window Title" value={form.chatWindowTitle} onChange={e => updateForm('chatWindowTitle', e.target.value)} id="title" />
              <div className="space-y-1.5">
                <label className={`block text-sm font-medium ${isDark ? 'text-dark-text' : 'text-light-text'}`}>Launcher Icon</label>
                <select value={form.launcherIcon} onChange={e => updateForm('launcherIcon', e.target.value)} className={`w-full rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 ${isDark ? 'bg-dark-surface-2 border border-dark-border text-dark-text' : 'bg-light-surface-2 border border-light-border text-light-text'}`}>
                  {['Chat Bubble','Robot','Headphones','Custom'].map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className={`block text-sm font-medium ${isDark ? 'text-dark-text' : 'text-light-text'}`}>Bot Avatar</label>
                <div className={`flex items-center gap-4 p-4 rounded-xl border-2 border-dashed ${isDark ? 'border-dark-border' : 'border-light-border'}`}>
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ backgroundColor: form.primaryColor + '20' }}>
                    <Bot className="w-7 h-7" style={{ color: form.primaryColor }} />
                  </div>
                  <button onClick={() => toast.info('Avatar upload coming soon!')} className="text-sm text-primary font-medium">Upload Image</button>
                </div>
              </div>
            </div>
            {/* Live Preview */}
            <div>
              <h4 className={`text-sm font-medium mb-3 ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`}>Live Preview</h4>
              <ChatWidget faqs={form.faqs.filter(f => f.question && f.answer)} primaryColor={form.primaryColor} welcomeMessage={form.welcomeMessage} chatWindowTitle={form.chatWindowTitle} fallbackMessage={form.fallbackMessage} launcherIcon={form.launcherIcon} inline />
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-dark-text' : 'text-light-text'}`}>Preview Your Bot</h3>
              <p className={`text-sm ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`}>Test your chatbot before publishing</p>
            </div>
            <div className="flex justify-center">
              <ChatWidget faqs={form.faqs.filter(f => f.question && f.answer)} primaryColor={form.primaryColor} position={form.chatPosition} welcomeMessage={form.welcomeMessage} chatWindowTitle={form.chatWindowTitle} fallbackMessage={form.fallbackMessage} launcherIcon={form.launcherIcon} inline />
            </div>
          </div>
        )}
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button variant="secondary" icon={ArrowLeft} onClick={prev} disabled={step === 0}>Back</Button>
        <div className="flex gap-3">
          {step === 4 && <Button variant="secondary" icon={Save} onClick={handleSaveDraft}>Save Draft</Button>}
          {step < 4 ? (
            <Button onClick={next}>Next <ArrowRight className="w-4 h-4 ml-1" /></Button>
          ) : (
            <Button onClick={handlePublish} className="shadow-lg shadow-primary/25">Publish Bot 🚀</Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateBot;
