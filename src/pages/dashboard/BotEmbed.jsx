import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Copy, Check, ChevronDown, ChevronUp, Code2, ExternalLink } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import ChatWidget from '../../components/chatbot/ChatWidget';
import { useBots } from '../../context/BotContext';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../hooks/useToast';
import { generateEmbedCode } from '../../utils/generateEmbedCode';

const BotEmbed = () => {
  const { botId } = useParams();
  const { getBot } = useBots();
  const { isDark } = useTheme();
  const toast = useToast();
  const navigate = useNavigate();
  const bot = getBot(botId);
  const [copied, setCopied] = useState(null);
  const [openGuide, setOpenGuide] = useState(null);
  const [showWidget, setShowWidget] = useState(false);

  if (!bot) {
    return (
      <div className="text-center py-20 animate-fade-in">
        <p className={isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}>Bot not found</p>
        <Button className="mt-4" onClick={() => navigate('/dashboard/bots')}>Back to Bots</Button>
      </div>
    );
  }

  const { scriptTag, reactComponent, iframeEmbed } = generateEmbedCode(bot.id, bot.name);

  const copyCode = (code, label) => {
    navigator.clipboard.writeText(code);
    setCopied(label);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopied(null), 2000);
  };

  const codeBlocks = [
    { label: 'Script Tag', code: scriptTag, desc: 'Add this to your HTML <head> or before </body>' },
    { label: 'React Component', code: reactComponent, desc: 'Install @chatbotbuilder/react and import the widget' },
    { label: 'iFrame', code: iframeEmbed, desc: 'Embed as an iframe in any page' },
  ];

  const guides = [
    { name: 'WordPress', steps: ['Go to Appearance > Theme Editor', 'Open header.php or footer.php', 'Paste the script tag before the closing tag', 'Save and refresh your site'] },
    { name: 'Shopify', steps: ['Go to Online Store > Themes > Edit Code', 'Open theme.liquid', 'Paste the script tag before </body>', 'Save'] },
    { name: 'Webflow', steps: ['Open your project settings', 'Go to Custom Code tab', "Paste in the 'Before </body> tag' section", 'Publish your site'] },
    { name: 'Custom HTML', steps: ['Open your HTML file', 'Paste the script tag before </body>', 'Upload and refresh'] },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`text-3xl md:text-4xl font-semibold ${isDark ? 'text-dark-text' : 'text-light-text'}`}>Embed {bot.name}</h2>
          <p className={`text-base leading-relaxed mt-4 ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`}>Copy the code and paste it into your website</p>
        </div>
        <Button variant="outline" icon={ExternalLink} onClick={() => setShowWidget(true)}>Test Bot</Button>
      </div>

      {codeBlocks.map((block, i) => (
        <Card key={i}>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className={`text-lg font-semibold ${isDark ? 'text-dark-text' : 'text-light-text'}`}>{block.label}</h3>
              <p className={`text-xs mt-0.5 ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`}>{block.desc}</p>
            </div>
            <Button variant="secondary" size="sm" icon={copied === block.label ? Check : Copy} onClick={() => copyCode(block.code, block.label)}>
              {copied === block.label ? 'Copied!' : 'Copy'}
            </Button>
          </div>
          <pre className={`rounded-xl p-4 text-sm overflow-x-auto font-mono ${isDark ? 'bg-dark-bg border border-dark-border text-emerald-400' : 'bg-gray-900 text-emerald-400'}`}>
            <code>{block.code}</code>
          </pre>
        </Card>
      ))}

      {/* Installation Guides */}
      <Card>
        <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-dark-text' : 'text-light-text'}`}>
          <Code2 className="w-5 h-5 inline mr-2 text-primary" />Installation Guides
        </h3>
        <div className="space-y-2">
          {guides.map((guide, i) => (
            <div key={i} className={`rounded-xl ${isDark ? 'bg-dark-surface-2 border border-dark-border' : 'bg-light-surface-2 border border-light-border'}`}>
              <button onClick={() => setOpenGuide(openGuide === i ? null : i)} className="w-full flex items-center justify-between px-4 py-3 text-left">
                <span className={`text-sm font-medium ${isDark ? 'text-dark-text' : 'text-light-text'}`}>{guide.name}</span>
                {openGuide === i ? <ChevronUp className="w-4 h-4 text-primary" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {openGuide === i && (
                <div className="px-4 pb-4 animate-slide-down">
                  <ol className="space-y-2">
                    {guide.steps.map((s, si) => (
                      <li key={si} className={`flex items-start gap-2 text-sm ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`}>
                        <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center flex-shrink-0 mt-0.5">{si + 1}</span>
                        {s}
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>

      {showWidget && (
        <ChatWidget
          faqs={bot.faqs || []}
          primaryColor={bot.primaryColor}
          position={bot.chatPosition}
          welcomeMessage={bot.welcomeMessage}
          chatWindowTitle={bot.chatWindowTitle}
          fallbackMessage={bot.fallbackMessage}
          launcherIcon={bot.launcherIcon}
          isOpen={true}
          onToggle={() => setShowWidget(false)}
        />
      )}
    </div>
  );
};

export default BotEmbed;
