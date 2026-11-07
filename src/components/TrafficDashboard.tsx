import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  Car,
  AlertTriangle,
  Sparkles,
  Navigation,
  Radio,
  Sliders,
  TrendingUp,
} from 'lucide-react';
import { useCityData } from '../context/CityDataContext';
import { HOURLY_TRAFFIC_SERIES } from '../services/mockData';
import { CityAIPredictionEngine } from '../services/aiPredictionEngine';
import { AP_TRAFFIC_CORRIDORS, AP_TRAFFIC_INCIDENTS } from '../services/andhraPradeshGeo';

export const TrafficDashboard: React.FC = () => {
  const { metrics, zones, theme } = useCityData();

  // AI Prediction form state
  const [forecastHour, setForecastHour] = useState<number>(18);
  const [weatherCondition, setWeatherCondition] = useState<'clear' | 'light_rain' | 'heavy_rain' | 'fog'>('clear');
  const [specialEvent, setSpecialEvent] = useState<boolean>(false);
  const [incidentActive, setIncidentActive] = useState<boolean>(false);

  // Compute AI forecast using Ridge Regression simulation
  const forecast = CityAIPredictionEngine.forecastTraffic({
    hour: forecastHour,
    currentDensity: metrics.traffic.congestion_index,
    weather: weatherCondition,
    specialEvent,
    incidentActive,
  });

  return (
    <div className="space-y-6">
      {/* Benz Circle Flyover & MG Road Adaptive Signal HUD */}
      <div className="hud-panel p-5 rounded-2xl border-l-4 border-l-cyan-600 dark:border-l-cyan-400">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-cyan-100 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-500/30">
                <Radio className="w-4 h-4 animate-spin" />
              </span>
              <h2 className="font-hud font-bold text-slate-900 dark:text-white text-base md:text-lg tracking-wide">
                Benz Circle Flyover & MG Road (Bandar Rd) Adaptive Signal
              </h2>
              <span className="bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-400 text-[10px] px-2 py-0.5 rounded font-mono-code font-bold border border-emerald-200 dark:border-emerald-500/30">
                VMC-INT-01 • ONLINE
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-mono-code">
              Vijayawada NH-16 Transit Corridor • V2I Connected: {metrics.traffic.v2i_connected_vehicles} vehicles • Phase #3 (North-South Green Wave)
            </p>
          </div>

          <div className="flex flex-wrap gap-3 font-mono-code text-center">
            <div className="bg-slate-50 dark:bg-[#070c14] border border-slate-200 dark:border-slate-800 px-3.5 py-2 rounded-xl min-w-[90px] shadow-2xs">
              <span className="text-[10px] text-slate-500 block font-semibold">CYCLE TIME</span>
              <span className="text-sm font-bold text-cyan-700 dark:text-cyan-400">120s</span>
            </div>
            <div className="bg-slate-50 dark:bg-[#070c14] border border-slate-200 dark:border-slate-800 px-3.5 py-2 rounded-xl min-w-[90px] shadow-2xs">
              <span className="text-[10px] text-slate-500 block font-semibold">FLOW RATE</span>
              <span className="text-sm font-bold text-emerald-700 dark:text-emerald-400">
                {metrics.traffic.flow_rate_veh_min} v/min
              </span>
            </div>
            <div className="bg-slate-50 dark:bg-[#070c14] border border-slate-200 dark:border-slate-800 px-3.5 py-2 rounded-xl min-w-[90px] shadow-2xs">
              <span className="text-[10px] text-slate-500 block font-semibold">AVG SPEED</span>
              <span className="text-sm font-bold text-amber-700 dark:text-amber-400">
                {metrics.traffic.average_speed_kmh} km/h
              </span>
            </div>
            <div className="bg-slate-50 dark:bg-[#070c14] border border-slate-200 dark:border-slate-800 px-3.5 py-2 rounded-xl min-w-[90px] shadow-2xs">
              <span className="text-[10px] text-slate-500 block font-semibold">OCCUPANCY</span>
              <span className="text-sm font-bold text-rose-700 dark:text-rose-400">
                {metrics.traffic.congestion_index}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Chart & AI Forecaster */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Real-time 24h Congestion & Speed Curve */}
        <div className="hud-panel p-5 rounded-2xl lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-hud text-sm font-semibold text-slate-900 dark:text-white tracking-wide">
                24-Hour Vijayawada Traffic Density & Speed Profile
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono-code">
                Benz Circle, Bandar Road, Eluru Road, and NH-16 sensor feeds
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono-code">
              <span className="flex items-center gap-1.5 text-cyan-700 dark:text-cyan-400 font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" /> Density (%)
              </span>
              <span className="flex items-center gap-1.5 text-amber-700 dark:text-amber-400 font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Speed (km/h)
              </span>
            </div>
          </div>

          <div className="h-68 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={HOURLY_TRAFFIC_SERIES}>
                <defs>
                  <linearGradient id="trafficGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0891b2" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#0891b2" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="speedGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#d97706" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#d97706" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="hour" stroke="#94a3b8" fontSize={11} fontFamily="JetBrains Mono" />
                <YAxis stroke="#94a3b8" fontSize={11} domain={[0, 100]} fontFamily="JetBrains Mono" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: theme === 'dark' ? '#070c14' : '#ffffff',
                    borderColor: theme === 'dark' ? '#1e293b' : '#e2e8f0',
                    color: theme === 'dark' ? '#ffffff' : '#0f172a',
                    borderRadius: '8px',
                    fontFamily: 'JetBrains Mono',
                    fontSize: '12px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="density"
                  stroke="#0891b2"
                  strokeWidth={2.5}
                  fill="url(#trafficGradient)"
                  name="Congestion Density %"
                />
                <Area
                  type="monotone"
                  dataKey="speed"
                  stroke="#d97706"
                  strokeWidth={2}
                  fill="url(#speedGradient)"
                  name="Speed (km/h)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Congestion Prediction Machine */}
        <div className="hud-panel p-5 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-cyan-700 dark:text-cyan-400">
                <Sparkles className="w-4 h-4 animate-pulse" />
                <h3 className="font-hud text-sm font-bold text-slate-900 dark:text-white tracking-wide">
                  AI Congestion Forecaster
                </h3>
              </div>
              <span className="text-[10px] bg-cyan-100 dark:bg-cyan-500/20 text-cyan-800 dark:text-cyan-300 font-mono-code px-2 py-0.5 rounded font-bold border border-cyan-200 dark:border-cyan-500/30">
                SCIKIT RIDGE
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 font-mono-code leading-relaxed">
              Trained on historical Vijayawada arterial traffic & monsoon precipitation coefficients.
            </p>

            <div className="space-y-3 font-mono-code text-xs">
              {/* Hour Selection */}
              <div>
                <label className="text-slate-700 dark:text-slate-300 block mb-1 font-semibold">
                  Target Forecast Hour:
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {[8, 12, 17, 18, 20, 22].map((hr) => (
                    <button
                      key={hr}
                      onClick={() => setForecastHour(hr)}
                      className={`py-1 rounded-lg text-center transition-all ${
                        forecastHour === hr
                          ? 'bg-cyan-600 text-white font-bold shadow-xs'
                          : 'bg-slate-50 dark:bg-[#070c14] border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
                      }`}
                    >
                      {hr}:00
                    </button>
                  ))}
                </div>
              </div>

              {/* Weather factor selector */}
              <div>
                <label className="text-slate-700 dark:text-slate-300 block mb-1 font-semibold">
                  Weather Friction:
                </label>
                <select
                  value={weatherCondition}
                  onChange={(e) => setWeatherCondition(e.target.value as any)}
                  className="w-full bg-slate-50 dark:bg-[#070c14] border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-800 dark:text-white outline-none focus:border-cyan-500 text-xs"
                >
                  <option value="clear">Clear Weather (1.0x)</option>
                  <option value="light_rain">Monsoon Shower (+15% delay)</option>
                  <option value="heavy_rain">Heavy Krishna Delta Rain (+35% delay)</option>
                  <option value="fog">Morning River Fog (+22% delay)</option>
                </select>
              </div>

              {/* Toggle check */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300 font-medium">
                  <input
                    type="checkbox"
                    checked={specialEvent}
                    onChange={(e) => setSpecialEvent(e.target.checked)}
                    className="accent-cyan-600 rounded"
                  />
                  <span>Bhavani Island / Festival Peak</span>
                </label>
              </div>

              {/* Forecast Result Card */}
              <div className="mt-4 p-3.5 rounded-xl bg-slate-50 dark:bg-[#070c14] border border-slate-200 dark:border-cyan-500/30 text-center">
                <span className="text-[10px] text-slate-500 uppercase block font-bold">
                  PROJECTED CONGESTION (AT {forecastHour}:00)
                </span>
                <div className="flex items-center justify-center gap-3 mt-1.5">
                  <div>
                    <span className="text-2xl font-bold font-hud text-rose-600 dark:text-rose-400">
                      {forecast.predictedDensity30m}%
                    </span>
                    <span className="text-[9px] text-slate-500 block">+30 min</span>
                  </div>
                  <span className="text-slate-300 dark:text-slate-700">|</span>
                  <div>
                    <span className="text-xl font-bold font-hud text-amber-600 dark:text-amber-400">
                      {forecast.predictedDensity60m}%
                    </span>
                    <span className="text-[9px] text-slate-500 block">+60 min</span>
                  </div>
                </div>
                <div className="text-[10px] text-slate-600 dark:text-slate-400 mt-2 flex justify-between px-2 pt-1 border-t border-slate-200 dark:border-slate-800">
                  <span>Confidence: {(forecast.confidenceScore * 100).toFixed(1)}%</span>
                  <span>Est. Delay: +{forecast.estimatedDelayMinutes} min</span>
                </div>
              </div>
            </div>
          </div>

          {forecast.recommendedReroute && (
            <div className="mt-4 p-3 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 text-[11px] font-mono-code text-amber-800 dark:text-amber-300 flex items-start gap-2 shadow-2xs">
              <Navigation className="w-4 h-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
              <div>
                <span className="font-bold">Vijayawada AI Reroute:</span>
                <p className="text-slate-700 dark:text-slate-300 mt-0.5">
                  Divert via {forecast.recommendedReroute.suggestedAlternative} (Saves {forecast.recommendedReroute.savedMinutes} min).
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Zone-by-Zone Congestion Breakdown */}
      <div className="hud-panel p-5 rounded-2xl">
        <h3 className="font-hud text-sm font-semibold text-slate-900 dark:text-white mb-3 tracking-wide">
          Vijayawada District Traffic Congestion Breakdown
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 font-mono-code">
          {zones.map((zone) => {
            const isHigh = zone.congestion > 70;
            const isMedium = zone.congestion > 45 && zone.congestion <= 70;
            return (
              <div
                key={zone.id}
                className="bg-slate-50 dark:bg-[#070c14] border border-slate-200 dark:border-slate-800 p-3.5 rounded-xl flex flex-col justify-between shadow-2xs"
              >
                <div>
                  <span className="text-[10px] text-slate-500 block truncate font-medium">
                    {zone.name}
                  </span>
                  <div className="text-xl font-bold font-hud text-slate-900 dark:text-white mt-1">
                    {zone.congestion}%
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-[10px]">
                  <span className="text-slate-500">Flow:</span>
                  <span
                    className={`font-bold ${
                      isHigh
                        ? 'text-rose-600 dark:text-rose-400'
                        : isMedium
                        ? 'text-amber-600 dark:text-amber-400'
                        : 'text-emerald-600 dark:text-emerald-400'
                    }`}
                  >
                    {isHigh ? 'HEAVY' : isMedium ? 'MODERATE' : 'FLUID'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Andhra Pradesh Statewide Live Highway & Corridor Status */}
      <div className="hud-panel p-5 rounded-2xl">
        <div className="flex flex-wrap items-center justify-between mb-4 gap-2">
          <div>
            <h3 className="font-hud text-sm font-semibold text-slate-900 dark:text-white tracking-wide">
              Andhra Pradesh Live Traffic Corridors & Speed Telemetry
            </h3>
            <p className="text-xs text-slate-500 font-mono-code">
              Monitored via NHAI radar, V2I beacons, and municipal CCTV feeds across AP
            </p>
          </div>
          <span className="text-xs font-mono-code bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded-lg">
            ● 9 Live Corridors Active
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 font-mono-code">
          {AP_TRAFFIC_CORRIDORS.map((c) => {
            const isCongested = c.status === 'congested';
            const isModerate = c.status === 'moderate';
            return (
              <div
                key={c.id}
                className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#070c14] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] text-slate-500 uppercase font-bold">{c.district}</span>
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase ${
                        isCongested
                          ? 'bg-rose-100 text-rose-700'
                          : isModerate
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-emerald-100 text-emerald-700'
                      }`}
                    >
                      {c.status}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">{c.name}</h4>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 block">Speed</span>
                    <span className="font-bold text-slate-900 dark:text-white">{c.currentSpeedKmh} km/h</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Delay</span>
                    <span className={`font-bold ${c.delayMinutes > 5 ? 'text-rose-600' : 'text-emerald-600'}`}>
                      +{c.delayMinutes}m
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Hourly Vol</span>
                    <span className="font-bold text-slate-900 dark:text-white">{c.vehiclesPerHour} v/h</span>
                  </div>
                </div>

                {c.alert && (
                  <div className="mt-2 text-[10px] text-rose-600 bg-rose-50 dark:bg-rose-500/10 p-1.5 rounded-lg border border-rose-200 dark:border-rose-500/20">
                    ⚠️ {c.alert}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
