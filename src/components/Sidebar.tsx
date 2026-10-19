import React from 'react';
import { ActiveScreen, DefectItem } from '../types';

interface SidebarProps {
  currentScreen: ActiveScreen;
  onScreenChange: (screen: ActiveScreen) => void;
  priorityQueue: DefectItem[];
  selectedDefectId: string;
  onSelectDefect: (defect: DefectItem) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentScreen,
  onScreenChange,
  priorityQueue,
  selectedDefectId,
  onSelectDefect
}) => {
  const navItems: { id: ActiveScreen; label: string; icon: string }[] = [
    { id: 'damage-detection-gis-map', label: 'GIS Live Canvas', icon: 'map' },
    { id: 'inspection-defect-analytics', label: 'Defect Inference Hub', icon: 'radar' },
    { id: 'predictive-maintenance', label: 'Predictive Maintenance', icon: 'timeline' },
    { id: 'contractor-dispatch-sla', label: 'Contractor Dispatch & SLA', icon: 'local_shipping' },
    { id: 'safety-index-reports', label: 'Safety Matrix & Index', icon: 'shield' },
    { id: 'sensor-calibration', label: 'LIDAR & Cam Calibration', icon: 'sensors' }
  ];

  const formatCountdown = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <aside className="fixed left-0 top-20 bottom-0 w-64 bg-[#0a0e18]/90 backdrop-blur-xl border-r border-[#313540] z-40 flex flex-col justify-between py-4">
      <div className="flex flex-col gap-4 px-2">
        <div className="px-2 text-[#d8c3ad] font-mono text-[10px] uppercase font-bold tracking-wider">
          Active Telemetry Channels
        </div>
        
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive = currentScreen === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onScreenChange(item.id)}
                className={`flex items-center gap-2.5 px-3 py-2 rounded text-sm transition-all text-left font-medium ${
                  isActive
                    ? 'bg-[#262a35] text-[#ffc174] font-bold shadow-sm'
                    : 'text-[#d8c3ad] hover:bg-[#262a35]/60 hover:text-[#dfe2f1]'
                }`}
              >
                <span className={`material-symbols-outlined text-lg ${isActive ? 'text-[#ffc174]' : 'text-[#d8c3ad]'}`}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Priority Triage Queue */}
        <div className="mt-4 pt-4 border-t border-[#313540] px-2">
          <div className="text-[#d8c3ad] font-mono text-[10px] uppercase font-bold tracking-wider mb-2 flex items-center justify-between">
            <span>Priority Triage Queue</span>
            <span className="text-[#ffb4ab] font-mono text-[9px] bg-[#93000a]/30 px-1 py-0.5 rounded">
              {priorityQueue.length} Active
            </span>
          </div>

          <div className="space-y-1.5">
            {priorityQueue.map((item) => {
              const isSelected = selectedDefectId === item.id;
              const isCrit = item.severity === 'P1_CRITICAL';
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    onSelectDefect(item);
                    if (currentScreen !== 'damage-detection-gis-map') {
                      onScreenChange('damage-detection-gis-map');
                    }
                  }}
                  className={`p-2 rounded border cursor-pointer transition-all flex items-center justify-between group ${
                    isSelected 
                      ? 'bg-[#262a35] border-[#ffc174] shadow-[0_0_10px_rgba(255,193,116,0.15)]' 
                      : isCrit
                        ? 'bg-[#171b26] border-[#93000a]/40 hover:border-[#ffb4ab]'
                        : 'bg-[#171b26] border-[#ffc174]/30 hover:border-[#ffc174]'
                  }`}
                >
                  <div className="flex flex-col">
                    <span className={`font-mono text-[10px] font-bold ${isCrit ? 'text-[#ffb4ab]' : 'text-[#ffc174]'}`}>
                      {item.code} • {isCrit ? 'P1 CRIT' : 'P2 MED'}
                    </span>
                    <span className="text-[10px] text-[#dfe2f1]/80 truncate max-w-[130px]">
                      {item.street}
                    </span>
                  </div>
                  <span className="font-mono text-[11px] text-[#dfe2f1] font-semibold bg-[#0a0e18] px-1.5 py-0.5 rounded border border-[#313540]">
                    {formatCountdown(item.slaRemainingSeconds)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Bottom Latency & Telemetry Sync Indicator */}
      <div className="px-4 pt-2 border-t border-[#313540] flex items-center justify-between text-[#d8c3ad] font-mono text-[10px]">
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#4cd7f6] animate-pulse"></span>
          CORRIDOR SYNC
        </span>
        <span className="font-bold text-[#4cd7f6]">LATENCY 14ms</span>
      </div>
    </aside>
  );
};
