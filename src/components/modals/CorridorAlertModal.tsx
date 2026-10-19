import React, { useState } from 'react';

interface CorridorAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  corridorName: string;
  onBroadcastSuccess: (message: string) => void;
}

export const CorridorAlertModal: React.FC<CorridorAlertModalProps> = ({
  isOpen,
  onClose,
  corridorName,
  onBroadcastSuccess
}) => {
  const [alertType, setAlertType] = useState('ROAD_HAZARD');
  const [targetChannels, setTargetChannels] = useState({
    vmsSigns: true,
    transitBus: true,
    wazeGoogle: true,
    cityPolice: true
  });
  const [isSending, setIsSending] = useState(false);

  if (!isOpen) return null;

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      onBroadcastSuccess(`Corridor advisory broadcasted across 18 Variable Message Signs & MBTA dispatch along ${corridorName}`);
      onClose();
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0a0e18]/85 backdrop-blur-md">
      <div className="w-full max-w-lg bg-[#171b26] border border-[#313540] rounded-xl shadow-2xl p-6 flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#313540]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#ffc174] text-xl">notification_important</span>
            <div>
              <h3 className="text-base font-bold text-[#dfe2f1]">
                Broadcast Corridor Alert
              </h3>
              <p className="font-mono text-xs text-[#d8c3ad]">{corridorName}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-[#d8c3ad] hover:text-white"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSendBroadcast} className="flex flex-col gap-4">
          <div>
            <label className="font-mono text-xs text-[#d8c3ad] block mb-1">ALERT CLASSIFICATION</label>
            <select
              value={alertType}
              onChange={(e) => setAlertType(e.target.value)}
              className="w-full px-3 py-2 bg-[#0a0e18] border border-[#313540] rounded text-xs text-[#dfe2f1] font-mono outline-none"
            >
              <option value="ROAD_HAZARD">Severe Pavement Hazard / Lane Caution</option>
              <option value="MAINTENANCE_CLOSURE">Emergency Paving Crew Active In Right Lane</option>
              <option value="SPEED_REDUCTION">Wet Road / Hydroplane Speed Advisory (35 MPH)</option>
            </select>
          </div>

          <div>
            <label className="font-mono text-xs text-[#d8c3ad] block mb-2">TARGET BROADCAST CHANNELS</label>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <label className="flex items-center gap-2 p-2 bg-[#1c1f2a] rounded border border-[#313540] cursor-pointer">
                <input
                  type="checkbox"
                  checked={targetChannels.vmsSigns}
                  onChange={(e) => setTargetChannels(c => ({ ...c, vmsSigns: e.target.checked }))}
                  className="accent-[#ffc174]"
                />
                <span className="text-[#dfe2f1]">18 Overhead VMS Signs</span>
              </label>

              <label className="flex items-center gap-2 p-2 bg-[#1c1f2a] rounded border border-[#313540] cursor-pointer">
                <input
                  type="checkbox"
                  checked={targetChannels.transitBus}
                  onChange={(e) => setTargetChannels(c => ({ ...c, transitBus: e.target.checked }))}
                  className="accent-[#ffc174]"
                />
                <span className="text-[#dfe2f1]">MBTA Transit Bus Telemetry</span>
              </label>

              <label className="flex items-center gap-2 p-2 bg-[#1c1f2a] rounded border border-[#313540] cursor-pointer">
                <input
                  type="checkbox"
                  checked={targetChannels.wazeGoogle}
                  onChange={(e) => setTargetChannels(c => ({ ...c, wazeGoogle: e.target.checked }))}
                  className="accent-[#ffc174]"
                />
                <span className="text-[#dfe2f1]">Waze / Google Maps API</span>
              </label>

              <label className="flex items-center gap-2 p-2 bg-[#1c1f2a] rounded border border-[#313540] cursor-pointer">
                <input
                  type="checkbox"
                  checked={targetChannels.cityPolice}
                  onChange={(e) => setTargetChannels(c => ({ ...c, cityPolice: e.target.checked }))}
                  className="accent-[#ffc174]"
                />
                <span className="text-[#dfe2f1]">Boston Police Dispatch</span>
              </label>
            </div>
          </div>

          <div className="p-3 bg-[#0a0e18] rounded-lg border border-[#313540] font-mono text-xs space-y-1">
            <span className="text-[#ffc174] font-bold block">Digital Sign Message Preview:</span>
            <div className="p-2 bg-[#111827] rounded text-[#ffc174] tracking-widest text-center border border-[#ffc174]/40 font-bold">
              CAUTION // PAVEMENT REPAIR AHEAD // REDUCE SPEED 35 MPH
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#313540]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-[#262a35] text-[#dfe2f1] rounded font-mono text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSending}
              className="px-4 py-2 bg-[#ffc174] text-[#472a00] font-bold rounded font-mono text-xs uppercase hover:brightness-110 shadow-sm flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-sm">cell_tower</span>
              {isSending ? 'Transmitting...' : 'Broadcast to Digital Signs'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
