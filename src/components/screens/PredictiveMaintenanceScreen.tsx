import React, { useState, useMemo } from 'react';
import { PredictiveRoadSegment } from '../../types';
import { PREDICTIVE_ROAD_SEGMENTS } from '../../data/mockData';

interface PredictiveMaintenanceScreenProps {
  onScheduleIntervention: (segment: PredictiveRoadSegment) => void;
}

export const PredictiveMaintenanceScreen: React.FC<PredictiveMaintenanceScreenProps> = ({
  onScheduleIntervention
}) => {
  const [segments, setSegments] = useState<PredictiveRoadSegment[]>(PREDICTIVE_ROAD_SEGMENTS);
  const [selectedSegmentId, setSelectedSegmentId] = useState<string>(PREDICTIVE_ROAD_SEGMENTS[0].id);
  const [weatherSeverity, setWeatherSeverity] = useState<'MILD' | 'NORMAL' | 'SEVERE'>('NORMAL');
  const [trafficVolumeShift, setTrafficVolumeShift] = useState<number>(0); // 0%, +15%, +30%
  const [showAllCorridors, setShowAllCorridors] = useState<boolean>(false);
  const [searchFilter, setSearchFilter] = useState('');
  const [riskFilter, setRiskFilter] = useState<string>('ALL');

  // Multiplier calculation for environmental simulator
  const weatherMultiplier = weatherSeverity === 'MILD' ? 0.8 : weatherSeverity === 'NORMAL' ? 1.0 : 1.35;
  const trafficMultiplier = 1 + (trafficVolumeShift / 100);
  const totalMultiplier = weatherMultiplier * trafficMultiplier;

  // Selected Segment with dynamic simulation adjustments
  const rawSelectedSegment = segments.find(s => s.id === selectedSegmentId) || segments[0];

  const simulatedSelectedSegment = useMemo(() => {
    const adjDecay = rawSelectedSegment.decayRatePtsPerMonth * totalMultiplier;
    const pointsAboveThreshold = Math.max(0, rawSelectedSegment.currentPci - rawSelectedSegment.failureThresholdPci);
    const monthsLeft = pointsAboveThreshold / adjDecay;
    const daysLeft = Math.max(1, Math.round(monthsLeft * 30));

    // Recalculate forecast points
    const updatedTrend = rawSelectedSegment.monthlyTrend.map(pt => {
      if (!pt.isForecast) return pt;
      // Calculate how many months past current (Oct)
      const forecastIndex = pt.month === 'Nov' ? 1 : pt.month === 'Dec' ? 2 : 3;
      const forecastedPci = Math.max(20, Math.round(rawSelectedSegment.currentPci - (adjDecay * forecastIndex)));
      const forecastedDefects = Math.round(pt.defects * totalMultiplier);
      return {
        ...pt,
        pci: forecastedPci,
        defects: forecastedDefects
      };
    });

    return {
      ...rawSelectedSegment,
      decayRatePtsPerMonth: Number(adjDecay.toFixed(1)),
      estimatedDaysToFailure: daysLeft,
      monthlyTrend: updatedTrend
    };
  }, [rawSelectedSegment, totalMultiplier]);

  // Filtered segments table
  const filteredSegments = segments.filter(seg => {
    if (riskFilter !== 'ALL' && seg.riskLevel !== riskFilter) return false;
    if (searchFilter) {
      const q = searchFilter.toLowerCase();
      return (
        seg.name.toLowerCase().includes(q) ||
        seg.corridor.toLowerCase().includes(q) ||
        seg.district.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Calculate high-level summary KPIs
  const criticalCount = segments.filter(s => s.estimatedDaysToFailure <= 25).length;
  const totalSavings = segments.reduce((acc, s) => acc + s.savingsEstimate, 0);

  // SVG Chart Dimensions
  const chartWidth = 720;
  const chartHeight = 260;
  const padding = { top: 25, right: 35, bottom: 40, left: 50 };
  const graphWidth = chartWidth - padding.left - padding.right;
  const graphHeight = chartHeight - padding.top - padding.bottom;

  // PCI scale: 20 to 100
  const minPci = 20;
  const maxPci = 100;
  const getY = (pci: number) => padding.top + graphHeight - ((pci - minPci) / (maxPci - minPci)) * graphHeight;
  const getX = (index: number, total: number) => padding.left + (index / (total - 1)) * graphWidth;

  // Threshold Y line (PCI = 40)
  const failureThresholdY = getY(40);

  // Generate SVG path for trend points
  const generatePath = (points: { pci: number }[]) => {
    return points.reduce((acc, pt, idx) => {
      const x = getX(idx, points.length);
      const y = getY(pt.pci);
      return idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
    }, '');
  };

  const selectedPoints = simulatedSelectedSegment.monthlyTrend;
  const historicalPoints = selectedPoints.filter(p => !p.isForecast);
  const forecastPoints = selectedPoints.filter((p, i) => i >= 5); // From Oct (idx 5) to Jan

  return (
    <div className="w-full flex flex-col gap-6 p-4 sm:p-6 bg-[#0f131d]">
      
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-[#171b26] rounded-xl border border-[#313540]">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#ffc174] text-xl">timeline</span>
            <h1 className="text-xl font-bold text-[#dfe2f1]">
              Predictive Roadway Maintenance &amp; Failure Forecasting
            </h1>
          </div>
          <p className="font-mono text-xs text-[#d8c3ad] mt-0.5">
            Machine-learned pavement decay models calculating Estimated Time to Failure (ETTF) from historical defect frequency, ESAL traffic, and freeze-thaw cycles
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-[#262a35] rounded font-mono text-xs text-[#4cd7f6] border border-[#4cd7f6]/30">
            ENGINE: AASHTO PDI v3.2
          </span>
          <span className="px-3 py-1 bg-[#262a35] rounded font-mono text-xs text-[#ffc174] border border-[#ffc174]/30">
            FORECAST HORIZON: 180 DAYS
          </span>
        </div>
      </div>

      {/* High-Level Predictive KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
        <div className="p-4 bg-[#1c1f2a] rounded-xl border border-[#93000a]/50">
          <div className="flex items-center justify-between text-[#ffb4ab] text-xs">
            <span className="flex items-center gap-1.5 font-bold">
              <span className="w-2 h-2 rounded-full bg-[#ffb4ab] animate-pulse"></span>
              IMMINENT SEGMENT FAILURES
            </span>
            <span className="material-symbols-outlined text-base">warning</span>
          </div>
          <div className="text-3xl font-bold text-[#ffb4ab] my-1">
            {criticalCount} <span className="text-sm font-normal text-[#dfe2f1]">Sectors</span>
          </div>
          <p className="text-[10px] text-[#ffb4ab]">Estimated Time to Failure &lt; 25 Days</p>
        </div>

        <div className="p-4 bg-[#1c1f2a] rounded-xl border border-[#313540]">
          <div className="flex items-center justify-between text-[#d8c3ad] text-xs">
            <span>MEDIAN FLEET TIME TO FAILURE</span>
            <span className="material-symbols-outlined text-[#ffc174] text-base">hourglass_bottom</span>
          </div>
          <div className="text-3xl font-bold text-[#ffc174] my-1">
            {simulatedSelectedSegment.estimatedDaysToFailure} <span className="text-sm font-normal text-[#dfe2f1]">Days</span>
          </div>
          <p className="text-[10px] text-[#4cd7f6]">Selected: {simulatedSelectedSegment.name.split('(')[0]}</p>
        </div>

        <div className="p-4 bg-[#1c1f2a] rounded-xl border border-[#313540]">
          <div className="flex items-center justify-between text-[#d8c3ad] text-xs">
            <span>PROACTIVE REMEDIATION ROI</span>
            <span className="material-symbols-outlined text-[#4cd7f6] text-base">savings</span>
          </div>
          <div className="text-3xl font-bold text-[#4cd7f6] my-1">
            ${(totalSavings / 1000).toFixed(0)}k
          </div>
          <p className="text-[10px] text-[#d8c3ad]">Preventative vs Emergency Rebuild Savings</p>
        </div>

        <div className="p-4 bg-[#1c1f2a] rounded-xl border border-[#313540]">
          <div className="flex items-center justify-between text-[#d8c3ad] text-xs">
            <span>DECAY ACCELERATION RATE</span>
            <span className="material-symbols-outlined text-[#ffb95f] text-base">speed</span>
          </div>
          <div className="text-3xl font-bold text-[#ffb95f] my-1">
            -{simulatedSelectedSegment.decayRatePtsPerMonth} <span className="text-sm font-normal text-[#dfe2f1]">pts/mo</span>
          </div>
          <p className="text-[10px] text-[#d8c3ad]">Impacted by {weatherSeverity.toLowerCase()} freeze-thaw</p>
        </div>
      </div>

      {/* Main Split: Visual Trend Line Chart & Environmental Sensitivity Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left 8 cols: Interactive Trend Line Chart */}
        <div className="lg:col-span-8 p-4 bg-[#1c1f2a] rounded-xl border border-[#313540] flex flex-col gap-4 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-[#313540]">
            <div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#4cd7f6] text-base">show_chart</span>
                <span className="font-mono text-sm font-bold text-[#dfe2f1]">
                  Pavement Condition Index (PCI) Decay Curve &amp; Failure Forecast
                </span>
              </div>
              <p className="font-mono text-xs text-[#d8c3ad] mt-0.5">
                Target: <span className="text-[#dfe2f1] font-semibold">{simulatedSelectedSegment.name}</span>
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowAllCorridors(!showAllCorridors)}
                className={`px-2.5 py-1 rounded font-mono text-[11px] font-bold uppercase transition-colors border ${
                  showAllCorridors 
                    ? 'bg-[#4cd7f6]/20 border-[#4cd7f6] text-[#4cd7f6]' 
                    : 'bg-[#171b26] border-[#313540] text-[#d8c3ad] hover:text-[#dfe2f1]'
                }`}
              >
                {showAllCorridors ? 'Comparing All 6 Segments' : 'Overlay All Segments'}
              </button>
            </div>
          </div>

          {/* SVG Trend Line Visualizer */}
          <div className="relative w-full overflow-x-auto bg-[#0a0e18] rounded-lg p-3 border border-[#313540] flex flex-col items-center">
            <svg 
              viewBox={`0 0 ${chartWidth} ${chartHeight}`} 
              className="w-full max-w-[720px] h-auto select-none overflow-visible"
            >
              {/* Grid Background Lines */}
              {[100, 80, 60, 40, 20].map(val => (
                <g key={val}>
                  <line
                    x1={padding.left}
                    y1={getY(val)}
                    x2={chartWidth - padding.right}
                    y2={getY(val)}
                    stroke={val === 40 ? '#ffb4ab' : '#262a35'}
                    strokeWidth={val === 40 ? 1.5 : 0.75}
                    strokeDasharray={val === 40 ? '4 4' : undefined}
                    strokeOpacity={val === 40 ? 0.9 : 0.6}
                  />
                  <text
                    x={padding.left - 8}
                    y={getY(val) + 4}
                    fill={val === 40 ? '#ffb4ab' : '#d8c3ad'}
                    fontSize="10"
                    fontFamily="JetBrains Mono"
                    textAnchor="end"
                    fontWeight={val === 40 ? 'bold' : 'normal'}
                  >
                    {val}
                  </text>
                </g>
              ))}

              {/* Critical Failure Zone Shading (Below PCI 40) */}
              <rect
                x={padding.left}
                y={failureThresholdY}
                width={graphWidth}
                height={graphHeight - (failureThresholdY - padding.top)}
                fill="#93000a"
                fillOpacity="0.12"
              />
              <text
                x={chartWidth - padding.right - 8}
                y={failureThresholdY - 6}
                fill="#ffb4ab"
                fontSize="9"
                fontFamily="JetBrains Mono"
                fontWeight="bold"
                textAnchor="end"
              >
                CRITICAL SUBGRADE COLLAPSE THRESHOLD (PCI &lt; 40)
              </text>

              {/* Division line between Recorded and Forecast */}
              <line
                x1={getX(5, selectedPoints.length)}
                y1={padding.top}
                x2={getX(5, selectedPoints.length)}
                y2={chartHeight - padding.bottom}
                stroke="#4cd7f6"
                strokeWidth="1"
                strokeDasharray="2 2"
                strokeOpacity="0.5"
              />
              <text
                x={getX(5, selectedPoints.length) + 4}
                y={padding.top + 10}
                fill="#4cd7f6"
                fontSize="9"
                fontFamily="JetBrains Mono"
                fontWeight="bold"
              >
                FORECAST HORIZON ▶
              </text>

              {/* Multi-segment overlay if toggled */}
              {showAllCorridors && segments.map((seg, sIdx) => {
                if (seg.id === simulatedSelectedSegment.id) return null;
                const colors = ['#f59e0b', '#03b5d3', '#acedff', '#ffbcb7', '#10b981'];
                const segColor = colors[sIdx % colors.length];
                const segPath = generatePath(seg.monthlyTrend);
                return (
                  <path
                    key={seg.id}
                    d={segPath}
                    fill="none"
                    stroke={segColor}
                    strokeWidth="1.5"
                    strokeOpacity="0.4"
                  />
                );
              })}

              {/* Selected Segment Trend Lines */}
              {/* Historical Segment (Solid) */}
              <path
                d={generatePath(historicalPoints)}
                fill="none"
                stroke="#4cd7f6"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Forecast Segment (Dashed) */}
              <path
                d={generatePath(forecastPoints)}
                fill="none"
                stroke="#ffc174"
                strokeWidth="3"
                strokeDasharray="6 4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Interactive Points and Labels */}
              {selectedPoints.map((pt, idx) => {
                const cx = getX(idx, selectedPoints.length);
                const cy = getY(pt.pci);
                const isCrit = pt.pci <= 40;

                return (
                  <g key={pt.month} className="group cursor-pointer">
                    <circle
                      cx={cx}
                      cy={cy}
                      r={pt.isForecast ? 5 : 6}
                      fill={isCrit ? '#ffb4ab' : pt.isForecast ? '#ffc174' : '#4cd7f6'}
                      stroke="#0a0e18"
                      strokeWidth="2"
                      className="transition-transform group-hover:scale-125"
                    />

                    {/* Value Badge above point */}
                    <text
                      x={cx}
                      y={cy - 10}
                      fill={isCrit ? '#ffb4ab' : '#dfe2f1'}
                      fontSize="10"
                      fontFamily="JetBrains Mono"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      {pt.pci}
                    </text>

                    {/* Defect count pill below axis */}
                    <text
                      x={cx}
                      y={chartHeight - padding.bottom + 16}
                      fill="#dfe2f1"
                      fontSize="10"
                      fontFamily="JetBrains Mono"
                      textAnchor="middle"
                    >
                      {pt.month}
                    </text>
                    <text
                      x={cx}
                      y={chartHeight - padding.bottom + 28}
                      fill={pt.isForecast ? '#ffc174' : '#d8c3ad'}
                      fontSize="8"
                      fontFamily="JetBrains Mono"
                      textAnchor="middle"
                    >
                      {pt.defects} def
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Chart Legend */}
            <div className="flex flex-wrap items-center justify-between w-full pt-3 border-t border-[#313540] text-xs font-mono">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-1 bg-[#4cd7f6] rounded"></div>
                  <span className="text-[#dfe2f1]">Historical CV Scans (May - Oct)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-1 border-t-2 border-dashed border-[#ffc174]"></div>
                  <span className="text-[#ffc174]">AASHTO Decay Projection</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-1 bg-[#ffb4ab] rounded"></div>
                  <span className="text-[#ffb4ab]">Failure Limit (PCI 40)</span>
                </div>
              </div>

              <span className="text-[#d8c3ad] text-[10px]">
                Defect volume plotted on bottom axis
              </span>
            </div>
          </div>

          {/* Quick Segment Switcher Buttons */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="font-mono text-xs text-[#d8c3ad] mr-1">Switch Segment:</span>
            {segments.map(s => {
              const isSelected = selectedSegmentId === s.id;
              const isUrgent = s.riskLevel === 'CRITICAL_URGENT';
              return (
                <button
                  key={s.id}
                  onClick={() => setSelectedSegmentId(s.id)}
                  className={`px-3 py-1.5 rounded font-mono text-xs transition-all flex items-center gap-1.5 border ${
                    isSelected
                      ? 'bg-[#262a35] border-[#ffc174] text-[#ffc174] font-bold shadow-sm'
                      : isUrgent
                      ? 'bg-[#171b26] border-[#93000a]/50 text-[#ffb4ab] hover:bg-[#262a35]'
                      : 'bg-[#171b26] border-[#313540] text-[#dfe2f1] hover:bg-[#262a35]'
                  }`}
                >
                  {isUrgent && <span className="w-1.5 h-1.5 rounded-full bg-[#ffb4ab] animate-pulse"></span>}
                  <span>{s.name.split('(')[0].trim()}</span>
                  <span className="text-[10px] opacity-80">({s.estimatedDaysToFailure}d)</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right 4 cols: Environmental Simulator & Intervention Recommendation */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          
          {/* Estimated Time to Failure Card */}
          <div className="p-4 bg-[#1c1f2a] rounded-xl border border-[#313540] flex flex-col gap-3 shadow-xl">
            <div className="flex items-center justify-between pb-2 border-b border-[#313540]">
              <span className="font-mono text-xs font-bold text-[#dfe2f1] uppercase">
                Estimated Time to Failure (ETTF)
              </span>
              <span className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold uppercase ${
                simulatedSelectedSegment.riskLevel === 'CRITICAL_URGENT' 
                  ? 'bg-[#93000a]/40 text-[#ffb4ab] border border-[#ffb4ab]/40' 
                  : 'bg-[#ffc174]/20 text-[#ffc174] border border-[#ffc174]/30'
              }`}>
                {simulatedSelectedSegment.riskLevel.replace('_', ' ')}
              </span>
            </div>

            <div className="flex items-baseline justify-between font-mono my-1">
              <div>
                <span className="text-4xl font-bold text-[#ffb4ab]">
                  {simulatedSelectedSegment.estimatedDaysToFailure}
                </span>
                <span className="text-sm text-[#dfe2f1] ml-1">Days Remaining</span>
              </div>
              <div className="text-right">
                <span className="text-xs text-[#d8c3ad] block">Predicted Breach:</span>
                <span className="text-sm font-bold text-[#ffc174]">
                  {simulatedSelectedSegment.predictedFailureDate}
                </span>
              </div>
            </div>

            <div className="p-3 bg-[#171b26] rounded-lg border border-[#313540] font-mono text-xs space-y-1.5">
              <div className="flex justify-between text-[#d8c3ad]">
                <span>Current Condition:</span>
                <span className="text-[#dfe2f1] font-bold">PCI {simulatedSelectedSegment.currentPci} / 100</span>
              </div>
              <div className="flex justify-between text-[#d8c3ad]">
                <span>Historical Defect Influx:</span>
                <span className="text-[#ffc174] font-bold">{simulatedSelectedSegment.historicalDefectCount6Mo} in 6 Months</span>
              </div>
              <div className="flex justify-between text-[#d8c3ad]">
                <span>Heavy Axle Load:</span>
                <span className="text-[#dfe2f1] font-bold">{simulatedSelectedSegment.trafficLoadEsal}</span>
              </div>
              <div className="flex justify-between text-[#d8c3ad]">
                <span>Pavement Age:</span>
                <span className="text-[#dfe2f1]">{simulatedSelectedSegment.surfaceAgeYears} Years</span>
              </div>
            </div>

            {/* Recommended Proactive Engineering Action */}
            <div className="p-3 bg-[#0a0e18] rounded-lg border border-[#ffc174]/40 flex flex-col gap-1.5">
              <span className="font-mono text-[10px] text-[#ffc174] uppercase font-bold tracking-wider">
                Proactive Preventative Remediation
              </span>
              <p className="text-xs font-semibold text-[#dfe2f1] leading-snug">
                {simulatedSelectedSegment.recommendedIntervention}
              </p>
              
              <div className="grid grid-cols-2 gap-2 font-mono text-xs pt-1 mt-1 border-t border-[#313540]">
                <div>
                  <span className="text-[10px] text-[#d8c3ad] block">Proactive Cost</span>
                  <span className="text-sm font-bold text-[#4cd7f6]">${simulatedSelectedSegment.proactiveCost.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#ffb4ab] block">Reconstruction Cost</span>
                  <span className="text-sm font-bold text-[#ffb4ab]">${simulatedSelectedSegment.reactiveFailureCost.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onScheduleIntervention(simulatedSelectedSegment)}
              className="w-full py-2.5 bg-[#ffc174] text-[#472a00] font-bold rounded font-mono text-xs uppercase hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <span className="material-symbols-outlined text-base">calendar_month</span>
              Schedule Proactive Intervention
            </button>
          </div>

          {/* Environmental Sensitivity Simulator Widget */}
          <div className="p-4 bg-[#1c1f2a] rounded-xl border border-[#313540] flex flex-col gap-3 shadow-xl font-mono text-xs">
            <div className="flex items-center justify-between pb-1 border-b border-[#313540]">
              <span className="font-bold text-[#dfe2f1] uppercase flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#4cd7f6] text-base">tune</span>
                Environmental Sensitivity Simulator
              </span>
              <span className="text-[10px] text-[#4cd7f6]">WHAT-IF MODEL</span>
            </div>
            
            <p className="text-[#d8c3ad] text-[11px] leading-relaxed">
              Test how upcoming weather events and traffic surges accelerate decay velocity:
            </p>

            {/* Winter Weather Control */}
            <div>
              <label className="text-[10px] text-[#d8c3ad] uppercase block mb-1">
                Winter Freeze-Thaw Severity
              </label>
              <div className="grid grid-cols-3 gap-1">
                {(['MILD', 'NORMAL', 'SEVERE'] as const).map(mode => (
                  <button
                    key={mode}
                    onClick={() => setWeatherSeverity(mode)}
                    className={`py-1 rounded text-[10px] font-bold transition-colors ${
                      weatherSeverity === mode 
                        ? 'bg-[#4cd7f6] text-[#003640]' 
                        : 'bg-[#171b26] text-[#d8c3ad] hover:text-[#dfe2f1]'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            {/* Traffic Volume Surge */}
            <div>
              <div className="flex justify-between text-[10px] text-[#d8c3ad] mb-1">
                <span>Heavy Commercial Traffic Volume:</span>
                <span className="text-[#ffc174] font-bold">+{trafficVolumeShift}% Volume</span>
              </div>
              <input
                type="range"
                min="0"
                max="30"
                step="15"
                value={trafficVolumeShift}
                onChange={(e) => setTrafficVolumeShift(Number(e.target.value))}
                className="w-full accent-[#ffc174] cursor-pointer"
              />
              <div className="flex justify-between text-[9px] text-[#d8c3ad] mt-0.5">
                <span>Standard (0%)</span>
                <span>Port Surge (+15%)</span>
                <span>Peak Logistics (+30%)</span>
              </div>
            </div>

            <div className="p-2 bg-[#0a0e18] rounded border border-[#313540] text-[10px] text-[#d8c3ad] flex justify-between">
              <span>Simulation Adjustment Factor:</span>
              <span className="text-[#ffc174] font-bold">{(totalMultiplier).toFixed(2)}x Velocity</span>
            </div>
          </div>

        </div>

      </div>

      {/* Roadway Segments Time to Failure Table */}
      <div className="w-full p-4 bg-[#1c1f2a] rounded-xl border border-[#313540] flex flex-col gap-4 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#313540]">
          <div>
            <h2 className="text-sm font-bold text-[#dfe2f1]">
              Municipal Arterial Segments Failure Risk Registry
            </h2>
            <p className="font-mono text-xs text-[#d8c3ad]">
              Ranked by Estimated Time to Failure (ETTF) and subgrade structural risk
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-2.5 top-2 text-[#d8c3ad] text-sm">search</span>
              <input
                type="text"
                placeholder="Search road segment..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="pl-8 pr-3 py-1.5 bg-[#0a0e18] border border-[#313540] rounded text-xs text-[#dfe2f1] font-mono outline-none w-52"
              />
            </div>

            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-[#0a0e18] border border-[#313540] rounded text-xs text-[#dfe2f1] font-mono outline-none cursor-pointer"
            >
              <option value="ALL">All Risk Levels</option>
              <option value="CRITICAL_URGENT">Critical Urgent (&lt;30d)</option>
              <option value="HIGH_WATCH">High Watch (30-60d)</option>
              <option value="MODERATE">Moderate (60-100d)</option>
              <option value="STABLE">Stable (&gt;100d)</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-[#313540] text-[#d8c3ad] text-[10px] uppercase font-bold tracking-wider">
                <th className="py-2.5 px-3">Roadway Sector</th>
                <th className="py-2.5 px-3">Corridor</th>
                <th className="py-2.5 px-3">Current PCI</th>
                <th className="py-2.5 px-3">Decay Velocity</th>
                <th className="py-2.5 px-3">Est. Time to Failure</th>
                <th className="py-2.5 px-3">Predicted Breach</th>
                <th className="py-2.5 px-3">Proactive vs Reactive</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#313540]/60">
              {filteredSegments.map(seg => {
                const isUrgent = seg.riskLevel === 'CRITICAL_URGENT';
                const isSelected = selectedSegmentId === seg.id;

                return (
                  <tr 
                    key={seg.id}
                    className={`transition-colors cursor-pointer ${
                      isSelected ? 'bg-[#262a35]' : 'hover:bg-[#262a35]/60'
                    }`}
                    onClick={() => setSelectedSegmentId(seg.id)}
                  >
                    <td className="py-3 px-3 font-semibold text-[#dfe2f1] font-sans">
                      <div className="flex items-center gap-2">
                        {isUrgent && <span className="w-2 h-2 rounded-full bg-[#ffb4ab] animate-pulse shrink-0"></span>}
                        <span>{seg.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-[#d8c3ad]">{seg.corridor}</td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <span className={`font-bold ${seg.currentPci < 50 ? 'text-[#ffb4ab]' : seg.currentPci < 65 ? 'text-[#ffc174]' : 'text-[#4cd7f6]'}`}>
                          {seg.currentPci}
                        </span>
                        <div className="w-16 bg-[#0a0e18] rounded-full h-1.5">
                          <div 
                            className={`h-full rounded-full ${seg.currentPci < 50 ? 'bg-[#ffb4ab]' : seg.currentPci < 65 ? 'bg-[#ffc174]' : 'bg-[#4cd7f6]'}`}
                            style={{ width: `${seg.currentPci}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-[#ffb95f]">
                      -{seg.decayRatePtsPerMonth} pts/mo
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                        isUrgent 
                          ? 'bg-[#93000a]/40 text-[#ffb4ab] border border-[#ffb4ab]/40' 
                          : seg.riskLevel === 'HIGH_WATCH'
                          ? 'bg-[#ffc174]/20 text-[#ffc174] border border-[#ffc174]/30'
                          : 'bg-[#262a35] text-[#dfe2f1]'
                      }`}>
                        {seg.estimatedDaysToFailure} Days
                      </span>
                    </td>
                    <td className="py-3 px-3 text-[#dfe2f1]">{seg.predictedFailureDate}</td>
                    <td className="py-3 px-3">
                      <span className="text-[#4cd7f6] font-bold">${seg.proactiveCost.toLocaleString()}</span>
                      <span className="text-[#d8c3ad] mx-1">vs</span>
                      <span className="text-[#ffb4ab] font-bold">${seg.reactiveFailureCost.toLocaleString()}</span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onScheduleIntervention(seg);
                        }}
                        className="px-2.5 py-1 bg-[#ffc174] hover:brightness-110 text-[#472a00] rounded font-mono text-[10px] font-bold uppercase transition-all shadow-sm"
                      >
                        Intervene
                      </button>
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
