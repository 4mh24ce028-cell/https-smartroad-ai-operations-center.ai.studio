import React, { useState, useEffect } from 'react';

interface AerialScanModalProps {
  isOpen: boolean;
  onClose: () => void;
  district: string;
  onScanCompleted: (newDefectsFound: number) => void;
}

export const AerialScanModal: React.FC<AerialScanModalProps> = ({
  isOpen,
  onClose,
  district,
  onScanCompleted
}) => {
  const [scanProgress, setScanProgress] = useState(0);
  const [scanStatus, setScanStatus] = useState<'PREPARING' | 'IN_FLIGHT' | 'COMPLETED'>('PREPARING');
  const [detectionsCount, setDetectionsCount] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      setScanProgress(0);
      setScanStatus('PREPARING');
      setDetectionsCount(0);
      return;
    }

    setScanStatus('IN_FLIGHT');
    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setScanStatus('COMPLETED');
          onScanCompleted(3);
          return 100;
        }
        if (prev === 30 || prev === 65 || prev === 90) {
          setDetectionsCount(c => c + 1);
        }
        return prev + 5;
      });
    }, 250);

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0a0e18]/85 backdrop-blur-md">
      <div className="w-full max-w-xl bg-[#171b26] border border-[#313540] rounded-xl shadow-2xl p-6 flex flex-col gap-5 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#313540]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#4cd7f6] text-xl animate-pulse">flight_takeoff</span>
            <div>
              <h3 className="text-base font-bold text-[#dfe2f1]">
                Autonomous UAV Aerial Scan Mission
              </h3>
              <p className="font-mono text-xs text-[#d8c3ad]">Unit: UAV Alpha • Thermal &amp; High-Res RGB Ortho-Imaging</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-[#d8c3ad] hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* Flight Telemetry Status */}
        <div className="grid grid-cols-3 gap-3 font-mono text-xs">
          <div className="p-3 bg-[#1c1f2a] rounded-lg border border-[#313540]">
            <span className="text-[10px] text-[#d8c3ad] block">SURVEY DISTRICT</span>
            <span className="text-sm font-bold text-[#dfe2f1]">{district}</span>
          </div>
          <div className="p-3 bg-[#1c1f2a] rounded-lg border border-[#313540]">
            <span className="text-[10px] text-[#d8c3ad] block">ALTITUDE / SPEED</span>
            <span className="text-sm font-bold text-[#4cd7f6]">60m • 24 MPH</span>
          </div>
          <div className="p-3 bg-[#1c1f2a] rounded-lg border border-[#313540]">
            <span className="text-[10px] text-[#d8c3ad] block">ANOMALIES LOGGED</span>
            <span className="text-sm font-bold text-[#ffc174]">{detectionsCount} Found</span>
          </div>
        </div>

        {/* Live Progress Bar */}
        <div className="flex flex-col gap-2 font-mono">
          <div className="flex justify-between text-xs">
            <span className="text-[#dfe2f1]">
              {scanStatus === 'IN_FLIGHT' ? 'Scanning Arterial Corridors & Highway Links...' : 'Survey Mission Complete'}
            </span>
            <span className="text-[#4cd7f6] font-bold">{scanProgress}%</span>
          </div>
          <div className="w-full bg-[#0a0e18] rounded-full h-3 overflow-hidden border border-[#313540]">
            <div 
              className="bg-gradient-to-r from-[#4cd7f6] to-[#ffc174] h-full transition-all duration-200"
              style={{ width: `${scanProgress}%` }}
            />
          </div>
        </div>

        {/* Simulated Waypoints Feed */}
        <div className="p-3 bg-[#0a0e18] rounded-lg border border-[#313540] font-mono text-xs space-y-1.5 max-h-36 overflow-y-auto">
          <div className="text-[10px] text-[#d8c3ad] uppercase font-bold border-b border-[#313540] pb-1">
            Telemetry Waypoint Logs
          </div>
          <div className="text-[#4cd7f6] text-[11px]">✓ WP 01: Takeoff from Central Depot Pad - Nominal</div>
          {scanProgress >= 25 && (
            <div className="text-[#dfe2f1] text-[11px]">✓ WP 02: Route 93 North Interchange - Pavement scan active</div>
          )}
          {scanProgress >= 50 && (
            <div className="text-[#ffc174] text-[11px]">! WP 03: DEF-9915 New Pothole detected (depth 7.2cm) at Exit 24</div>
          )}
          {scanProgress >= 75 && (
            <div className="text-[#dfe2f1] text-[11px]">✓ WP 04: Charles River Dam corridor - Thermal profiling clear</div>
          )}
          {scanProgress >= 100 && (
            <div className="text-[#4cd7f6] text-[11px] font-bold">✓ Mission Complete: 14.8 km surveyed. Data ingested into GIS Canopy.</div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#313540]">
          {scanStatus === 'COMPLETED' ? (
            <button
              onClick={onClose}
              className="px-4 py-2 bg-[#4cd7f6] text-[#003640] font-bold rounded font-mono text-xs uppercase hover:brightness-110"
            >
              Close &amp; View Updated GIS Map
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-4 py-2 bg-[#262a35] text-[#dfe2f1] rounded font-mono text-xs"
            >
              Run in Background
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
