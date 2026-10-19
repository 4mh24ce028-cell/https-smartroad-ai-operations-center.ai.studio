import React, { useState } from 'react';

interface SafetyReportsScreenProps {
  onExportDotReport: () => void;
}

export const SafetyReportsScreen: React.FC<SafetyReportsScreenProps> = ({
  onExportDotReport
}) => {
  const [reportPeriod, setReportPeriod] = useState('OCTOBER_2026');
  const [reportType, setReportType] = useState('FHWA_SECTION_119');

  const handleDownloadCsv = () => {
    const csvContent = `data:text/csv;charset=utf-8,` + 
      `Corridor,PCI Score,IRI Roughness,P1 Defects,P2 Defects,SLA Compliance,Safety Rating\n` +
      `Route 93 North,62,142 in/mi,8,22,100.0%,B-\n` +
      `Massachusetts Ave,58,168 in/mi,11,29,98.4%,C+\n` +
      `Commonwealth Ave,69,118 in/mi,5,18,100.0%,B\n` +
      `Storrow Drive,81,84 in/mi,1,9,100.0%,A-\n` +
      `Harbor Commercial Bypass,88,72 in/mi,0,6,100.0%,A`;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SmartRoad_DOT_Safety_Audit_${reportPeriod}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full flex flex-col gap-6 p-4 sm:p-6 bg-[#0f131d]">
      
      {/* Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-[#171b26] rounded-xl border border-[#313540]">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#03b5d3] text-xl">shield</span>
            <h1 className="text-xl font-bold text-[#dfe2f1]">
              Road Safety Index &amp; DOT Compliance Reports
            </h1>
          </div>
          <p className="font-mono text-xs text-[#d8c3ad] mt-0.5">
            Federal Highway Administration (FHWA) and Department of Transportation (DOT) certified roadway safety audits
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadCsv}
            className="px-3 py-1.5 bg-[#1c1f2a] hover:bg-[#262a35] text-[#dfe2f1] border border-[#313540] rounded font-mono text-xs uppercase transition-all flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-sm">download</span>
            Download CSV Data
          </button>
          <button
            onClick={onExportDotReport}
            className="px-3 py-1.5 bg-[#4cd7f6] text-[#003640] font-bold rounded font-mono text-xs uppercase hover:brightness-110 transition-all flex items-center gap-1.5 shadow-sm"
          >
            <span className="material-symbols-outlined text-sm">assignment_returned</span>
            Generate Official DOT Report
          </button>
        </div>
      </div>

      {/* Safety Matrix Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Main Composite Safety Score */}
        <div className="p-6 bg-[#1c1f2a] rounded-xl border border-[#313540] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-[#313540]">
              <span className="font-mono text-xs font-bold text-[#d8c3ad] uppercase">
                Municipal Road Safety Index
              </span>
              <span className="font-mono text-[10px] text-[#4cd7f6] bg-[#4cd7f6]/10 px-2 py-0.5 rounded border border-[#4cd7f6]/20">
                OCTOBER 2026 AUDIT
              </span>
            </div>
            
            <div className="flex items-baseline gap-3 my-4">
              <span className="font-mono text-5xl font-bold text-[#dfe2f1]">86.4</span>
              <span className="font-mono text-sm text-[#d8c3ad]">/ 100</span>
              <span className="px-2.5 py-1 bg-[#313540] text-[#acedff] font-mono text-xs font-bold rounded">
                GRADE B+
              </span>
            </div>

            <p className="text-xs text-[#d8c3ad] leading-relaxed">
              Composite index calculated from real-time road profile roughness (IRI), pothole severity frequency, cyclist collision risk, and contractor remediation turnaround speed.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-[#313540] flex justify-between font-mono text-xs">
            <span className="text-[#4cd7f6]">▲ +2.1 pts vs prev month</span>
            <span className="text-[#dfe2f1]">City Target: 90.0</span>
          </div>
        </div>

        {/* Roughness IRI Index */}
        <div className="p-6 bg-[#1c1f2a] rounded-xl border border-[#313540] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-[#313540]">
              <span className="font-mono text-xs font-bold text-[#d8c3ad] uppercase">
                International Roughness Index (IRI)
              </span>
              <span className="font-mono text-[10px] text-[#ffc174]">FHWA STANDARD</span>
            </div>

            <div className="space-y-3 my-4">
              <div>
                <div className="flex justify-between font-mono text-xs mb-1">
                  <span className="text-[#4cd7f6] font-bold">Good (&lt;95 in/mi)</span>
                  <span className="text-[#dfe2f1]">64% of network</span>
                </div>
                <div className="w-full bg-[#0a0e18] rounded-full h-2">
                  <div className="bg-[#4cd7f6] h-full rounded-full" style={{ width: '64%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between font-mono text-xs mb-1">
                  <span className="text-[#ffc174] font-bold">Acceptable (95-170 in/mi)</span>
                  <span className="text-[#dfe2f1]">28% of network</span>
                </div>
                <div className="w-full bg-[#0a0e18] rounded-full h-2">
                  <div className="bg-[#ffc174] h-full rounded-full" style={{ width: '28%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between font-mono text-xs mb-1">
                  <span className="text-[#ffb4ab] font-bold">Poor / Deteriorated (&gt;170 in/mi)</span>
                  <span className="text-[#dfe2f1]">8% of network</span>
                </div>
                <div className="w-full bg-[#0a0e18] rounded-full h-2">
                  <div className="bg-[#ffb4ab] h-full rounded-full" style={{ width: '8%' }}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-[#313540] font-mono text-xs text-[#d8c3ad]">
            Measured via LiDAR profilometer on Patrol Vans #04 &amp; #07
          </div>
        </div>

        {/* Hazard Prevention & Impact Metric */}
        <div className="p-6 bg-[#1c1f2a] rounded-xl border border-[#313540] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-[#313540]">
              <span className="font-mono text-xs font-bold text-[#d8c3ad] uppercase">
                Citizen Liability Risk Mitigation
              </span>
              <span className="material-symbols-outlined text-[#ffc174] text-base">verified_user</span>
            </div>

            <div className="my-4">
              <span className="font-mono text-4xl font-bold text-[#ffc174]">$312,000</span>
              <p className="font-mono text-xs text-[#4cd7f6] mt-1">
                Estimated Tort Claim &amp; Vehicle Damage Savings
              </p>
              <p className="text-xs text-[#d8c3ad] mt-3 leading-relaxed">
                By maintaining a sub-2 hour rapid infill turnaround on P1 voids, municipal liability exposure for tire blowouts, rim fractures, and cyclist falls is reduced by 83.2%.
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-[#313540] flex justify-between font-mono text-xs">
            <span className="text-[#d8c3ad]">P1 Emergency Patches:</span>
            <span className="text-[#ffb4ab] font-bold">29 Resolved</span>
          </div>
        </div>

      </div>

      {/* Safety Index by Roadways Table */}
      <div className="w-full p-4 bg-[#1c1f2a] rounded-xl border border-[#313540] flex flex-col gap-3">
        <div className="flex items-center justify-between pb-2 border-b border-[#313540]">
          <span className="font-mono text-xs font-bold text-[#dfe2f1] uppercase">
            Functional Classification Roadway Safety Breakdown
          </span>
          <span className="font-mono text-[10px] text-[#d8c3ad]">WGS 84 GEOCODED</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-[#313540] text-[#d8c3ad] text-[10px] uppercase font-bold tracking-wider">
                <th className="py-2.5 px-3">Class Description</th>
                <th className="py-2.5 px-3">Mileage Scanned</th>
                <th className="py-2.5 px-3">Safety Index</th>
                <th className="py-2.5 px-3">Avg IRI Roughness</th>
                <th className="py-2.5 px-3">P1 Defect Density</th>
                <th className="py-2.5 px-3">Target Standard</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#313540]/60">
              {[
                { name: 'Principal Arterial Corridors', miles: '246 mi', score: 82.1, iri: '112 in/mi', density: '0.42 / mi', target: '85.0' },
                { name: 'Minor Arterials & Transit Connectors', miles: '380 mi', score: 84.6, iri: '98 in/mi', density: '0.31 / mi', target: '85.0' },
                { name: 'Collector Streets & Industrial Loops', miles: '412 mi', score: 88.9, iri: '86 in/mi', density: '0.19 / mi', target: '80.0' },
                { name: 'Protected Bicycle Lanes & Micro-Mobility', miles: '124 mi', score: 79.4, iri: '138 in/mi', density: '0.64 / mi', target: '85.0' },
                { name: 'Residential Neighborhood Grids', miles: '820 mi', score: 89.2, iri: '82 in/mi', density: '0.14 / mi', target: '80.0' }
              ].map(r => (
                <tr key={r.name} className="hover:bg-[#262a35]/60 transition-colors">
                  <td className="py-3 px-3 font-semibold text-[#dfe2f1] font-sans">{r.name}</td>
                  <td className="py-3 px-3 text-[#d8c3ad]">{r.miles}</td>
                  <td className="py-3 px-3 font-bold text-[#4cd7f6]">{r.score}</td>
                  <td className="py-3 px-3 text-[#dfe2f1]">{r.iri}</td>
                  <td className="py-3 px-3 text-[#ffc174]">{r.density}</td>
                  <td className="py-3 px-3 text-[#d8c3ad] font-bold">{r.target}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
