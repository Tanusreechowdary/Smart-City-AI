import React, { useState } from 'react';
import { CityDataProvider, useCityData } from './context/CityDataContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { MainOverview } from './components/MainOverview';
import { TrafficDashboard } from './components/TrafficDashboard';
import { WasteDashboard } from './components/WasteDashboard';
import { EnergyDashboard } from './components/EnergyDashboard';
import { EnvironmentDashboard } from './components/EnvironmentDashboard';
import { WaterDashboard } from './components/WaterDashboard';
import { AiInsightsLab } from './components/AiInsightsLab';
import { CitizenPortal } from './components/CitizenPortal';
import { AdminApiConsole } from './components/AdminApiConsole';
import { AiCopilotModal } from './components/AiCopilotModal';
import { AlertsDrawer } from './components/AlertsDrawer';
import { LoginPage } from './components/LoginPage';
import { DigitalTwinMap } from './components/DigitalTwinMap';

const AppContent: React.FC = () => {
  const [currentTab, setTab] = useState<string>('dashboard');
  const [isChatOpen, setChatOpen] = useState<boolean>(false);
  const [isAlertsOpen, setAlertsOpen] = useState<boolean>(false);

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
          {currentTab === 'waste' && <WasteDashboard />}
          {currentTab === 'energy' && <EnergyDashboard />}
          {currentTab === 'environment' && <EnvironmentDashboard />}
          {currentTab === 'water' && <WaterDashboard />}
          {currentTab === 'services' && <MainOverview onNavigateTab={setTab} />}
          {currentTab === 'news' && <CitizenPortal />}
          {currentTab === 'settings' && <AdminApiConsole />}
          {currentTab === 'citizen' && <CitizenPortal />}
          {currentTab === 'ai-insights' && <AiInsightsLab />}
          {currentTab === 'admin-api' && <AdminApiConsole />}
        </main>
      </div>

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
