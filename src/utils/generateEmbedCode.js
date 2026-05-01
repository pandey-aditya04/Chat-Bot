export const generateEmbedCode = (botId, botName = 'ChatBot') => {
  const scriptTag = `<!-- ${botName} Widget -->
<script
  src="https://chatbotbuilder.io/widget.js"
  data-bot-id="${botId}"
  data-position="bottom-right"
  async
></script>`;

  const reactComponent = `import { ChatBotWidget } from '@chatbotbuilder/react';

function App() {
  return (
    <div>
      <ChatBotWidget
        botId="${botId}"
        position="bottom-right"
        theme="auto"
      />
    </div>
  );
}

export default App;`;

  const iframeEmbed = `<iframe
  src="https://chatbotbuilder.io/embed/${botId}"
  width="400"
  height="600"
  style="border: none; border-radius: 12px; box-shadow: 0 4px 24px rgba(0,0,0,0.15);"
  title="${botName}"
  allow="microphone"
></iframe>`;

  return { scriptTag, reactComponent, iframeEmbed };
};
