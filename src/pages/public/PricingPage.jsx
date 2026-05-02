import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Check, X, ChevronDown, ChevronUp, Bot, Moon, Sun, ArrowLeft, Zap } from 'lucide-react';
import { pricingPlans, featureComparison, pricingFAQs } from '../../data/pricingPlans';
import { useTheme } from '../../context/ThemeContext';
import FadeIn from '../../components/ui/FadeIn';
import { motion, AnimatePresence } from 'framer-motion';

const PricingPage = () => {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const [openFaq, setOpenFaq] = useState(null);
  const [annual, setAnnual] = useState(false);

  return (
    <div className={`min-h-screen ${isDark ? 'bg-surface text-text-primary' : 'light bg-surface text-text-primary'}`}>
      <nav className={`sticky top-0 z-50 backdrop-blur-xl border-b border-border ${isDark ? 'bg-surface/80' : 'bg-surface/80'}`}>
        <div className="max-w-6xl mx-auto px-6 md:px-12 flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-brand flex items-center justify-center shadow-glow-brand">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight">ChatBot<span className="gradient-text">Builder</span></span>
          </Link>
          <div className="flex items-center gap-4">
            <button onClick={toggleTheme} className="p-2.5 rounded-xl border border-border bg-surface-raised hover:bg-surface-overlay text-text-secondary hover:text-text-primary transition-all">
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <Link to="/" className="hidden sm:flex items-center gap-2 text-xs font-black uppercase tracking-widest text-text-secondary hover:text-brand transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to Home
            </Link>
          </div>
        </div>
      </nav>

      <section className="py-24 lg:py-32 overflow-hidden relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-brand/5 blur-[120px] rounded-full -z-10" />
        
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <FadeIn>
              <h1 className="mb-6">Simple, Honest <span className="gradient-text">Pricing</span></h1>
              <p className="text-text-secondary text-lg max-w-2xl mx-auto mb-10">Start free and scale as you grow. No hidden fees or complex contracts.</p>
              
              <div className="inline-flex items-center p-1.5 rounded-2xl bg-surface-raised border border-border shadow-sm">
                <button 
                  onClick={() => setAnnual(false)} 
                  className={`px-8 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${!annual ? 'bg-brand text-white shadow-glow-brand' : 'text-text-secondary hover:text-text-primary'}`}
                >
                  Monthly
                </button>
                <button 
                  onClick={() => setAnnual(true)} 
                  className={`px-8 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all relative ${annual ? 'bg-brand text-white shadow-glow-brand' : 'text-text-secondary hover:text-text-primary'}`}
                >
                  Annual
                  <span className="absolute -top-3 -right-2 px-2 py-0.5 bg-success text-white text-[8px] font-black rounded-full shadow-lg">SAVE 20%</span>
                </button>
              </div>
            </FadeIn>
          </div>

          <div className="grid md:grid-cols-3 gap-8 items-end">
            {pricingPlans.map((plan, i) => {
              const price = annual && plan.price !== '$0' ? `$${Math.round(parseInt(plan.price.replace('$',''))*0.8)}` : plan.price;
              return (
                <FadeIn key={i} delay={i * 0.1} className="h-full">
                  <div className={`relative flex flex-col h-full rounded-3xl p-8 transition-all duration-500 border ${
                    plan.highlight 
                      ? 'bg-surface-raised border-brand shadow-glow-brand scale-105 z-10' 
                      : 'bg-surface-raised/50 border-border hover:border-brand/30'
                  }`}>
                    {plan.badge && (
                      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-brand text-[10px] font-black uppercase tracking-widest text-white rounded-full shadow-xl">
                        {plan.badge}
                      </div>
                    )}
                    
                    <div className="mb-8">
                      <h3 className="text-sm font-black uppercase tracking-widest text-text-primary mb-4">{plan.name}</h3>
                      <div className="flex items-baseline gap-2 mb-2">
                        <span className="text-5xl font-black tracking-tight">{price}</span>
                        <span className="text-sm font-bold text-text-muted uppercase tracking-widest">{plan.period}</span>
                      </div>
                      <p className="text-xs text-text-secondary font-medium leading-relaxed">{plan.description}</p>
                    </div>

                    <div className="flex-1 space-y-4 mb-10">
                      {plan.features.map((f, fi) => (
                        <div key={fi} className="flex items-start gap-3">
                          <div className="mt-1 w-4.5 h-4.5 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0">
                            <Check className="w-2.5 h-2.5 text-success font-black" />
                          </div>
                          <span className="text-sm text-text-secondary font-medium">{f}</span>
                        </div>
                      ))}
                    </div>

                    <button 
                      onClick={() => navigate('/signup')} 
                      className={`w-full py-4 rounded-xl font-black uppercase tracking-widest text-xs transition-all ${
                        plan.highlight 
                          ? 'bg-brand text-white shadow-lg shadow-brand/20 hover:bg-brand-hover' 
                          : 'bg-surface-overlay text-text-primary border border-border hover:bg-border'
                      }`}
                    >
                      {plan.cta}
                    </button>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* Feature Comparison */}
      <section className={`py-24 lg:py-32 ${isDark ? 'bg-surface-raised/20' : 'bg-surface-raised/50'}`}>
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <FadeIn>
              <h2 className="mb-4">Feature <span className="gradient-text">Deep-Dive</span></h2>
              <p className="text-text-secondary text-base">Compare all features across our simple plans</p>
            </FadeIn>
          </div>
          
          <FadeIn delay={0.2}>
            <div className="max-w-4xl mx-auto rounded-3xl overflow-hidden border border-border shadow-2xl bg-surface-raised/80 backdrop-blur-xl">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-surface-overlay border-b border-border">
                      <th className="text-left px-8 py-5 text-[10px] font-black uppercase tracking-widest text-text-muted">Features & Capabilities</th>
                      {['Free','Basic','Pro'].map(p => (
                        <th key={p} className="text-center px-8 py-5 text-[10px] font-black uppercase tracking-widest text-text-primary">{p}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {featureComparison.map((row, i) => (
                      <tr key={i} className="hover:bg-surface-overlay/30 transition-colors">
                        <td className="px-8 py-4.5 text-sm font-bold text-text-primary">{row.feature}</td>
                        {['free','basic','pro'].map(plan => (
                          <td key={plan} className="px-8 py-4.5 text-center">
                            {typeof row[plan] === 'boolean' ? (
                              row[plan] ? (
                                <div className="w-6 h-6 rounded-lg bg-success/10 flex items-center justify-center mx-auto">
                                  <Check className="w-3.5 h-3.5 text-success font-black" />
                                </div>
                              ) : (
                                <X className="w-4 h-4 text-text-muted/30 mx-auto" />
                              )
                            ) : (
                              <span className="text-xs font-black text-text-secondary uppercase tracking-widest">{row[plan]}</span>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 lg:py-32">
        <div className="max-w-3xl mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <FadeIn>
              <h2 className="mb-4">Common <span className="gradient-text">Questions</span></h2>
              <p className="text-text-secondary text-base">Everything you need to know about billing and trials</p>
            </FadeIn>
          </div>
          
          <div className="space-y-4">
            {pricingFAQs.map((faq, i) => (
              <FadeIn key={i} delay={i * 0.05} direction="none">
                <div className={`rounded-2xl border transition-all duration-300 ${openFaq === i ? 'bg-surface-raised border-brand/30 shadow-lg' : 'bg-surface border-border hover:border-brand/20'}`}>
                  <button 
                    onClick={() => setOpenFaq(openFaq === i ? null : i)} 
                    className="w-full flex items-center justify-between px-6 py-5 text-left group"
                  >
                    <span className={`text-sm font-bold transition-colors ${openFaq === i ? 'text-brand' : 'text-text-primary group-hover:text-brand'}`}>{faq.question}</span>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${openFaq === i ? 'bg-brand text-white rotate-180' : 'bg-surface-overlay text-text-muted'}`}>
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>
                  <AnimatePresence>
                    {openFaq === i && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-6 text-sm leading-relaxed text-text-secondary font-medium">{faq.answer}</div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 lg:py-32 bg-brand relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand via-accent to-purple-600 opacity-90" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
        
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <FadeIn>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-8 tracking-tight">Ready to boost your conversion?</h2>
            <p className="text-white/80 text-lg mb-10 font-medium">Join 10,000+ creators building the future of customer support.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button onClick={() => navigate('/signup')} className="w-full sm:w-auto px-12 py-4.5 bg-white text-brand font-black uppercase tracking-widest text-xs rounded-xl shadow-2xl hover:scale-105 transition-all">
                Get Started Free
              </button>
              <button onClick={() => navigate('/login')} className="w-full sm:w-auto px-12 py-4.5 bg-brand-hover text-white border border-white/20 font-black uppercase tracking-widest text-xs rounded-xl hover:bg-brand transition-all">
                Sign In
              </button>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
};

export default PricingPage;
