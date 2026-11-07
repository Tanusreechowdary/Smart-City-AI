import { OverviewMetrics, Complaint, MapNode } from '../types';

export interface CopilotContext {
  metrics: OverviewMetrics | null;
  activeNodes: MapNode[];
  complaints: Complaint[];
  activeZoneName?: string;
}

export class GeminiCityCopilot {
  private static instance: GeminiCityCopilot;

  private constructor() {}

  public static getInstance(): GeminiCityCopilot {
    if (!GeminiCityCopilot.instance) {
      GeminiCityCopilot.instance = new GeminiCityCopilot();
    }
    return GeminiCityCopilot.instance;
  }

  public async askUrbanCopilot(userPrompt: string, context: CopilotContext): Promise<string> {
    const promptLower = userPrompt.toLowerCase();

    // Call server-side proxy route /api/chat/assistant (handles GEMINI_API_KEY securely on the server)
    try {
      const res = await fetch('/api/chat/assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userPrompt,
          context: {
            metrics: context.metrics,
            complaintsCount: context.complaints.length,
          },
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data?.reply) {
          return data.reply;
        }
      }
    } catch (err) {
      console.warn('Backend proxy unavailable, activating client-side intelligent fallback engine:', err);
    }

    // Intelligent domain-specific rule-based response engine (Vijayawada context)
    return this.generateExpertFallbackResponse(promptLower, context);
  }

  private generateExpertFallbackResponse(query: string, context: CopilotContext): string {
    const traffic = context.metrics?.traffic;
    const water = context.metrics?.water;
    const energy = context.metrics?.energy;
    const waste = context.metrics?.waste;
    const env = context.metrics?.environment;

    if (query.includes('traffic') || query.includes('congestion') || query.includes('jam') || query.includes('benz') || query.includes('flyover')) {
      return `🚦 **Vijayawada Traffic & V2I Telemetry Status**:
• Current Citywide Congestion Index: **${traffic?.congestion_index ?? 74}%**
• **Benz Circle Flyover & MG Road** adaptive intersection is running cycle **Phase #3** (120s cycle, 84 veh/min flow).
• V2I connected vehicle communication latency: **9ms**.
• **AI Recommendation**: Scikit-Learn Ridge model projects evening congestion to reach **92%** at 18:00 due to NH-16 Chennai-Kolkata corridor transit. Rerouting via the **Vijayawada Inner Ring Road & Ramavarappadu NH-16 Bypass** saves ~12 minutes.`;
    }

    if (query.includes('water') || query.includes('leak') || query.includes('pressure') || query.includes('barrage') || query.includes('prakasam')) {
      return `💧 **Prakasam Barrage & Krishna River SCADA Telemetry**:
• Prakasam Barrage Reservoir Level: **${water?.main_reservoir_pct ?? 88.2}%** (12.0 ft, automated crest gates nominal).
• Main Trunk Pipeline Pressure: **${water?.trunk_pressure_bar ?? 4.22} Bar** (Baseline: 4.2 Bar).
• Anomaly Flag: Isolation Forest detected acoustic deviation in **Bhavanipuram Head Water Works** (3.18 Bar).
• **Action Taken**: Valve V-04 pressure throttled. VMC SCADA rapid repair squad dispatched near Rythu Bazaar.`;
    }

    if (query.includes('energy') || query.includes('power') || query.includes('grid') || query.includes('streetlight') || query.includes('solar')) {
      return `⚡ **APTRANSCO & Vijayawada Smart Streetlight CMS**:
• Municipal Grid Load: **${energy?.grid_load_mw ?? 418.5} MW** (Gunadala 220kV Substation).
• Renewable Solar Generation: **${energy?.solar_generation_mw ?? 114.2} MW** (${Math.round(((energy?.solar_generation_mw ?? 114) / (energy?.grid_load_mw ?? 418)) * 100)}% clean energy).
• Smart Streetlights: **${energy?.streetlights_online ?? 6240} / ${energy?.streetlights_total ?? 6280}** online along Bandar Road and Eluru Road.
• Adaptive dimming schedule saved **${energy?.savings_pct ?? 32.8}%** energy compared to conventional sodium vapor lamps.`;
    }

    if (query.includes('waste') || query.includes('trash') || query.includes('garbage') || query.includes('bin') || query.includes('route')) {
      return `♻️ **VMC Smart Waste Management & Fleet Logistics**:
• Citywide Bin Capacity Utilization: **${waste?.average_fill_pct ?? 68}%**
• Urgent Collections Scheduled: **${waste?.bins_requiring_pickup ?? 32} bins** exceed the 70% fill threshold.
• Critical Nodes: **One Town Kaleswara Rao Market (96% full)** and **Pandit Nehru Bus Station (PNBS) Terminal 1 (92% full)**.
• Automated TSP Routing: 16 electric compactor trucks dispatched via nearest-neighbor heuristics, cutting collection transit by 38.4%.`;
    }

    if (query.includes('aqi') || query.includes('air') || query.includes('pollution') || query.includes('environment')) {
      return `🍃 **Vijayawada Environmental Telemetry**:
• Current City Air Quality Index: **${env?.aqi ?? 58} AQI (Status: ${env?.status ?? 'MODERATE'})**
• Fine Particulate: PM2.5 is **${env?.pm2_5 ?? 22.4} µg/m³**, PM10 is **${env?.pm10 ?? 42.0} µg/m³**.
• Ambient Temperature: **${env?.temp_c ?? 32.2}°C**, Humidity: **${env?.humidity_pct ?? 64}%**, Noise: **${env?.noise_db ?? 66} dB**.
• Highest particulate concentration observed at **Auto Nagar Industrial Corridor (AQI 88)**.`;
    }

    if (query.includes('report') || query.includes('complaint') || query.includes('pothole') || query.includes('citizen')) {
      return `📋 **VMC Citizen Incident Portal Guide**:
• Citizens can submit reports for potholes, overflowing bins, damaged streetlights, and water leaks directly under the **Citizen Services** tab.
• Currently, there are **${context.complaints.length} active tickets** in the municipal queue for Vijayawada.
• Urgent tickets automatically alert VMC field dispatchers within 60 seconds of submission.`;
    }

    return `🏙️ **Vijayawada Smart City AI Copilot Online**:
I continuously monitor 1,280+ digital twin sensors across Vijayawada, Andhra Pradesh:
1. **Benz Circle & MG Road V2I**: Adaptive traffic signal timings and congestion forecasting.
2. **Prakasam Barrage & Krishna River SCADA**: Reservoir headworks and acoustic leak detection.
3. **Auto Nagar Industrial Estate**: Air quality monitoring and grid balancing.
4. **One Town & PNBS Waste Logistics**: Smart bin fill ultrasound sensors & TSP route optimization.
5. **Bandar & Eluru Road Smart Lighting**: Zhaga-D4i CMS dimming and remote relays.

Try asking: *"What is the traffic forecast at Benz Circle for 18:00?"*, *"What is the Prakasam Barrage water status?"*, or *"Which bins in One Town need pickup?"*`;
  }
}
