import React, { useState } from 'react';
import { DefectItem, PatrolVehicle } from '../types';

interface GisMapCanvasProps {
  defects: DefectItem[];
  vehicles: PatrolVehicle[];
  selectedDefect: DefectItem;
  onSelectDefect: (defect: DefectItem) => void;
  onSelectVehicle: (vehicle: PatrolVehicle) => void;
  onFilterCorridor: () => void;
  onBroadcastAlert: () => void;
}

export const GisMapCanvas: React.FC<GisMapCanvasProps> = ({
  defects,
  vehicles,
  selectedDefect,
  onSelectDefect,
  onSelectVehicle,
  onFilterCorridor,
  onBroadcastAlert
}) => {
  const [heatmapActive, setHeatmapActive] = useState(true);
  const [mapMode, setMapMode] = useState<'VECTOR' | 'HYBRID' | 'SATELLITE'>('VECTOR');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [activeFilters, setActiveFilters] = useState({
    potholes: true,
    rutting: true,
    alligator: true,
    manholes: true
  });
  const [hoveredDefectId, setHoveredDefectId] = useState<string | null>(null);

  const toggleFilter = (key: keyof typeof activeFilters) => {
    setActiveFilters(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const activeCount = Object.values(activeFilters).filter(Boolean).length;

  // Filter defects based on checkboxes
  const isDefectVisible = (def: DefectItem) => {
    if (def.type === 'POTHOLE' && !activeFilters.potholes) return false;
    if (def.type === 'RUTTING' && !activeFilters.rutting) return false;
    if (def.type === 'ALLIGATOR_CRACK' && !activeFilters.alligator) return false;
    if (def.type === 'MANHOLE_SUBSIDENCE' && !activeFilters.manholes) return false;
    return true;
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Main Map Container */}
      <div className="relative w-full h-[760px] bg-[#0a0e18] rounded-xl overflow-hidden flex flex-col border border-[#313540] shadow-2xl">
        
        {/* Live Static / Vector GIS Map Viewport */}
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center transition-transform duration-300 ease-out"
          style={{
            backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuAfSemFME8hmXoNYtkt8Cw6WvaADVYEJ9lnl7XlMSvFKlRxfYs0FjAGnlVwWHp70v4xbFXU7pFS6TSjAXn1dbaeGkknEbxoQBJ1Npk85KygU6QBB6AFxRwRY7lsgqGJ2OPiL8jIfs2vLm6jKhVv7Zpl8sICgTPucH2y_tLREH7gzkxRVXb_K7fD7AjZZvuME4LwgCTxX9YqUsSv1ML8M8zuzhRDwWjjt8Ije6hNOhX_xaq2Ipm66VPpxg')`,
            transform: `scale(${zoomLevel})`,
            filter: mapMode === 'VECTOR' ? 'contrast(1.15) brightness(0.85)' : mapMode === 'HYBRID' ? 'contrast(1.05)' : 'brightness(1.1)'
          }}
        />

        {/* Ambient Tactical Grid & SVG Heat Corridors Overlay */}
        <div className="absolute inset-0 bg-[#0a0e18]/65 pointer-events-none">
          <svg className="w-full h-full opacity-50" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="tactical-grid" width="48" height="48" patternUnits="userSpaceOnUse">
                <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#262a35" strokeWidth="0.75" />
              </pattern>
              <linearGradient id="heat-arterial-1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#4cd7f6" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#ffb4ab" stopOpacity="0.95" />
              </linearGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#tactical-grid)" />
            
            {/* High-contrast simulated arterial road network polyline vectors */}
            {heatmapActive && (
              <>
                <path 
                  d="M 40 180 Q 240 220 460 160 T 820 280" 
                  fill="none" 
                  stroke="url(#heat-arterial-1)" 
                  strokeWidth="4" 
                  strokeLinecap="round" 
                  strokeDasharray="8 4" 
                  className="animate-pulse" 
                />
                <path 
                  d="M 120 620 L 320 440 L 580 430 L 780 560" 
                  fill="none" 
                  stroke="#03b5d3" 
                  strokeWidth="3" 
                  strokeOpacity="0.7" 
                />
                <path 
                  d="M 460 160 L 580 430" 
                  fill="none" 
                  stroke="#ff938c" 
                  strokeWidth="4" 
                  strokeOpacity="0.8" 
                />
                <circle cx="460" cy="160" r="28" fill="#93000a" fillOpacity="0.25" />
              </>
            )}
          </svg>
        </div>

        {/* GIS Tactical Map Top Controls Bar */}
        <div className="relative z-20 p-4 flex flex-wrap items-center justify-between gap-3 bg-[#0a0e18]/85 backdrop-blur-md border-b border-[#313540]">
          <div className="flex items-center gap-3">
            <span className="px-2 py-1 bg-[#262a35] rounded font-mono text-[10px] text-[#4cd7f6] uppercase font-bold flex items-center gap-1.5 border border-[#4cd7f6]/30">
              <span className="w-2 h-2 rounded-full bg-[#4cd7f6] animate-pulse"></span>
              GIS TACTICAL CANOPY v4.1
            </span>
            <span className="text-[#d8c3ad] font-mono text-xs hidden md:inline">
              Projection: EPSG:3857 (WGS 84 / Pseudo-Mercator)
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Heatmap Toggle Button */}
            <button
              onClick={() => setHeatmapActive(!heatmapActive)}
              className={`px-3 py-1.5 rounded font-mono text-[11px] uppercase font-bold flex items-center gap-1.5 transition-all border ${
                heatmapActive 
                  ? 'bg-[#262a35] text-[#dfe2f1] border-[#ffc174]/40 hover:bg-[#353944]' 
                  : 'bg-[#171b26] text-[#d8c3ad] border-[#313540] hover:text-[#dfe2f1]'
              }`}
            >
              <span className="material-symbols-outlined text-sm text-[#ffc174]">local_fire_department</span>
              Heatmap: {heatmapActive ? 'ON' : 'OFF'}
            </button>

            {/* Map Mode Tabs */}
            <div className="flex bg-[#171b26] rounded p-0.5 border border-[#313540]">
              {(['VECTOR', 'HYBRID', 'SATELLITE'] as const).map(mode => (
                <button
                  key={mode}
                  onClick={() => setMapMode(mode)}
                  className={`px-2.5 py-1 rounded font-mono text-[10px] font-bold uppercase transition-colors ${
                    mapMode === mode 
                      ? 'bg-[#313540] text-[#dfe2f1]' 
                      : 'text-[#d8c3ad] hover:text-[#dfe2f1]'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Interactive Defect Pins */}
        {defects.filter(isDefectVisible).map((def) => {
          const isSelected = selectedDefect.id === def.id;
          const isHovered = hoveredDefectId === def.id;
          const isCrit = def.severity === 'P1_CRITICAL';
          const isInRepair = def.status === 'IN_REPAIR';
          const isMed = def.severity === 'P2_HIGH';

          return (
            <div
              key={def.id}
              onClick={() => onSelectDefect(def)}
              onMouseEnter={() => setHoveredDefectId(def.id)}
              onMouseLeave={() => setHoveredDefectId(null)}
              className="absolute z-20 cursor-pointer -translate-x-1/2 -translate-y-1/2 group"
              style={{ top: `${def.mapY}%`, left: `${def.mapX}%` }}
            >
              {/* Pin Graphics */}
              <div className="relative flex items-center justify-center w-8 h-8">
                {isCrit && (
                  <>
                    <span className="absolute w-8 h-8 rounded-full bg-[#ffb4ab]/30 animate-ping"></span>
                    <span className="absolute w-5 h-5 rounded-full bg-[#ffb4ab]/60"></span>
                    <span className="relative w-3.5 h-3.5 rounded-full bg-[#ffb4ab] flex items-center justify-center text-[#690005] font-bold font-mono text-[9px] shadow-[0_0_8px_#ffb4ab]">
                      !
                    </span>
                  </>
                )}
                {isMed && (
                  <>
                    <span className="absolute w-7 h-7 rounded-full bg-[#ffc174]/25 animate-pulse"></span>
                    <span className="relative w-3.5 h-3.5 rounded-full bg-[#ffc174] flex items-center justify-center text-[#472a00] font-bold font-mono text-[9px] shadow-[0_0_8px_#ffc174]">
                      ▲
                    </span>
                  </>
                )}
                {isInRepair && (
                  <span className="relative w-4 h-4 rounded-full bg-[#4cd7f6] flex items-center justify-center text-[#003640] font-bold font-mono text-[9px] shadow-[0_0_8px_#4cd7f6]">
                    ✓
                  </span>
                )}
                {!isCrit && !isMed && !isInRepair && (
                  <span className="relative w-3 h-3 rounded-full bg-[#ffb95f] shadow-[0_0_6px_#ffb95f]"></span>
                )}
              </div>

              {/* Pin Tooltip / HUD Callout Card (Visible when hovered or selected) */}
              {(isHovered || isSelected) && (
                <div className="absolute left-8 -top-8 w-72 p-3 bg-[#0a0e18]/95 backdrop-blur-md rounded-lg shadow-2xl border border-[#313540] pointer-events-none z-30 animate-in fade-in zoom-in-95 duration-150">
                  <div className={`flex items-center justify-between pb-1 mb-1 px-1.5 py-0.5 rounded ${
                    isCrit ? 'bg-[#93000a]/30 text-[#ffb4ab]' : isMed ? 'bg-[#ffc174]/20 text-[#ffc174]' : 'bg-[#4cd7f6]/20 text-[#4cd7f6]'
                  }`}>
                    <span className="font-mono text-[10px] font-bold uppercase">
                      {def.code} • {isCrit ? 'CRITICAL P1' : isMed ? 'POTHOLE P2' : 'FATIGUE P3'}
                    </span>
                    <span className="font-mono text-[10px] font-bold">
                      {def.confidence}% AI CONF
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-[#dfe2f1] leading-tight line-clamp-2">
                    {def.title}
                  </p>
                  <div className="mt-1 flex items-center justify-between text-[#d8c3ad] font-mono text-[10px]">
                    <span>{def.street}</span>
                    <span className={`font-bold ${isCrit ? 'text-[#ffb4ab]' : 'text-[#ffc174]'}`}>
                      {def.hazardSpan}
                    </span>
                  </div>
                  <div className="mt-1 pt-1 border-t border-[#313540] flex items-center justify-between text-[9px] text-[#d8c3ad] font-mono">
                    <span>LAT: {def.lat.toFixed(4)}°N</span>
                    <span className={isCrit ? 'text-[#ffb4ab] font-bold' : 'text-[#ffc174]'}>
                      SLA: 01h 42m LEFT
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Live GPS Patrol Vehicle Markers */}
        {vehicles.map((veh) => (
          <div
            key={veh.id}
            onClick={() => onSelectVehicle(veh)}
            className="absolute z-20 flex items-center gap-1.5 px-2 py-1 bg-[#262a35]/90 backdrop-blur rounded shadow-lg border border-[#313540] cursor-pointer hover:bg-[#353944] hover:border-[#4cd7f6] transition-all -translate-x-1/2 -translate-y-1/2"
            style={{ top: `${veh.mapY}%`, left: `${veh.mapX}%` }}
          >
            <span className={`material-symbols-outlined text-sm ${
              veh.type === 'VAN' ? 'text-[#4cd7f6]' : veh.type === 'SWEEPER' ? 'text-[#ffc174]' : 'text-[#acedff] animate-pulse'
            }`}>
              {veh.type === 'VAN' ? 'directions_car' : veh.type === 'SWEEPER' ? 'cleaning_services' : 'flight'}
            </span>
            <div className="flex flex-col">
              <span className="font-mono text-[9px] text-[#dfe2f1] font-bold leading-tight">
                {veh.unitCode}
              </span>
              <span className="font-mono text-[8px] text-[#4cd7f6] leading-tight">
                {veh.speedMph} MPH • {veh.status}
              </span>
            </div>
          </div>
        ))}

        {/* Floating HUD Defect Filter Controls (Bottom Left) */}
        <div className="absolute bottom-12 left-4 z-20 p-3 bg-[#0a0e18]/90 backdrop-blur-md rounded-lg max-w-sm border border-[#313540] shadow-xl">
          <div className="flex items-center justify-between mb-2 pb-1 border-b border-[#313540]">
            <span className="font-mono text-[10px] text-[#d8c3ad] uppercase font-bold tracking-wider">
              Canvas Defect Filters
            </span>
            <span className="font-mono text-[10px] text-[#4cd7f6] font-bold">
              ACTIVE: {activeCount}/4
            </span>
          </div>
          <div className="grid grid-cols-2 gap-1.5 text-xs">
            <label className="flex items-center gap-1.5 p-1 bg-[#171b26] rounded cursor-pointer hover:bg-[#262a35] transition-colors select-none">
              <input
                type="checkbox"
                checked={activeFilters.potholes}
                onChange={() => toggleFilter('potholes')}
                className="accent-[#4cd7f6] w-3.5 h-3.5 rounded-none cursor-pointer"
              />
              <span className="font-mono text-[11px] text-[#dfe2f1]">Potholes (1,104)</span>
            </label>
            <label className="flex items-center gap-1.5 p-1 bg-[#171b26] rounded cursor-pointer hover:bg-[#262a35] transition-colors select-none">
              <input
                type="checkbox"
                checked={activeFilters.rutting}
                onChange={() => toggleFilter('rutting')}
                className="accent-[#4cd7f6] w-3.5 h-3.5 rounded-none cursor-pointer"
              />
              <span className="font-mono text-[11px] text-[#dfe2f1]">Rutting (192)</span>
            </label>
            <label className="flex items-center gap-1.5 p-1 bg-[#171b26] rounded cursor-pointer hover:bg-[#262a35] transition-colors select-none">
              <input
                type="checkbox"
                checked={activeFilters.alligator}
                onChange={() => toggleFilter('alligator')}
                className="accent-[#4cd7f6] w-3.5 h-3.5 rounded-none cursor-pointer"
              />
              <span className="font-mono text-[11px] text-[#dfe2f1]">Alligator Cracks (128)</span>
            </label>
            <label className="flex items-center gap-1.5 p-1 bg-[#171b26] rounded cursor-pointer hover:bg-[#262a35] transition-colors select-none">
              <input
                type="checkbox"
                checked={activeFilters.manholes}
                onChange={() => toggleFilter('manholes')}
                className="accent-[#4cd7f6] w-3.5 h-3.5 rounded-none cursor-pointer"
              />
              <span className="font-mono text-[11px] text-[#dfe2f1]">Manholes (58)</span>
            </label>
          </div>
        </div>

        {/* Floating Compass & Zoom HUD Widget (Bottom Right) */}
        <div className="absolute bottom-12 right-4 z-20 flex flex-col items-center gap-1 p-1 bg-[#0a0e18]/90 backdrop-blur-md rounded-lg border border-[#313540] shadow-xl">
          <button
            onClick={() => setZoomLevel(prev => Math.min(prev + 0.25, 2.5))}
            className="w-8 h-8 flex items-center justify-center text-[#dfe2f1] hover:bg-[#262a35] rounded font-bold text-base transition-all"
            title="Zoom In"
          >
            +
          </button>
          <div className="w-5 h-0.5 bg-[#313540]"></div>
          <button
            onClick={() => setZoomLevel(prev => Math.max(prev - 0.25, 0.75))}
            className="w-8 h-8 flex items-center justify-center text-[#dfe2f1] hover:bg-[#262a35] rounded font-bold text-base transition-all"
            title="Zoom Out"
          >
            -
          </button>
          <div className="w-5 h-0.5 bg-[#313540]"></div>
          <button
            onClick={() => setZoomLevel(1)}
            className="w-8 h-8 flex items-center justify-center text-[#4cd7f6] hover:bg-[#262a35] rounded transition-all"
            title="Reset North / Scale"
          >
            <span className="material-symbols-outlined text-base">explore</span>
          </button>
        </div>

        {/* Tactical Map Bottom Telemetry Bar */}
        <div className="relative z-20 mt-auto px-4 py-2 bg-[#0a0e18]/85 backdrop-blur-md border-t border-[#313540] flex items-center justify-between text-[#d8c3ad] font-mono text-[11px]">
          <div className="flex items-center gap-4">
            <span>GRID: <strong className="text-[#dfe2f1]">UTM 19T 330982 4691720</strong></span>
            <span className="hidden sm:inline">RESOLUTION: <strong className="text-[#dfe2f1]">0.05m/px (GSD)</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#4cd7f6] animate-pulse"></span>
            <span className="text-[#4cd7f6] font-bold">EDGE SYNC HEALTHY (14ms)</span>
          </div>
        </div>

      </div>

      {/* Quick GIS Corridor Triage Sub-bar */}
      <div className="w-full p-4 bg-[#171b26] rounded-lg border border-[#313540] flex flex-wrap items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#262a35] rounded border border-[#ffc174]/30 text-[#ffc174]">
            <span className="material-symbols-outlined text-xl">route</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-[#dfe2f1]">
              Priority Arterial Corridor: Route 93 North
            </p>
            <p className="font-mono text-xs text-[#d8c3ad]">
              Continuous automated pavement scanning by 6 connected public transit buses
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onFilterCorridor}
            className="px-4 py-1.5 bg-[#1c1f2a] text-[#dfe2f1] hover:bg-[#262a35] border border-[#313540] rounded font-mono text-[11px] font-bold uppercase transition-all flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-sm">filter_alt</span>
            Filter Corridor
          </button>
          <button
            onClick={onBroadcastAlert}
            className="px-4 py-1.5 bg-[#ffc174] text-[#472a00] font-bold rounded font-mono text-[11px] uppercase hover:brightness-110 transition-all flex items-center gap-1.5 shadow-sm"
          >
            <span className="material-symbols-outlined text-sm">notification_important</span>
            Broadcast Corridor Alert
          </button>
        </div>
      </div>

    </div>
  );
};
