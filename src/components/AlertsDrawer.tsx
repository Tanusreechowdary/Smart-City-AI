import React from 'react';
import {
  X,
  AlertCircle,
  CheckCircle2,
  MapPin,
} from 'lucide-react';
import { useCityData } from '../context/CityDataContext';

interface AlertsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AlertsDrawer: React.FC<AlertsDrawerProps> = ({ isOpen, onClose }) => {
  const { alerts, acknowledgeAlert } = useCityData();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-md bg-white dark:bg-[#070c14] border-l border-slate-200 dark:border-slate-800 h-full flex flex-col shadow-2xl font-mono-code text-xs">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-[#0b1322]">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-500 animate-pulse" />
            <h3 className="font-hud font-bold text-slate-900 dark:text-white text-sm tracking-wide">
              Vijayawada Incident & Alert Queue
            </h3>
            <span className="text-[10px] bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300 px-2 py-0.5 rounded-full font-bold">
              {alerts.filter((a) => !a.acknowledged).length} ACTIVE
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Alerts List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {alerts.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-emerald-500" />
              <span>All Vijayawada municipal sectors nominal. Zero active alerts.</span>
            </div>
          ) : (
            alerts.map((al) => {
              const isCrit = al.severity === 'CRITICAL';
              const isWarn = al.severity === 'WARNING';

              return (
                <div
                  key={al.id}
                  className={`p-3.5 rounded-2xl border transition-all ${
                    al.acknowledged
                      ? 'bg-slate-50 dark:bg-[#070c14] border-slate-200 dark:border-slate-800/80 opacity-60'
                      : isCrit
                      ? 'bg-rose-50 border-rose-200 dark:bg-rose-500/10 dark:border-rose-500/40 shadow-xs'
                      : isWarn
                      ? 'bg-amber-50 border-amber-200 dark:bg-amber-500/10 dark:border-amber-500/40'
                      : 'bg-cyan-50 border-cyan-200 dark:bg-cyan-500/10 dark:border-cyan-500/30'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-slate-900 dark:text-white">{al.title}</span>
                    <span
                      className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase border ${
                        isCrit
                          ? 'bg-rose-100 text-rose-700 border-rose-300 dark:bg-rose-500/20 dark:text-rose-300'
                          : isWarn
                          ? 'bg-amber-100 text-amber-700 border-amber-300 dark:bg-amber-500/20 dark:text-amber-300'
                          : 'bg-cyan-100 text-cyan-800 border-cyan-300 dark:bg-cyan-500/20 dark:text-cyan-300'
                      }`}
                    >
                      {al.severity}
                    </span>
                  </div>

                  <p className="text-slate-700 dark:text-slate-300 text-xs leading-relaxed mb-2.5">{al.message}</p>

                  <div className="flex items-center justify-between text-[10px] text-slate-500 pt-2 border-t border-slate-200 dark:border-slate-800">
                    <span className="flex items-center gap-1 font-medium">
                      <MapPin className="w-3 h-3 text-cyan-600 dark:text-cyan-400" />
                      {al.zone}
                    </span>
                    <div className="flex items-center gap-2">
                      <span>{al.timestamp}</span>
                      {!al.acknowledged ? (
                        <button
                          onClick={() => acknowledgeAlert(al.id)}
                          className="px-2 py-0.5 bg-white dark:bg-slate-800 hover:bg-slate-100 text-cyan-700 dark:text-cyan-300 rounded border border-slate-200 dark:border-slate-700 transition-colors font-bold shadow-2xs"
                        >
                          Acknowledge
                        </button>
                      ) : (
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold">✓ Resolved</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
