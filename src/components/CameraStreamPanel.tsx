import React, { useState, useEffect } from 'react';
import { PatrolVehicle, DefectItem } from '../types';

interface CameraStreamPanelProps {
  activeVehicle: PatrolVehicle;
  onSwitchVehicle: (vehicleId: string) => void;
  allVehicles: PatrolVehicle[];
  selectedDefect: DefectItem;
}

export const CameraStreamPanel: React.FC<CameraStreamPanelProps> = ({
  activeVehicle,
  onSwitchVehicle,
  allVehicles,
  selectedDefect
}) => {
  const [utcTime, setUtcTime] = useState<string>('');
  const [showBoundingBoxes, setShowBoundingBoxes] = useState(true);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [showCameraMenu, setShowCameraMenu] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setUtcTime(now.toTimeString().split(' ')[0] + ' UTC');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleCaptureSnapshot = () => {
    setIsCapturing(true);
    setTimeout(() => setIsCapturing(false), 300);
  };

  return (
    <div className="w-full bg-[#1c1f2a] rounded-xl overflow-hidden flex flex-col border border-[#313540] shadow-xl">
      {/* Stream Header */}
      <div className="px-4 py-2.5 bg-[#262a35] flex items-center justify-between border-b border-[#313540]">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ffb4ab] animate-pulse"></span>
          
          <div className="relative">
            <button
              onClick={() => setShowCameraMenu(!showCameraMenu)}
              className="font-mono text-xs text-[#dfe2f1] uppercase font-bold tracking-wider hover:text-[#ffc174] flex items-center gap-1 transition-colors"
            >
              <span>{activeVehicle.camId} // {activeVehicle.name} - Forward 4K Telemetric Camera</span>
              <span className="material-symbols-outlined text-sm">arrow_drop_down</span>
            </button>

            {/* Camera switcher dropdown */}
            {showCameraMenu && (
              <div className="absolute left-0 mt-2 w-72 bg-[#0a0e18]/95 backdrop-blur-xl border border-[#313540] rounded-lg shadow-2xl p-1 z-50">
                <div className="px-3 py-1.5 text-[10px] font-mono text-[#d8c3ad] uppercase border-b border-[#313540]">
                  Switch Autonomous Feeds
                </div>
                {allVehicles.map(veh => (
                  <button
                    key={veh.id}
                    onClick={() => {
                      onSwitchVehicle(veh.id);
                      setShowCameraMenu(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded text-xs transition-colors flex items-center justify-between ${
                      activeVehicle.id === veh.id ? 'bg-[#262a35] text-[#4cd7f6] font-bold' : 'text-[#dfe2f1] hover:bg-[#171b26]'
                    }`}
                  >
                    <div>
                      <div className="font-mono">{veh.name}</div>
                      <div className="text-[10px] text-[#d8c3ad]">{veh.camId} • {veh.speedMph} MPH</div>
                    </div>
                    <span className="font-mono text-[9px] text-[#ffc174]">{veh.status}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-mono text-[11px] text-[#4cd7f6]">
            {activeVehicle.fps.toFixed(1)} FPS • 4K UHD
          </span>
          <button
            onClick={() => setShowBoundingBoxes(!showBoundingBoxes)}
            className={`px-2 py-0.5 rounded font-mono text-[10px] uppercase font-semibold border transition-colors ${
              showBoundingBoxes ? 'bg-[#4cd7f6]/20 border-[#4cd7f6] text-[#4cd7f6]' : 'bg-[#171b26] border-[#313540] text-[#d8c3ad]'
            }`}
            title="Toggle AI Bounding Boxes"
          >
            AI BOXES: {showBoundingBoxes ? 'ON' : 'OFF'}
          </button>
        </div>
      </div>

      {/* Simulated Road Surface Image with AI Bounding Boxes */}
      <div className={`relative w-full h-72 bg-[#0a0e18] overflow-hidden select-none transition-all ${isCapturing ? 'brightness-150' : ''}`}>
        <img
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDUlg741_UN9omTmJ-uhJMnF7_5Fim10By0D4Js9vEJJtRuTsgEdy7wLnHC4YbTuX3nYjeI-gIZn35eSZ7Etoh9FNWTKzPElUs84S9BcFhQE_wpN6dm5Jq33Mjep9HliAJo4lgZh0efK4CSUGOT1K4GDD3CsdaM8x4CuO9FWxBOdOfebDcdPz6RZjkg_dWTfCyXTzy8QRUt99Ly2Ut86otLVYz0KqVdjjCoGt5aXs6xp5D_XfUf0QG88Q"
          alt="Dashboard camera feed with road defect telemetry"
          className={`w-full h-full object-cover opacity-85 transition-transform duration-300 ${
            isZoomed ? 'scale-125' : 'scale-100'
          }`}
        />

        {/* AI Computer Vision HUD Overlay Graphics */}
        <div className="absolute inset-0 pointer-events-none p-3 flex flex-col justify-between">
          
          {/* Top HUD Stream Telemetry */}
          <div className="flex items-center justify-between text-[#dfe2f1] font-mono text-[11px] bg-[#0a0e18]/80 px-2.5 py-1 rounded backdrop-blur-sm max-w-max border border-[#313540]">
            <span className="text-[#4cd7f6] font-bold">LAT: {activeVehicle.lat.toFixed(4)}° N</span>
            <span className="mx-2 text-[#313540]">|</span>
            <span className="text-[#4cd7f6] font-bold">LONG: {activeVehicle.long.toFixed(4)}° W</span>
            <span className="mx-2 text-[#313540]">|</span>
            <span className="text-[#ffc174] font-bold">SPEED: {activeVehicle.speedMph} MPH</span>
            <span className="mx-2 text-[#313540]">|</span>
            <span className="text-[#dfe2f1]">{utcTime}</span>
          </div>

          {/* Interactive Bounding Boxes */}
          {showBoundingBoxes && (
            <>
              {/* Bounding Box 1: Neon Amber Box (Pothole Defect) */}
              <div className="absolute top-[42%] left-[18%] w-48 h-28 pointer-events-auto group cursor-crosshair">
                <div className="w-full h-full border-2 border-[#f59e0b] bg-[#f59e0b]/10 relative rounded-sm shadow-[0_0_12px_rgba(245,158,11,0.4)]">
                  <span className="absolute -top-6 left-0 px-1.5 py-0.5 bg-[#f59e0b] text-[#613b00] font-mono text-[10px] font-bold tracking-tight rounded-t shadow-sm whitespace-nowrap">
                    Pothole: 94.2% Conf | Est Depth: 8.5cm | Vol: 0.12 m³
                  </span>
                  {/* Corner tactical brackets */}
                  <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-[#ffc174]"></div>
                  <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-[#ffc174]"></div>
                </div>
              </div>

              {/* Bounding Box 2: Neon Red Box (Severe Transverse Crack) */}
              <div className="absolute top-[60%] left-[55%] w-44 h-20 pointer-events-auto group cursor-crosshair">
                <div className="w-full h-full border-2 border-[#ffb4ab] bg-[#93000a]/20 relative rounded-sm shadow-[0_0_14px_rgba(255,180,171,0.5)]">
                  <span className="absolute -top-6 left-0 px-1.5 py-0.5 bg-[#ffb4ab] text-[#690005] font-mono text-[10px] font-bold tracking-tight rounded-t shadow-sm whitespace-nowrap">
                    Severe Transverse Crack: 98.7% Conf | Length: 3.2m
                  </span>
                  {/* Corner tactical brackets */}
                  <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-[#ffb4ab]"></div>
                  <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-[#ffb4ab]"></div>
                </div>
              </div>
            </>
          )}

          {/* Quick HUD Camera Controls */}
          <div className="absolute right-3 top-3 pointer-events-auto flex items-center gap-1.5">
            <button
              onClick={() => setIsZoomed(!isZoomed)}
              className="p-1.5 bg-[#0a0e18]/80 hover:bg-[#262a35] text-[#dfe2f1] rounded border border-[#313540] transition-colors"
              title={isZoomed ? 'Zoom 1x' : 'Digital Zoom 1.25x'}
            >
              <span className="material-symbols-outlined text-sm">
                {isZoomed ? 'zoom_out' : 'zoom_in'}
              </span>
            </button>
            <button
              onClick={handleCaptureSnapshot}
              className="p-1.5 bg-[#0a0e18]/80 hover:bg-[#262a35] text-[#dfe2f1] rounded border border-[#313540] transition-colors"
              title="Capture Telemetry Snapshot"
            >
              <span className="material-symbols-outlined text-sm">photo_camera</span>
            </button>
          </div>

          {/* Bottom Reticle & Crosshairs Coordinates */}
          <div className="flex items-end justify-between">
            <div className="px-2 py-0.5 bg-[#0a0e18]/80 rounded backdrop-blur-sm text-[10px] font-mono text-[#d8c3ad] border border-[#313540]">
              <span>MODEL: YOLO-RoadDefect-v9x [FP16 TensorRT]</span>
            </div>
            <div className="flex items-center gap-1.5 px-2 py-0.5 bg-[#0a0e18]/80 rounded backdrop-blur-sm text-[10px] font-mono text-[#4cd7f6] border border-[#313540]">
              <span className="material-symbols-outlined text-xs">adjust</span>
              <span>OPTICAL TRACKER: LOCKED</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
