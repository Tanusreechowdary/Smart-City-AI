import React, { useState } from 'react';
import {
  Leaf,
  Car,
  FileText,
  Bus,
  Recycle,
  MapPin,
  Plus,
  Minus,
  ArrowRight,
  TrendingDown,
  Clock,
  ClipboardList,
  CalendarDays,
  CreditCard,
  Search,
  Headphones,
  Home,
  MoreHorizontal,
  CheckCircle2,
  AlertTriangle,
  X,
  ExternalLink,
  Globe,
} from 'lucide-react';
import { useCityData } from '../context/CityDataContext';
import { DashboardMiniMap } from './DashboardMiniMap';

interface MainOverviewProps {
  onNavigateTab: (tab: string) => void;
}

export const MainOverview: React.FC<MainOverviewProps> = ({ onNavigateTab }) => {
  const { metrics, addComplaint } = useCityData();

  // Map view toggle: 'interactive' (Live Leaflet with street/house zoom across AP) or 'pictorial' (exact screenshot illustration)
  const [overviewMapMode, setOverviewMapMode] = useState<'interactive' | 'pictorial'>('interactive');

  // Active pin modal/tooltip state
  const [activePin, setActivePin] = useState<string | null>(null);
  const [activePinDetailText, setActivePinDetailText] = useState<string | null>(null);

  // Quick Service Modals
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [modalSuccessMsg, setModalSuccessMsg] = useState<string | null>(null);

  // Form states
  const [complaintText, setComplaintText] = useState('');
  const [complaintCategory, setComplaintCategory] = useState<
    'Streetlight' | 'Overflowing Bin' | 'Traffic Hazard' | 'Water Leak'
  >('Streetlight');
  const [complaintLocation, setComplaintLocation] = useState('Benz Circle, Sector 5');

  const handleRegisterComplaint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!complaintText) return;
    addComplaint({
      category: complaintCategory,
      location: complaintLocation,
      zone: 'Benz Circle',
      description: complaintText,
      urgency: 'MEDIUM',
      reporterName: 'Tanusree Chowdary',
    });
    setModalSuccessMsg('Complaint registered successfully! Ticket ID generated.');
    setTimeout(() => {
      setActiveModal(null);
      setModalSuccessMsg(null);
      setComplaintText('');
    }, 1500);
  };

  return (
    <div className="space-y-4 max-w-[1440px] mx-auto font-sans pb-8">
      {/* 1. Welcome Hero Banner */}
      <div className="rounded-2xl overflow-hidden shadow-xs border border-slate-100 bg-[#082e56] relative">
        <img
          src="/assets/dashboard_hero_banner.png"
          alt="Welcome to Smart City Dashboard - Connected People, Sustainable Environment, Better Tomorrow"
          className="w-full h-auto object-cover max-h-[195px] select-none block"
        />
      </div>

      {/* 2. Top Five Summary/KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {/* Card 1: Air Quality */}
        <div
          onClick={() => onNavigateTab('environment')}
          className="bg-white rounded-2xl p-4 border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-md transition-all flex items-center gap-3.5 cursor-pointer group"
        >
          <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
            <Leaf className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-slate-700">Air Quality</p>
            <p className="text-sm font-bold text-emerald-600 mt-0.5">Good</p>
            <p className="text-xs font-semibold text-emerald-700">AQI {metrics.environment.aqi || 42}</p>
          </div>
        </div>

        {/* Card 2: Traffic Status */}
        <div
          onClick={() => onNavigateTab('traffic')}
          className="bg-white rounded-2xl p-4 border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-md transition-all flex items-center gap-3.5 cursor-pointer group"
        >
          <div className="w-12 h-12 rounded-full bg-[#5c70e2] text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
            <Car className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-slate-700">Traffic Status</p>
            <p className="text-sm font-bold text-blue-600 mt-0.5">Normal</p>
            <p className="text-xs font-medium text-slate-500 truncate">
              Avg. Speed {Math.round(metrics.traffic.average_speed_kmh || 42)} km/h
            </p>
          </div>
        </div>

        {/* Card 3: Pending Complaints */}
        <div
          onClick={() => onNavigateTab('citizen')}
          className="bg-white rounded-2xl p-4 border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-md transition-all flex items-center gap-3.5 cursor-pointer group"
        >
          <div className="w-12 h-12 rounded-full bg-[#f97316] text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
            <FileText className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-slate-700">Pending Complaints</p>
            <p className="text-lg font-bold text-slate-800 leading-tight mt-0.5">12</p>
            <p className="text-xs font-normal text-slate-400">(out of 48)</p>
          </div>
        </div>

        {/* Card 4: Public Transport */}
        <div
          onClick={() => onNavigateTab('traffic')}
          className="bg-white rounded-2xl p-4 border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-md transition-all flex items-center gap-3.5 cursor-pointer group"
        >
          <div className="w-12 h-12 rounded-full bg-[#0ea5e9] text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
            <Bus className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-slate-700">Public Transport</p>
            <p className="text-sm font-bold text-blue-600 mt-0.5">On Time</p>
            <p className="text-xs font-medium text-slate-500">98% Schedule Adherence</p>
          </div>
        </div>

        {/* Card 5: Waste Collection */}
        <div
          onClick={() => onNavigateTab('waste')}
          className="bg-white rounded-2xl p-4 border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-md transition-all flex items-center gap-3.5 cursor-pointer group"
        >
          <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
            <Recycle className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-slate-700">Waste Collection</p>
            <p className="text-sm font-bold text-emerald-600 mt-0.5">Completed</p>
            <p className="text-xs font-normal text-slate-400">Today</p>
          </div>
        </div>
      </div>

      {/* 3. Main Dashboard Grid: Left Column & Right Column */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* LEFT COLUMN: Map Overview + Quick Services (approx 7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* City Map Overview Card */}
          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.03)] relative">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#0a4d8c]" />
                <div>
                  <h3 className="text-sm font-bold text-[#0a3866] tracking-tight">City Map Overview</h3>
                  <span className="text-[10px] text-slate-500 font-medium">Andhra Pradesh Statewide GIS</span>
                </div>
              </div>

              {/* View Switcher: Live AP Map vs Stylized Riverfront */}
              <div className="flex items-center gap-2">
                <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-[10px] font-semibold">
                  <button
                    onClick={() => setOverviewMapMode('interactive')}
                    className={`px-2 py-1 rounded-md transition-all cursor-pointer ${
                      overviewMapMode === 'interactive'
                        ? 'bg-white text-[#1366d9] shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Live AP Map
                  </button>
                  <button
                    onClick={() => setOverviewMapMode('pictorial')}
                    className={`px-2 py-1 rounded-md transition-all cursor-pointer ${
                      overviewMapMode === 'pictorial'
                        ? 'bg-white text-[#1366d9] shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Riverfront View
                  </button>
                </div>

                <button
                  onClick={() => onNavigateTab('city-map')}
                  className="text-xs font-semibold text-[#1366d9] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Full Map</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Map Canvas: Interactive Andhra Pradesh Map OR Stylized Riverfront Hotspots */}
            {overviewMapMode === 'interactive' ? (
              <DashboardMiniMap
                onNavigateFullMap={() => onNavigateTab('city-map')}
                onSelectPinInfo={(info) => {
                  setActivePinDetailText(info);
                  setActivePin('custom');
                }}
              />
            ) : (
              <div className="relative rounded-xl overflow-hidden border border-slate-100 select-none bg-slate-50">
                <img
                  src="/assets/dashboard_map_canvas.png"
                  alt="Vijayawada Krishna Riverfront City Map"
                  className="w-full h-auto object-cover block"
                />

                {/* Clickable hotspot overlays corresponding to pins in image */}
                {/* Air Quality Station Pin */}
                <button
                  onClick={() => {
                    setActivePin('aqi');
                    setActivePinDetailText(null);
                  }}
                  title="Air Quality Station: Benz Circle"
                  className="absolute top-[8%] left-[29%] w-[25%] h-[15%] cursor-pointer hover:ring-2 hover:ring-emerald-400 rounded-full transition-all opacity-0 hover:opacity-20 bg-emerald-500"
                />

                {/* Bus Stop Pin */}
                <button
                  onClick={() => {
                    setActivePin('bus');
                    setActivePinDetailText(null);
                  }}
                  title="Bus Stop: PNBS Central Terminal"
                  className="absolute top-[22%] right-[18%] w-[22%] h-[15%] cursor-pointer hover:ring-2 hover:ring-blue-400 rounded-full transition-all opacity-0 hover:opacity-20 bg-blue-500"
                />

                {/* Traffic Alert Pin */}
                <button
                  onClick={() => {
                    setActivePin('traffic');
                    setActivePinDetailText(null);
                  }}
                  title="Traffic Alert: Prakasam Barrage Bridge"
                  className="absolute top-[52%] left-[18%] w-[25%] h-[15%] cursor-pointer hover:ring-2 hover:ring-rose-400 rounded-full transition-all opacity-0 hover:opacity-20 bg-rose-500"
                />

                {/* Waste Bin Pin */}
                <button
                  onClick={() => {
                    setActivePin('waste1');
                    setActivePinDetailText(null);
                  }}
                  title="Smart Bin: Governorpet Market"
                  className="absolute bottom-[14%] left-[28%] w-[22%] h-[15%] cursor-pointer hover:ring-2 hover:ring-amber-400 rounded-full transition-all opacity-0 hover:opacity-20 bg-amber-500"
                />

                {/* Public Facility Pin */}
                <button
                  onClick={() => {
                    setActivePin('facility');
                    setActivePinDetailText(null);
                  }}
                  title="Public Facility: VMC Civic Center"
                  className="absolute bottom-[20%] right-[18%] w-[26%] h-[15%] cursor-pointer hover:ring-2 hover:ring-blue-400 rounded-full transition-all opacity-0 hover:opacity-20 bg-blue-500"
                />

                {/* Zoom Controls */}
                <div className="absolute top-2.5 right-2.5 flex flex-col bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                  <button
                    onClick={() => onNavigateTab('city-map')}
                    className="p-1.5 hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
                    title="Zoom in"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                  <div className="border-t border-slate-200" />
                  <button
                    onClick={() => onNavigateTab('city-map')}
                    className="p-1.5 hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
                    title="Zoom out"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* Selected Pin Popover Detail */}
            {(activePin || activePinDetailText) && (
              <div className="mt-3 p-3 rounded-xl bg-blue-50/80 border border-blue-200 flex items-center justify-between animate-in fade-in">
                <div className="text-xs text-slate-700">
                  {activePinDetailText ? (
                    <p className="font-medium text-slate-900">{activePinDetailText}</p>
                  ) : (
                    <>
                      {activePin === 'aqi' && (
                        <p>
                          🌿 <span className="font-bold text-slate-900">Air Quality Monitoring Station</span>: Benz Circle. Real-time AQI 42 (Good), PM2.5: 14 µg/m³.
                        </p>
                      )}
                      {activePin === 'bus' && (
                        <p>
                          🚌 <span className="font-bold text-slate-900">Bus Stop Node</span>: PNBS Inter-City Bus Terminal. 6 arrivals in next 10 mins.
                        </p>
                      )}
                      {activePin === 'traffic' && (
                        <p>
                          🚨 <span className="font-bold text-slate-900">Traffic Congestion Alert</span>: Prakasam Barrage roadwork. Flow speed 22 km/h.
                        </p>
                      )}
                      {activePin === 'waste1' && (
                        <p>
                          🗑️ <span className="font-bold text-slate-900">Smart Waste Bin #04</span>: Governorpet Commercial Area. Fill level: 48%. Next collection 14:00.
                        </p>
                      )}
                      {activePin === 'facility' && (
                        <p>
                          🏢 <span className="font-bold text-slate-900">Public Facility</span>: VMC Citizen Service Center. Open till 18:00 IST.
                        </p>
                      )}
                    </>
                  )}
                </div>
                <button
                  onClick={() => {
                    setActivePin(null);
                    setActivePinDetailText(null);
                  }}
                  className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Quick Services Grid */}
          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.03)]">
            <h3 className="text-sm font-bold text-[#0a3866] mb-3.5 tracking-tight">Quick Services</h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* Tile 1: Register Complaint */}
              <button
                onClick={() => setActiveModal('complaint')}
                className="p-3.5 rounded-xl bg-slate-50/70 hover:bg-blue-50/60 border border-slate-100 hover:border-blue-200 transition-all flex flex-col items-center justify-center text-center group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#1366d9] flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                  <ClipboardList className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold text-slate-700 group-hover:text-[#1366d9] transition-colors leading-tight">
                  Register Complaint
                </span>
              </button>

              {/* Tile 2: Book Appointment */}
              <button
                onClick={() => setActiveModal('appointment')}
                className="p-3.5 rounded-xl bg-slate-50/70 hover:bg-cyan-50/60 border border-slate-100 hover:border-cyan-200 transition-all flex flex-col items-center justify-center text-center group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-cyan-100 text-cyan-600 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                  <CalendarDays className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold text-slate-700 group-hover:text-cyan-700 transition-colors leading-tight">
                  Book Appointment
                </span>
              </button>

              {/* Tile 3: Pay Bills */}
              <button
                onClick={() => setActiveModal('bills')}
                className="p-3.5 rounded-xl bg-slate-50/70 hover:bg-indigo-50/60 border border-slate-100 hover:border-indigo-200 transition-all flex flex-col items-center justify-center text-center group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                  <CreditCard className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold text-slate-700 group-hover:text-indigo-700 transition-colors leading-tight">
                  Pay Bills
                </span>
              </button>

              {/* Tile 4: Apply for Certificate */}
              <button
                onClick={() => setActiveModal('certificate')}
                className="p-3.5 rounded-xl bg-slate-50/70 hover:bg-sky-50/60 border border-slate-100 hover:border-sky-200 transition-all flex flex-col items-center justify-center text-center group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                  <FileText className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold text-slate-700 group-hover:text-sky-700 transition-colors leading-tight">
                  Apply for Certificate
                </span>
              </button>

              {/* Tile 5: Track Application */}
              <button
                onClick={() => setActiveModal('track')}
                className="p-3.5 rounded-xl bg-slate-50/70 hover:bg-emerald-50/60 border border-slate-100 hover:border-emerald-200 transition-all flex flex-col items-center justify-center text-center group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                  <Search className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold text-slate-700 group-hover:text-emerald-700 transition-colors leading-tight">
                  Track Application
                </span>
              </button>

              {/* Tile 6: Grievance Redressal */}
              <button
                onClick={() => onNavigateTab('citizen')}
                className="p-3.5 rounded-xl bg-slate-50/70 hover:bg-purple-50/60 border border-slate-100 hover:border-purple-200 transition-all flex flex-col items-center justify-center text-center group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                  <Headphones className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold text-slate-700 group-hover:text-purple-700 transition-colors leading-tight">
                  Grievance Redressal
                </span>
              </button>

              {/* Tile 7: Property Tax */}
              <button
                onClick={() => setActiveModal('tax')}
                className="p-3.5 rounded-xl bg-slate-50/70 hover:bg-amber-50/60 border border-slate-100 hover:border-amber-200 transition-all flex flex-col items-center justify-center text-center group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                  <Home className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold text-slate-700 group-hover:text-amber-700 transition-colors leading-tight">
                  Property Tax
                </span>
              </button>

              {/* Tile 8: More Services */}
              <button
                onClick={() => onNavigateTab('services')}
                className="p-3.5 rounded-xl bg-slate-50/70 hover:bg-blue-50/60 border border-slate-100 hover:border-blue-200 transition-all flex flex-col items-center justify-center text-center group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-200 text-slate-600 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                  <MoreHorizontal className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold text-slate-700 group-hover:text-[#1366d9] transition-colors leading-tight">
                  More Services
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Environmental Data, Recent Activity, Energy, Promo (approx 5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Card A: Environmental Data */}
          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.03)]">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5">
                <Leaf className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-bold text-[#0a3866] tracking-tight">Environmental Data</h3>
              </div>
              <button
                onClick={() => onNavigateTab('environment')}
                className="text-xs font-semibold text-[#1366d9] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>View Details</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Air Quality Index (AQI) Line Chart */}
            <div className="mb-4">
              <div className="flex items-center gap-1 text-xs text-slate-600 mb-2 font-medium">
                <MapPin className="w-3.5 h-3.5 text-[#0a4d8c]" />
                <span>Air Quality Index (AQI)</span>
              </div>

              {/* Smooth Area/Line Chart */}
              <div className="h-28 w-full relative">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 320 80">
                  <defs>
                    <linearGradient id="aqiGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal Grid lines */}
                  <line x1="20" y1="10" x2="310" y2="10" stroke="#f1f5f9" strokeWidth="1" />
                  <line x1="20" y1="40" x2="310" y2="40" stroke="#f1f5f9" strokeWidth="1" />
                  <line x1="20" y1="70" x2="310" y2="70" stroke="#f1f5f9" strokeWidth="1" />

                  {/* Y Axis labels */}
                  <text x="5" y="14" fontSize="8" fill="#94a3b8" fontFamily="sans-serif">200</text>
                  <text x="5" y="44" fontSize="8" fill="#94a3b8" fontFamily="sans-serif">100</text>
                  <text x="10" y="74" fontSize="8" fill="#94a3b8" fontFamily="sans-serif">0</text>

                  {/* Shaded Area */}
                  <polygon
                    points="30,50 72,52 114,40 156,42 198,46 240,43 282,36 282,70 30,70"
                    fill="url(#aqiGrad)"
                  />

                  {/* The Green Trend Line */}
                  <polyline
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points="30,50 72,52 114,40 156,42 198,46 240,43 282,36"
                  />

                  {/* Data Point Dots */}
                  {[
                    [30, 50],
                    [72, 52],
                    [114, 40],
                    [156, 42],
                    [198, 46],
                    [240, 43],
                    [282, 36],
                  ].map(([cx, cy], i) => (
                    <circle key={i} cx={cx} cy={cy} r="2.8" fill="#10b981" stroke="#ffffff" strokeWidth="1.5" />
                  ))}
                </svg>

                {/* X Axis Date Labels matching screenshot */}
                <div className="flex justify-between text-[9px] text-slate-400 font-medium px-4 mt-0.5">
                  <span>20 Oct</span>
                  <span>21 Oct</span>
                  <span>22 Oct</span>
                  <span>23 Oct</span>
                  <span>24 Oct</span>
                  <span>25 Oct</span>
                  <span>26 Oct</span>
                </div>
              </div>
            </div>

            {/* Waste Collected Circular Progress Ring */}
            <div className="pt-3 border-t border-slate-100">
              <p className="text-xs font-semibold text-slate-700 mb-2">Waste Collected</p>
              <div className="flex items-center gap-5">
                {/* SVG Donut Ring */}
                <div className="relative w-20 h-20 shrink-0 flex items-center justify-center">
                  <svg className="w-20 h-20 -rotate-90 transform" viewBox="0 0 36 36">
                    {/* Background ring */}
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#e2e8f0"
                      strokeWidth="3.8"
                    />
                    {/* Foreground green ring (78%) */}
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="3.8"
                      strokeDasharray="78, 100"
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="absolute text-sm font-bold text-slate-800">78%</span>
                </div>

                {/* Legend */}
                <div className="space-y-1 text-xs">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span>Collected</span>
                    </div>
                    <span className="font-bold text-slate-800">78%</span>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <span className="w-2 h-2 rounded-full bg-slate-300" />
                      <span>Remaining</span>
                    </div>
                    <span className="font-bold text-slate-800">22%</span>
                  </div>

                  <p className="text-[11px] text-slate-400 font-normal pt-1">Total Waste: 120 tons</p>
                </div>
              </div>
            </div>
          </div>

          {/* Card B: Recent Activity */}
          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.03)]">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-slate-600" />
                <h3 className="text-sm font-bold text-[#0a3866] tracking-tight">Recent Activity</h3>
              </div>
              <button
                onClick={() => onNavigateTab('citizen')}
                className="text-xs font-semibold text-[#1366d9] hover:underline cursor-pointer"
              >
                View All
              </button>
            </div>

            <div className="space-y-3">
              {/* Item 1 */}
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-rose-500 text-white flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800 leading-tight">New complaint submitted</p>
                    <p className="text-[11px] text-slate-400">Street light not working - Sector 5</p>
                  </div>
                </div>
                <span className="text-[11px] text-slate-400 whitespace-nowrap">10:24 AM</span>
              </div>

              {/* Item 2 */}
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center shrink-0">
                    <Car className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800 leading-tight">Traffic update</p>
                    <p className="text-[11px] text-slate-400">Heavy traffic on NH-16</p>
                  </div>
                </div>
                <span className="text-[11px] text-slate-400 whitespace-nowrap">09:45 AM</span>
              </div>

              {/* Item 3 */}
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center shrink-0">
                    <Recycle className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800 leading-tight">Waste collection completed</p>
                    <p className="text-[11px] text-slate-400">Zone B - 26 Oct 2026</p>
                  </div>
                </div>
                <span className="text-[11px] text-slate-400 whitespace-nowrap">08:30 AM</span>
              </div>

              {/* Item 4 */}
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center shrink-0">
                    <Leaf className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800 leading-tight">Air quality improved</p>
                    <p className="text-[11px] text-slate-400">AQI 42 (Good)</p>
                  </div>
                </div>
                <span className="text-[11px] text-slate-400 whitespace-nowrap">07:15 AM</span>
              </div>

              {/* Item 5 */}
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-500 text-white flex items-center justify-center shrink-0">
                    <Bus className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800 leading-tight">Public transport update</p>
                    <p className="text-[11px] text-slate-400">Bus 27A delayed by 5 mins</p>
                  </div>
                </div>
                <span className="text-[11px] text-slate-400 whitespace-nowrap">06:50 AM</span>
              </div>
            </div>
          </div>

          {/* Card C: Energy Consumption Bar Chart */}
          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.03)]">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5">
                <span className="text-blue-600 font-bold">⚡</span>
                <h3 className="text-sm font-bold text-[#0a3866] tracking-tight">Energy Consumption</h3>
              </div>
              <span className="text-xs font-semibold text-emerald-600 flex items-center gap-0.5">
                <TrendingDown className="w-3.5 h-3.5" />
                <span>12%</span>
                <span className="text-[10px] text-slate-400 font-normal ml-0.5">(vs last week)</span>
              </span>
            </div>

            {/* Bar Chart matching screenshot */}
            <div className="h-28 w-full pt-2">
              <div className="h-20 flex items-end justify-between px-2 gap-2">
                {[
                  { day: 'Mon', h: 55 },
                  { day: 'Tue', h: 68 },
                  { day: 'Wed', h: 82 },
                  { day: 'Thu', h: 60 },
                  { day: 'Fri', h: 62 },
                  { day: 'Sat', h: 50 },
                  { day: 'Sun', h: 42 },
                ].map((b) => (
                  <div key={b.day} className="flex-1 flex flex-col items-center gap-1 group">
                    <div
                      className="w-full max-w-[18px] bg-[#3b82f6] hover:bg-[#2563eb] rounded-t-sm transition-all"
                      style={{ height: `${b.h}%` }}
                      title={`${b.day}: ${Math.round(b.h * 5)} MWh`}
                    />
                    <span className="text-[9px] text-slate-400 font-medium group-hover:text-slate-700 transition-colors">
                      {b.day}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Card D: Bottom Promo Banner */}
          <div className="rounded-2xl overflow-hidden border border-slate-100 shadow-xs relative select-none">
            <img
              src="/assets/dashboard_promo_banner.png"
              alt="Cleaner Cities, Greener Future"
              className="w-full h-auto object-cover block"
            />
          </div>
        </div>
      </div>

      {/* Interactive Quick Service Modals */}
      {activeModal === 'complaint' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl relative border border-slate-100 animate-in fade-in zoom-in-95">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            {modalSuccessMsg ? (
              <div className="text-center py-6">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                <h4 className="text-lg font-bold text-slate-800">Complaint Logged</h4>
                <p className="text-sm text-slate-600 mt-1">{modalSuccessMsg}</p>
              </div>
            ) : (
              <div>
                <h4 className="text-lg font-bold text-[#0a3866] mb-1">Register Citizen Grievance</h4>
                <p className="text-xs text-slate-500 mb-4">
                  Log an issue directly to the Vijayawada Municipal Corporation command desk.
                </p>

                <form onSubmit={handleRegisterComplaint} className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Issue Category</label>
                    <select
                      value={complaintCategory}
                      onChange={(e) => setComplaintCategory(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs outline-none bg-white"
                    >
                      <option value="Streetlight">Street Light / Power Failure</option>
                      <option value="Overflowing Bin">Garbage Overflow / Waste Pickup</option>
                      <option value="Traffic Hazard">Traffic Light Signal / Roadwork</option>
                      <option value="Water Leak">Water Supply / Pipeline Leakage</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Location / Landmark</label>
                    <input
                      type="text"
                      value={complaintLocation}
                      onChange={(e) => setComplaintLocation(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
                    <textarea
                      rows={3}
                      required
                      placeholder="Describe the problem..."
                      value={complaintText}
                      onChange={(e) => setComplaintText(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs outline-none"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setActiveModal(null)}
                      className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-[#1366d9] text-white text-xs font-semibold hover:bg-[#0f52b0]"
                    >
                      Submit Ticket
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Appointment Modal */}
      {activeModal === 'appointment' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl relative border border-slate-100">
            <button onClick={() => setActiveModal(null)} className="absolute top-4 right-4 text-slate-400">
              <X className="w-5 h-5" />
            </button>
            <h4 className="text-lg font-bold text-[#0a3866] mb-1">Book Municipal Appointment</h4>
            <p className="text-xs text-slate-500 mb-4">Select service office and convenient time slot.</p>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Department</label>
                <select className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white">
                  <option>Town Planning & Building Permissions</option>
                  <option>Revenue & Property Tax Assessment</option>
                  <option>Health & Sanitation Certification</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Preferred Date</label>
                <input type="date" defaultValue="2026-10-28" className="w-full px-3 py-2 rounded-xl border border-slate-200" />
              </div>
              <button
                onClick={() => {
                  alert('Appointment booked for 28 Oct 2026 at VMC Head Office, Governorpet!');
                  setActiveModal(null);
                }}
                className="w-full mt-2 py-2.5 rounded-xl bg-[#1366d9] text-white font-semibold"
              >
                Confirm Booking
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pay Bills Modal */}
      {activeModal === 'bills' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl relative border border-slate-100">
            <button onClick={() => setActiveModal(null)} className="absolute top-4 right-4 text-slate-400">
              <X className="w-5 h-5" />
            </button>
            <h4 className="text-lg font-bold text-[#0a3866] mb-1">Utility Bill Quick Pay</h4>
            <p className="text-xs text-slate-500 mb-4">Pay water charges, municipal electricity, or sanitation cess.</p>
            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center">
                <div>
                  <p className="font-bold text-slate-800">Water Consumption #VMC-WTR-994</p>
                  <p className="text-[11px] text-slate-400">Due: 31 Oct 2026</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-[#1366d9]">₹ 420.00</p>
                  <button
                    onClick={() => {
                      alert('Water bill ₹ 420.00 paid successfully! Receipt sent to email.');
                      setActiveModal(null);
                    }}
                    className="mt-1 px-3 py-1 bg-emerald-600 text-white rounded-lg text-[11px] font-semibold"
                  >
                    Pay Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Certificate Modal */}
      {activeModal === 'certificate' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl relative border border-slate-100">
            <button onClick={() => setActiveModal(null)} className="absolute top-4 right-4 text-slate-400">
              <X className="w-5 h-5" />
            </button>
            <h4 className="text-lg font-bold text-[#0a3866] mb-1">Apply for Citizen Certificate</h4>
            <p className="text-xs text-slate-500 mb-3">DigiLocker verified fast-track certificates.</p>
            <div className="space-y-2 text-xs">
              {['Birth Certificate Copy', 'Trade License Renewal', 'Residence Certificate', 'No Objection Certificate (Fire/Safety)'].map((c) => (
                <div key={c} className="p-2.5 rounded-xl border border-slate-200 flex justify-between items-center hover:bg-slate-50">
                  <span className="font-medium text-slate-800">{c}</span>
                  <button
                    onClick={() => {
                      alert(`Application initiated for ${c}. Application reference: VMC-AP-2026-${Math.floor(1000 + Math.random() * 9000)}`);
                      setActiveModal(null);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-blue-50 text-[#1366d9] font-bold text-[11px] hover:bg-blue-100"
                  >
                    Apply →
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Track Modal */}
      {activeModal === 'track' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl relative border border-slate-100">
            <button onClick={() => setActiveModal(null)} className="absolute top-4 right-4 text-slate-400">
              <X className="w-5 h-5" />
            </button>
            <h4 className="text-lg font-bold text-[#0a3866] mb-1">Track Grievance / Application</h4>
            <p className="text-xs text-slate-500 mb-4">Enter 10-digit VMC Application ID or Mobile number.</p>
            <div className="flex gap-2">
              <input type="text" placeholder="e.g. VMC-2026-9481" className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs" />
              <button
                onClick={() => alert('Status: Under Review by Ward 14 Officer. Target Resolution: 28 Oct 2026.')}
                className="px-4 py-2 rounded-xl bg-[#1366d9] text-white text-xs font-semibold"
              >
                Track
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Property Tax Modal */}
      {activeModal === 'tax' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl relative border border-slate-100">
            <button onClick={() => setActiveModal(null)} className="absolute top-4 right-4 text-slate-400">
              <X className="w-5 h-5" />
            </button>
            <h4 className="text-lg font-bold text-[#0a3866] mb-1">Property Tax Assessment</h4>
            <p className="text-xs text-slate-500 mb-3">Vijayawada Municipal Corporation Assessment Zone B.</p>
            <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Assessment No:</span>
                <span className="font-semibold text-slate-800">AP-VJA-104928</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Property Owner:</span>
                <span className="font-semibold text-slate-800">Tanusree Chowdary</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Current FY 2026-27:</span>
                <span className="font-bold text-emerald-600">PAID (Clear)</span>
              </div>
            </div>
            <button
              onClick={() => setActiveModal(null)}
              className="mt-4 w-full py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold text-xs"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
