import React, { useState, useEffect } from 'react';
import { DefectItem } from '../types';

interface IncidentAssessmentCardProps {
  defect: DefectItem;
  onDispatchContractor: (defect: DefectItem) => void;
  onMarkVerified: (defectId: string) => void;
  onFlagReview: (defectId: string) => void;
  onLogCitizenHazard: (defect: DefectItem) => void;
}

export const IncidentAssessmentCard: React.FC<IncidentAssessmentCardProps> = ({
  defect,
  onDispatchContractor,
  onMarkVerified,
  onFlagReview,
  onLogCitizenHazard
}) => {
  const [secondsLeft, setSecondsLeft] = useState(defect.slaRemainingSeconds);
  const [isDispatching, setIsDispatching] = useState(false);
  const [isDispatched, setIsDispatched] = useState(defect.status === 'DISPATCHED' || defect.status === 'IN_REPAIR');

  useEffect(() => {
    setSecondsLeft(defect.slaRemainingSeconds);
    setIsDispatched(defect.status === 'DISPATCHED' || defect.status === 'IN_REPAIR');
  }, [defect]);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft(prev => Math.max(prev - 1, 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatSLA = (total: number) => {
    const h = Math.floor(total / 3600);
    const m = Math.floor((total % 3600) / 60);
    const s = total % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleDispatch = () => {
    setIsDispatching(true);
    setTimeout(() => {
      setIsDispatching(false);
      setIsDispatched(true);
      onDispatchContractor(defect);
    }, 700);
  };

  const isCritical = defect.severity === 'P1_CRITICAL';

  return (
    <div className="w-full p-4 bg-[#1c1f2a] rounded-xl flex flex-col gap-3 border border-[#313540] shadow-xl">
      {/* Header status */}
      <div className="flex items-center justify-between pb-1 border-b border-[#313540]">
        <div className="flex items-center gap-2">
          <span className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold uppercase tracking-wider ${
            isCritical ? 'bg-[#93000a]/30 text-[#ffb4ab] border border-[#ffb4ab]/40' : 'bg-[#f59e0b]/20 text-[#ffc174] border border-[#ffc174]/40'
          }`}>
            SEVERITY: {isCritical ? 'CRITICAL (LEVEL 4)' : `HIGH (LEVEL ${defect.severityNumber})`}
          </span>
          <span className="font-mono text-xs text-[#d8c3ad]">
            {defect.code}-CV
          </span>
        </div>

        <span className={`font-mono text-[11px] px-2 py-1 rounded bg-[#262a35] font-bold ${
          isCritical ? 'text-[#ffb4ab]' : 'text-[#ffc174]'
        }`}>
          COUNTDOWN SLA: {formatSLA(secondsLeft)}
        </span>
      </div>

      {/* Action Recommendation Box */}
      <div className="p-3 bg-[#171b26] rounded-lg flex flex-col gap-1.5 border border-[#313540]">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] text-[#d8c3ad] uppercase font-bold tracking-wider">
            Recommended Engineering Action
          </span>
          <span className="font-mono text-xs text-[#4cd7f6] font-bold">
            EST COST: ${defect.estCost.toLocaleString()}
          </span>
        </div>
        <p className="text-sm text-[#dfe2f1] font-semibold leading-snug">
          {defect.recommendedAction}
        </p>
        <p className="text-xs text-[#d8c3ad] leading-relaxed">
          {defect.actionDetails}
        </p>
      </div>

      {/* Operational Action Triggers */}
      <div className="grid grid-cols-2 gap-2 mt-1">
        <button
          onClick={handleDispatch}
          disabled={isDispatching || isDispatched}
          className={`px-3 py-2.5 font-bold rounded transition-all flex items-center justify-center gap-1.5 font-mono text-[11px] uppercase shadow-sm ${
            isDispatched 
              ? 'bg-[#4cd7f6] text-[#003640] cursor-default'
              : 'bg-[#ffc174] text-[#472a00] hover:brightness-110'
          }`}
          type="button"
        >
          {isDispatching ? (
            <>
              <span className="material-symbols-outlined text-base animate-spin">refresh</span>
              Dispatching...
            </>
          ) : isDispatched ? (
            <>
              <span className="material-symbols-outlined text-base">task_alt</span>
              Crew Assigned
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-base">send_time_extension</span>
              Auto-Dispatch Contractor
            </>
          )}
        </button>

        <button
          onClick={() => onMarkVerified(defect.id)}
          className="px-3 py-2.5 bg-[#262a35] text-[#dfe2f1] hover:bg-[#353944] rounded border border-[#313540] transition-all flex items-center justify-center gap-1.5 font-mono text-[11px] uppercase"
          type="button"
        >
          <span className="material-symbols-outlined text-base text-[#4cd7f6]">verified</span>
          Mark as Verified
        </button>

        <button
          onClick={() => onFlagReview(defect.id)}
          className="px-3 py-2 bg-[#171b26] text-[#d8c3ad] hover:text-[#dfe2f1] hover:bg-[#262a35] rounded border border-[#313540] transition-all flex items-center justify-center gap-1.5 font-mono text-[10px] uppercase"
          type="button"
        >
          <span className="material-symbols-outlined text-sm text-[#ffc174]">flag</span>
          Flag Secondary Review
        </button>

        <button
          onClick={() => onLogCitizenHazard(defect)}
          className="px-3 py-2 bg-[#171b26] text-[#d8c3ad] hover:text-[#dfe2f1] hover:bg-[#262a35] rounded border border-[#313540] transition-all flex items-center justify-center gap-1.5 font-mono text-[10px] uppercase"
          type="button"
        >
          <span className="material-symbols-outlined text-sm text-[#ffb4ab]">campaign</span>
          Log Citizen Hazard
        </button>
      </div>
    </div>
  );
};
