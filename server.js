const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const fetch = require('node-fetch');
global.fetch = fetch;

const { GoogleGenerativeAI } = require('@google/generative-ai');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());


app.use(express.static('public'));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

const chat = model.startChat({
  history: [],
  systemInstruction: `
    You are a helpful assistant. Be clear, friendly, and avoid markdown unless asked.
  `,
});


app.post('/chat', async (req, res) => {
  const { message } = req.body;
  console.log('🔹 Incoming message:', message);

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

    const result = await model.generateContent({
      contents: [
        {
          role: 'user',
          parts: [{ text: message }]
        }
      ]
    });

    const reply = result.response.text();
    console.log('✅ Gemini replied:', reply);
    res.json({ reply });
  } catch (error) {
    console.error('❌ Gemini API Error:', error.message || error);
    res.status(500).json({ reply: '❌ Error' });
  }
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});

