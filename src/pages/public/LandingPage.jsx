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
import HeroOrb from '../../components/3d/HeroOrb';
import FadeIn from '../../components/ui/FadeIn';
import { Helmet } from 'react-helmet-async';
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
    <div className={`min-h-screen ${isDark ? 'bg-surface text-text-primary' : 'light bg-surface text-text-primary'}`}>
      <Helmet>
        <title>ChatBot Builder | Build AI Chatbots for Your Website</title>
        <meta name="description" content="Transform your static FAQ into an intelligent, interactive assistant in minutes. No-code AI platform for building custom chatbots." />
        <meta property="og:title" content="ChatBot Builder | No-Code AI Assistant" />
        <meta property="og:description" content="Build AI Chatbots your visitors actually talk to. Transform your static FAQ into an interactive assistant." />
      </Helmet>
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 ${isDark ? 'bg-surface/80' : 'bg-surface/80'} backdrop-blur-xl border-b border-border`}>
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <div className="flex items-center justify-between h-20">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-brand flex items-center justify-center shadow-glow-brand">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <span className="font-bold text-xl tracking-tight">ChatBot<span className="gradient-text">Builder</span></span>
            </Link>
            
            <div className="hidden md:flex items-center gap-10">
              {['Features', 'How It Works', 'Pricing'].map((item) => (
                <a 
                  key={item} 
                  href={`#${item.toLowerCase().replace(/\s+/g, '-')}`} 
                  className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
                >
                  {item}
                </a>
              ))}
            </div>

            <div className="hidden md:flex items-center gap-4">
              <button onClick={toggleTheme} className="p-2.5 rounded-xl hover:bg-surface-overlay transition-colors border border-border">
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              {isAuthenticated ? (
                <button 
                  onClick={() => navigate('/dashboard')} 
                  className="px-6 py-2.5 bg-brand hover:bg-brand-hover text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-brand/20 hover:shadow-brand/40"
                >
                  Dashboard
                </button>
              ) : (
                <>
                  <button 
                    onClick={() => navigate('/login')} 
                    className="px-5 py-2.5 text-sm font-semibold rounded-xl hover:bg-surface-overlay transition-colors"
                  >
                    Login
                  </button>
                  <button 
                    onClick={() => navigate('/signup')} 
                    className="px-6 py-2.5 bg-brand hover:bg-brand-hover text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-brand/20 hover:shadow-brand/40"
                  >
                    Get Started
                  </button>
                </>
              )}
            </div>

            <button onClick={() => setMobileMenu(!mobileMenu)} className="md:hidden p-2 text-text-primary">
              {mobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenu && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-surface-raised border-t border-border overflow-hidden"
            >
              <div className="px-6 py-8 space-y-5">
                {['Features', 'How It Works', 'Pricing'].map((item) => (
                  <a 
                    key={item} 
                    href={`#${item.toLowerCase().replace(/\s+/g, '-')}`} 
                    onClick={() => setMobileMenu(false)}
                    className="block text-lg font-medium"
                  >
                    {item}
                  </a>
                ))}
                <div className="flex flex-col gap-4 pt-4">
                  <button onClick={() => { navigate('/login'); setMobileMenu(false); }} className="w-full py-3 text-center font-semibold rounded-xl bg-surface-overlay">Login</button>
                  <button onClick={() => { navigate('/signup'); setMobileMenu(false); }} className="w-full py-3 text-center font-semibold rounded-xl bg-brand text-white">Get Started</button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-44 pb-28 lg:pt-56 lg:pb-40 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-brand/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[120px]" />
        </div>
        
        <div className="relative max-w-6xl mx-auto px-6 md:px-12">
          <div className="grid lg:grid-cols-[1.2fr,0.8fr] gap-16 items-center">
            <div>
              <FadeIn delay={0.1}>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand/10 border border-brand/20 text-brand text-xs font-bold uppercase tracking-widest mb-8">
                  <Zap className="w-3.5 h-3.5" /> No-code AI platform
                </div>
              </FadeIn>
              
              <FadeIn delay={0.2} className="relative z-10 py-2">
                <h1 className="mb-8 leading-[1.1] pb-2">
                  <span className="gradient-text">Build AI Chatbots</span> your visitors actually talk to.
                </h1>
              </FadeIn>

              <FadeIn delay={0.3}>
                <p className="text-lg text-text-secondary mb-10 max-w-xl leading-relaxed">
                  Transform your static FAQ into an intelligent, interactive assistant in minutes. Embed it on any site with a single line of code.
                </p>
              </FadeIn>

              <FadeIn delay={0.4} className="flex flex-col sm:flex-row gap-5">
                <button 
                  onClick={() => navigate('/signup')} 
                  className="px-10 py-4.5 bg-brand hover:bg-brand-hover text-white font-bold rounded-xl transition-all shadow-xl shadow-brand/20 hover:shadow-brand/40 hover:-translate-y-1 flex items-center justify-center gap-3"
                >
                  Start Building Free <ArrowRight className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })} 
                  className="px-10 py-4.5 bg-surface-raised border border-border hover:border-brand/50 text-text-primary font-bold rounded-xl transition-all flex items-center justify-center gap-3 shadow-sm"
                >
                  <Play className="w-5 h-5 fill-current" /> Watch Demo
                </button>
              </FadeIn>

              <FadeIn delay={0.5} className="mt-12 flex items-center gap-6">
                <div className="flex -space-x-3">
                  {[1,2,3,4].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-surface bg-surface-raised flex items-center justify-center text-[10px] font-bold">U{i}</div>
                  ))}
                </div>
                <div>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-warning text-warning" />)}
                  </div>
                  <p className="text-xs text-text-secondary mt-1">Trusted by <span className="text-text-primary font-bold">10k+</span> creators</p>
                </div>
              </FadeIn>
            </div>

            <div className="hidden lg:block relative">
              <div className="absolute inset-0 bg-brand/5 rounded-full blur-3xl animate-pulse" />
              <HeroOrb />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 lg:py-32 bg-surface-raised/30">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <div className="text-center mb-20">
            <FadeIn>
              <h2 className="mb-4">How It <span className="gradient-text">Works</span></h2>
              <p className="text-text-secondary text-lg max-w-2xl mx-auto">Three simple steps to deploy your AI assistant</p>
            </FadeIn>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            {steps.map((step, i) => (
              <FadeIn key={i} delay={i * 0.1} className="relative group">
                <div className="w-16 h-16 rounded-2xl bg-brand/10 border border-brand/20 flex items-center justify-center text-brand text-2xl font-black mb-8 group-hover:scale-110 group-hover:shadow-glow-brand transition-all duration-500">
                  {step.num}
                </div>
                <h3 className="mb-4 text-xl">{step.title}</h3>
                <p className="text-text-secondary leading-relaxed">{step.description}</p>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 lg:py-32">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <div className="text-center mb-20">
            <FadeIn>
              <h2 className="mb-4">Everything You <span className="gradient-text">Need</span></h2>
              <p className="text-text-secondary text-lg max-w-2xl mx-auto">Powerful features built for conversion and scale</p>
            </FadeIn>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <FadeIn key={i} delay={i * 0.08} className="p-8 rounded-2xl bg-surface-raised border border-border hover:border-brand/50 hover:shadow-card-hover transition-all duration-300 group">
                <div className="w-14 h-14 rounded-xl bg-brand/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <f.icon className="w-7 h-7 text-brand" />
                </div>
                <h3 className="mb-3">{f.title}</h3>
                <p className="text-text-secondary">{f.description}</p>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section id="demo" className="py-24 lg:py-32 bg-surface-raised/50">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <FadeIn>
              <h2 className="mb-4">Try It <span className="gradient-text">Live</span></h2>
              <p className="text-text-secondary text-lg">Experience the smooth, instant responses for yourself</p>
            </FadeIn>
          </div>
          
          <FadeIn delay={0.2} className="flex justify-center">
            <div className="w-full max-w-lg shadow-2xl rounded-3xl overflow-hidden border border-border">
              <ChatWidget 
                faqs={demoBot.faqs} 
                primaryColor="#6366f1" 
                welcomeMessage="Hi! 👋 I'm a demo bot. Ask me anything!" 
                chatWindowTitle="Live Demo" 
                inline 
              />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 lg:py-32">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <div className="text-center mb-20">
            <FadeIn>
              <h2 className="mb-4">Simple <span className="gradient-text">Pricing</span></h2>
              <p className="text-text-secondary text-lg">Start free, upgrade as you grow</p>
            </FadeIn>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, i) => (
              <FadeIn key={i} delay={i * 0.1} className={`relative p-8 rounded-2xl border transition-all duration-500 ${plan.highlight ? 'bg-surface-raised border-brand shadow-glow-brand ring-1 ring-brand/30' : 'bg-surface border-border hover:border-text-muted'}`}>
                {plan.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 bg-brand text-[10px] font-black uppercase tracking-widest text-white rounded-full">
                    {plan.badge}
                  </div>
                )}
                <div className="mb-8">
                  <h3 className="text-lg mb-2">{plan.name}</h3>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-4xl font-black">{plan.price}</span>
                    <span className="text-sm text-text-secondary">{plan.period}</span>
                  </div>
                </div>
                
                <ul className="space-y-4 mb-10">
                  {plan.features.map((f, fi) => (
                    <li key={fi} className="flex items-start gap-3 text-sm">
                      <div className="mt-1 w-4 h-4 rounded-full bg-success/20 flex items-center justify-center flex-shrink-0">
                        <Check className="w-2.5 h-2.5 text-success" />
                      </div>
                      <span className="text-text-secondary">{f}</span>
                    </li>
                  ))}
                </ul>

                <button 
                  onClick={() => navigate('/signup')} 
                  className={`w-full py-4 rounded-xl font-bold text-sm transition-all ${plan.highlight ? 'bg-brand text-white shadow-lg shadow-brand/20 hover:bg-brand-hover' : 'bg-surface-overlay text-text-primary hover:bg-border'}`}
                >
                  {plan.cta}
                </button>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-border bg-surface">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <div className="grid md:grid-cols-[1.5fr,1fr,1fr,1fr] gap-12">
            <div>
              <div className="flex items-center gap-2.5 mb-6">
                <div className="w-8 h-8 rounded-lg bg-brand flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-lg">ChatBot<span className="gradient-text">Builder</span></span>
              </div>
              <p className="text-sm text-text-secondary mb-8 leading-relaxed">
                Empowering businesses with intelligent, no-code AI assistants since 2024.
              </p>
              <div className="flex gap-4">
                {[Share2, LinkIcon, Globe].map((Icon, i) => (
                  <button key={i} className="w-10 h-10 rounded-xl bg-surface-raised border border-border flex items-center justify-center text-text-secondary hover:text-brand hover:border-brand transition-all">
                    <Icon className="w-4 h-4" />
                  </button>
                ))}
              </div>
            </div>
            
            {[{title:'Product',links:['Features','Pricing','Integrations']},{title:'Company',links:['About','Blog','Careers']},{title:'Legal',links:['Privacy','Terms','Security']}].map((col, i) => (
              <div key={i}>
                <h4 className="text-sm font-black uppercase tracking-widest text-text-primary mb-6">{col.title}</h4>
                <ul className="space-y-4">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-sm text-text-secondary hover:text-brand transition-colors">{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-20 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-xs text-text-muted">© {new Date().getFullYear()} ChatBot Builder. All rights reserved.</p>
            <div className="flex gap-8 text-xs text-text-muted">
              <a href="#" className="hover:text-text-secondary transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-text-secondary transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
