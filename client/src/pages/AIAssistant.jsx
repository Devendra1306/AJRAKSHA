import { useState, useRef, useEffect } from 'react';

const INITIAL_MESSAGES = [
  {
    id: 1, role: 'ai',
    text: 'Namaste! 🌾 I\'m your Ajraksha AI — built for Indian farmers. I can help you with crop advice, market prices, weather insights, and yield planning. What would you like to know today?',
    time: '09:15 AM',
  },
  {
    id: 2, role: 'user',
    text: 'What\'s the best time to sow wheat in Madhya Pradesh?',
    time: '09:16 AM',
  },
  {
    id: 3, role: 'ai',
    text: 'Great question! For Madhya Pradesh, the ideal sowing window for **rabi wheat** is:\n\n🌡️ **Oct 25 – Nov 15** — Optimum period for most varieties.\n🌾 **Nov 15 – Dec 1** — Late sowing; use HD-2781 or GW-322 varieties.\n\nYour soil temperature should be **18–22°C** at 10cm depth. Given the forecast shows rain on Thursday, waiting until Friday to prepare your field would be ideal. Shall I also check current market rates for wheat seed?',
    time: '09:16 AM',
  },
];

const SUGGESTIONS = [
  { label: 'Analyze my crop', icon: 'eco' },
  { label: 'Weather impact', icon: 'wb_sunny' },
  { label: 'Market prices', icon: 'trending_up' },
  { label: 'Soil health tips', icon: 'grass' },
  { label: 'Best fertiliser?', icon: 'science' },
];

const AI_THINKING_DOTS = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '14px 16px' }}>
    {[0, 1, 2].map(i => (
      <div
        key={i}
        style={{ width: 7, height: 7, borderRadius: '50%', background: '#f97316' }}
      />
    ))}
  </div>
);

function formatText(text) {
  // Simple markdown-lite: **bold** and newlines
  const lines = text.split('\n');
  return lines.map((line, i) => {
    const parts = line.split(/\*\*(.*?)\*\*/g);
    return (
      <span key={i}>
        {parts.map((part, j) =>
          j % 2 === 1 ? <strong key={j}>{part}</strong> : part
        )}
        {i < lines.length - 1 && <br />}
      </span>
    );
  });
}

let nextId = 10;
const AI_RESPONSES = [
  'That\'s a great question! Based on current market data and your farm profile, I recommend focusing on rabi crops this season. Cotton prices are at a 6-month high — if you have irrigated land, consider intercropping maize.',
  'Based on the weather forecast for your region, humidity levels are elevated at 72%. I suggest applying a preventive fungicide on your cotton crop before Thursday\'s rain. Mancozeb 75% WP at 2.5g/L would be effective.',
  'Current wheat MSP is ₹2,275/quintal. APMC Indore is offering ₹2,140 but APMC Bhopal is slightly higher at ₹2,180. Transportation costs should factor in. I\'d hold for 2–3 weeks if storage is available.',
  'Your soil health score of 74/100 suggests moderate deficiency in phosphorus. I recommend DAP application at 50 kg/acre before sowing. Also consider micronutrient mixture with zinc sulfate.',
];

export default function AIAssistant() {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const sendMessage = (text) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const now = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    const userMsg = { id: nextId++, role: 'user', text: trimmed, time: now };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);
    setTimeout(() => {
      const aiMsg = {
        id: nextId++,
        role: 'ai',
        text: AI_RESPONSES[Math.floor(Math.random() * AI_RESPONSES.length)],
        time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1600 + Math.random() * 600);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <div style={{ background: '#fff8f6', minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ maxWidth: 860, margin: '0 auto', width: '100%', flex: 1, display: 'flex', flexDirection: 'column', padding: '32px 24px 0' }}>

        {/* Header */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 44, height: 44, borderRadius: 14, background: 'linear-gradient(135deg, #f97316, #ea580c)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(249,115,22,0.35)' }}>
                <span className="material-symbols-outlined" style={{ color: '#fff', fontSize: 24 }}>smart_toy</span>
              </div>
              <div>
                <h1 style={{ fontSize: 24, fontWeight: 700, color: '#251913', margin: 0 }}>AI Assistant</h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#16a34a', boxShadow: '0 0 6px #16a34a' }} />
                  <span style={{ fontSize: 12, color: '#584237' }}>Online · Powered by Gemini</span>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', border: '1.5px solid #e0c0b1', borderRadius: 10, background: '#fff', color: '#584237', fontSize: 13, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>history</span>
                History
              </button>
              <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', border: 'none', borderRadius: 10, background: '#f97316', color: '#fff', fontSize: 13, cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>add</span>
                New Chat
              </button>
            </div>
          </div>
          <div style={{ height: 1, background: '#e0c0b1', margin: '20px 0 0' }} />
        </div>

        {/* Chat Area */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px 0 16px', display: 'flex', flexDirection: 'column', gap: 16, minHeight: 0 }}>
          
            {messages.map((msg) => (
              <div
                key={msg.id}
                style={{ display: 'flex', flexDirection: msg.role === 'user' ? 'row-reverse' : 'row', alignItems: 'flex-end', gap: 10 }}
              >
                {/* Avatar */}
                {msg.role === 'ai' && (
                  <div style={{ width: 34, height: 34, borderRadius: 10, background: 'linear-gradient(135deg, #f97316, #ea580c)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span className="material-symbols-outlined" style={{ color: '#fff', fontSize: 18 }}>smart_toy</span>
                  </div>
                )}
                {msg.role === 'user' && (
                  <div style={{ width: 34, height: 34, borderRadius: 10, background: '#e0c0b1', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span className="material-symbols-outlined" style={{ color: '#584237', fontSize: 18 }}>person</span>
                  </div>
                )}

                <div style={{ maxWidth: '72%' }}>
                  <div style={{
                    padding: '12px 16px',
                    borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                    background: msg.role === 'user' ? '#f97316' : '#fff1eb',
                    color: msg.role === 'user' ? '#fff' : '#251913',
                    fontSize: 14,
                    lineHeight: 1.6,
                    border: msg.role === 'ai' ? '1px solid #f3d0be' : 'none',
                    boxShadow: msg.role === 'ai' ? '0 2px 12px rgba(157,67,0,0.07)' : '0 2px 12px rgba(249,115,22,0.2)',
                  }}>
                    {formatText(msg.text)}
                  </div>
                  <div style={{ fontSize: 10, color: '#9ca3af', marginTop: 4, textAlign: msg.role === 'user' ? 'right' : 'left', paddingLeft: msg.role === 'ai' ? 4 : 0, paddingRight: msg.role === 'user' ? 4 : 0 }}>
                    {msg.time}
                  </div>
                </div>
              </div>
            ))}
          

          {/* Typing indicator */}
          
            {isTyping && (
              <div
                style={{ display: 'flex', alignItems: 'flex-end', gap: 10 }}
              >
                <div style={{ width: 34, height: 34, borderRadius: 10, background: 'linear-gradient(135deg, #f97316, #ea580c)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span className="material-symbols-outlined" style={{ color: '#fff', fontSize: 18 }}>smart_toy</span>
                </div>
                <div style={{ background: '#fff1eb', border: '1px solid #f3d0be', borderRadius: '18px 18px 18px 4px', boxShadow: '0 2px 12px rgba(157,67,0,0.07)' }}>
                  <AI_THINKING_DOTS />
                </div>
              </div>
            )}
          

          <div ref={bottomRef} />
        </div>

        {/* Input Area */}
        <div
          style={{ paddingBottom: 24, paddingTop: 4 }}
        >
          {/* Quick Suggestions */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
            {SUGGESTIONS.map((s, i) => (
              <button
                key={s.label}
                onClick={() => sendMessage(s.label)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '7px 14px', borderRadius: 20,
                  border: '1.5px solid #e0c0b1', background: '#fff',
                  color: '#584237', fontSize: 12, fontWeight: 500,
                  cursor: 'pointer', transition: 'all 0.18s', fontFamily: 'Inter, sans-serif',
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 14, color: '#f97316' }}>{s.icon}</span>
                {s.label}
              </button>
            ))}
          </div>

          {/* Input bar */}
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end', background: '#fff', border: '1.5px solid #e0c0b1', borderRadius: 18, padding: '10px 12px', boxShadow: '0 4px 20px rgba(157,67,0,0.08)' }}>
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about your crops, weather, markets..."
              rows={1}
              style={{
                flex: 1, border: 'none', outline: 'none', resize: 'none',
                fontSize: 14, color: '#251913', background: 'transparent',
                fontFamily: 'Inter, sans-serif', lineHeight: 1.5, maxHeight: 100,
                overflowY: 'auto', padding: '2px 4px',
              }}
            />
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#584237', display: 'flex', alignItems: 'center' }}>
                <span className="material-symbols-outlined" style={{ fontSize: 22 }}>mic</span>
              </button>
              <button
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || isTyping}
                style={{
                  width: 38, height: 38, borderRadius: 12, border: 'none',
                  background: input.trim() && !isTyping ? 'linear-gradient(135deg, #f97316, #ea580c)' : '#f3e8e2',
                  color: input.trim() && !isTyping ? '#fff' : '#c4a090',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: input.trim() && !isTyping ? 'pointer' : 'not-allowed',
                  transition: 'all 0.2s', boxShadow: input.trim() && !isTyping ? '0 3px 12px rgba(249,115,22,0.4)' : 'none',
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 20 }}>send</span>
              </button>
            </div>
          </div>
          <p style={{ textAlign: 'center', fontSize: 11, color: '#9ca3af', marginTop: 8 }}>
            AI responses are advisory. Always consult a local agronomist for critical decisions.
          </p>
        </div>
      </div>
    </div>
  );
}
