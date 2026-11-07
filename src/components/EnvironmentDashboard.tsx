import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import {
  Wind,
  Thermometer,
  Droplets,
  Volume2,
  AlertTriangle,
  ShieldCheck,
  Gauge,
} from 'lucide-react';
import { useCityData } from '../context/CityDataContext';

export const EnvironmentDashboard: React.FC = () => {
  const { metrics, zones, theme } = useCityData();
  const [aqiThreshold, setAqiThreshold] = useState<number>(100);

  const getAqiColor = (aqi: number) => {
    if (aqi <= 50) return '#10b981'; // Green (Good)
    if (aqi <= 100) return '#f59e0b'; // Amber (Moderate)
    if (aqi <= 150) return '#f97316'; // Orange (Unhealthy sensitive)
    return '#f43f5e'; // Red (Hazardous)
  };

  const getAqiStatus = (aqi: number) => {
    if (aqi <= 50) return { label: 'GOOD', color: 'text-emerald-700 bg-emerald-100 border-emerald-300 dark:text-emerald-400 dark:bg-emerald-500/10' };
    if (aqi <= 100) return { label: 'MODERATE', color: 'text-amber-700 bg-amber-100 border-amber-300 dark:text-amber-400 dark:bg-amber-500/10' };
    if (aqi <= 150) return { label: 'UNHEALTHY (SENSITIVE)', color: 'text-orange-700 bg-orange-100 border-orange-300 dark:text-orange-400 dark:bg-orange-500/10' };
    return { label: 'HAZARDOUS', color: 'text-rose-700 bg-rose-100 border-rose-300 dark:text-rose-400 dark:bg-rose-500/10 animate-pulse' };
  };

  const aqiStatus = getAqiStatus(metrics.environment.aqi);

  const zoneAqiData = zones.map((z) => ({
    name: z.name.split(' ')[0],
    fullName: z.name,
    aqi: z.aqi,
  }));

  return (
    <div className="space-y-6">
      {/* Top AQI Sensor HUD */}
      <div className="hud-panel p-5 rounded-2xl border-l-4 border-l-emerald-500">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30">
                <Wind className="w-4 h-4 animate-spin" />
              </span>
              <h2 className="font-hud font-bold text-slate-900 dark:text-white text-base md:text-lg tracking-wide">
                Vijayawada Environmental Micro-Station Grid & AQI Telemetry
              </h2>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono-code font-bold border ${aqiStatus.color}`}>
                {aqiStatus.label}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-mono-code">
              64 hyper-local particulate stations across Auto Nagar, One Town, Benz Circle, and Krishna Riverfront.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono-code bg-slate-50 dark:bg-[#070c14] border border-slate-200 dark:border-slate-800 p-2.5 rounded-xl text-slate-700 dark:text-slate-300">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>CPCB Standards: COMPLIANT</span>
          </div>
        </div>

        {/* Environmental Parameter Meters */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-4 pt-4 border-t border-slate-200 dark:border-slate-800/80 font-mono-code text-xs">
          <div className="bg-slate-50 dark:bg-[#070c14] border border-slate-200 dark:border-slate-800 p-3 rounded-xl shadow-2xs">
            <span className="text-[10px] text-slate-500 block font-semibold">CITYWIDE AQI</span>
            <span className="text-xl font-bold font-hud text-emerald-700 dark:text-emerald-400">
              {metrics.environment.aqi}
            </span>
          </div>
          <div className="bg-slate-50 dark:bg-[#070c14] border border-slate-200 dark:border-slate-800 p-3 rounded-xl shadow-2xs">
            <span className="text-[10px] text-slate-500 block font-semibold">FINE PM2.5</span>
            <span className="text-xl font-bold font-hud text-cyan-800 dark:text-cyan-300">
              {metrics.environment.pm2_5} <span className="text-[10px] text-slate-400 font-normal">µg/m³</span>
            </span>
          </div>
          <div className="bg-slate-50 dark:bg-[#070c14] border border-slate-200 dark:border-slate-800 p-3 rounded-xl shadow-2xs">
            <span className="text-[10px] text-slate-500 block font-semibold">COARSE PM10</span>
            <span className="text-xl font-bold font-hud text-cyan-800 dark:text-cyan-300">
              {metrics.environment.pm10} <span className="text-[10px] text-slate-400 font-normal">µg/m³</span>
            </span>
          </div>
          <div className="bg-slate-50 dark:bg-[#070c14] border border-slate-200 dark:border-slate-800 p-3 rounded-xl shadow-2xs">
            <span className="text-[10px] text-slate-500 block font-semibold">TEMPERATURE</span>
            <span className="text-xl font-bold font-hud text-amber-700 dark:text-amber-300 flex items-center gap-1">
              <Thermometer className="w-4 h-4 text-amber-600" />
              {metrics.environment.temp_c}°C
            </span>
          </div>
          <div className="bg-slate-50 dark:bg-[#070c14] border border-slate-200 dark:border-slate-800 p-3 rounded-xl shadow-2xs">
            <span className="text-[10px] text-slate-500 block font-semibold">HUMIDITY</span>
            <span className="text-xl font-bold font-hud text-blue-700 dark:text-blue-300 flex items-center gap-1">
              <Droplets className="w-4 h-4 text-blue-600" />
              {metrics.environment.humidity_pct}%
            </span>
          </div>
          <div className="bg-slate-50 dark:bg-[#070c14] border border-slate-200 dark:border-slate-800 p-3 rounded-xl shadow-2xs">
            <span className="text-[10px] text-slate-500 block font-semibold">NOISE POLLUTION</span>
            <span className="text-xl font-bold font-hud text-purple-700 dark:text-purple-300 flex items-center gap-1">
              <Volume2 className="w-4 h-4 text-purple-600" />
              {metrics.environment.noise_db} dB
            </span>
          </div>
        </div>
      </div>

      {/* Zone-by-Zone AQI Comparison Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="hud-panel p-5 rounded-2xl lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-hud text-sm font-semibold text-slate-900 dark:text-white tracking-wide">
                Vijayawada Sector Air Quality Index Comparison
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono-code">
                Auto Nagar industrial readings vs Krishna riverfront ecological baseline
              </p>
            </div>
            <span className="text-xs font-mono-code text-cyan-700 dark:text-cyan-400 font-semibold">
              SAFE THRESHOLD: &lt;100 AQI
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={zoneAqiData}>
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} fontFamily="JetBrains Mono" />
                <YAxis stroke="#94a3b8" fontSize={11} domain={[0, 120]} fontFamily="JetBrains Mono" />
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
                <Bar dataKey="aqi" radius={[6, 6, 0, 0]} name="AQI Reading">
                  {zoneAqiData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getAqiColor(entry.aqi)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Configurable Alert Threshold Tester */}
        <div className="hud-panel p-5 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-cyan-700 dark:text-cyan-400 mb-2">
              <Gauge className="w-4 h-4" />
              <h3 className="font-hud text-sm font-bold text-slate-900 dark:text-white tracking-wide">
                Configurable Health Thresholds
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 font-mono-code">
              Simulate automated VMC municipal advisory broadcast when particulate levels peak.
            </p>

            <div className="space-y-4 font-mono-code text-xs">
              <div>
                <div className="flex justify-between text-slate-700 dark:text-slate-300 mb-1 font-semibold">
                  <span>AQI Alert Trigger:</span>
                  <span className="text-amber-600 dark:text-amber-400 font-bold">{aqiThreshold} AQI</span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="160"
                  step="5"
                  value={aqiThreshold}
                  onChange={(e) => setAqiThreshold(parseInt(e.target.value))}
                  className="w-full accent-emerald-600 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#070c14] border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Current Reading:</span>
                  <span className="text-slate-900 dark:text-white font-bold">{metrics.environment.aqi} AQI</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Trigger Status:</span>
                  <span
                    className={
                      metrics.environment.aqi > aqiThreshold
                        ? 'text-rose-600 dark:text-rose-400 font-bold'
                        : 'text-emerald-700 dark:text-emerald-400 font-bold'
                    }
                  >
                    {metrics.environment.aqi > aqiThreshold ? 'THRESHOLD VIOLATED' : 'WITHIN SAFE LIMITS'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {metrics.environment.aqi > aqiThreshold ? (
            <div className="p-3 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 rounded-xl text-rose-800 dark:text-rose-300 text-[11px] font-mono-code flex items-start gap-2 mt-4 shadow-2xs">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
              <span>
                VMC Public Advisory: High particulate density in Auto Nagar. Sensitive groups advised to wear protective masks.
              </span>
            </div>
          ) : (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 rounded-xl text-emerald-800 dark:text-emerald-300 text-[11px] font-mono-code flex items-start gap-2 mt-4 shadow-2xs">
              <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
              <span>Vijayawada ambient air quality complies with municipal health bylaws.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
