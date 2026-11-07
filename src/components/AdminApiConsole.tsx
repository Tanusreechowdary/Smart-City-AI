import React, { useState } from 'react';
import {
  Terminal,
  Download,
  Play,
  Copy,
  Check,
  Cpu,
  FileSpreadsheet,
} from 'lucide-react';
import { useCityData } from '../context/CityDataContext';

interface ApiEndpoint {
  method: 'GET' | 'POST';
  path: string;
  description: string;
  params?: string;
  sampleBody?: string;
  response: any;
}

export const AdminApiConsole: React.FC = () => {
  const { metrics, mapNodes, streetlights, smartBins, complaints, alerts } = useCityData();
  const [selectedEndpoint, setSelectedEndpoint] = useState<number>(0);
  const [apiResponse, setApiResponse] = useState<string>('');
  const [copiedCurl, setCopiedCurl] = useState<boolean>(false);
  const [activeSubTab, setActiveSubTab] = useState<'api_explorer' | 'sensor_audit' | 'export'>(
    'api_explorer'
  );

  const apiEndpoints: ApiEndpoint[] = [
    {
      method: 'GET',
      path: '/api/dashboard/overview',
      description: 'Fetch aggregate Vijayawada smart city KPIs across Benz Circle traffic, Prakasam Barrage, AQI, and VMC waste.',
      response: metrics,
    },
    {
      method: 'GET',
      path: '/api/dashboard/nodes',
      description: 'Retrieve real-time geospatial IoT digital twin node telemetry across Vijayawada coordinates.',
      response: mapNodes,
    },
    {
      method: 'GET',
      path: '/api/traffic/forecast',
      params: '?hour=18&zone=benz_circle&weather=clear',
      description: 'Run Scikit-learn Ridge regression model to forecast Benz Circle congestion density at +30m and +60m.',
      response: {
        location: 'Benz Circle Flyover, Vijayawada',
        predicted_density_30m: 88.4,
        predicted_density_60m: 82.1,
        confidence_score: 0.942,
        methodology: 'Ridge Regression Diurnal Harmonic',
        recommended_reroute: 'Inner Ring Road via Ramavarappadu NH-16 Bypass',
      },
    },
    {
      method: 'GET',
      path: '/api/water/leak-check',
      params: '?pressure_bar=3.18&sector=bhavanipuram',
      description: 'Execute Isolation Forest anomaly detector for Prakasam Barrage distribution trunks.',
      response: {
        sector: 'Bhavanipuram Head Water Works',
        pressure_bar: 3.18,
        anomaly_score: -0.382,
        is_anomaly: true,
        severity: 'WARNING',
        estimated_leak_liters_per_hour: 245,
        recommended_action: 'Throttle SCADA Valve V-04 and dispatch VMC rapid repair team near Rythu Bazaar.',
      },
    },
    {
      method: 'POST',
      path: '/api/energy/streetlights/control',
      description: 'Transmit Zhaga-D4i or NEMA-7 luminaire relay and dimming commands on Bandar Road.',
      sampleBody: JSON.stringify(
        { node_id: 'ZH-VJA-101', district: 'MG Road', is_active: true, brightness_pct: 85 },
        null,
        2
      ),
      response: {
        success: true,
        node_id: 'ZH-VJA-101',
        district: 'MG Road (Bandar Road)',
        is_active: true,
        brightness_pct: 85,
        power_watts: 119,
        timestamp: new Date().toISOString(),
      },
    },
    {
      method: 'POST',
      path: '/api/citizen/complaints',
      description: 'Register a citizen infrastructure grievance into Vijayawada Municipal Corporation queue.',
      sampleBody: JSON.stringify(
        {
          category: 'Pothole',
          location: 'Besant Road Junction near MG Road',
          zone: 'Governorpet',
          description: 'Road surface depression causing traffic slowdown',
          urgency: 'HIGH',
        },
        null,
        2
      ),
      response: {
        success: true,
        ticket_id: 'VMC-4102',
        status: 'PENDING',
        assigned_unit: 'VMC Triage Queue',
      },
    },
  ];

  const handleRunRequest = (endpoint: ApiEndpoint) => {
    setApiResponse(JSON.stringify(endpoint.response, null, 2));
  };

  const getCurlCommand = (endpoint: ApiEndpoint) => {
    const baseUrl = 'http://localhost:3000';
    if (endpoint.method === 'GET') {
      return `curl -X GET "${baseUrl}${endpoint.path}${endpoint.params || ''}" \\\n  -H "Accept: application/json"`;
    }
    return `curl -X POST "${baseUrl}${endpoint.path}" \\\n  -H "Content-Type: application/json" \\\n  -d '${endpoint.sampleBody?.replace(/\n/g, '')}'`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedCurl(true);
    setTimeout(() => setCopiedCurl(false), 2000);
  };

  const exportTelemetryCSV = () => {
    const headers = 'City,Metric,Value,Unit,Status\n';
    const rows = [
      `Vijayawada,Traffic Congestion (Benz Circle),${metrics.traffic.congestion_index},%,Nominal`,
      `Vijayawada,Average Vehicle Speed,${metrics.traffic.average_speed_kmh},km/h,Active`,
      `Vijayawada,Air Quality Index (Auto Nagar),${metrics.environment.aqi},AQI,${metrics.environment.status}`,
      `Vijayawada,Fine Particulate PM2.5,${metrics.environment.pm2_5},ug/m3,Moderate`,
      `Vijayawada,Municipal Grid Load (Gunadala),${metrics.energy.grid_load_mw},MW,Normal`,
      `Vijayawada,Solar Power Supply,${metrics.energy.solar_generation_mw},MW,Optimal`,
      `Vijayawada,Prakasam Barrage Reservoir,${metrics.water.main_reservoir_pct},%,Nominal 12ft`,
      `Vijayawada,Pipeline Pressure,${metrics.water.trunk_pressure_bar},Bar,Scattered`,
      `Vijayawada,Average Compactor Fill,${metrics.waste.average_fill_pct},%,VMC TSP Active`,
    ].join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vijayawada_smart_city_telemetry_${Date.now()}.csv`;
    a.click();
  };

  const currentEndpoint = apiEndpoints[selectedEndpoint];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="hud-panel p-5 rounded-2xl border-l-4 border-l-cyan-600">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-cyan-100 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-500/30">
                <Terminal className="w-5 h-5 animate-pulse" />
              </span>
              <h2 className="font-hud font-bold text-slate-900 dark:text-white text-base md:text-lg tracking-wide">
                VMC Admin Center & REST API Inspector
              </h2>
              <span className="bg-cyan-100 dark:bg-cyan-500/20 text-cyan-800 dark:text-cyan-300 text-[10px] px-2 py-0.5 rounded-full font-mono-code font-bold border border-cyan-200 dark:border-cyan-500/30">
                OPENAPI 3.1 • VIJAYAWADA
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-mono-code">
              Live documentation, interactive cURL execution, municipal CSV reporting, and sensor audits.
            </p>
          </div>

          {/* Sub Navigation */}
          <div className="flex items-center gap-2 font-mono-code text-xs">
            {[
              { id: 'api_explorer', label: 'REST API Explorer', icon: Terminal },
              { id: 'sensor_audit', label: 'IoT Sensor Audit', icon: Cpu },
              { id: 'export', label: 'Data CSV Export', icon: FileSpreadsheet },
            ].map((sub) => {
              const Icon = sub.icon;
              return (
                <button
                  key={sub.id}
                  onClick={() => setActiveSubTab(sub.id as any)}
                  className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all font-medium cursor-pointer ${
                    activeSubTab === sub.id
                      ? 'bg-cyan-600 text-white font-bold shadow-xs'
                      : 'bg-slate-50 dark:bg-[#070c14] border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{sub.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {activeSubTab === 'api_explorer' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Endpoint List Sidebar */}
          <div className="hud-panel p-4 rounded-2xl lg:col-span-1 space-y-2 font-mono-code text-xs">
            <span className="text-[10px] uppercase text-slate-500 tracking-wider font-bold block mb-2">
              Available VMC REST Endpoints
            </span>
            {apiEndpoints.map((ep, idx) => (
              <button
                key={ep.path}
                onClick={() => {
                  setSelectedEndpoint(idx);
                  handleRunRequest(ep);
                }}
                className={`w-full text-left p-2.5 rounded-xl border transition-all flex flex-col gap-1 cursor-pointer ${
                  selectedEndpoint === idx
                    ? 'bg-cyan-50 border-cyan-300 text-cyan-900 dark:bg-cyan-500/15 dark:border-cyan-400/40 dark:text-cyan-300'
                    : 'bg-slate-50 dark:bg-[#070c14] border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${
                      ep.method === 'GET'
                        ? 'bg-blue-100 text-blue-800 border border-blue-200 dark:bg-blue-500/20 dark:text-blue-300'
                        : 'bg-emerald-100 text-emerald-800 border border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-300'
                    }`}
                  >
                    {ep.method}
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white truncate">{ep.path}</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{ep.description}</p>
              </button>
            ))}
          </div>

          {/* Request / Response Workbench */}
          <div className="hud-panel p-5 rounded-2xl lg:col-span-2 space-y-4 font-mono-code text-xs">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                    currentEndpoint.method === 'GET'
                      ? 'bg-blue-100 text-blue-800 border border-blue-200 dark:bg-blue-500/20 dark:text-blue-300'
                      : 'bg-emerald-100 text-emerald-800 border border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-300'
                  }`}
                >
                  {currentEndpoint.method}
                </span>
                <span className="font-bold text-slate-900 dark:text-white text-sm">
                  {currentEndpoint.path}
                  {currentEndpoint.params}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => copyToClipboard(getCurlCommand(currentEndpoint))}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-[#070c14] border border-slate-200 dark:border-slate-700 hover:border-slate-400 text-slate-700 dark:text-slate-300 flex items-center gap-1 text-[11px] cursor-pointer"
                >
                  {copiedCurl ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCurl ? 'Copied' : 'Copy cURL'}</span>
                </button>
                <button
                  onClick={() => handleRunRequest(currentEndpoint)}
                  className="px-3 py-1 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white font-bold flex items-center gap-1 text-[11px] cursor-pointer shadow-xs"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Send Request</span>
                </button>
              </div>
            </div>

            <p className="text-slate-700 dark:text-slate-300">{currentEndpoint.description}</p>

            {/* cURL Snippet */}
            <div>
              <span className="text-slate-500 block mb-1 text-[10px] uppercase font-bold">
                cURL Execution Format:
              </span>
              <pre className="p-3 rounded-xl bg-slate-50 dark:bg-[#070c14] border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-300 overflow-x-auto text-[11px]">
                {getCurlCommand(currentEndpoint)}
              </pre>
            </div>

            {/* Response Output JSON */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-slate-500 text-[10px] uppercase font-bold">
                  JSON Response Payload (200 OK):
                </span>
                <span className="text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">● Status: 200 OK (3ms)</span>
              </div>
              <pre className="p-3.5 rounded-xl bg-slate-900 text-cyan-300 border border-slate-800 overflow-x-auto text-[11px] max-h-72">
                {apiResponse || JSON.stringify(currentEndpoint.response, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'sensor_audit' && (
        <div className="hud-panel p-5 rounded-2xl space-y-4 font-mono-code text-xs">
          <h3 className="font-hud text-sm font-semibold text-slate-900 dark:text-white tracking-wide">
            Vijayawada IoT Edge Sensor Node Registry & Telemetry Availability
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 text-[10px] uppercase">
                  <th className="pb-2">Node ID</th>
                  <th className="pb-2">Type</th>
                  <th className="pb-2">Vijayawada Sector</th>
                  <th className="pb-2">Status</th>
                  <th className="pb-2">Primary Telemetry</th>
                  <th className="pb-2">Last Heartbeat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {mapNodes.map((n) => (
                  <tr key={n.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/40">
                    <td className="py-2.5 font-bold text-cyan-700 dark:text-cyan-400">{n.id}</td>
                    <td className="py-2.5 capitalize text-slate-700 dark:text-slate-300">{n.type}</td>
                    <td className="py-2.5 text-slate-500">{n.zone}</td>
                    <td className="py-2.5">
                      <span
                        className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase border ${
                          n.status === 'critical'
                            ? 'bg-rose-100 text-rose-700 border-rose-300 dark:bg-rose-500/20 dark:text-rose-300'
                            : n.status === 'warning'
                            ? 'bg-amber-100 text-amber-700 border-amber-300 dark:bg-amber-500/20 dark:text-amber-300'
                            : 'bg-emerald-100 text-emerald-700 border-emerald-300 dark:bg-emerald-500/20 dark:text-emerald-300'
                        }`}
                      >
                        {n.status}
                      </span>
                    </td>
                    <td className="py-2.5 text-slate-900 dark:text-white font-semibold">{n.value}</td>
                    <td className="py-2.5 text-slate-500">{n.lastUpdated}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeSubTab === 'export' && (
        <div className="hud-panel p-6 rounded-2xl space-y-4 font-mono-code text-xs">
          <div className="flex items-center gap-2 text-cyan-700 dark:text-cyan-400">
            <FileSpreadsheet className="w-5 h-5" />
            <h3 className="font-hud text-base font-bold text-slate-900 dark:text-white tracking-wide">
              Vijayawada Municipal Data Export Center (CSV / Reports)
            </h3>
          </div>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed max-w-2xl">
            Download comprehensive audit files formatted for statistical analysis in Python (pandas), GIS cartography (QGIS), or VMC municipal archives.
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <button
              onClick={exportTelemetryCSV}
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-xl flex items-center gap-2 transition-all shadow-sm cursor-pointer"
            >
              <Download className="w-4 h-4" />
              Export Vijayawada Telemetry (CSV)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
