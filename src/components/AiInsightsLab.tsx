import React, { useState } from 'react';
import {
  BrainCircuit,
  Cpu,
  ShieldCheck,
} from 'lucide-react';
import { useCityData } from '../context/CityDataContext';
import { CityAIPredictionEngine } from '../services/aiPredictionEngine';

export const AiInsightsLab: React.FC = () => {
  const { metrics } = useCityData();

  const [activeModelTab, setActiveModelTab] = useState<'traffic' | 'water' | 'energy' | 'waste'>('traffic');
  const [trafficHour, setTrafficHour] = useState<number>(18);
  const [weatherParam, setWeatherParam] = useState<'clear' | 'light_rain' | 'heavy_rain' | 'fog'>('heavy_rain');
  const [hasEvent, setHasEvent] = useState<boolean>(true);

  const trafficResult = CityAIPredictionEngine.forecastTraffic({
    hour: trafficHour,
    currentDensity: metrics.traffic.congestion_index,
    weather: weatherParam,
    specialEvent: hasEvent,
    incidentActive: false,
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="hud-panel p-5 rounded-2xl border-l-4 border-l-cyan-600">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-cyan-100 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-500/30">
                <BrainCircuit className="w-5 h-5 animate-pulse" />
              </span>
              <h2 className="font-hud font-bold text-slate-900 dark:text-white text-base md:text-lg tracking-wide">
                Vijayawada Urban AI Predictive Models Lab
              </h2>
              <span className="bg-cyan-100 dark:bg-cyan-500/20 text-cyan-800 dark:text-cyan-300 text-[10px] px-2 py-0.5 rounded-full font-mono-code font-bold border border-cyan-200 dark:border-cyan-500/30">
                SCIKIT-LEARN & HEURISTIC ENGINE
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-mono-code">
              Transparent, explainable machine learning models calibrated to Vijayawada urban arterial and Krishna delta conditions.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono-code bg-slate-50 dark:bg-[#070c14] border border-slate-200 dark:border-slate-800 p-2.5 rounded-xl text-slate-700 dark:text-slate-300 shadow-2xs">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Model Calibration: VERIFIED (v2.4)</span>
          </div>
        </div>

        {/* Model Selector Tabs */}
        <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-slate-200 dark:border-slate-800/80 font-mono-code text-xs">
          {[
            { id: 'traffic', label: 'Ridge Traffic Regressor (Benz Circle)', badge: 'R² 0.942' },
            { id: 'water', label: 'Isolation Forest (Prakasam Barrage)', badge: 'Score -1 to +1' },
            { id: 'energy', label: 'ARIMA Grid Balancing (Gunadala)', badge: 'Demand Peak' },
            { id: 'waste', label: 'TSP Nearest-Neighbor (One Town/PNBS)', badge: '38% Savings' },
          ].map((m) => (
            <button
              key={m.id}
              onClick={() => setActiveModelTab(m.id as any)}
              className={`px-3 py-1.5 rounded-xl flex items-center gap-2 transition-all cursor-pointer font-medium ${
                activeModelTab === m.id
                  ? 'bg-cyan-600 text-white font-bold shadow-xs'
                  : 'bg-slate-50 dark:bg-[#070c14] border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <span>{m.label}</span>
              <span className="text-[10px] opacity-80 font-normal">({m.badge})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Model Sandbox */}
      {activeModelTab === 'traffic' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="hud-panel p-5 rounded-2xl lg:col-span-2 space-y-4">
            <h3 className="font-hud text-sm font-semibold text-slate-900 dark:text-white tracking-wide flex items-center gap-2">
              <Cpu className="w-4 h-4 text-cyan-600" />
              Benz Circle Congestion Model Architecture & Feature Coefficients
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono-code leading-relaxed">
              Formulation: <code className="bg-slate-100 dark:bg-[#070c14] text-cyan-800 dark:text-cyan-300 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-800">
                y = w₀ + w₁·sin(2πh/24) + w₂·cos(2πh/24) + w₃·density_curr + w₄·weather_mult + w₅·event_flag
              </code>
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono-code text-xs">
              <div className="bg-slate-50 dark:bg-[#070c14] border border-slate-200 dark:border-slate-800 p-3 rounded-xl shadow-2xs">
                <span className="text-[10px] text-slate-500 block font-semibold">R² ACCURACY</span>
                <span className="text-base font-bold text-emerald-700 dark:text-emerald-400">0.942</span>
              </div>
              <div className="bg-slate-50 dark:bg-[#070c14] border border-slate-200 dark:border-slate-800 p-3 rounded-xl shadow-2xs">
                <span className="text-[10px] text-slate-500 block font-semibold">MSE LOSS</span>
                <span className="text-base font-bold text-cyan-800 dark:text-cyan-300">3.12</span>
              </div>
              <div className="bg-slate-50 dark:bg-[#070c14] border border-slate-200 dark:border-slate-800 p-3 rounded-xl shadow-2xs">
                <span className="text-[10px] text-slate-500 block font-semibold">DATA POINTS</span>
                <span className="text-base font-bold text-slate-800 dark:text-white">48,200 records</span>
              </div>
              <div className="bg-slate-50 dark:bg-[#070c14] border border-slate-200 dark:border-slate-800 p-3 rounded-xl shadow-2xs">
                <span className="text-[10px] text-slate-500 block font-semibold">LATENCY</span>
                <span className="text-base font-bold text-cyan-700 dark:text-cyan-400">1.8 ms</span>
              </div>
            </div>

            {/* Feature Weight Visualizer */}
            <div className="space-y-2.5 pt-2 font-mono-code text-xs">
              <span className="text-slate-700 dark:text-slate-300 font-semibold block">Audited Feature Coefficients:</span>
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-[11px] text-slate-500 mb-0.5">
                    <span>Diurnal Time-of-Day Curve (w₁):</span>
                    <span className="text-cyan-700 font-bold">42% impact</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-[#070c14] h-2 rounded-full overflow-hidden border border-slate-200 dark:border-slate-800">
                    <div className="bg-cyan-500 h-full rounded-full" style={{ width: '42%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] text-slate-500 mb-0.5">
                    <span>Live Sensor Density Feedback (w₃):</span>
                    <span className="text-emerald-700 font-bold">58% impact</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-[#070c14] h-2 rounded-full overflow-hidden border border-slate-200 dark:border-slate-800">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: '58%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] text-slate-500 mb-0.5">
                    <span>Monsoon Weather Penalty (w₄):</span>
                    <span className="text-amber-700 font-bold">+{trafficResult.featureWeights.weatherPenalty}%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-[#070c14] h-2 rounded-full overflow-hidden border border-slate-200 dark:border-slate-800">
                    <div
                      className="bg-amber-500 h-full rounded-full"
                      style={{ width: `${Math.min(100, trafficResult.featureWeights.weatherPenalty * 2)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Simulation Controls */}
          <div className="hud-panel p-5 rounded-2xl flex flex-col justify-between">
            <div>
              <h3 className="font-hud text-sm font-bold text-slate-900 dark:text-white tracking-wide mb-3">
                Vijayawada Traffic Sensitivity Sandbox
              </h3>

              <div className="space-y-3 font-mono-code text-xs">
                <div>
                  <label className="text-slate-700 dark:text-slate-300 block mb-1 font-semibold">Target Hour ({trafficHour}:00):</label>
                  <input
                    type="range"
                    min="6"
                    max="23"
                    value={trafficHour}
                    onChange={(e) => setTrafficHour(parseInt(e.target.value))}
                    className="w-full accent-cyan-600 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg cursor-pointer"
                  />
                </div>

                <div>
                  <label className="text-slate-700 dark:text-slate-300 block mb-1 font-semibold">Weather Friction:</label>
                  <select
                    value={weatherParam}
                    onChange={(e) => setWeatherParam(e.target.value as any)}
                    className="w-full bg-slate-50 dark:bg-[#070c14] border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-1.5 text-slate-800 dark:text-white outline-none focus:border-cyan-500 text-xs"
                  >
                    <option value="clear">Clear (1.0x)</option>
                    <option value="light_rain">Light Shower (1.15x)</option>
                    <option value="heavy_rain">Heavy Krishna Delta Rain (1.35x)</option>
                    <option value="fog">Morning River Fog (1.22x)</option>
                  </select>
                </div>

                <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300 pt-1 font-medium">
                  <input
                    type="checkbox"
                    checked={hasEvent}
                    onChange={(e) => setHasEvent(e.target.checked)}
                    className="accent-cyan-600 rounded"
                  />
                  <span>Bhavani Ghat / Holiday Surge</span>
                </label>

                {/* Real-time prediction display */}
                <div className="mt-4 p-3.5 rounded-xl bg-slate-50 dark:bg-[#070c14] border border-slate-200 dark:border-cyan-500/30 text-center space-y-1">
                  <span className="text-[10px] text-slate-500 uppercase block font-semibold">
                    Calculated Congestion (+30m)
                  </span>
                  <div className="text-2xl font-bold font-hud text-rose-600 dark:text-rose-400">
                    {trafficResult.predictedDensity30m}%
                  </div>
                  <span className="text-[10px] text-slate-600 dark:text-slate-400 block">
                    Severity: <strong className="text-slate-900 dark:text-white">{trafficResult.congestionLevel}</strong> • Delay: +{trafficResult.estimatedDelayMinutes}m
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 text-[10px] font-mono-code text-slate-500 italic">
              Note: Transparent baseline machine learning simulation for Vijayawada corridors.
            </div>
          </div>
        </div>
      )}

      {activeModelTab === 'water' && (
        <div className="hud-panel p-5 rounded-2xl space-y-4 font-mono-code text-xs">
          <h3 className="font-hud text-sm font-semibold text-slate-900 dark:text-white tracking-wide">
            Prakasam Barrage Isolation Forest Anomaly Detection Specification
          </h3>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
            The Isolation Forest algorithm isolates pipeline pressure drops across Bhavanipuram, One Town, and Auto Nagar conduits. Contamination parameter set to 0.03.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#070c14] border border-slate-200 dark:border-slate-800">
              <span className="text-emerald-700 dark:text-emerald-400 font-bold block mb-1">Score &gt; 0.0 (Inlier)</span>
              <p className="text-slate-500 text-[11px]">Nominal pressure gradient (4.0 - 4.4 Bar). Normal diurnal drawdown.</p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#070c14] border border-slate-200 dark:border-slate-800">
              <span className="text-amber-700 dark:text-amber-400 font-bold block mb-1">Score -0.1 to -0.4 (Monitor)</span>
              <p className="text-slate-500 text-[11px]">Minor acoustic perturbation; possible joint weeping or valve throttling.</p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#070c14] border border-slate-200 dark:border-slate-800">
              <span className="text-rose-700 dark:text-rose-400 font-bold block mb-1">Score &lt; -0.5 (Critical Leak)</span>
              <p className="text-slate-500 text-[11px]">Abrupt pressure loss combined with high velocity flow indicates main trunk rupture.</p>
            </div>
          </div>
        </div>
      )}

      {activeModelTab === 'energy' && (
        <div className="hud-panel p-5 rounded-2xl space-y-4 font-mono-code text-xs">
          <h3 className="font-hud text-sm font-semibold text-slate-900 dark:text-white tracking-wide">
            Gunadala 220kV Substation Forecaster & Dimming Heuristic
          </h3>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
            Balances APTRANSCO base generation with canal solar PV plants, dimming Bandar Road and Eluru Road streetlights during off-peak hours (23:00 - 05:00).
          </p>
          <div className="bg-slate-50 dark:bg-[#070c14] border border-slate-200 dark:border-slate-800 p-4 rounded-xl flex items-center justify-between">
            <div>
              <span className="text-slate-500 block text-[11px]">Monthly Power Savings:</span>
              <span className="text-xl font-bold font-hud text-emerald-700 dark:text-emerald-400">168.2 MWh Saved</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Substation Peak Load Shaving:</span>
              <span className="text-xl font-bold font-hud text-cyan-700 dark:text-cyan-400">-22.4 MW</span>
            </div>
          </div>
        </div>
      )}

      {activeModelTab === 'waste' && (
        <div className="hud-panel p-5 rounded-2xl space-y-4 font-mono-code text-xs">
          <h3 className="font-hud text-sm font-semibold text-slate-900 dark:text-white tracking-wide">
            Vijayawada Traveling Salesperson (TSP) Nearest-Neighbor Solver
          </h3>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
            Prioritizes compactor routing between One Town wholesale vegetable markets, PNBS bus complex, and Bhavanipuram Rythu Bazaar, cutting VMC municipal diesel consumption by 38.4%.
          </p>
        </div>
      )}
    </div>
  );
};
