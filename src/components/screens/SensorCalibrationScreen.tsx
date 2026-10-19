import React, { useState } from 'react';
import { PatrolVehicle } from '../../types';

interface SensorCalibrationScreenProps {
  vehicles: PatrolVehicle[];
}

export const SensorCalibrationScreen: React.FC<SensorCalibrationScreenProps> = ({
  vehicles
}) => {
  const [selectedVehicleId, setSelectedVehicleId] = useState(vehicles[0]?.id || 'veh-04');
  const [isCalibrating, setIsCalibrating] = useState(false);
  const [calibrationSuccess, setCalibrationSuccess] = useState(false);

  const selectedVehicle = vehicles.find(v => v.id === selectedVehicleId) || vehicles[0];

  const handleRunCalibration = () => {
    setIsCalibrating(true);
    setCalibrationSuccess(false);
    setTimeout(() => {
      setIsCalibrating(false);
      setCalibrationSuccess(true);
      setTimeout(() => setCalibrationSuccess(false), 4000);
    }, 1500);
  };

  return (
    <div className="w-full flex flex-col gap-6 p-4 sm:p-6 bg-[#0f131d]">
      
      {/* Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-[#171b26] rounded-xl border border-[#313540]">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#4cd7f6] text-xl">sensors</span>
            <h1 className="text-xl font-bold text-[#dfe2f1]">
              LIDAR &amp; Optical Camera Calibration Deck
            </h1>
          </div>
          <p className="font-mono text-xs text-[#d8c3ad] mt-0.5">
            Stereoscopic vision synchronization, LiDAR IMU drift compensation, and GNSS RTK positioning verification
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-3 py-1 bg-[#262a35] text-[#4cd7f6] rounded font-mono text-xs border border-[#4cd7f6]/30">
            139 / 142 NODES ONLINE
          </span>
          <button
            onClick={handleRunCalibration}
            disabled={isCalibrating}
            className="px-3 py-1.5 bg-[#ffc174] text-[#472a00] font-bold rounded font-mono text-xs uppercase hover:brightness-110 transition-all flex items-center gap-1.5 shadow-sm"
          >
            {isCalibrating ? (
              <>
                <span className="material-symbols-outlined text-sm animate-spin">refresh</span>
                Zeroing IMU &amp; Lens...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-sm">tune</span>
                Run Auto-Calibration Sequence
              </>
            )}
          </button>
        </div>
      </div>

      {calibrationSuccess && (
        <div className="p-3 bg-[#4cd7f6]/10 border border-[#4cd7f6] rounded-lg text-xs font-mono text-[#4cd7f6] flex items-center justify-between">
          <span className="flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">verified</span>
            Stereo Disparity &amp; IMU Calibration Matrix updated for {selectedVehicle.name}. Drift compensation re-zeroed.
          </span>
          <span className="text-[#dfe2f1]">RTK DELTA: 0.002m</span>
        </div>
      )}

      {/* Grid split: Vehicle selector & Live Diagnostics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 4: Edge Survey Fleet List */}
        <div className="lg:col-span-4 p-4 bg-[#1c1f2a] rounded-xl border border-[#313540] flex flex-col gap-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#313540]">
            <span className="font-mono text-xs font-bold text-[#dfe2f1] uppercase">
              Survey Fleet Units
            </span>
            <span className="font-mono text-[10px] text-[#4cd7f6]">SELECT TO INSPECT</span>
          </div>

          <div className="space-y-2">
            {vehicles.map(v => (
              <div
                key={v.id}
                onClick={() => setSelectedVehicleId(v.id)}
                className={`p-3 rounded-lg border cursor-pointer transition-all ${
                  selectedVehicleId === v.id
                    ? 'bg-[#262a35] border-[#4cd7f6] shadow-[0_0_10px_rgba(76,215,246,0.15)]'
                    : 'bg-[#171b26] border-[#313540] hover:bg-[#262a35]'
                }`}
              >
                <div className="flex items-center justify-between font-mono text-xs">
                  <span className="text-[#dfe2f1] font-bold">{v.name}</span>
                  <span className="text-[#4cd7f6]">{v.fps} FPS</span>
                </div>
                <div className="font-mono text-[10px] text-[#d8c3ad] mt-1 flex justify-between">
                  <span>{v.camId}</span>
                  <span className="text-[#ffc174]">{v.status}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 bg-[#171b26] rounded-lg border border-[#313540] font-mono text-xs space-y-1.5">
            <div className="text-[10px] text-[#d8c3ad] uppercase font-bold">Edge Sensor Architecture</div>
            <div className="text-[#dfe2f1] flex justify-between">
              <span>Primary Optical:</span>
              <span className="text-[#4cd7f6]">Sony IMX477 4K HDR</span>
            </div>
            <div className="text-[#dfe2f1] flex justify-between">
              <span>LiDAR Unit:</span>
              <span className="text-[#4cd7f6]">Velodyne Ultra Puck 32</span>
            </div>
            <div className="text-[#dfe2f1] flex justify-between">
              <span>Edge Compute:</span>
              <span className="text-[#ffc174]">NVIDIA Jetson Orin 64GB</span>
            </div>
          </div>
        </div>

        {/* Right 8: Diagnostic Readout & Sensor Calibration Matrix */}
        <div className="lg:col-span-8 p-4 bg-[#1c1f2a] rounded-xl border border-[#313540] flex flex-col gap-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#313540]">
            <div>
              <span className="font-mono text-sm font-bold text-[#dfe2f1] block">
                {selectedVehicle.name} • Hardware Diagnostics
              </span>
              <span className="font-mono text-xs text-[#d8c3ad]">
                Assigned to: {selectedVehicle.operator}
              </span>
            </div>
            <span className="px-2 py-0.5 bg-[#4cd7f6]/20 text-[#4cd7f6] font-mono text-xs font-bold rounded border border-[#4cd7f6]/30">
              STATUS: NOMINAL
            </span>
          </div>

          {/* Telemetry Matrix Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono">
            <div className="p-3 bg-[#171b26] rounded-lg border border-[#313540]">
              <span className="text-[10px] text-[#d8c3ad] block">LIDAR RETURN RATE</span>
              <span className="text-xl font-bold text-[#4cd7f6]">1,240,000</span>
              <span className="text-[10px] text-[#d8c3ad] block">points / second</span>
            </div>
            <div className="p-3 bg-[#171b26] rounded-lg border border-[#313540]">
              <span className="text-[10px] text-[#d8c3ad] block">GNSS RTK ACCURACY</span>
              <span className="text-xl font-bold text-[#ffc174]">± 0.012 m</span>
              <span className="text-[10px] text-[#d8c3ad] block">Centimeter Level Fix</span>
            </div>
            <div className="p-3 bg-[#171b26] rounded-lg border border-[#313540]">
              <span className="text-[10px] text-[#d8c3ad] block">IMU GYRO DRIFT</span>
              <span className="text-xl font-bold text-[#dfe2f1]">0.003 °/s</span>
              <span className="text-[10px] text-[#4cd7f6] block">Inside Threshold</span>
            </div>
          </div>

          {/* Optical Matrix Specification */}
          <div className="p-4 bg-[#171b26] rounded-lg border border-[#313540] flex flex-col gap-3 font-mono text-xs">
            <span className="text-[11px] font-bold text-[#d8c3ad] uppercase">
              Optical Intrinsic &amp; Extrinsic Calibration Matrix
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div className="p-2 bg-[#0a0e18] rounded border border-[#313540]">
                <span className="text-[9px] text-[#d8c3ad] block">FOCAL X (fx)</span>
                <span className="text-xs text-[#dfe2f1] font-bold">1842.14 px</span>
              </div>
              <div className="p-2 bg-[#0a0e18] rounded border border-[#313540]">
                <span className="text-[9px] text-[#d8c3ad] block">FOCAL Y (fy)</span>
                <span className="text-xs text-[#dfe2f1] font-bold">1839.88 px</span>
              </div>
              <div className="p-2 bg-[#0a0e18] rounded border border-[#313540]">
                <span className="text-[9px] text-[#d8c3ad] block">CENTER X (cx)</span>
                <span className="text-xs text-[#dfe2f1] font-bold">960.05 px</span>
              </div>
              <div className="p-2 bg-[#0a0e18] rounded border border-[#313540]">
                <span className="text-[9px] text-[#d8c3ad] block">CENTER Y (cy)</span>
                <span className="text-xs text-[#dfe2f1] font-bold">540.12 px</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-[#d8c3ad] pt-2 border-t border-[#313540]">
              <span>Radial Distortion Coefficients: k1 = -0.142, k2 = 0.084, p1 = 0.001</span>
              <span className="text-[#4cd7f6]">Polynomial Fit: 0.9994</span>
            </div>
          </div>

          {/* Synthetic LiDAR Point Cloud Viewport Simulation */}
          <div className="relative w-full h-44 bg-[#0a0e18] rounded-lg overflow-hidden border border-[#313540] flex items-center justify-center">
            {/* Ambient Point Cloud Graphic */}
            <svg className="w-full h-full opacity-60" xmlns="http://www.w3.org/2000/svg">
              <g stroke="#4cd7f6" strokeWidth="1" strokeOpacity="0.6">
                {Array.from({ length: 40 }).map((_, i) => (
                  <circle
                    key={i}
                    cx={(i * 35 + 20) % 700}
                    cy={60 + Math.sin(i * 0.5) * 30 + (i % 3) * 15}
                    r={Math.max(1, (i % 4) + 1)}
                    fill={i % 5 === 0 ? '#ffb4ab' : i % 3 === 0 ? '#ffc174' : '#4cd7f6'}
                  />
                ))}
                <line x1="20" y1="120" x2="680" y2="120" stroke="#ffc174" strokeDasharray="4 4" />
                <line x1="20" y1="140" x2="680" y2="140" stroke="#313540" />
              </g>
            </svg>

            <div className="absolute top-2 left-3 font-mono text-[10px] text-[#4cd7f6] bg-[#0a0e18]/80 px-2 py-0.5 rounded border border-[#313540]">
              POINT CLOUD SLICE // ROAD SURFACE ELEVATION (Z-AXIS)
            </div>
            <div className="absolute bottom-2 right-3 font-mono text-[10px] text-[#d8c3ad] bg-[#0a0e18]/80 px-2 py-0.5 rounded border border-[#313540]">
              SAMPLE DENSITY: 840 pts/m²
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
