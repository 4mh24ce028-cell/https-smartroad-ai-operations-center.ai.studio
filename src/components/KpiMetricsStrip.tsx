import React from 'react';

interface KpiMetricsStripProps {
  totalAnomalies?: number;
  criticalCount?: number;
  contractorsActive?: number;
  safetyScore?: number;
  latencyMs?: number;
  onCardClick?: (metricKey: string) => void;
}

export const KpiMetricsStrip: React.FC<KpiMetricsStripProps> = ({
  totalAnomalies = 1482,
  criticalCount = 29,
  contractorsActive = 14,
  safetyScore = 86.4,
  latencyMs = 42,
  onCardClick
}) => {
  return (
    <section className="w-full px-4 sm:px-6 py-4 bg-[#0a0e18]">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* Metric 1: Total Detected Anomalies */}
        <div 
          onClick={() => onCardClick?.('anomalies')}
          className="relative p-4 bg-[#1c1f2a] rounded-lg overflow-hidden group cursor-pointer border border-[#313540] hover:border-[#4cd7f6]/60 transition-all shadow-sm"
        >
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#4cd7f6]"></div>
          <div className="flex items-center justify-between mb-1">
            <span className="font-mono text-[10px] text-[#d8c3ad] uppercase font-bold tracking-wider">
              Total Detected Anomalies
            </span>
            <span className="material-symbols-outlined text-[#4cd7f6] text-lg">crisis_alert</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-2xl text-[#dfe2f1] font-bold">
              {totalAnomalies.toLocaleString()}
            </span>
            <span className="font-mono text-xs text-[#4cd7f6] font-medium">+18 / 24h</span>
          </div>
          <div className="mt-1 flex items-center justify-between text-[#d8c3ad] font-mono text-[10px]">
            <span>Corridor coverage: 94.6%</span>
            <span className="text-[#4cd7f6]">LIVE SYNC</span>
          </div>
        </div>

        {/* Metric 2: Critical Potholes / Fissures */}
        <div 
          onClick={() => onCardClick?.('critical')}
          className="relative p-4 bg-[#1c1f2a] rounded-lg overflow-hidden group cursor-pointer border border-[#93000a]/50 hover:border-[#ffb4ab] transition-all shadow-sm"
        >
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#ffb4ab]"></div>
          <div className="flex items-center justify-between mb-1">
            <span className="font-mono text-[10px] text-[#ffb4ab] uppercase font-bold tracking-wider flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ffb4ab] animate-ping"></span>
              Critical Potholes / Fissures
            </span>
            <span className="material-symbols-outlined text-[#ffb4ab] text-lg">warning</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-2xl text-[#ffb4ab] font-bold">
              {criticalCount}
            </span>
            <span className="font-mono text-[9px] font-bold text-[#ffb4ab] px-1.5 py-0.5 rounded bg-[#93000a]/40 border border-[#ffb4ab]/30">
              ACTION &lt;48H
            </span>
          </div>
          <div className="mt-1 flex items-center justify-between text-[#d8c3ad] font-mono text-[10px]">
            <span>Requires Emergency Patching</span>
            <span className="text-[#ffb4ab] font-bold">P1 ESCALATED</span>
          </div>
        </div>

        {/* Metric 3: Contractors Dispatched */}
        <div 
          onClick={() => onCardClick?.('contractors')}
          className="relative p-4 bg-[#1c1f2a] rounded-lg overflow-hidden group cursor-pointer border border-[#313540] hover:border-[#ffc174]/60 transition-all shadow-sm"
        >
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#ffc174]"></div>
          <div className="flex items-center justify-between mb-1">
            <span className="font-mono text-[10px] text-[#d8c3ad] uppercase font-bold tracking-wider">
              Contractors Dispatched
            </span>
            <span className="material-symbols-outlined text-[#ffc174] text-lg">engineering</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-2xl text-[#ffc174] font-bold">
              {contractorsActive}
            </span>
            <span className="font-mono text-xs text-[#dfe2f1] font-medium">Active Crews</span>
          </div>
          <div className="mt-1 flex items-center justify-between text-[#d8c3ad] font-mono text-[10px]">
            <span>Spread across 6 municipal zones</span>
            <span className="text-[#ffc174] font-bold">100% SLA COMPLIANT</span>
          </div>
        </div>

        {/* Metric 4: Road Safety Index */}
        <div 
          onClick={() => onCardClick?.('safety')}
          className="relative p-4 bg-[#1c1f2a] rounded-lg overflow-hidden group cursor-pointer border border-[#313540] hover:border-[#4cd7f6]/60 transition-all shadow-sm"
        >
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#03b5d3]"></div>
          <div className="flex items-center justify-between mb-1">
            <span className="font-mono text-[10px] text-[#d8c3ad] uppercase font-bold tracking-wider">
              Road Safety Index
            </span>
            <span className="material-symbols-outlined text-[#03b5d3] text-lg">shield</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-2xl text-[#dfe2f1] font-bold">
              {safetyScore.toFixed(1)}
            </span>
            <span className="font-mono text-xs text-[#d8c3ad]">/ 100</span>
            <span className="font-mono text-[9px] font-bold text-[#acedff] bg-[#313540] px-1.5 py-0.5 rounded">
              RATING: B+
            </span>
          </div>
          <div className="mt-1 flex items-center justify-between text-[#d8c3ad] font-mono text-[10px]">
            <span className="text-[#4cd7f6] flex items-center gap-0.5 font-medium">
              ▲ +2.1 pts vs prev mo
            </span>
            <span>Target: 90.0</span>
          </div>
        </div>

        {/* Metric 5: Inference & Edge Latency */}
        <div 
          onClick={() => onCardClick?.('latency')}
          className="relative p-4 bg-[#1c1f2a] rounded-lg overflow-hidden group cursor-pointer border border-[#313540] hover:border-[#ffb95f]/60 transition-all shadow-sm"
        >
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#ffb95f]"></div>
          <div className="flex items-center justify-between mb-1">
            <span className="font-mono text-[10px] text-[#d8c3ad] uppercase font-bold tracking-wider">
              Inference &amp; Edge Latency
            </span>
            <span className="material-symbols-outlined text-[#ffb95f] text-lg">memory</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-2xl text-[#ffb95f] font-bold">
              {latencyMs}<span className="text-sm font-normal">ms</span>
            </span>
            <span className="font-mono text-xs text-[#d8c3ad]">avg compute</span>
          </div>
          <div className="mt-1 flex items-center justify-between text-[#d8c3ad] font-mono text-[10px]">
            <span>142 Active Mobile/UAV feeds</span>
            <span className="text-[#4cd7f6] font-bold">99.8% FPS OK</span>
          </div>
        </div>

      </div>
    </section>
  );
};
