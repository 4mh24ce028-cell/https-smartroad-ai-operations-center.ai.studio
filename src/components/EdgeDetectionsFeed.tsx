import React from 'react';
import { DefectItem } from '../types';

interface EdgeDetectionsFeedProps {
  defects: DefectItem[];
  selectedDefectId: string;
  onSelectDefect: (defect: DefectItem) => void;
}

export const EdgeDetectionsFeed: React.FC<EdgeDetectionsFeedProps> = ({
  defects,
  selectedDefectId,
  onSelectDefect
}) => {
  return (
    <div className="w-full p-4 bg-[#1c1f2a] rounded-xl flex flex-col gap-3 border border-[#313540] shadow-xl">
      {/* Feed Header */}
      <div className="flex items-center justify-between pb-1 border-b border-[#313540]">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#4cd7f6] text-base">stream</span>
          <span className="text-sm font-bold text-[#dfe2f1]">
            Edge AI Detections Feed
          </span>
        </div>
        <span className="font-mono text-[10px] text-[#d8c3ad] uppercase tracking-wider">
          STREAM ACTIVE (142 NODES)
        </span>
      </div>

      {/* Feed List */}
      <div className="flex flex-col gap-2 max-h-56 overflow-y-auto pr-1">
        {defects.slice(0, 6).map((item) => {
          const isSelected = selectedDefectId === item.id;
          const isCrit = item.severity === 'P1_CRITICAL';
          const isMed = item.severity === 'P2_HIGH';

          return (
            <div
              key={item.id}
              onClick={() => onSelectDefect(item)}
              className={`p-2.5 rounded-lg flex items-center justify-between transition-all cursor-pointer group border ${
                isSelected
                  ? 'bg-[#262a35] border-[#4cd7f6] shadow-[0_0_10px_rgba(76,215,246,0.15)]'
                  : 'bg-[#171b26] border-transparent hover:bg-[#262a35] hover:border-[#313540]'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span
                  className={`px-1.5 py-1 rounded font-mono text-[9px] font-bold shrink-0 ${
                    isCrit
                      ? 'bg-[#93000a]/30 text-[#ffb4ab] border border-[#ffb4ab]/30'
                      : isMed
                      ? 'bg-[#ffc174]/20 text-[#ffc174] border border-[#ffc174]/30'
                      : 'bg-[#03b5d3]/20 text-[#4cd7f6] border border-[#4cd7f6]/30'
                  }`}
                >
                  {isCrit ? 'P1 CRIT' : isMed ? 'P2 MED' : 'P3 WEAR'}
                </span>

                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-semibold text-[#dfe2f1] truncate group-hover:text-[#ffc174] transition-colors">
                    {item.code} • {item.title.split('(')[0].trim()}
                  </span>
                  <span className="font-mono text-[10px] text-[#d8c3ad] truncate">
                    {item.street} • {item.detectedBy}
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-end shrink-0 pl-2">
                <span className={`font-mono text-xs font-bold ${
                  isCrit ? 'text-[#ffb4ab]' : isMed ? 'text-[#ffc174]' : 'text-[#dfe2f1]'
                }`}>
                  {item.confidence.toFixed(1)}%
                </span>
                <span className="font-mono text-[10px] text-[#d8c3ad]">
                  {item.detectedTimeAgo}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
