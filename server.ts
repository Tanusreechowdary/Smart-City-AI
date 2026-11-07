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
        const ai = new GoogleGenAI({ apiKey });
        const systemInstruction = `You are the Smart City AI Autonomous Urban Command Copilot for the State of Andhra Pradesh, India, including Vijayawada Municipal Corporation (VMC), Greater Visakhapatnam Municipal Corporation (GVMC), Tirupati Municipal Corporation (TMC), Guntur Municipal Corporation (GMC), and the APCRDA Digital Twin GIS Command Center.

Statewide Andhra Pradesh Telemetry & GIS Context:
- Geographical Scope: Entire Andhra Pradesh (26 Districts: Vijayawada, Amaravati, Visakhapatnam, Tirupati, Guntur, Kurnool, Kakinada, Rajamahendravaram, Nellore, Kadapa, Anantapur).
- Interactive Map GIS Layers: High-Res Satellite (House Roofs at 19x zoom), Live Traffic Flow & Congestion Corridors, Satellite Hybrid, OpenStreetMap Streets & Building Footprints, CartoDB Voyager, Command Center Dark GIS, and Environmental AQI.
- Live Highway & Corridor Traffic:
  • Benz Circle Flyover & MG Road: 19 km/h (Congested, +14m delay). Detour: Inner Ring Road.
  • Prakasam Barrage Krishna Bridge: 28 km/h (Moderate, single-lane sluice work). Detour: Kanaka Durga Flyover.
  • NH-16 Vijayawada-Guntur Express: 74 km/h (Free flow).
  • Vizag Beach Road Marine Drive: 35 km/h (Moderate weekend/tourist flow).
  • Tirupati Alipiri Gateway & Bypass: 22 km/h (+12m delay, pilgrim queue).
- Current Urban Metrics:
  • Traffic Congestion Index: ${context?.metrics?.traffic?.congestion_index ?? 74}%
  • Air Quality: ${context?.metrics?.environment?.aqi ?? 58} AQI (Good/Moderate)
  • Power Grid Demand: ${context?.metrics?.energy?.grid_load_mw ?? 418} MW (Gunadala Substation, Solar: ${context?.metrics?.energy?.solar_generation_mw ?? 114} MW)
  • Water SCADA: Prakasam Barrage reservoir at 12.0 ft, main trunk pressure 4.22 Bar.
  • Waste Collection: ${context?.metrics?.waste?.average_fill_pct ?? 68}% compactor efficiency.

Respond in a professional, courteous, authoritative municipal style. Provide actionable intelligence, specific routes, landmark references, and advice for citizens and city operators.`;

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: message,
          config: {
            systemInstruction,
            temperature: 0.3,
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
    let reply = `Namaskaram! Vijayawada Smart City AI Copilot is online. Monitoring 1,280+ IoT sensors across Benz Circle, Prakasam Barrage, Auto Nagar, and One Town. How can I assist with municipal operations?`;

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
    } else if (query.includes('waste') || query.includes('trash') || query.includes('bin')) {
      reply = `♻️ **VMC Solid Waste Fleet Logistics**:
• One Town Kaleswara Rao Market (96% full) & PNBS Terminal 1 (92% full) scheduled for priority compactor collection via TSP algorithm.`;
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
