import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const port = process.env.PORT || 3000;

  app.use(express.json());

  // Backend API route for Gemini AI Copilot
  app.post('/api/chat/assistant', async (req, res) => {
    const { message, context } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
      try {
        const ai = new GoogleGenAI({
          apiKey,
          httpOptions: {
            headers: {
              'User-Agent': 'aistudio-build',
            },
          },
        });
        const systemInstruction = `You are Civy (సివి), the cute, friendly, and highly intelligent Smart City AI Assistant for Andhra Pradesh, India (motto: "Smarter • Safer • Greener").

You are designed to answer ALL questions asked by citizens, operators, and tourists warmly, thoroughly, and accurately:
1. Smart City Operations: Live city telemetry, energy grid loads, solar generation, water SCADA reservoir levels (Prakasam Barrage), air quality (AQI), and citizen grievances (waste disposal, garbage collection, drainage, road potholes, streetlight repairs).
2. Emergency Assistance: Directing users to nearby 24/7 hospitals (GGH Gunadala, Manipal, Ramesh, KGH, SVIMS), emergency speed dials (108 Ambulance, 100/112 Police, 101 Fire, 1091 Disha Women SOS), police stations, and fire offices.
3. Transit & City Services: Pandit Nehru Bus Station (PNBS), Vijayawada Junction Railway Station (BZA), airports, heritage tourist landmarks (Kanaka Durga Temple, Undavalli Caves, Bhavani Island), and restaurants.
4. Universal Q&A: You can answer ANY general questions, explain concepts, provide facts, or assist with any topic with warmth, intelligence, and clarity.

Always maintain a friendly, helpful persona as Civy. Use clear markdown formatting (bullet points, bold text) where helpful.`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: message,
          config: {
            systemInstruction,
          },
        });

        if (response?.text) {
          return res.json({ success: true, reply: response.text });
        }
      } catch (err: any) {
        console.error('Gemini API Server Error:', err?.message || err);
      }
    }

    // Expert rule-based fallback if API key quota exceeded or offline
    const query = message.toLowerCase();
    let reply = `Namaskaram! I am **Civy** (సివి), your friendly Smart City AI Assistant! 🤖🏙️✨ I'm here to help make our city Smarter, Safer, and Greener. How can I assist you today?`;

    if (query.includes('traffic') || query.includes('congestion') || query.includes('benz')) {
      reply = `🚦 **Benz Circle & MG Road Telemetry**:
• Current Congestion Index: **74%** (Flow: 84 veh/min).
• V2I Adaptive Green Phase extended by 18s for NH-16 transit.
• **AI Recommendation**: Divert northbound traffic via Vijayawada Inner Ring Road & Ramavarappadu NH-16 Bypass to save ~12 minutes.`;
    } else if (query.includes('water') || query.includes('barrage') || query.includes('prakasam')) {
      reply = `💧 **Prakasam Barrage SCADA Status**:
• Krishna River Reservoir: **88.2%** (12.0 ft, automated crest gates nominal).
• Main Trunk Pressure: **4.22 Bar** (Bhavanipuram Valve V-04 throttled to prevent joint rupture).`;
    } else if (query.includes('energy') || query.includes('power') || query.includes('grid')) {
      reply = `⚡ **APTRANSCO Gunadala Substation**:
• Grid Demand: **418.5 MW** (Solar contribution: **114.2 MW**).
• Smart Streetlights along Bandar Road operating on automated 75% dusk dimming curve.`;
    } else if (query.includes('hospital') || query.includes('emergency') || query.includes('police') || query.includes('fire') || query.includes('services') || query.includes('doctor')) {
      reply = `🏥 **Emergency Assistance & Nearby Civic Services**:
• **Medical & Trauma**: Government General Hospital (GGH Gunadala, 0866-2576666, 108 Ambulance), Manipal Hospital (Tadepalli, 0866-6450505), Ramesh Hospitals (Ring Road).
• **Police & Security**: Central Police Commissionerate (Bandar Road, 0866-2579999 / 100 / 112), Disha Women Police (1091 SOS).
• **Fire & Disaster**: State Disaster Response & Fire Services HQ (Auto Nagar, 101 / 0866-2544101), Suryaraopet Central Fire Station (0866-2572101).
• **Transit Hubs**: Pandit Nehru Bus Station (PNBS, 24x7 RTC terminal), Vijayawada Junction Railway Station (BZA, 139).
• Visit the **Emergency & Services** tab to search by your exact location and calculate instant distances.`;
    }

    return res.json({ success: true, reply, fallback: true });
  });

  // Mount Vite middleware in development mode
  const isProd = process.env.NODE_ENV === 'production';
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, () => {
    console.log(`Smart City AI Server running on http://localhost:${port}`);
  });
}

startServer();
