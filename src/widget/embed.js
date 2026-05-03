import { createRoot } from 'react-dom/client'
import { createElement } from 'react'
import ChatWidget from './ChatWidget'

// Find the script tag
const script = document.currentScript ||
  document.querySelector('script[data-bot-id]')

const botId = script?.getAttribute('data-bot-id')
const apiUrl = script?.getAttribute('data-api-url') ||
  'https://chat-bottt.onrender.com/api'

const color = script?.getAttribute('data-color') || '#7c3aed'

if (!botId) {
  console.error('[ChatBotWidget] Missing data-bot-id attribute')
} else {
  const container = document.createElement('div')
  container.id = '__chatbot_widget__'
  document.body.appendChild(container)
  createRoot(container).render(
    createElement(ChatWidget, {
      botId,
      apiUrl,
      primaryColor: color
    })
  )
}
