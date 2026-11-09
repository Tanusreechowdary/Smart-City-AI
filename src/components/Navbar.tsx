import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Bell,
  ChevronDown,
  User,
  LogOut,
  Shield,
  Settings,
  Sparkles,
} from 'lucide-react';
import { useCityData } from '../context/CityDataContext';
import { CIVY_LOGO_URL } from './AiCopilotModal';
import { UserRole } from '../types';

interface NavbarProps {
  onOpenChat: () => void;
  onOpenAlerts: () => void;
  unacknowledgedAlertsCount: number;
  onSearch?: (query: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenChat,
  onOpenAlerts,
  unacknowledgedAlertsCount,
  onSearch,
}) => {
  const { userRole, setUserRole, currentUser, logout } = useCityData();
  const [showProfileMenu, setShowProfileMenu] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicked outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (onSearch) onSearch(e.target.value);
  };

  const displayName = currentUser?.name || 'Tanusree Chowdary';
  const roleDisplay = userRole === 'citizen' ? 'Citizen' : userRole === 'operator' ? 'Operator' : 'Administrator';

  return (
    <header className="h-16 bg-white border-b border-slate-200/80 px-4 md:px-6 flex items-center justify-between sticky top-0 z-30 transition-all">
      {/* Search Bar matching screenshot */}
      <div className="flex items-center flex-1 max-w-md">
        <div className="relative w-full max-w-sm sm:max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search services, complaints, locations..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50/60 hover:bg-slate-50 focus:bg-white text-sm text-slate-800 placeholder-slate-400 rounded-lg border border-slate-200 outline-none focus:border-[#1366d9] focus:ring-2 focus:ring-[#1366d9]/10 transition-all"
          />
        </div>
      </div>

      {/* Right controls: AI Assist, Notification Bell, User Profile */}
      <div className="flex items-center gap-3 md:gap-4">
        {/* Civy AI Assistant Quick Pill */}
        <button
          onClick={onOpenChat}
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-50/90 hover:bg-blue-100 text-[#1366d9] text-xs font-bold transition-all border border-blue-200/80 shadow-2xs cursor-pointer group"
          title="Ask Civy - Smart City AI"
        >
          <img
            src={CIVY_LOGO_URL}
            alt="Civy"
            className="w-5 h-5 rounded-full object-cover border border-cyan-400 group-hover:scale-110 transition-transform shadow-xs"
          />
          <span>Ask Civy</span>
        </button>

        {/* Notifications Bell with Red Badge 3 */}
        <button
          onClick={onOpenAlerts}
          className="relative p-2 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
          title="Incident Alerts & Notifications"
        >
          <Bell className="w-5 h-5 text-slate-600" />
          <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
            {unacknowledgedAlertsCount > 0 ? unacknowledgedAlertsCount : 3}
          </span>
        </button>

        {/* User Profile */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
          >
            {/* Deep Blue Circle Avatar */}
            <div className="w-9 h-9 rounded-full bg-[#0a4d8c] flex items-center justify-center text-white shadow-xs">
              <User className="w-5 h-5" strokeWidth={2.2} />
            </div>

            <div className="hidden sm:flex flex-col text-left">
              <div className="flex items-center gap-1">
                <span className="text-sm font-semibold text-slate-800 tracking-tight leading-none">
                  {displayName}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </div>
              <span className="text-xs text-slate-500 font-normal leading-tight mt-0.5">
                {roleDisplay}
              </span>
            </div>
          </button>

          {/* Profile Dropdown Menu */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-50 animate-in fade-in zoom-in-95 duration-100 text-slate-700">
              <div className="p-3 border-b border-slate-100">
                <p className="font-semibold text-sm text-slate-800">{displayName}</p>
                <p className="text-xs text-slate-500 truncate mt-0.5">
                  {currentUser?.email || 'tanusreechowdarysirigiri@gmail.com'}
                </p>
                <span className="inline-block mt-2 px-2 py-0.5 rounded-full bg-blue-50 text-[#1366d9] text-[10px] font-semibold uppercase tracking-wider">
                  {roleDisplay} Portal
                </span>
              </div>

              {/* Role Switcher */}
              <div className="py-2 border-b border-slate-100">
                <span className="px-3 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Switch Active Role
                </span>
                <div className="mt-1 space-y-0.5">
                  {(['citizen', 'operator', 'admin'] as UserRole[]).map((r) => (
                    <button
                      key={r}
                      onClick={() => {
                        setUserRole(r);
                        setShowProfileMenu(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs capitalize transition-colors ${
                        userRole === r
                          ? 'bg-blue-50 text-[#1366d9] font-bold'
                          : 'hover:bg-slate-50 text-slate-600'
                      }`}
                    >
                      <span>{r === 'citizen' ? 'Citizen' : r === 'operator' ? 'Field Operator' : 'Administrator'}</span>
                      {userRole === r && <span className="w-1.5 h-1.5 rounded-full bg-[#1366d9]" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="pt-1">
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer font-medium"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out to Login Screen</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
