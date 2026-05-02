import { useState, useEffect, useRef } from 'react'

function ChatWidget({ botId, apiUrl, primaryColor }) {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [botConfig, setBotConfig] = useState(null)
  const endRef = useRef(null)
  const color = primaryColor || botConfig?.color || '#7c3aed'

  useEffect(() => {
    if (!botId || !apiUrl) return
    fetch(`${apiUrl}/bots/${botId}/public`)
      .then(r => r.json())
      .then(data => {
        setBotConfig(data)
        setMessages([{
          role: 'assistant',
          content: data.welcomeMessage || `Hi! I'm ${data.name}. How can I help you today?`
        }])
      })
      .catch(() => {
        setBotConfig({ name: 'Support Bot', color: '#7c3aed' })
        setMessages([{ role: 'assistant', content: 'Hi! How can I help you today?' }])
      })
  }, [botId, apiUrl])

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const send = async () => {
    if (!input.trim() || loading) return
    const userMsg = { role: 'user', content: input }
    const updated = [...messages, userMsg]
    setMessages(updated)
    setInput('')
    setLoading(true)
    try {
      const res = await fetch(`${apiUrl}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ botId, messages: updated })
      })
      const data = await res.json()
      setMessages([...updated, { role: 'assistant', content: data.reply }])
    } catch {
      setMessages([...updated, {
        role: 'assistant',
        content: 'Sorry, something went wrong. Please try again.'
      }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      position: 'fixed', bottom: '24px', right: '24px',
      zIndex: 2147483647, fontFamily: 'system-ui, sans-serif'
    }}>
      {open && (
        <div style={{
          width: '360px', height: '520px', background: '#fff',
          borderRadius: '16px', marginBottom: '12px', overflow: 'hidden',
          display: 'flex', flexDirection: 'column',
          boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
          border: '1px solid #e5e7eb'
        }}>
          {/* Header */}
          <div style={{
            background: color, padding: '16px 20px',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center'
          }}>
            <div>
              <div style={{ color: '#fff', fontWeight: 700, fontSize: '15px' }}>
                {botConfig?.name || 'Support Bot'}
              </div>
              <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: '12px' }}>
                ● Online
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              style={{
                background: 'rgba(255,255,255,0.2)', border: 'none',
                color: '#fff', width: '28px', height: '28px',
                borderRadius: '50%', cursor: 'pointer', fontSize: '14px'
              }}>✕</button>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1, overflowY: 'auto', padding: '16px',
            display: 'flex', flexDirection: 'column', gap: '10px',
            background: '#fafafa'
          }}>
            {messages.map((m, i) => (
              <div key={i} style={{
                display: 'flex',
                justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start'
              }}>
                <div style={{
                  maxWidth: '80%', padding: '10px 14px', fontSize: '14px',
                  lineHeight: '1.5', borderRadius: '14px',
                  background: m.role === 'user' ? color : '#fff',
                  color: m.role === 'user' ? '#fff' : '#111',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.08)'
                }}>
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{
                  background: '#fff', padding: '10px 14px',
                  borderRadius: '14px', fontSize: '14px', color: '#888',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.08)'
                }}>
                  Typing...
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          {/* Input */}
          <div style={{
            padding: '12px', borderTop: '1px solid #e5e7eb',
            display: 'flex', gap: '8px', background: '#fff'
          }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
              placeholder="Type a message..."
              style={{
                flex: 1, border: '1px solid #e5e7eb', borderRadius: '8px',
                padding: '10px 12px', fontSize: '14px', outline: 'none',
                fontFamily: 'inherit'
              }}
            />
            <button
              onClick={send}
              disabled={loading}
              style={{
                background: color, color: '#fff', border: 'none',
                borderRadius: '8px', padding: '10px 18px', cursor: 'pointer',
                fontSize: '14px', fontWeight: 600,
                opacity: loading ? 0.6 : 1
              }}>
              Send
            </button>
          </div>
        </div>
      )}

      {/* Bubble */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '56px', height: '56px', borderRadius: '50%',
          background: color, border: 'none', cursor: 'pointer',
          boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
          display: 'flex', alignItems: 'center',
          justifyContent: 'center', marginLeft: 'auto',
          fontSize: '24px', transition: 'transform 0.2s'
        }}
        onMouseEnter={e => e.target.style.transform = 'scale(1.1)'}
        onMouseLeave={e => e.target.style.transform = 'scale(1)'}
      >
        {open ? '✕' : '💬'}
      </button>
    </div>
  )
}

export default ChatWidget
