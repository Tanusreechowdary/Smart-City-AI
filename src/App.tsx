import React, { useState, useEffect } from 'react';
import { CityDataProvider, useCityData } from './context/CityDataContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { MainOverview } from './components/MainOverview';
import { TrafficDashboard } from './components/TrafficDashboard';
import { EnergyDashboard } from './components/EnergyDashboard';
import { EnvironmentDashboard } from './components/EnvironmentDashboard';
import { WaterDashboard } from './components/WaterDashboard';
import { AiInsightsLab } from './components/AiInsightsLab';
import { CitizenPortal } from './components/CitizenPortal';
import { AdminApiConsole } from './components/AdminApiConsole';
import { AiCopilotModal, CIVY_LOGO_URL } from './components/AiCopilotModal';
import { AlertsDrawer } from './components/AlertsDrawer';
import { LoginPage } from './components/LoginPage';
import { DigitalTwinMap } from './components/DigitalTwinMap';
import { ServicesDashboard } from './components/ServicesDashboard';

const AppContent: React.FC = () => {
  const [currentTab, setTab] = useState<string>('dashboard');
  const [isChatOpen, setChatOpen] = useState<boolean>(false);
  const [isAlertsOpen, setAlertsOpen] = useState<boolean>(false);
  const [quotaExceeded, setQuotaExceeded] = useState<boolean>(false);

  useEffect(() => {
    const handleQuota = () => setQuotaExceeded(true);
    window.addEventListener('gmp-quota-exceeded', handleQuota);
    return () => window.removeEventListener('gmp-quota-exceeded', handleQuota);
  }, []);

  const { alerts, isAuthenticated } = useCityData();
  const unacknowledgedCount = alerts.filter((a) => !a.acknowledged).length;

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#f0f4f9] text-slate-800 font-sans selection:bg-[#1366d9]/20 selection:text-[#1366d9]">
      {/* Full height Left Sidebar */}
      <Sidebar currentTab={currentTab} setTab={setTab} />

      {/* Main Right Area: Top Header + Scrollable View */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Google Maps Platform Quota Alert Banner */}
        {quotaExceeded && (
          <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2.5 text-xs md:text-sm text-center sticky top-0 z-50 shadow-sm shrink-0">
            <span>
              Google Maps Platform quota reached. If you are the app owner, visit{' '}
              <a
                href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
                target="_blank"
                rel="noopener noreferrer"
                className="underline font-semibold text-amber-950 hover:text-amber-800"
              >
                maps developer site
              </a>{' '}
              for instructions to update your account.
            </span>
          </div>
        )}

        {/* Top Header Bar */}
        <Navbar
          onOpenChat={() => setChatOpen(true)}
          onOpenAlerts={() => setAlertsOpen(true)}
          unacknowledgedAlertsCount={unacknowledgedCount}
        />

        {/* Dynamic Viewport */}
        <main className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-5 lg:p-6 bg-[#f0f4f9]">
          {currentTab === 'dashboard' && <MainOverview onNavigateTab={setTab} />}
          {currentTab === 'city-map' && (
            <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div>
                  <h2 className="text-base font-bold text-[#0a3866]">Andhra Pradesh Statewide Digital Twin & City GIS Map</h2>
                  <p className="text-xs text-slate-500">
                    High-resolution maps with street names, building footprints, and individual house rooftops (Zoom up to 19x) across all AP districts.
                  </p>
                </div>
                <button
                  onClick={() => setTab('dashboard')}
                  className="text-xs font-semibold text-[#1366d9] hover:underline cursor-pointer"
                >
                  ← Back to Dashboard
                </button>
              </div>
              <DigitalTwinMap />
            </div>
          )}
          {currentTab === 'traffic' && <TrafficDashboard />}
          {currentTab === 'energy' && <EnergyDashboard />}
          {currentTab === 'environment' && <EnvironmentDashboard />}
          {currentTab === 'water' && <WaterDashboard />}
          {currentTab === 'services' && <ServicesDashboard />}
          {currentTab === 'news' && <CitizenPortal />}
          {currentTab === 'settings' && <AdminApiConsole />}
          {currentTab === 'citizen' && <CitizenPortal />}
          {currentTab === 'ai-insights' && <AiInsightsLab />}
          {currentTab === 'admin-api' && <AdminApiConsole />}
        </main>
      </div>

      {/* Floating Chatbot Assistant Trigger */}
      <button
        onClick={() => setChatOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-3 px-4 py-2.5 rounded-full bg-gradient-to-r from-[#0c1e33] via-[#0a4d8c] to-[#1366d9] text-white shadow-2xl hover:shadow-cyan-500/30 hover:scale-105 active:scale-95 transition-all duration-200 border border-cyan-400/50 group cursor-pointer focus:outline-none focus:ring-4 focus:ring-[#1366d9]/40"
        title="Chat with Civy - Smart City AI Assistant"
        aria-label="Chat with Civy - Smart City AI Assistant"
      >
        <div className="relative shrink-0">
          <img
            src={CIVY_LOGO_URL}
            alt="Civy"
            className="w-9 h-9 rounded-full object-cover border-2 border-cyan-400 shadow-sm group-hover:rotate-6 transition-transform"
          />
          <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border border-white"></span>
          </span>
        </div>
        <div className="flex flex-col text-left">
          <span className="font-bold text-sm tracking-wide text-white leading-tight">
            Ask Civy
          </span>
          <span className="text-[10px] text-cyan-200 font-medium leading-tight">
            Smart City AI
          </span>
        </div>
      </button>

      {/* AI Assistant Chat Modal */}
      <AiCopilotModal isOpen={isChatOpen} onClose={() => setChatOpen(false)} />

      {/* Emergency Incident Alerts Drawer */}
      <AlertsDrawer isOpen={isAlertsOpen} onClose={() => setAlertsOpen(false)} />
    </div>
  );
};

export default function App() {
  return (
    <CityDataProvider>
      <AppContent />
    </CityDataProvider>
  );
}
