import React, { useState } from 'react';
import {
  Trash2,
  Truck,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Leaf,
  Battery,
  Thermometer,
  Sparkles,
} from 'lucide-react';
import { useCityData } from '../context/CityDataContext';
import { CityAIPredictionEngine } from '../services/aiPredictionEngine';

export const WasteDashboard: React.FC = () => {
  const { smartBins, emptyBin, dispatchBinFleet } = useCityData();
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('all');

  // Compute TSP optimized route across high-priority bins in Vijayawada
  const optimization = CityAIPredictionEngine.optimizeWasteRoutes({
    bins: smartBins.map((b) => ({
      id: b.id,
      district: b.district,
      fillPct: b.fillPct,
      lat: b.coordinates[0],
      lng: b.coordinates[1],
      priorityScore: b.priorityScore,
    })),
  });

  const filteredBins =
    selectedTypeFilter === 'all'
      ? smartBins
      : smartBins.filter((b) => b.type.toLowerCase() === selectedTypeFilter.toLowerCase());

  const getStatusBadge = (status: string, fill: number) => {
    if (fill >= 90) {
      return (
        <span className="text-[10px] font-mono-code px-2 py-0.5 rounded-full font-bold bg-rose-100 text-rose-700 border border-rose-300 dark:bg-rose-500/20 dark:text-rose-300 dark:border-rose-500/40 animate-pulse">
          OVERFLOW HAZARD
        </span>
      );
    }
    if (fill >= 70) {
      return (
        <span className="text-[10px] font-mono-code px-2 py-0.5 rounded-full font-bold bg-amber-100 text-amber-700 border border-amber-300 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/40">
          PICKUP REQUIRED
        </span>
      );
    }
    return (
      <span className="text-[10px] font-mono-code px-2 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-700 border border-emerald-300 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/40">
        NORMAL CAPACITY
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Top TSP Optimization HUD Banner */}
      <div className="hud-panel p-5 rounded-2xl border-l-4 border-l-purple-600 dark:border-l-purple-500">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-500/30">
                <Truck className="w-4 h-4 animate-bounce" />
              </span>
              <h2 className="font-hud font-bold text-slate-900 dark:text-white text-base md:text-lg tracking-wide">
                Vijayawada Smart Waste Logistics & TSP Route Optimization
              </h2>
              <span className="bg-purple-100 dark:bg-purple-500/20 text-purple-800 dark:text-purple-300 text-[10px] px-2 py-0.5 rounded-full font-mono-code font-bold border border-purple-200 dark:border-purple-500/30">
                NEAREST-NEIGHBOR SOLVER
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-mono-code">
              VMC dynamic solid waste routing prioritizing One Town flower markets & PNBS bus station compactors.
            </p>
          </div>

          <button
            onClick={dispatchBinFleet}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold font-mono-code rounded-xl transition-all shadow-sm text-xs cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            DISPATCH VMC FLEET ({optimization.urgentPickupsCount} BINS)
          </button>
        </div>

        {/* TSP Metrics Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-slate-200 dark:border-slate-800/80 font-mono-code text-xs">
          <div className="bg-slate-50 dark:bg-[#070c14] border border-slate-200 dark:border-slate-800 p-3 rounded-xl shadow-2xs">
            <span className="text-[10px] text-slate-500 block font-semibold">OPTIMIZED DISTANCE</span>
            <span className="text-sm font-bold text-purple-700 dark:text-purple-400">
              {optimization.totalDistanceKm} km
            </span>
          </div>
          <div className="bg-slate-50 dark:bg-[#070c14] border border-slate-200 dark:border-slate-800 p-3 rounded-xl shadow-2xs">
            <span className="text-[10px] text-slate-500 block font-semibold">ESTIMATED CYCLE</span>
            <span className="text-sm font-bold text-cyan-700 dark:text-cyan-400">
              {optimization.estimatedTimeMin} mins
            </span>
          </div>
          <div className="bg-slate-50 dark:bg-[#070c14] border border-slate-200 dark:border-slate-800 p-3 rounded-xl shadow-2xs">
            <span className="text-[10px] text-slate-500 block font-semibold">DIESEL SAVED</span>
            <span className="text-sm font-bold text-emerald-700 dark:text-emerald-400">
              {optimization.fuelSavedLiters} L
            </span>
          </div>
          <div className="bg-slate-50 dark:bg-[#070c14] border border-slate-200 dark:border-slate-800 p-3 rounded-xl shadow-2xs">
            <span className="text-[10px] text-slate-500 block font-semibold">CO2 MITIGATION</span>
            <span className="text-sm font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
              <Leaf className="w-3.5 h-3.5" /> {optimization.co2PreventedKg} kg
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Overview */}
      <div className="flex flex-wrap items-center justify-between gap-3 font-mono-code text-xs">
        <div className="flex items-center gap-2">
          <span className="text-slate-600 dark:text-slate-400 font-semibold">Filter Waste Stream:</span>
          {['all', 'General', 'Recyclable', 'Organic', 'Hazardous'].map((stream) => (
            <button
              key={stream}
              onClick={() => setSelectedTypeFilter(stream)}
              className={`px-3 py-1 rounded-lg transition-all capitalize font-medium ${
                selectedTypeFilter.toLowerCase() === stream.toLowerCase()
                  ? 'bg-purple-600 text-white font-bold shadow-xs'
                  : 'bg-white dark:bg-[#0b1322] border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              {stream}
            </button>
          ))}
        </div>

        <div className="text-slate-600 dark:text-slate-400">
          Showing <span className="text-slate-900 dark:text-white font-bold">{filteredBins.length}</span> Smart Compactors
        </div>
      </div>

      {/* Smart Bins Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBins.map((bin) => {
          const isCritical = bin.fillPct >= 90;
          const isWarning = bin.fillPct >= 70 && bin.fillPct < 90;

          return (
            <div
              key={bin.id}
              className={`hud-panel p-4 rounded-2xl flex flex-col justify-between border transition-all ${
                isCritical
                  ? 'border-rose-400 dark:border-rose-500/50 shadow-md shadow-rose-500/5'
                  : isWarning
                  ? 'border-amber-300 dark:border-amber-500/40'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono-code font-bold text-cyan-700 dark:text-cyan-400">
                    {bin.id}
                  </span>
                  {getStatusBadge(bin.status, bin.fillPct)}
                </div>

                <h4 className="text-slate-900 dark:text-white font-semibold text-sm mb-1">{bin.location}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-mono-code mb-3">
                  District: {bin.district} • Stream: {bin.type}
                </p>

                {/* Fill Percentage Progress Bar */}
                <div className="space-y-1 mb-4 font-mono-code text-xs">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-500">Ultrasound Fill Level:</span>
                    <span
                      className={`font-bold ${
                        isCritical
                          ? 'text-rose-600 dark:text-rose-400'
                          : isWarning
                          ? 'text-amber-600 dark:text-amber-400'
                          : 'text-emerald-600 dark:text-emerald-400'
                      }`}
                    >
                      {bin.fillPct}% ({Math.round(bin.capacityLiters * (bin.fillPct / 100))}L)
                    </span>
                  </div>

                  <div className="w-full bg-slate-100 dark:bg-[#070c14] rounded-full h-2.5 overflow-hidden border border-slate-200 dark:border-slate-800">
                    <div
                      className={`h-full transition-all duration-500 rounded-full ${
                        isCritical
                          ? 'bg-rose-500'
                          : isWarning
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                      }`}
                      style={{ width: `${bin.fillPct}%` }}
                    />
                  </div>
                </div>

                {/* Telemetry Micro Indicators */}
                <div className="grid grid-cols-3 gap-2 bg-slate-50 dark:bg-[#070c14] border border-slate-200 dark:border-slate-800 p-2 rounded-xl text-[10px] font-mono-code text-slate-500 mb-3">
                  <div className="flex items-center gap-1">
                    <Battery className="w-3 h-3 text-cyan-600" />
                    <span>{bin.batteryPct}% Bat</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Thermometer className="w-3 h-3 text-amber-600" />
                    <span>{bin.temperatureC}°C</span>
                  </div>
                  <div className="truncate">
                    <span>{bin.lastEmptied}</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between font-mono-code text-xs">
                <span className="text-slate-500 text-[11px]">Priority: {bin.priorityScore}/100</span>
                <button
                  onClick={() => emptyBin(bin.id)}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-[#0b1322] border border-slate-200 dark:border-slate-700 hover:border-cyan-500 text-slate-700 dark:text-slate-300 hover:text-cyan-700 transition-colors flex items-center gap-1 text-[11px]"
                >
                  <RotateCcw className="w-3 h-3" />
                  Empty Bin
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
