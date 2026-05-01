export const pricingPlans = [
  {
    name: 'Free',
    price: '$0',
    period: '/mo',
    description: 'Perfect for trying out ChatBot Builder',
    features: [
      '1 Chatbot',
      '100 messages/mo',
      'Basic FAQ (up to 10)',
      'Embed on 1 site',
      'Community support',
    ],
    cta: 'Get Started',
    highlight: false,
    badge: null,
  },
  {
    name: 'Basic',
    price: '$19',
    period: '/mo',
    description: 'Best for growing businesses',
    features: [
      '5 Chatbots',
      '5,000 messages/mo',
      'Unlimited FAQs',
      'Custom branding',
      'Analytics dashboard',
      'Email support',
    ],
    cta: 'Start Free Trial',
    highlight: true,
    badge: 'Most Popular',
  },
  {
    name: 'Pro',
    price: '$49',
    period: '/mo',
    description: 'For teams who need the best',
    features: [
      'Unlimited Chatbots',
      'Unlimited messages',
      'AI-enhanced responses',
      'Priority support',
      'API access',
      'White-label option',
      'Custom domain',
    ],
    cta: 'Go Pro',
    highlight: false,
    badge: null,
  },
];

export const featureComparison = [
  { feature: 'Chatbots', free: '1', basic: '5', pro: 'Unlimited' },
  { feature: 'Messages/month', free: '100', basic: '5,000', pro: 'Unlimited' },
  { feature: 'FAQs per bot', free: '10', basic: 'Unlimited', pro: 'Unlimited' },
  { feature: 'Custom branding', free: false, basic: true, pro: true },
  { feature: 'Analytics', free: false, basic: true, pro: true },
  { feature: 'AI-enhanced responses', free: false, basic: false, pro: true },
  { feature: 'API access', free: false, basic: false, pro: true },
  { feature: 'White-label', free: false, basic: false, pro: true },
  { feature: 'Custom domain', free: false, basic: false, pro: true },
  { feature: 'Priority support', free: false, basic: false, pro: true },
  { feature: 'Email support', free: false, basic: true, pro: true },
  { feature: 'Community support', free: true, basic: true, pro: true },
];

export const pricingFAQs = [
  {
    question: 'Can I switch plans later?',
    answer: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect at the start of your next billing cycle.',
  },
  {
    question: 'Is there a free trial for paid plans?',
    answer: 'Yes! Both the Basic and Pro plans come with a 14-day free trial. No credit card required.',
  },
  {
    question: 'What happens when I hit my message limit?',
    answer: 'Your chatbot will continue to work but will show a fallback message. You can upgrade your plan to increase your limit.',
  },
  {
    question: 'Can I cancel anytime?',
    answer: "Absolutely. There are no long-term contracts. Cancel anytime and you won't be charged again.",
  },
  {
    question: 'Do you offer annual billing?',
    answer: 'Yes! Save 20% with annual billing on Basic and Pro plans.',
  },
];
