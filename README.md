# Smart City AI – Intelligent Urban Management Platform

**Vijayawada Municipal Corporation (VMC) & APCRDA Digital Twin**  
*Location: Vijayawada, Andhra Pradesh, India (16.5062° N, 80.6480° E)*  
*Smart City Ecosystem | Robotics, Automation & Control Laboratory*

---

## 1. Project Overview

**Smart City AI** is an intelligent urban management system and digital twin command center engineered specifically for **Vijayawada, Andhra Pradesh**. It features a modern **light colour theme** (with dark mode toggle) and an interactive **OpenStreetMap / CartoDB GIS Map** centered directly on Vijayawada's key municipal sectors:

1. **Benz Circle & MG Road (Bandar Road) Corridor**:
   - V2I adaptive traffic signal telemetry on NH-16 (Chennai-Kolkata arterial).
   - Scikit-learn Ridge Regression predicting congestion peaks and reroutes via the Vijayawada Inner Ring Road.
2. **Prakasam Barrage & Krishna Riverfront**:
   - SCADA reservoir water level monitoring (12.0 ft) and automated crest gate telemetry.
   - Isolation Forest anomaly detection for subterranean pipeline leakage detection.
3. **One Town (Old City & Kanaka Durga Temple)**:
   - High-density heritage and market sector with ultrasound smart bin compactor fill tracking.
   - Traveling Salesperson (TSP) nearest-neighbor collection route optimization.
4. **Auto Nagar Industrial Corridor (Jawahar Auto Nagar)**:
   - AP's premier industrial automotive hub with real-time PM2.5 / PM10 particulate monitoring and CPCB thresholds.
5. **Gunadala & Ramavarappadu Ring**:
   - APTRANSCO 220kV substation balancing with renewable solar generation across Krishna canal arrays.
6. **Bhavanipuram & Gollapudi Bypass**:
   - West transit hub and Rythu Bazaar municipal distribution.

---

## 2. Interactive Map Capabilities

- **Location**: Centered at **[16.5062, 80.6480]** in Vijayawada, Andhra Pradesh.
- **Cartography**: OpenStreetMap with clean CartoDB Positron light tiles (and Dark Matter in dark mode).
- **Navigation Shortcuts**: One-click fly-to buttons for *Benz Circle*, *Prakasam Barrage*, *One Town*, and *Auto Nagar*.
- **Live Node Telemetry**: Pulsing IoT markers with inspection HUD cards showing real-time flow rate, pressure, AQI, and voltage.

---

## 3. Light Theme & Design System

- **Default Theme**: Modern, crisp **Light Theme** (`#f8fafc` background, pure white `#ffffff` cards, slate text, cyan, emerald, amber, and purple accents).
- **Theme Switcher**: Instant Sun/Moon toggle in the header navbar to switch between Light and Dark mode.
- **Legibility**: High-contrast typography using Chakra Petch for HUD metrics and JetBrains Mono for telemetry codes.

---

## 4. Execution Instructions

```bash
# Install dependencies
npm install

# Start Vite dev server on port 3000
npm run dev
```
Open `http://localhost:3000` to interact with the Vijayawada Smart City digital twin.
