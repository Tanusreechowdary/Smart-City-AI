import React from 'react';
import {
  Home,
  Map,
  FileText,
  LayoutGrid,
  Bus,
  Leaf,
  Newspaper,
  Settings,
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  setTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, setTab }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'city-map', label: 'City Map', icon: Map },
    { id: 'citizen', label: 'My Complaints', icon: FileText },
    { id: 'services', label: 'Emergency & Services', icon: LayoutGrid },
    { id: 'traffic', label: 'Traffic & Transport', icon: Bus },
    { id: 'environment', label: 'Environment', icon: Leaf },
    { id: 'news', label: 'News & Updates', icon: Newspaper },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-[#0c1e33] flex flex-col justify-between shrink-0 select-none min-h-screen text-slate-200">
      <div className="flex flex-col">
        {/* Brand Header */}
        <div className="p-4 sm:p-5 pb-3">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setTab('dashboard')}>
            <img
              src="/assets/smart_city_sidebar_logo.png"
              alt="Smart City"
              className="h-10 w-auto object-contain"
            />
          </div>
        </div>

        {/* Navigation List */}
        <nav className="px-3 py-2 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setTab(item.id)}
                className={`w-full flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-sm transition-all font-normal ${
                  isActive
                    ? 'bg-[#1366d9] text-white font-medium shadow-sm'
                    : 'text-[#8ea2b8] hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    isActive ? 'text-white' : 'text-[#8ea2b8]'
                  }`}
                  strokeWidth={isActive ? 2.2 : 1.8}
                />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Illustration: Skyline + Tagline */}
      <div className="p-3 pt-6 flex flex-col items-center">
        <img
          src="/assets/sidebar_city_footer.png"
          alt="A Smarter City for a Brighter Future"
          className="w-full max-w-[210px] h-auto object-contain opacity-95 pointer-events-none"
        />
      </div>
    </aside>
  );
};
