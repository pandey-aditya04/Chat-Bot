import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Bot, Zap, Palette, BarChart2, Layers, Settings2,
  ArrowRight, Check, MessageCircle, ChevronRight,
  Share2, Link as LinkIcon, Globe, Play, Star, ExternalLink,
  Menu, X, Moon, Sun
} from 'lucide-react';
import { pricingPlans } from '../../data/pricingPlans';
import { mockBots } from '../../data/mockBots';
import ChatWidget from '../../components/chatbot/ChatWidget';
import RobotScene from '../../components/3d/RobotScene';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

const features = [
  { icon: MessageCircle, title: 'FAQ Knowledge Base', description: 'Add your FAQs and let your chatbot answer them instantly.' },
  { icon: Zap, title: 'Instant Deploy', description: 'Deploy your chatbot with a single line of code in under a minute.' },
  { icon: Palette, title: 'Custom Branding', description: "Match your chatbot's look and feel to your brand." },
  { icon: BarChart2, title: 'Analytics Dashboard', description: 'Track conversations, popular questions, and performance.' },
  { icon: Layers, title: 'Multi-Bot Support', description: 'Create and manage multiple chatbots for different sites.' },
  { icon: Settings2, title: 'No-Code Setup', description: 'Build your chatbot through our intuitive visual interface.' },
];

const steps = [
  { num: '01', title: 'Add Your FAQs', description: 'Enter your questions and answers. Import from CSV or type them in.' },
  { num: '02', title: 'Customize Your Bot', description: 'Choose colors, set the tone, and preview live changes.' },
  { num: '03', title: 'Embed on Your Website', description: "Copy a script tag and paste it. You're live in seconds." },
];

const LandingPage = () => {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const { isAuthenticated } = useAuth();
  const [mobileMenu, setMobileMenu] = useState(false);
  const demoBot = mockBots[0];

  return (
    <div className={`min-h-screen ${isDark ? 'bg-dark-bg text-dark-text' : 'bg-light-bg text-light-text'}`}>
      {/* Nav */}
      <nav className={`fixed top-0 w-full z-50 ${isDark ? 'bg-dark-bg/80' : 'bg-light-bg/80'} backdrop-blur-xl border-b ${isDark ? 'border-dark-border' : 'border-light-border'}`}>
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg">ChatBot<span className="text-primary">Builder</span></span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className={`text-sm font-medium ${isDark ? 'text-dark-text-secondary hover:text-dark-text' : 'text-light-text-secondary hover:text-light-text'} transition-colors`}>Features</a>
              <a href="#how-it-works" className={`text-sm font-medium ${isDark ? 'text-dark-text-secondary hover:text-dark-text' : 'text-light-text-secondary hover:text-light-text'} transition-colors`}>How It Works</a>
              <a href="#pricing" className={`text-sm font-medium ${isDark ? 'text-dark-text-secondary hover:text-dark-text' : 'text-light-text-secondary hover:text-light-text'} transition-colors`}>Pricing</a>
            </div>
            <div className="hidden md:flex items-center gap-3">
              <button onClick={toggleTheme} className={`p-2 rounded-xl ${isDark ? 'hover:bg-dark-surface' : 'hover:bg-light-surface-2'} transition-colors`}>
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              {isAuthenticated ? (
                <button onClick={() => navigate('/dashboard')} className="px-5 py-2.5 bg-primary hover:bg-primary-dark text-white text-sm font-medium rounded-xl transition-colors shadow-lg shadow-primary/25">Dashboard</button>
              ) : (
                <>
                  <button onClick={() => navigate('/login')} className={`px-5 py-2.5 text-sm font-medium rounded-xl transition-colors ${isDark ? 'text-dark-text hover:bg-dark-surface' : 'text-light-text hover:bg-light-surface-2'}`}>Login</button>
                  <button onClick={() => navigate('/signup')} className="px-5 py-2.5 bg-primary hover:bg-primary-dark text-white text-sm font-medium rounded-xl transition-colors shadow-lg shadow-primary/25">Get Started</button>
                </>
              )}
            </div>
            <button onClick={() => setMobileMenu(!mobileMenu)} className="md:hidden p-2">
              {mobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
        {mobileMenu && (
          <div className={`md:hidden ${isDark ? 'bg-dark-surface border-t border-dark-border' : 'bg-light-surface border-t border-light-border'} animate-slide-down`}>
            <div className="px-4 py-4 space-y-3">
              <a href="#features" onClick={() => setMobileMenu(false)} className="block py-2 text-sm font-medium">Features</a>
              <a href="#how-it-works" onClick={() => setMobileMenu(false)} className="block py-2 text-sm font-medium">How It Works</a>
              <a href="#pricing" onClick={() => setMobileMenu(false)} className="block py-2 text-sm font-medium">Pricing</a>
              <div className="flex gap-3 pt-2">
                <button onClick={() => { navigate('/login'); setMobileMenu(false); }} className={`flex-1 py-2.5 text-sm font-medium rounded-xl ${isDark ? 'bg-dark-surface-2' : 'bg-light-surface-2'}`}>Login</button>
                <button onClick={() => { navigate('/signup'); setMobileMenu(false); }} className="flex-1 py-2.5 bg-primary text-white text-sm font-medium rounded-xl">Get Started</button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section className="relative pt-40 pb-20 md:pt-56 md:pb-20 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-6xl mx-auto px-6 md:px-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                <Zap className="w-4 h-4" /> No-code chatbot platform
              </div>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight mb-6">
                Build AI Chatbots <span className="gradient-text">in Minutes</span>
              </h1>
              <p className={`text-base leading-relaxed mb-8 max-w-lg mx-auto lg:mx-0 ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`}>
                Create intelligent FAQ chatbots, customize their look, and embed them on your website — no code required.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button onClick={() => navigate('/signup')} className="px-8 py-4 bg-primary hover:bg-primary-dark text-white font-semibold rounded-xl transition-all shadow-xl shadow-primary/30 hover:shadow-primary/50 hover:scale-105 flex items-center justify-center gap-2">
                  Get Started Free <ArrowRight className="w-5 h-5" />
                </button>
                <button onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })} className={`px-8 py-4 font-semibold rounded-xl transition-all flex items-center justify-center gap-2 ${isDark ? 'bg-dark-surface border border-dark-border hover:bg-dark-surface-2' : 'bg-light-surface border border-light-border hover:bg-light-surface-2 shadow-sm'}`}>
                  <Play className="w-5 h-5" /> See Demo
                </button>
              </div>
              <div className="flex items-center gap-6 mt-8 justify-center lg:justify-start">
                <div className="flex -space-x-2">
                  {['bg-blue-500','bg-green-500','bg-purple-500','bg-orange-500'].map((c,i) => (
                    <div key={i} className={`w-8 h-8 rounded-full ${c} border-2 ${isDark ? 'border-dark-bg' : 'border-light-bg'} flex items-center justify-center text-white text-xs font-bold`}>{String.fromCharCode(65+i)}</div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_,i) => <Star key={i} className="w-4 h-4 fill-warning text-warning" />)}
                  </div>
                  <p className={`text-xs mt-0.5 ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`}>Loved by 10,000+ businesses</p>
                </div>
              </div>
            </div>
            {/* Interactive 3D Robot */}
            <div className="hidden lg:flex justify-center items-center h-[500px]">
              <RobotScene />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className={`py-20 ${isDark ? 'bg-dark-surface/50' : 'bg-light-surface-2'}`}>
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-semibold">How It <span className="gradient-text">Works</span></h2>
            <p className={`text-base leading-relaxed mt-4 max-w-2xl mx-auto ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`}>Get your chatbot up and running in three simple steps</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step,i) => (
              <div key={i} className="relative text-center group">
                {i < 2 && <div className="hidden md:block absolute top-16 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-primary/50 to-transparent" />}
                <div className="relative inline-flex mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-primary/30 group-hover:scale-110 transition-transform">{step.num}</div>
                </div>
                <h3 className={`text-lg font-semibold mb-3 ${isDark ? 'text-dark-text' : 'text-light-text'}`}>{step.title}</h3>
                <p className={`text-base leading-relaxed ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'} max-w-xs mx-auto`}>{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-semibold">Everything You <span className="gradient-text">Need</span></h2>
            <p className={`text-base leading-relaxed mt-4 max-w-2xl mx-auto ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`}>Powerful features to build, deploy, and manage your chatbots</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((f,i) => (
              <div key={i} className={`group p-6 rounded-2xl transition-all duration-300 hover:scale-[1.02] ${isDark ? 'bg-dark-surface border border-dark-border hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5' : 'bg-light-surface border border-light-border hover:border-primary/30 hover:shadow-xl'}`}>
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"><f.icon className="w-6 h-6 text-primary" /></div>
                <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-dark-text' : 'text-light-text'}`}>{f.title}</h3>
                <p className={`text-base leading-relaxed ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`}>{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo */}
      <section id="demo" className={`py-20 ${isDark ? 'bg-dark-surface/50' : 'bg-light-surface-2'}`}>
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-semibold">Try It <span className="gradient-text">Live</span></h2>
            <p className={`text-base leading-relaxed mt-4 max-w-2xl mx-auto ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`}>Ask a question and see instant responses</p>
          </div>
          <div className="flex justify-center">
            <ChatWidget faqs={demoBot.faqs} primaryColor={demoBot.primaryColor} welcomeMessage="Hi! 👋 I'm a demo bot. Try asking 'What are your hours?'" chatWindowTitle="Demo Bot" fallbackMessage="I'm not sure about that!" inline />
          </div>
        </div>
      </section>

      {/* Pricing Teaser */}
      <section id="pricing" className="py-20">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-semibold">Simple <span className="gradient-text">Pricing</span></h2>
            <p className={`text-base leading-relaxed mt-4 max-w-2xl mx-auto ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`}>Start free. Upgrade when you're ready.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {pricingPlans.map((plan,i) => (
              <div key={i} className={`relative rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02] ${plan.highlight ? 'bg-gradient-to-b from-primary/10 to-accent/5 border-2 border-primary shadow-xl shadow-primary/10' : isDark ? 'bg-dark-surface border border-dark-border' : 'bg-light-surface border border-light-border shadow-sm'}`}>
                {plan.badge && <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-white text-xs font-semibold rounded-full">{plan.badge}</div>}
                <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-dark-text' : 'text-light-text'}`}>{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className={`text-4xl font-bold ${isDark ? 'text-dark-text' : 'text-light-text'}`}>{plan.price}</span>
                  <span className={`text-sm ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`}>{plan.period}</span>
                </div>
                <p className={`text-base leading-relaxed mb-6 ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`}>{plan.description}</p>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f,fi) => (
                    <li key={fi} className="flex items-center gap-3"><Check className="w-4 h-4 text-success flex-shrink-0" /><span className={`text-sm ${isDark ? 'text-dark-text' : 'text-light-text'}`}>{f}</span></li>
                  ))}
                </ul>
                <button onClick={() => navigate('/signup')} className={`w-full py-3 rounded-xl font-medium text-sm transition-all ${plan.highlight ? 'bg-primary hover:bg-primary-dark text-white shadow-lg shadow-primary/25' : isDark ? 'bg-dark-surface-2 hover:bg-dark-border text-dark-text border border-dark-border' : 'bg-light-surface-2 hover:bg-light-border text-light-text border border-light-border'}`}>{plan.cta}</button>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/pricing" className="inline-flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all">View full pricing <ChevronRight className="w-4 h-4" /></Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`py-20 border-t ${isDark ? 'bg-dark-surface border-dark-border' : 'bg-light-surface-2 border-light-border'}`}>
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center"><Bot className="w-5 h-5 text-white" /></div>
                <span className="font-bold text-lg">ChatBot<span className="text-primary">Builder</span></span>
              </div>
              <p className={`text-sm ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`}>Build intelligent chatbots in minutes.</p>
              <div className="flex gap-3 mt-4">
                {[Share2, ExternalLink, LinkIcon, Globe].map((Icon,i) => (
                  <button key={i} className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-dark-surface-2 text-dark-text-secondary' : 'hover:bg-light-border text-light-text-secondary'}`}><Icon className="w-4 h-4" /></button>
                ))}
              </div>
            </div>
            {[{title:'Product',links:['Features','Pricing','Integrations','Changelog']},{title:'Company',links:['About','Blog','Careers','Contact']},{title:'Legal',links:['Privacy','Terms','Security','GDPR']}].map((col,i) => (
              <div key={i}>
                <h4 className={`font-semibold mb-4 ${isDark ? 'text-dark-text' : 'text-light-text'}`}>{col.title}</h4>
                <ul className="space-y-2.5">{col.links.map((l,li) => <li key={li}><a href="#" className={`text-sm ${isDark ? 'text-dark-text-secondary hover:text-dark-text' : 'text-light-text-secondary hover:text-light-text'} transition-colors`}>{l}</a></li>)}</ul>
              </div>
            ))}
          </div>
          <div className={`mt-12 pt-8 border-t text-center text-sm ${isDark ? 'border-dark-border text-dark-text-secondary' : 'border-light-border text-light-text-secondary'}`}>
            © {new Date().getFullYear()} ChatBot Builder. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
