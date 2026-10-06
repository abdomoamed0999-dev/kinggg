import http from 'http';
import express from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

async function startServer() {
  const app = express();
  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
  const httpServer = http.createServer(app);

  app.use(express.json());

  // API endpoint for Tanseeqi AI Counselor
  app.post('/api/chat', async (req, res) => {
    try {
      const { message, history } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;

      if (!apiKey) {
        return res.status(200).json({
          reply: 'تنبيه: مفتاح GEMINI_API_KEY غير مهيأ حالياً في الخادم. يمكنك تجربة الاستفسارات الاسترشادية أو تفعيل المفتاح من لوحة التحكم.',
          groundingMetadata: null,
        });
      }

      const ai = new GoogleGenAI({ apiKey });

      // Build contents array with conversation history
      const contents: any[] = [];
      if (Array.isArray(history)) {
        for (const item of history) {
          contents.push({
            role: item.role === 'user' ? 'user' : 'model',
            parts: [{ text: item.content }],
          });
        }
      }
      contents.push({
        role: 'user',
        parts: [{ text: message }],
      });

      // Using gemini-3.5-flash with Google Search grounding
      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents,
        config: {
          systemInstruction: `أنت "مستشار تنسيقي الذكي" (Tanseeqi AI Counselor) - مستشار أكاديمي خبير في قواعد تنسيق القبول بالجامعات والمعاهد العليا المصرية لطلاب الثانوية العامة (علمي علوم، علمي رياضة، أدبي) وطلاب الدبلومات الفنية (صناعي، تجاري، زراعي، سياحة وفنادق نظام 3 و 5 سنوات).
مهامك:
1. تقديم إرشادات دقيقة حول الحدود الدنيا للقبول بالجامعات الحكومية والأهلية والخاصة والتكنولوجية والمعاهد العليا.
2. شرح قواعد التوزيع الجغرافي (مجموعة أ، ب، ج)، تقليل الاغتراب، واختبارات القدرات.
3. توضيح شروط ومواد المسابقة المركزية الموحدة (معادلة كلية الهندسة، كلية التجارة، كلية الزراعة) لخريجي الدبلومات الفنية.
4. استخدم لغة عربية مهنية ومشجعة للطلاب وأولياء الأمور في مصر.`,
          tools: [{ googleSearch: {} }],
        },
      });

      const replyText = response.text || 'أهلاً بك! كيف يمكنني مساعدتك في تنسيق الجامعات والدبلومات الفنية اليوم؟';
      const grounding = response.candidates?.[0]?.groundingMetadata || null;

      res.json({
        reply: replyText,
        groundingMetadata: grounding,
      });
    } catch (error: any) {
      console.error('Gemini chat error:', error);
      res.status(500).json({
        error: error.message || 'حدث خطأ أثناء معالجة الطلب مع المستشار الذكي.',
      });
    }
  });

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', service: 'Tanseeqi API' });
  });

  // Mount Vite middleware in development, or serve built assets in production
  const distPath = path.resolve(process.cwd(), 'dist');
  const indexHtmlPath = path.resolve(distPath, 'index.html');
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction || !fs.existsSync(indexHtmlPath)) {
    const isHmrDisabled = process.env.DISABLE_HMR === 'true';
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: isHmrDisabled ? false : { server: httpServer },
        watch: isHmrDisabled ? null : {},
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(indexHtmlPath);
    });
  }

  httpServer.listen(port, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${port}`);
  });
}

startServer();
