import React, { useState } from 'react';
import { ActiveScreen, DefectItem } from '../types';

interface HeaderProps {
  currentScreen: ActiveScreen;
  onScreenChange: (screen: ActiveScreen) => void;
  onRunAerialScan: () => void;
  onExportDotReport: () => void;
  selectedDistrict: string;
  onDistrictChange: (district: string) => void;
  criticalDefects: DefectItem[];
  onSelectDefect: (defect: DefectItem) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentScreen,
  onScreenChange,
  onRunAerialScan,
  onExportDotReport,
  selectedDistrict,
  onDistrictChange,
  criticalDefects,
  onSelectDefect
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showDistrictMenu, setShowDistrictMenu] = useState(false);

  const districts = ['Metro Central', 'North Corridor', 'South Harbor', 'Cambridge Sector', 'Back Bay Arterials'];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0e18]/95 backdrop-blur-xl border-b border-[#313540]">
      <div className="h-20 w-full px-4 sm:px-6 flex items-center justify-between gap-4">
        
        {/* Left Brand Lockup */}
        <div className="flex items-center gap-6">
          <div 
            className="flex items-center gap-3 cursor-pointer select-none"
            onClick={() => onScreenChange('damage-detection-gis-map')}
          >
            <img 
              alt="SmartRoad-AI Emblem" 
              className="h-8 w-auto object-contain" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDHp6sESgGy2aEZ1iXfRQtQ7K0EdGVCD0pB-SDsCzLazzAluHxH8GrNaQ1yNdp8jJsm6vDsD7YpkmM-F0pFSCOVUKYQJKX4L_MQV_1wFCPraESquo1mxwZvk4tsCgld27ZNB00QGPc3oo3SHMFnzBs2FE_b9LU5jGEb0U10h0HIp4K8CXWmBUhvUJfdtZJf_ayuqdSDklKJ6nHh9XXsP79dBfRaX6NVo_bnBRBr9IpRgMeH4zPZtGOYmw" 
            />
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-[#dfe2f1]">
                  SmartRoad<span className="text-[#ffc174]">-AI</span>
                </span>
                <span className="px-1.5 py-0.5 bg-[#262a35] rounded text-[#ffc174] font-mono text-[10px] uppercase font-bold tracking-wider border border-[#ffc174]/20">
                  MUNICIPAL OPERATIONS CENTER • v2.4-PROD
                </span>
              </div>
              <span className="font-mono text-[11px] text-[#d8c3ad] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4cd7f6] animate-pulse"></span>
                Autonomous CV Fleet Surveillance Deck
              </span>
            </div>
          </div>

          {/* District & Fleet Quick Badge */}
          <div className="hidden 2xl:flex items-center gap-4 px-4 py-1.5 bg-[#171b26] rounded border border-[#313540]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#4cd7f6] shadow-[0_0_8px_#4cd7f6]"></span>
              <span className="font-mono text-[11px] text-[#dfe2f1]">
                Edge Fleet: <strong className="text-[#4cd7f6] font-bold">142 Active Units</strong>
              </span>
            </div>
            <span className="text-[#313540]">|</span>
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm text-[#ffc174]">smart_toy</span>
              <span className="font-mono text-[11px] text-[#d8c3ad]">
                Model: <span className="text-[#dfe2f1]">YOLO-RoadDefect-v9x (98.4% Acc)</span>
              </span>
            </div>
            <span className="text-[#313540]">|</span>
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm text-[#d8c3ad]">location_on</span>
              <span className="font-mono text-[11px] text-[#d8c3ad]">
                District: <span className="text-[#dfe2f1] font-medium">{selectedDistrict}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Center Navigation Links */}
        <nav className="hidden xl:flex items-center gap-1 self-stretch h-full">
          <button
            onClick={() => onScreenChange('damage-detection-gis-map')}
            className={`flex items-center h-full px-4 text-sm font-medium transition-colors border-b-2 ${
              currentScreen === 'damage-detection-gis-map'
                ? 'bg-[#262a35] text-[#ffc174] border-[#ffc174]'
                : 'text-[#d8c3ad] hover:text-[#dfe2f1] hover:bg-[#171b26] border-transparent'
            }`}
          >
            Damage Detection & GIS Map
          </button>
          <button
            onClick={() => onScreenChange('inspection-defect-analytics')}
            className={`flex items-center h-full px-4 text-sm font-medium transition-colors border-b-2 ${
              currentScreen === 'inspection-defect-analytics'
                ? 'bg-[#262a35] text-[#ffc174] border-[#ffc174]'
                : 'text-[#d8c3ad] hover:text-[#dfe2f1] hover:bg-[#171b26] border-transparent'
            }`}
          >
            Inspection & Defect Analytics
          </button>
          <button
            onClick={() => onScreenChange('predictive-maintenance')}
            className={`flex items-center h-full px-4 text-sm font-medium transition-colors border-b-2 ${
              currentScreen === 'predictive-maintenance'
                ? 'bg-[#262a35] text-[#ffc174] border-[#ffc174]'
                : 'text-[#d8c3ad] hover:text-[#dfe2f1] hover:bg-[#171b26] border-transparent'
            }`}
          >
            Predictive Maintenance
          </button>
          <button
            onClick={() => onScreenChange('contractor-dispatch-sla')}
            className={`flex items-center h-full px-4 text-sm font-medium transition-colors border-b-2 ${
              currentScreen === 'contractor-dispatch-sla'
                ? 'bg-[#262a35] text-[#ffc174] border-[#ffc174]'
                : 'text-[#d8c3ad] hover:text-[#dfe2f1] hover:bg-[#171b26] border-transparent'
            }`}
          >
            Contractor Dispatch & SLA
          </button>
          <button
            onClick={() => onScreenChange('safety-index-reports')}
            className={`flex items-center h-full px-4 text-sm font-medium transition-colors border-b-2 ${
              currentScreen === 'safety-index-reports'
                ? 'bg-[#262a35] text-[#ffc174] border-[#ffc174]'
                : 'text-[#d8c3ad] hover:text-[#dfe2f1] hover:bg-[#171b26] border-transparent'
            }`}
          >
            Safety Index & Reports
          </button>
        </nav>

        {/* Right Tools & User Profile */}
        <div className="flex items-center gap-3">
          
          {/* Action Buttons */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={onRunAerialScan}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#171b26] border border-[#4cd7f6]/40 text-[#4cd7f6] hover:bg-[#4cd7f6]/10 rounded font-mono text-[11px] font-bold uppercase transition-all tracking-wider shadow-sm"
              type="button"
            >
              <span className="material-symbols-outlined text-sm">flight_takeoff</span>
              Run Aerial Scan
            </button>
            <button
              onClick={onExportDotReport}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#171b26] border border-[#313540] text-[#dfe2f1] hover:bg-[#262a35] rounded font-mono text-[11px] font-bold uppercase transition-all tracking-wider"
              type="button"
            >
              <span className="material-symbols-outlined text-sm">assignment_returned</span>
              Export DOT Report
            </button>
          </div>

          <div className="flex items-center gap-2 pl-2 border-l border-[#313540] relative">
            
            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded hover:bg-[#262a35] text-[#d8c3ad] hover:text-[#dfe2f1] transition-colors"
                type="button"
                aria-label="Alerts"
              >
                <span className="material-symbols-outlined">notifications</span>
                <span className="absolute top-1.5 right-1.5 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-[#ffb4ab] text-[#690005] font-mono text-[9px] font-bold leading-none animate-pulse">
                  {criticalDefects.length || 3}
                </span>
              </button>

              {/* Notification Flyout */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-[#0a0e18]/95 backdrop-blur-xl border border-[#313540] rounded-lg shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="flex items-center justify-between pb-2 border-b border-[#313540] mb-2">
                    <span className="font-mono text-[11px] font-bold text-[#ffb4ab] uppercase">
                      Critical P1 Hazard Alerts ({criticalDefects.length})
                    </span>
                    <button 
                      onClick={() => setShowNotifications(false)}
                      className="text-[#d8c3ad] hover:text-white text-xs"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                    {criticalDefects.map((def) => (
                      <div
                        key={def.id}
                        onClick={() => {
                          onSelectDefect(def);
                          setShowNotifications(false);
                          if (currentScreen !== 'damage-detection-gis-map') {
                            onScreenChange('damage-detection-gis-map');
                          }
                        }}
                        className="p-2 bg-[#171b26] hover:bg-[#262a35] rounded border border-[#93000a]/40 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center justify-between text-[11px] font-mono">
                          <span className="text-[#ffb4ab] font-bold">{def.code}</span>
                          <span className="text-[#ffc174]">{def.confidence}% Conf</span>
                        </div>
                        <p className="text-xs text-[#dfe2f1] font-semibold mt-0.5 line-clamp-1">{def.title}</p>
                        <p className="text-[10px] text-[#d8c3ad] mt-0.5 flex justify-between">
                          <span>{def.street}</span>
                          <span className="text-[#ffb4ab] font-mono">SLA &lt;2h</span>
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* District Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowDistrictMenu(!showDistrictMenu)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#171b26] rounded border border-[#313540] text-[#d8c3ad] hover:text-[#dfe2f1] hover:bg-[#262a35] transition-colors font-mono text-[11px]"
                type="button"
              >
                <span className="material-symbols-outlined text-sm text-[#ffc174]">location_city</span>
                <span className="hidden sm:inline font-medium">{selectedDistrict}</span>
                <span className="material-symbols-outlined text-sm">arrow_drop_down</span>
              </button>

              {showDistrictMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-[#0a0e18]/95 backdrop-blur-xl border border-[#313540] rounded-lg shadow-xl p-1 z-50">
                  <div className="px-3 py-1.5 text-[10px] font-mono text-[#d8c3ad] uppercase border-b border-[#313540] mb-1">
                    Select Operations District
                  </div>
                  {districts.map(d => (
                    <button
                      key={d}
                      onClick={() => {
                        onDistrictChange(d);
                        setShowDistrictMenu(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 rounded text-xs transition-colors flex items-center justify-between ${
                        selectedDistrict === d ? 'bg-[#262a35] text-[#ffc174] font-bold' : 'text-[#dfe2f1] hover:bg-[#171b26]'
                      }`}
                    >
                      <span>{d}</span>
                      {selectedDistrict === d && <span className="material-symbols-outlined text-xs">check</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex items-center gap-2.5 pl-2 border-l border-[#313540]">
              <img 
                alt="Marcus Vance, PE" 
                className="w-8 h-8 rounded-full object-cover ring-1 ring-[#ffc174]/40" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCKFS4Ti0PudqEJtGUsUNYZuoG-Av1UKjm_Y58NJ2VUQbiCIRXvEdNhXBA8cpKePr09hrmwXWZ18MbQ7FvxTYMABfbg75B3LYy4sAGbEoXEt24HjzmExCTCMbdAk9aCWR2a5MkeAF-dtUI3N_JfNp8q-fvc6yeXf2Ta0mU03895egmN6d65j7TMqPsadRDPaSGXLgOTdwC_c_B5HHaIxr627M9_9HHmLu21yFViifHb_3vcVvpb3GGL1A" 
              />
              <div className="hidden 2xl:flex flex-col text-left">
                <span className="text-xs font-semibold text-[#dfe2f1] leading-tight">Marcus Vance, PE</span>
                <span className="font-mono text-[9px] text-[#d8c3ad] uppercase tracking-wider">Director of Public Works</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </header>
  );
};
