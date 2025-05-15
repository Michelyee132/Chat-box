import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();
const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Start a chat session with instructions
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
const chat = model.startChat({
  history: [],
  systemInstruction: `
    You are a friendly and thoughtful assistant. 
    Respond like ChatGPT: avoid dumping code unless asked, explain with clear language, be concise, and keep tone casual but helpful. 
    Assume the user wants a well-structured response — not a markdown textbook. 
    Add simple examples only if needed, and explain them step-by-step like you're teaching a beginner.
  `,
});

app.post('/chat', async (req, res) => {
  const { message } = req.body;

  try {
    const result = await chat.sendMessage(message);
    const response = result.response.text();
    res.json({ reply: response });
  } catch (error) {
    console.error('Gemini Error:', error);
    res.status(500).json({ error: 'Gemini API failed' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
