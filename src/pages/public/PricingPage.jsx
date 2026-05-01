import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Check, X, ChevronDown, ChevronUp, Bot, Moon, Sun, ArrowLeft } from 'lucide-react';
import { pricingPlans, featureComparison, pricingFAQs } from '../../data/pricingPlans';
import { useTheme } from '../../context/ThemeContext';

const PricingPage = () => {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const [openFaq, setOpenFaq] = useState(null);
  const [annual, setAnnual] = useState(false);

  return (
    <div className={`min-h-screen ${isDark ? 'bg-dark-bg text-dark-text' : 'bg-light-bg text-light-text'}`}>
      <nav className={`sticky top-0 z-50 ${isDark ? 'bg-dark-bg/80' : 'bg-light-bg/80'} backdrop-blur-xl border-b ${isDark ? 'border-dark-border' : 'border-light-border'}`}>
        <div className="max-w-6xl mx-auto px-6 md:px-12 flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center"><Bot className="w-5 h-5 text-white" /></div>
            <span className="font-bold text-lg">ChatBot<span className="text-primary">Builder</span></span>
          </Link>
          <div className="flex items-center gap-3">
            <button onClick={toggleTheme} className={`p-2 rounded-xl ${isDark ? 'hover:bg-dark-surface' : 'hover:bg-light-surface-2'}`}>{isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}</button>
            <Link to="/" className={`text-sm font-medium flex items-center gap-1 ${isDark ? 'text-dark-text-secondary hover:text-dark-text' : 'text-light-text-secondary hover:text-light-text'}`}><ArrowLeft className="w-4 h-4" /> Back</Link>
          </div>
        </div>
      </nav>

      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold">Choose Your <span className="gradient-text">Plan</span></h1>
            <p className={`text-base leading-relaxed mt-4 max-w-2xl mx-auto ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`}>Start free and scale as you grow. All plans include a 14-day trial.</p>
            <div className="flex items-center justify-center gap-3 mt-8">
              <span className={`text-sm ${!annual ? 'text-primary font-medium' : isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`}>Monthly</span>
              <button onClick={() => setAnnual(!annual)} className={`relative w-12 h-6 rounded-full transition-colors ${annual ? 'bg-primary' : isDark ? 'bg-dark-surface-2' : 'bg-gray-300'}`}>
                <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${annual ? 'translate-x-6.5' : 'translate-x-0.5'}`} />
              </button>
              <span className={`text-sm ${annual ? 'text-primary font-medium' : isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`}>Annual <span className="text-success text-xs">Save 20%</span></span>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {pricingPlans.map((plan,i) => {
              const price = annual && plan.price !== '$0' ? `$${Math.round(parseInt(plan.price.replace('$',''))*0.8)}` : plan.price;
              return (
                <div key={i} className={`relative rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02] ${plan.highlight ? 'bg-gradient-to-b from-primary/10 to-accent/5 border-2 border-primary shadow-xl shadow-primary/10' : isDark ? 'bg-dark-surface border border-dark-border' : 'bg-light-surface border border-light-border shadow-sm'}`}>
                  {plan.badge && <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-white text-xs font-semibold rounded-full">{plan.badge}</div>}
                  <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-dark-text' : 'text-light-text'}`}>{plan.name}</h3>
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className={`text-4xl font-bold ${isDark ? 'text-dark-text' : 'text-light-text'}`}>{price}</span>
                    <span className={`text-sm ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`}>{plan.period}</span>
                  </div>
                  <p className={`text-base leading-relaxed mb-6 ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`}>{plan.description}</p>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((f,fi) => <li key={fi} className="flex items-center gap-3"><Check className="w-4 h-4 text-success flex-shrink-0" /><span className={`text-sm ${isDark ? 'text-dark-text' : 'text-light-text'}`}>{f}</span></li>)}
                  </ul>
                  <button onClick={() => navigate('/signup')} className={`w-full py-3 rounded-xl font-medium text-sm transition-all ${plan.highlight ? 'bg-primary hover:bg-primary-dark text-white shadow-lg shadow-primary/25' : isDark ? 'bg-dark-surface-2 hover:bg-dark-border text-dark-text border border-dark-border' : 'bg-light-surface-2 hover:bg-light-border text-light-text border border-light-border'}`}>{plan.cta}</button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Feature Comparison */}
      <section className={`py-20 ${isDark ? 'bg-dark-surface/50' : 'bg-light-surface-2'}`}>
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-semibold">Feature <span className="gradient-text">Comparison</span></h2>
          </div>
          <div className={`max-w-4xl mx-auto rounded-2xl overflow-hidden ${isDark ? 'bg-dark-surface border border-dark-border' : 'bg-light-surface border border-light-border'}`}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className={isDark ? 'border-b border-dark-border' : 'border-b border-light-border'}>
                    <th className={`text-left px-6 py-4 text-sm font-medium ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`}>Feature</th>
                    {['Free','Basic','Pro'].map(p => <th key={p} className={`text-center px-6 py-4 text-sm font-semibold ${isDark ? 'text-dark-text' : 'text-light-text'}`}>{p}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {featureComparison.map((row,i) => (
                    <tr key={i} className={isDark ? 'border-b border-dark-border/50' : 'border-b border-light-border/50'}>
                      <td className={`px-6 py-3.5 text-sm ${isDark ? 'text-dark-text' : 'text-light-text'}`}>{row.feature}</td>
                      {['free','basic','pro'].map(plan => (
                        <td key={plan} className="px-6 py-3.5 text-center">
                          {typeof row[plan] === 'boolean' ? (
                            row[plan] ? <Check className="w-5 h-5 text-success mx-auto" /> : <X className="w-5 h-5 text-gray-500 mx-auto" />
                          ) : (
                            <span className={`text-sm font-medium ${isDark ? 'text-dark-text' : 'text-light-text'}`}>{row[plan]}</span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-6 md:px-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-semibold">Frequently Asked <span className="gradient-text">Questions</span></h2>
          </div>
          <div className="space-y-3">
            {pricingFAQs.map((faq,i) => (
              <div key={i} className={`rounded-xl overflow-hidden ${isDark ? 'bg-dark-surface border border-dark-border' : 'bg-light-surface border border-light-border'}`}>
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className={`w-full flex items-center justify-between px-6 py-4 text-left`}>
                  <span className={`font-medium text-sm ${isDark ? 'text-dark-text' : 'text-light-text'}`}>{faq.question}</span>
                  {openFaq === i ? <ChevronUp className="w-4 h-4 text-primary" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {openFaq === i && (
                  <div className={`px-6 pb-4 text-sm animate-slide-down ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`}>{faq.answer}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default PricingPage;
