import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  Zap,
  Power,
  Sun,
  Moon,
  TrendingDown,
} from 'lucide-react';
import { useCityData } from '../context/CityDataContext';
import { HOURLY_ENERGY_SERIES } from '../services/mockData';

export const EnergyDashboard: React.FC = () => {
  const {
    streetlights,
    toggleStreetlight,
    setStreetlightBrightness,
    toggleAllStreetlights,
    metrics,
    theme,
  } = useCityData();

  const totalWatts = streetlights.reduce((acc, curr) => acc + curr.power_watts, 0);
  const activeCount = streetlights.filter((s) => s.is_active).length;

  return (
    <div className="space-y-6">
      {/* Top Streetlight CMS HUD Banner */}
      <div className="hud-panel p-5 rounded-2xl border-l-4 border-l-amber-500">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30">
                <Zap className="w-4 h-4 animate-pulse" />
              </span>
              <h2 className="font-hud font-bold text-slate-900 dark:text-white text-base md:text-lg tracking-wide">
                Vijayawada Smart Streetlight CMS & Substation Balancing
              </h2>
              <span className="bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 text-[10px] px-2 py-0.5 rounded-full font-mono-code font-bold border border-amber-200 dark:border-amber-500/30">
                ZHAGA-D4i & APTRANSCO GRID
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-mono-code">
              Bandar Road, Eluru Road & Benz Circle corridor luminaires connected via D4i smart sensors.
            </p>
          </div>

          {/* Quick Batch Controls */}
          <div className="flex items-center gap-2 font-mono-code text-xs">
            <button
              onClick={() => toggleAllStreetlights(true)}
              className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl transition-colors flex items-center gap-1.5 font-bold shadow-xs cursor-pointer"
            >
              <Sun className="w-3.5 h-3.5" /> All Luminaires ON
            </button>
            <button
              onClick={() => toggleAllStreetlights(false)}
              className="px-3.5 py-1.5 bg-slate-100 dark:bg-[#0b1322] border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-1.5 font-medium cursor-pointer"
            >
              <Moon className="w-3.5 h-3.5" /> All OFF
            </button>
          </div>
        </div>

        {/* Energy KPI Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-slate-200 dark:border-slate-800/80 font-mono-code text-xs">
          <div className="bg-slate-50 dark:bg-[#070c14] border border-slate-200 dark:border-slate-800 p-3 rounded-xl shadow-2xs">
            <span className="text-[10px] text-slate-500 block font-semibold">GRID LOAD (GUNADALA)</span>
            <span className="text-sm font-bold text-amber-700 dark:text-amber-400">
              {metrics.energy.grid_load_mw} MW
            </span>
          </div>
          <div className="bg-slate-50 dark:bg-[#070c14] border border-slate-200 dark:border-slate-800 p-3 rounded-xl shadow-2xs">
            <span className="text-[10px] text-slate-500 block font-semibold">SOLAR CONTRIBUTION</span>
            <span className="text-sm font-bold text-emerald-700 dark:text-emerald-400">
              {metrics.energy.solar_generation_mw} MW
            </span>
          </div>
          <div className="bg-slate-50 dark:bg-[#070c14] border border-slate-200 dark:border-slate-800 p-3 rounded-xl shadow-2xs">
            <span className="text-[10px] text-slate-500 block font-semibold">MUNICIPAL SAVINGS</span>
            <span className="text-sm font-bold text-cyan-700 dark:text-cyan-400 flex items-center gap-1">
              <TrendingDown className="w-3.5 h-3.5 text-cyan-600" />
              {metrics.energy.savings_pct}% / month
            </span>
          </div>
          <div className="bg-slate-50 dark:bg-[#070c14] border border-slate-200 dark:border-slate-800 p-3 rounded-xl shadow-2xs">
            <span className="text-[10px] text-slate-500 block font-semibold">LIGHTING DRAW</span>
            <span className="text-sm font-bold text-slate-800 dark:text-white">
              {totalWatts} W ({activeCount}/{streetlights.length} active)
            </span>
          </div>
        </div>
      </div>

      {/* Grid Load vs Solar Curve Chart */}
      <div className="hud-panel p-5 rounded-2xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-hud text-sm font-semibold text-slate-900 dark:text-white tracking-wide">
              APTRANSCO Substation Power Generation vs Solar Profile (MW)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono-code">
              Gunadala 220kV grid telemetry and Krishna canal solar farm generation
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs font-mono-code">
            <span className="flex items-center gap-1.5 text-amber-700 dark:text-amber-400 font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Grid Load (MW)
            </span>
            <span className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Solar PV (MW)
            </span>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={HOURLY_ENERGY_SERIES}>
              <defs>
                <linearGradient id="energyGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#d97706" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#d97706" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="solarGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#059669" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#059669" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="hour" stroke="#94a3b8" fontSize={11} fontFamily="JetBrains Mono" />
              <YAxis stroke="#94a3b8" fontSize={11} domain={[0, 550]} fontFamily="JetBrains Mono" />
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
                dataKey="totalMw"
                stroke="#d97706"
                strokeWidth={2.5}
                fill="url(#energyGradient)"
                name="Grid Demand (MW)"
              />
              <Area
                type="monotone"
                dataKey="solarMw"
                stroke="#059669"
                strokeWidth={2}
                fill="url(#solarGradient)"
                name="Solar Solar PV (MW)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Streetlight Node Control Cards */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-hud text-sm font-semibold text-slate-900 dark:text-white tracking-wide">
            Vijayawada Zhaga-D4i Luminaire Telemetry & Dimming CMS
          </h3>
          <span className="text-[10px] font-mono-code text-slate-500">
            BANDAR ROAD • PRAKASAM PROMENADE • BENZ CIRCLE
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {streetlights.map((node) => (
            <div
              key={node.node_id}
              className={`hud-panel p-4 rounded-2xl flex flex-col justify-between border transition-all ${
                node.is_active
                  ? 'border-amber-300 dark:border-amber-400/30 shadow-xs'
                  : 'border-slate-200 dark:border-slate-800 opacity-70'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-mono-code font-bold text-cyan-700 dark:text-cyan-400">
                      {node.node_id}
                    </span>
                    <span className="text-[9px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-1.5 py-0.5 rounded font-mono-code">
                      {node.protocol}
                    </span>
                  </div>

                  <span
                    className={`text-[10px] font-mono-code px-2 py-0.5 rounded-full font-bold ${
                      node.is_active
                        ? 'bg-amber-100 text-amber-800 border border-amber-300 dark:bg-amber-400/20 dark:text-amber-300'
                        : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                    }`}
                  >
                    {node.is_active ? `${node.brightness_pct}% BRIGHTNESS` : 'OFFLINE'}
                  </span>
                </div>

                <h4 className="text-slate-900 dark:text-white font-semibold text-sm mb-1">{node.district}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-mono-code mb-3">
                  Pole {node.pole_number} • Ambient: {node.lux_ambient} Lux
                </p>

                {/* Dimming Slider Control */}
                <div className="space-y-1 mb-3 font-mono-code text-xs">
                  <div className="flex justify-between text-[11px] text-slate-500">
                    <span>Dimmer Level:</span>
                    <span className="text-slate-900 dark:text-white font-semibold">{node.brightness_pct}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    step="5"
                    value={node.brightness_pct}
                    disabled={!node.is_active}
                    onChange={(e) =>
                      setStreetlightBrightness(node.node_id, parseInt(e.target.value))
                    }
                    className="w-full accent-amber-500 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg cursor-pointer disabled:opacity-40"
                  />
                </div>

                {/* Telemetry Key-Values */}
                <div className="grid grid-cols-2 gap-2 bg-slate-50 dark:bg-[#070c14] border border-slate-200 dark:border-slate-800 p-2 rounded-xl text-[10px] font-mono-code text-slate-500">
                  <div>
                    <span>Power: </span>
                    <span className="text-slate-900 dark:text-white font-semibold">{node.power_watts} W</span>
                  </div>
                  <div>
                    <span>Voltage: </span>
                    <span className="text-slate-900 dark:text-white font-semibold">{node.voltage_v} V</span>
                  </div>
                </div>
              </div>

              {/* Power Switch Toggle */}
              <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between font-mono-code text-xs">
                <span className="text-slate-500 text-[11px]">Relay State:</span>
                <button
                  onClick={() => toggleStreetlight(node.node_id)}
                  className={`px-3 py-1.5 rounded-xl border font-bold transition-all flex items-center gap-1.5 text-xs cursor-pointer ${
                    node.is_active
                      ? 'bg-amber-100 border-amber-300 text-amber-800 dark:bg-amber-500/20 dark:border-amber-400 dark:text-amber-300'
                      : 'bg-slate-100 border-slate-200 text-slate-600 dark:bg-[#070c14] dark:border-slate-700 dark:text-slate-500'
                  }`}
                >
                  <Power className="w-3.5 h-3.5" />
                  {node.is_active ? 'POWER ON' : 'STANDBY'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
