import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-for-srmist';

app.use(cors());
app.use(express.json());

// Auth Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// --- AUTH ROUTES ---

app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Validate SRMIST email (optional but good practice for this context)
    if (!email.endsWith('@srmist.edu.in') && !email.endsWith('@srmtech.edu.in')) {
      // For now we allow it but in a strict system we might return 400
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: { name, email, password_hash }
    });

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (error) {
    res.status(500).json({ error: 'Failed to register' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (error) {
    res.status(500).json({ error: 'Failed to login' });
  }
});

app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    res.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// --- NOTICES ROUTES ---

app.get('/api/notices', authenticateToken, async (req, res) => {
  try {
    const notices = await prisma.notice.findMany({
      orderBy: { date: 'desc' }
    });
    res.json(notices);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch notices' });
  }
});

// --- FAQ ROUTES ---

app.get('/api/faq', authenticateToken, async (req, res) => {
  try {
    const faqs = await prisma.fAQ.findMany();
    res.json(faqs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch FAQs' });
  }
});

// --- FEEDBACK ROUTES ---

app.post('/api/feedback', authenticateToken, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const feedback = await prisma.feedback.create({
      data: {
        userId: req.user.id,
        rating,
        comment
      }
    });
    res.json(feedback);
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit feedback' });
  }
});

// --- CHAT ROUTES ---

app.get('/api/chat/history', authenticateToken, async (req, res) => {
  try {
    const sessions = await prisma.chatSession.findMany({
      where: { userId: req.user.id },
      include: { messages: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch chat history' });
  }
});

app.post('/api/chat/message', authenticateToken, async (req, res) => {
  try {
    const { sessionId, content } = req.body;
    let currentSessionId = sessionId;

    if (!currentSessionId) {
      const session = await prisma.chatSession.create({
        data: {
          userId: req.user.id,
          title: content.substring(0, 50) + '...',
        }
      });
      currentSessionId = session.id;
    }

    // Save user message
    const userMessage = await prisma.message.create({
      data: {
        sessionId: currentSessionId,
        role: 'user',
        content
      }
    });

    let botReply = "";

    if (!process.env.GEMINI_API_KEY) {
      botReply = "Error: GEMINI_API_KEY is not set in the environment variables. Please add it to your .env file to enable the AI assistant.";
    } else {
      // Fetch Context
      const faqs = await prisma.fAQ.findMany();
      const notices = await prisma.notice.findMany({ orderBy: { date: 'desc' }, take: 5 });
      
      const contextString = `
      You are Querio, an official AI assistant for SRMIST university. Answer questions in the language the user speaks.
      Use the following recent notices and FAQs to answer questions accurately:
      
      NOTICES:
      ${notices.map(n => `- ${n.title} (${n.department}): ${n.content}`).join('\n')}
      
      FAQs:
      ${faqs.map(f => `Q: ${f.question} | A: ${f.answer}`).join('\n')}
      
      If the user asks something not covered in the context, give a helpful, polite generic answer.
      `;

      try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ 
          model: "gemini-2.5-flash",
          systemInstruction: contextString 
        });

        // Retrieve chat history for context
        const history = await prisma.message.findMany({
          where: { sessionId: currentSessionId },
          orderBy: { createdAt: 'asc' }
        });

        // Format history for Gemini
        const chatHistory = history.filter(m => m.id !== userMessage.id).map(msg => ({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.content }],
        }));

        const chat = model.startChat({
          history: chatHistory,
        });

        const result = await chat.sendMessage(content);
        botReply = result.response.text();
      } catch (aiError) {
        console.error('Gemini API Error:', aiError);
        botReply = "I'm sorry, I'm having trouble connecting to my AI brain right now. Please try again later.";
      }
    }

    const botMessage = await prisma.message.create({
      data: {
        sessionId: currentSessionId,
        role: 'bot',
        content: botReply
      }
    });

    res.json({
      sessionId: currentSessionId,
      messages: [userMessage, botMessage]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to process message' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
