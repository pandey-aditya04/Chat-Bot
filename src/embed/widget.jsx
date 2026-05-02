import React from 'react';
import { createRoot } from 'react-dom/client';
import ChatWidget from '../components/chatbot/ChatWidget';
import './widget.css';

const initWidget = () => {
  // Check if already initialized
  if (document.getElementById('chatbot-builder-root')) return;

  // Get config from window or script tag
  const config = window.ChatBotConfig || {};
  const botId = config.botId || document.currentScript?.getAttribute('data-bot-id');

  if (!botId) {
    console.error('ChatBot Builder: Missing botId in window.ChatBotConfig or data-bot-id attribute');
    return;
  }

  // Create container
  const container = document.createElement('div');
  container.id = 'chatbot-builder-root';
  document.body.appendChild(container);

  // Render
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <ChatWidget 
        botId={botId} 
        primaryColor={config.primaryColor}
        position={config.position}
        welcomeMessage={config.welcomeMessage}
        chatWindowTitle={config.chatWindowTitle}
      />
    </React.StrictMode>
  );
};

// Initialize when DOM is ready
if (document.readyState === 'complete') {
  initWidget();
} else {
  window.addEventListener('load', initWidget);
}
