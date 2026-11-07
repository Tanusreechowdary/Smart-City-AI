import React, { useState } from 'react';
import {
  Droplets,
  Activity,
  AlertTriangle,
  Power,
  RotateCcw,
} from 'lucide-react';
import { useCityData } from '../context/CityDataContext';
import { CityAIPredictionEngine } from '../services/aiPredictionEngine';

export const WaterDashboard: React.FC = () => {
  const { waterNodes, toggleWaterValve, metrics } = useCityData();

  // Test custom pressure reading against the Isolation Forest anomaly detector
  const [testPressure, setTestPressure] = useState<number>(3.18);
  const [testFlowRate, setTestFlowRate] = useState<number>(188);

  const anomalyResult = CityAIPredictionEngine.detectWaterAnomaly({
    pressureBar: testPressure,
    flowRateLps: testFlowRate,
    vibrationMmS: testPressure < 3.2 ? 4.6 : 1.2,
  });

  return (
    <div className="space-y-6">
      {/* Top SCADA Water Trunk HUD */}
      <div className="hud-panel p-5 rounded-2xl border-l-4 border-l-blue-600 dark:border-l-blue-400">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30">
                <Droplets className="w-4 h-4 animate-bounce" />
              </span>
              <h2 className="font-hud font-bold text-slate-900 dark:text-white text-base md:text-lg tracking-wide">
                Prakasam Barrage SCADA & Krishna River Pipeline Network
              </h2>
              <span className="bg-blue-100 dark:bg-blue-500/20 text-blue-800 dark:text-blue-300 text-[10px] px-2 py-0.5 rounded-full font-mono-code font-bold border border-blue-200 dark:border-blue-500/30">
                ISOLATION FOREST LEAK DETECTION
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-mono-code">
              Monitors Krishna river reservoir level (12.0 ft) and potable distribution trunks to Bhavanipuram, One Town, and Auto Nagar.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono-code bg-slate-50 dark:bg-[#070c14] border border-slate-200 dark:border-slate-800 p-2.5 rounded-xl text-slate-700 dark:text-slate-300">
            <Activity className="w-4 h-4 text-cyan-600" />
            <span>
              TRUNK PRESSURE: <span className="text-cyan-700 dark:text-cyan-400 font-bold">{metrics.water.trunk_pressure_bar} Bar</span>
            </span>
          </div>
        </div>

        {/* Key Metrics Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-slate-200 dark:border-slate-800/80 font-mono-code text-xs">
          <div className="bg-slate-50 dark:bg-[#070c14] border border-slate-200 dark:border-slate-800 p-3 rounded-xl shadow-2xs">
            <span className="text-[10px] text-slate-500 block font-semibold">PRAKASAM BARRAGE RESERVOIR</span>
            <span className="text-xl font-bold font-hud text-blue-700 dark:text-blue-400">
              {metrics.water.main_reservoir_pct}%
            </span>
          </div>
          <div className="bg-slate-50 dark:bg-[#070c14] border border-slate-200 dark:border-slate-800 p-3 rounded-xl shadow-2xs">
            <span className="text-[10px] text-slate-500 block font-semibold">DAILY MUNICIPAL DRAW</span>
            <span className="text-xl font-bold font-hud text-slate-900 dark:text-white">
              {metrics.water.daily_consumption_ml} ML
            </span>
          </div>
          <div className="bg-slate-50 dark:bg-[#070c14] border border-slate-200 dark:border-slate-800 p-3 rounded-xl shadow-2xs">
            <span className="text-[10px] text-slate-500 block font-semibold">PIPELINE INTEGRITY</span>
            <span className="text-xl font-bold font-hud text-emerald-700 dark:text-emerald-400">
              {metrics.water.pipeline_health_pct}%
            </span>
          </div>
          <div className="bg-slate-50 dark:bg-[#070c14] border border-slate-200 dark:border-slate-800 p-3 rounded-xl shadow-2xs">
            <span className="text-[10px] text-slate-500 block font-semibold">ACTIVE LEAKAGE FLAGS</span>
            <span className="text-xl font-bold font-hud text-amber-700 dark:text-amber-400">
              {metrics.water.active_leaks_detected} Alert
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Interactive Pipeline Sectors & Isolation Forest Anomaly Lab */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pipeline Sectors Table & Valve actuation */}
        <div className="hud-panel p-5 rounded-2xl lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-hud text-sm font-semibold text-slate-900 dark:text-white tracking-wide">
                Vijayawada Distribution Sectors & Gate Valve Actuators
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono-code">
                Pneumatic isolation valve control across Krishna River distribution conduits
              </p>
            </div>
            <span className="text-xs font-mono-code text-cyan-700 dark:text-cyan-400 font-semibold">
              NOMINAL: 4.2 Bar
            </span>
          </div>

          <div className="space-y-3 font-mono-code text-xs">
            {waterNodes.map((node) => {
              const isDeviation = node.status !== 'OPTIMAL';
              return (
                <div
                  key={node.id}
                  className={`p-3.5 rounded-xl border flex flex-wrap items-center justify-between gap-3 transition-all ${
                    isDeviation
                      ? 'bg-amber-50 border-amber-300 dark:bg-amber-500/5 dark:border-amber-500/50'
                      : 'bg-slate-50 dark:bg-[#070c14] border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-cyan-700 dark:text-cyan-400">{node.id}</span>
                      <span className="text-slate-900 dark:text-white font-semibold">{node.sector}</span>
                      <span
                        className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold border ${
                          node.status === 'LEAK_DETECTED'
                            ? 'bg-rose-100 text-rose-700 border-rose-300 dark:bg-rose-500/20 dark:text-rose-300'
                            : node.status === 'DEVIATION'
                            ? 'bg-amber-100 text-amber-700 border-amber-300 dark:bg-amber-500/20 dark:text-amber-300'
                            : 'bg-emerald-100 text-emerald-700 border-emerald-300 dark:bg-emerald-500/20 dark:text-emerald-300'
                        }`}
                      >
                        {node.status}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-4 text-[11px] text-slate-500 dark:text-slate-400">
                      <span>
                        Pressure: <strong className="text-slate-800 dark:text-white">{node.pressureBar} Bar</strong>
                      </span>
                      <span>
                        Flow: <strong className="text-slate-800 dark:text-white">{node.flowRateLps} L/s</strong>
                      </span>
                      <span>
                        Acoustic Vibration: <strong className="text-slate-800 dark:text-white">{node.vibrationMmS} mm/s</strong>
                      </span>
                      <span>
                        ML Score: <strong className={isDeviation ? 'text-amber-600' : 'text-emerald-600'}>{node.acousticLeakScore}</strong>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`text-[10px] font-bold ${
                        node.valveOpen ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-500'
                      }`}
                    >
                      {node.valveOpen ? 'GATE OPEN' : 'ISOLATED'}
                    </span>
                    <button
                      onClick={() => toggleWaterValve(node.id)}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                        node.valveOpen
                          ? 'bg-rose-50 border-rose-300 text-rose-700 hover:bg-rose-100 dark:bg-rose-500/15 dark:border-rose-500/40 dark:text-rose-300'
                          : 'bg-emerald-50 border-emerald-300 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-500/15 dark:border-emerald-500/40 dark:text-emerald-300'
                      }`}
                    >
                      <Power className="w-3.5 h-3.5" />
                      {node.valveOpen ? 'Isolate Valve' : 'Open Valve'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Isolation Forest Anomaly Detection Simulator */}
        <div className="hud-panel p-5 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-cyan-700 dark:text-cyan-400 mb-2">
              <Activity className="w-4 h-4 animate-pulse" />
              <h3 className="font-hud text-sm font-bold text-slate-900 dark:text-white tracking-wide">
                Isolation Forest Leak Detector
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 font-mono-code leading-relaxed">
              Real-time statistical outlier isolation calibrated to 4.2 Bar Krishna headworks pressure baseline.
            </p>

            <div className="space-y-4 font-mono-code text-xs">
              <div>
                <div className="flex justify-between text-slate-700 dark:text-slate-300 mb-1 font-semibold">
                  <span>Simulate Bhavanipuram Pressure:</span>
                  <span className="text-cyan-700 dark:text-cyan-400 font-bold">{testPressure.toFixed(2)} Bar</span>
                </div>
                <input
                  type="range"
                  min="1.5"
                  max="5.0"
                  step="0.05"
                  value={testPressure}
                  onChange={(e) => setTestPressure(parseFloat(e.target.value))}
                  className="w-full accent-cyan-600 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
                  <span>1.5 Bar (Burst)</span>
                  <span>4.2 Bar (Nominal)</span>
                  <span>5.0 Bar (High)</span>
                </div>
              </div>

              {/* Anomaly Result Card */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#070c14] border border-slate-200 dark:border-cyan-500/30 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Isolation Score:</span>
                  <span
                    className={`font-hud font-bold text-base ${
                      anomalyResult.anomalyScore < 0 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-700 dark:text-emerald-400'
                    }`}
                  >
                    {anomalyResult.anomalyScore}
                  </span>
                </div>

                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-slate-500">Anomaly Classification:</span>
                  <span
                    className={`px-2 py-0.5 rounded-full font-bold uppercase text-[10px] ${
                      anomalyResult.severity === 'CRITICAL'
                        ? 'bg-rose-100 text-rose-700 border border-rose-300 dark:bg-rose-500/20 dark:text-rose-300'
                        : anomalyResult.severity === 'WARNING'
                        ? 'bg-amber-100 text-amber-700 border border-amber-300 dark:bg-amber-500/20 dark:text-amber-300'
                        : 'bg-emerald-100 text-emerald-700 border border-emerald-300 dark:bg-emerald-500/20 dark:text-emerald-300'
                    }`}
                  >
                    {anomalyResult.severity}
                  </span>
                </div>

                {anomalyResult.estimatedLeakLitersPerHour > 0 && (
                  <div className="flex justify-between items-center text-[11px] pt-1 border-t border-slate-200 dark:border-slate-800">
                    <span className="text-slate-500">Estimated Water Loss:</span>
                    <span className="text-rose-600 dark:text-rose-400 font-bold">
                      ~{anomalyResult.estimatedLeakLitersPerHour} L/hour
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 rounded-xl bg-slate-50 dark:bg-[#070c14] border border-slate-200 dark:border-slate-800 text-[11px] font-mono-code text-slate-700 dark:text-slate-300 shadow-2xs">
            <span className="text-slate-500 block text-[10px] uppercase font-bold text-cyan-700 dark:text-cyan-400">
              VMC SCADA Directive:
            </span>
            <p className="mt-1 text-slate-800 dark:text-slate-200">{anomalyResult.recommendedAction}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
