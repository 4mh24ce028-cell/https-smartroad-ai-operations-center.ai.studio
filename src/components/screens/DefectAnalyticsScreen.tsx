import React, { useState } from 'react';
import { DefectItem, DefectType, SeverityLevel } from '../../types';

interface DefectAnalyticsScreenProps {
  defects: DefectItem[];
  onSelectDefectForMap: (defect: DefectItem) => void;
  onDispatchDefect: (defect: DefectItem) => void;
}

export const DefectAnalyticsScreen: React.FC<DefectAnalyticsScreenProps> = ({
  defects,
  onSelectDefectForMap,
  onDispatchDefect
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('ALL');
  const [selectedType, setSelectedType] = useState<string>('ALL');

  const filteredDefects = defects.filter((def) => {
    if (selectedSeverity !== 'ALL' && def.severity !== selectedSeverity) return false;
    if (selectedType !== 'ALL' && def.type !== selectedType) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        def.code.toLowerCase().includes(q) ||
        def.title.toLowerCase().includes(q) ||
        def.street.toLowerCase().includes(q) ||
        def.district.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="w-full flex flex-col gap-6 p-4 sm:p-6 bg-[#0f131d]">
      
      {/* Analytics Screen Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-[#171b26] rounded-xl border border-[#313540]">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#4cd7f6] text-xl">radar</span>
            <h1 className="text-xl font-bold text-[#dfe2f1]">
              Inspection &amp; Defect Inference Hub
            </h1>
          </div>
          <p className="font-mono text-xs text-[#d8c3ad] mt-0.5">
            Real-time telemetry analytics powered by edge-processed computer vision across 142 mobile municipal survey nodes
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-3 py-1 bg-[#262a35] rounded font-mono text-xs text-[#ffc174] border border-[#ffc174]/30">
            MODEL: YOLO-RoadDefect-v9x (TensorRT FP16)
          </span>
          <span className="px-3 py-1 bg-[#262a35] rounded font-mono text-xs text-[#4cd7f6] border border-[#4cd7f6]/30">
            DATA PIPELINE: 99.8% INGESTION RATE
          </span>
        </div>
      </div>

      {/* Analytics KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-[#1c1f2a] rounded-xl border border-[#313540] flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#d8c3ad] font-mono text-xs">
            <span>PAVEMENT CONDITION INDEX (PCI)</span>
            <span className="material-symbols-outlined text-[#4cd7f6] text-base">straighten</span>
          </div>
          <div className="flex items-baseline gap-2 my-2">
            <span className="font-mono text-3xl font-bold text-[#dfe2f1]">74.2</span>
            <span className="font-mono text-xs text-[#4cd7f6]">FAIR / GOOD</span>
          </div>
          <div className="w-full bg-[#0a0e18] rounded-full h-1.5 overflow-hidden">
            <div className="bg-[#4cd7f6] h-full" style={{ width: '74.2%' }}></div>
          </div>
        </div>

        <div className="p-4 bg-[#1c1f2a] rounded-xl border border-[#313540] flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#d8c3ad] font-mono text-xs">
            <span>DEFECT DENSITY</span>
            <span className="material-symbols-outlined text-[#ffc174] text-base">grid_4x4</span>
          </div>
          <div className="flex items-baseline gap-2 my-2">
            <span className="font-mono text-3xl font-bold text-[#ffc174]">3.4</span>
            <span className="font-mono text-xs text-[#d8c3ad]">anomalies / km</span>
          </div>
          <p className="font-mono text-[10px] text-[#d8c3ad]">-0.6 vs quarterly threshold</p>
        </div>

        <div className="p-4 bg-[#1c1f2a] rounded-xl border border-[#313540] flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#d8c3ad] font-mono text-xs">
            <span>TOTAL SURVEYED CORRIDORS</span>
            <span className="material-symbols-outlined text-[#dfe2f1] text-base">add_road</span>
          </div>
          <div className="flex items-baseline gap-2 my-2">
            <span className="font-mono text-3xl font-bold text-[#dfe2f1]">1,248</span>
            <span className="font-mono text-xs text-[#4cd7f6]">km mapped</span>
          </div>
          <p className="font-mono text-[10px] text-[#d8c3ad]">94.6% municipal street grid</p>
        </div>

        <div className="p-4 bg-[#1c1f2a] rounded-xl border border-[#313540] flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#d8c3ad] font-mono text-xs">
            <span>MODEL mAP@50 PRECISION</span>
            <span className="material-symbols-outlined text-[#ffb4ab] text-base">check_circle</span>
          </div>
          <div className="flex items-baseline gap-2 my-2">
            <span className="font-mono text-3xl font-bold text-[#4cd7f6]">98.4%</span>
            <span className="font-mono text-xs text-[#4cd7f6]">F1: 0.972</span>
          </div>
          <p className="font-mono text-[10px] text-[#d8c3ad]">Inference latency 42ms/frame</p>
        </div>
      </div>

      {/* Mid Split: Distribution Breakdown & Corridor PCI Heat */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 6: Defect Distribution Chart & Model Accuracy */}
        <div className="lg:col-span-6 p-4 bg-[#1c1f2a] rounded-xl border border-[#313540] flex flex-col gap-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#313540]">
            <span className="font-mono text-xs uppercase font-bold text-[#dfe2f1]">
              Anomaly Classification Distribution
            </span>
            <span className="font-mono text-[11px] text-[#4cd7f6]">1,482 TOTAL DETECTIONS</span>
          </div>

          <div className="space-y-3">
            {[
              { type: 'Potholes & Voids', count: 1104, pct: 74, color: 'bg-[#ffc174]', text: 'text-[#ffc174]' },
              { type: 'Rutting & Depressions', count: 192, pct: 13, color: 'bg-[#4cd7f6]', text: 'text-[#4cd7f6]' },
              { type: 'Alligator / Fatigue Cracks', count: 128, pct: 9, color: 'bg-[#ffb4ab]', text: 'text-[#ffb4ab]' },
              { type: 'Manhole Lip Subsidence', count: 58, pct: 4, color: 'bg-[#acedff]', text: 'text-[#acedff]' },
            ].map(row => (
              <div key={row.type} className="flex flex-col gap-1">
                <div className="flex justify-between font-mono text-xs">
                  <span className="text-[#dfe2f1] font-semibold">{row.type}</span>
                  <span className={`${row.text} font-bold`}>{row.count.toLocaleString()} ({row.pct}%)</span>
                </div>
                <div className="w-full bg-[#0a0e18] rounded-full h-2 overflow-hidden">
                  <div className={`${row.color} h-full rounded-full transition-all duration-500`} style={{ width: `${row.pct}%` }}></div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-2 pt-3 border-t border-[#313540]">
            <span className="font-mono text-[11px] text-[#d8c3ad] uppercase font-bold block mb-2">
              Autonomous YOLO Model Inference Benchmarks
            </span>
            <div className="grid grid-cols-4 gap-2 text-center font-mono">
              <div className="p-2 bg-[#171b26] rounded border border-[#313540]">
                <div className="text-[10px] text-[#d8c3ad]">POTHOLE</div>
                <div className="text-xs text-[#ffc174] font-bold">97.8%</div>
              </div>
              <div className="p-2 bg-[#171b26] rounded border border-[#313540]">
                <div className="text-[10px] text-[#d8c3ad]">CRACK</div>
                <div className="text-xs text-[#4cd7f6] font-bold">98.4%</div>
              </div>
              <div className="p-2 bg-[#171b26] rounded border border-[#313540]">
                <div className="text-[10px] text-[#d8c3ad]">RUTTING</div>
                <div className="text-xs text-[#dfe2f1] font-bold">94.1%</div>
              </div>
              <div className="p-2 bg-[#171b26] rounded border border-[#313540]">
                <div className="text-[10px] text-[#d8c3ad]">MANHOLE</div>
                <div className="text-xs text-[#acedff] font-bold">95.0%</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right 6: Corridor Condition Index Matrix */}
        <div className="lg:col-span-6 p-4 bg-[#1c1f2a] rounded-xl border border-[#313540] flex flex-col gap-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#313540]">
            <span className="font-mono text-xs uppercase font-bold text-[#dfe2f1]">
              Arterial Corridor Health &amp; PCI Scorecard
            </span>
            <span className="font-mono text-[10px] text-[#ffc174] bg-[#ffc174]/10 px-2 py-0.5 rounded border border-[#ffc174]/30">
              PRIORITY AUDIT
            </span>
          </div>

          <div className="space-y-2.5">
            {[
              { name: 'Route 93 North Arterial Corridor', length: '18.4 km', pci: 62, status: 'POOR / P1 FOCUS', p1: 8, p2: 22 },
              { name: 'Massachusetts Avenue Multi-Modal Link', length: '14.2 km', pci: 58, status: 'CRITICAL ATTENTION', p1: 11, p2: 29 },
              { name: 'Commonwealth Avenue Transit Spine', length: '15.6 km', pci: 69, status: 'MODERATE FAIR', p1: 5, p2: 18 },
              { name: 'Storrow Drive Westbound Expressway', length: '12.1 km', pci: 81, status: 'OPTIMAL / GOOD', p1: 1, p2: 9 },
              { name: 'Harbor Commercial Heavy Bypass', length: '9.8 km', pci: 88, status: 'EXCELLENT', p1: 0, p2: 6 },
            ].map(cor => (
              <div key={cor.name} className="p-2.5 bg-[#171b26] rounded-lg border border-[#313540] flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-[#dfe2f1]">{cor.name}</div>
                  <div className="font-mono text-[10px] text-[#d8c3ad] flex items-center gap-2 mt-0.5">
                    <span>{cor.length}</span>
                    <span>•</span>
                    <span className="text-[#ffb4ab] font-bold">{cor.p1} P1 Hazards</span>
                    <span>•</span>
                    <span className="text-[#ffc174]">{cor.p2} P2 Warnings</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex flex-col items-end font-mono">
                    <span className="text-sm font-bold text-[#dfe2f1]">PCI {cor.pci}</span>
                    <span className={`text-[9px] font-bold ${cor.pci < 65 ? 'text-[#ffb4ab]' : cor.pci < 75 ? 'text-[#ffc174]' : 'text-[#4cd7f6]'}`}>
                      {cor.status}
                    </span>
                  </div>
                  <div className={`w-3 h-3 rounded-full ${cor.pci < 65 ? 'bg-[#ffb4ab]' : cor.pci < 75 ? 'bg-[#ffc174]' : 'bg-[#4cd7f6]'}`}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Defect Registry Data Table with Search & Filtering */}
      <div className="w-full p-4 bg-[#1c1f2a] rounded-xl border border-[#313540] flex flex-col gap-4">
        
        {/* Table Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#313540]">
          <div>
            <h2 className="text-sm font-bold text-[#dfe2f1]">Defect Inventory &amp; Inspection Logs</h2>
            <p className="font-mono text-xs text-[#d8c3ad]">Detailed records indexed by autonomous mobile camera and LiDAR telemetry</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Search Input */}
            <div className="relative">
              <span className="material-symbols-outlined absolute left-2.5 top-2 text-[#d8c3ad] text-sm">search</span>
              <input
                type="text"
                placeholder="Search ID, Street, District..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 bg-[#0a0e18] border border-[#313540] rounded text-xs text-[#dfe2f1] focus:border-[#4cd7f6] outline-none font-mono w-56"
              />
            </div>

            {/* Severity Filter */}
            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="px-2.5 py-1.5 bg-[#0a0e18] border border-[#313540] rounded text-xs text-[#dfe2f1] font-mono outline-none cursor-pointer"
            >
              <option value="ALL">All Severities</option>
              <option value="P1_CRITICAL">P1 Critical</option>
              <option value="P2_HIGH">P2 High</option>
              <option value="P3_MEDIUM">P3 Medium</option>
            </select>

            {/* Type Filter */}
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-2.5 py-1.5 bg-[#0a0e18] border border-[#313540] rounded text-xs text-[#dfe2f1] font-mono outline-none cursor-pointer"
            >
              <option value="ALL">All Types</option>
              <option value="POTHOLE">Potholes</option>
              <option value="LONGITUDINAL_CRACK">Longitudinal Cracks</option>
              <option value="ALLIGATOR_CRACK">Alligator Cracks</option>
              <option value="RUTTING">Rutting</option>
              <option value="MANHOLE_SUBSIDENCE">Manhole Lips</option>
            </select>
          </div>
        </div>

        {/* Data Table */}
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-[#313540] text-[#d8c3ad] text-[10px] uppercase font-bold tracking-wider">
                <th className="py-2.5 px-3">Defect Code</th>
                <th className="py-2.5 px-3">Classification</th>
                <th className="py-2.5 px-3">Location / Corridor</th>
                <th className="py-2.5 px-3">Severity</th>
                <th className="py-2.5 px-3">AI Confidence</th>
                <th className="py-2.5 px-3">Sensor Source</th>
                <th className="py-2.5 px-3">Est Remediation</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#313540]/60">
              {filteredDefects.map((d) => {
                const isCrit = d.severity === 'P1_CRITICAL';
                return (
                  <tr key={d.id} className="hover:bg-[#262a35]/60 transition-colors">
                    <td className="py-3 px-3 font-bold text-[#dfe2f1]">{d.code}</td>
                    <td className="py-3 px-3 text-[#dfe2f1] font-sans font-medium">{d.title}</td>
                    <td className="py-3 px-3 text-[#d8c3ad]">
                      {d.street} <span className="text-[#313540]">|</span> {d.district}
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                        isCrit ? 'bg-[#93000a]/40 text-[#ffb4ab] border border-[#ffb4ab]/40' : 'bg-[#ffc174]/20 text-[#ffc174] border border-[#ffc174]/30'
                      }`}>
                        {isCrit ? 'P1 CRIT' : 'P2 MED'}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-bold text-[#4cd7f6]">{d.confidence.toFixed(1)}%</td>
                    <td className="py-3 px-3 text-[#d8c3ad]">{d.detectedBy}</td>
                    <td className="py-3 px-3 text-[#ffc174] font-semibold">${d.estCost.toLocaleString()}</td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onSelectDefectForMap(d)}
                          className="px-2.5 py-1 bg-[#171b26] hover:bg-[#313540] text-[#4cd7f6] rounded border border-[#313540] text-[10px] font-bold uppercase transition-all"
                          title="View on GIS Map"
                        >
                          Map View
                        </button>
                        <button
                          onClick={() => onDispatchDefect(d)}
                          className="px-2.5 py-1 bg-[#ffc174] hover:brightness-110 text-[#472a00] rounded font-bold text-[10px] uppercase transition-all"
                          title="Dispatch Contractor"
                        >
                          Dispatch
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
};
