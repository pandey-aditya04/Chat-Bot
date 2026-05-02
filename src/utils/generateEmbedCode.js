export const generateEmbedCode = (botId, botName = 'ChatBot') => {
  const host = window.location.origin;

  const scriptTag = `<!-- ${botName} Widget -->
<script
  src="${host}/widget.js"
  data-bot-id="${botId}"
  data-position="bottom-right"
  async
></script>`;

  const reactComponent = `// 1. Install the widget script in your index.html
// <script src="${host}/widget.js" async></script>

// 2. Use the widget in your component
import { useEffect } from 'react';

function App() {
  useEffect(() => {
    // Initialize with your botId
    if (window.ChatBot) {
      window.ChatBot.init({
        botId: "${botId}"
      });
    }
  }, []);

  return (
    <div>
      {/* Your App Content */}
    </div>
  );
}

export default App;`;

  const iframeEmbed = `<iframe
  src="${host}/embed/${botId}"
  width="400"
  height="600"
  style="border: none; border-radius: 12px; box-shadow: 0 4px 24px rgba(0,0,0,0.15);"
  title="${botName}"
  allow="microphone"
></iframe>`;

  return { scriptTag, reactComponent, iframeEmbed };
};
