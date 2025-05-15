import React, { useState } from 'react';

function App() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    // Add user's message
    setMessages((prev) => [...prev, { type: 'user', text: input }]);

    try {
      const response = await fetch('http://localhost:3001/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();
      setMessages((prev) => [...prev, { type: 'bot', text: data.reply }]);
    } catch (err) {
      setMessages((prev) => [...prev, { type: 'bot', text: '❌ Error contacting Gemini API' }]);
    }

    setInput('');
  };

  return (
    <div style={{ padding: 20, fontFamily: 'sans-serif', maxWidth: 600, margin: '0 auto' }}>
      <h1>🤖 Gemini Chatbot</h1>

      <div style={{ height: 400, overflowY: 'auto', border: '1px solid #ccc', padding: 10 }}>
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              textAlign: msg.type === 'user' ? 'right' : 'left',
              margin: '10px 0',
            }}
          >
            <span style={{ fontWeight: 'bold' }}>
              {msg.type === 'user' ? 'You' : 'Gemini'}:
            </span>{' '}
            {msg.text}
          </div>
        ))}
      </div>

      <div style={{ marginTop: 10 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          style={{ width: '80%', padding: 10 }}
          placeholder="Type your message..."
        />
        <button onClick={sendMessage} style={{ padding: 10 }}>Send</button>
      </div>
    </div>
  );
}

export default App;
