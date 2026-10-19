import React, { useState } from 'react';

interface DotReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  district: string;
}

export const DotReportModal: React.FC<DotReportModalProps> = ({
  isOpen,
  onClose,
  district
}) => {
  const [downloading, setDownloading] = useState(false);

  if (!isOpen) return null;

  const handleDownloadPdf = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      window.print();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0a0e18]/85 backdrop-blur-md">
      <div className="w-full max-w-2xl bg-[#171b26] border border-[#313540] rounded-xl shadow-2xl p-6 flex flex-col gap-5 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#313540]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#4cd7f6] text-xl">assignment_returned</span>
            <div>
              <h3 className="text-base font-bold text-[#dfe2f1]">
                Official DOT Highway Performance Audit Report
              </h3>
              <p className="font-mono text-xs text-[#d8c3ad]">FHWA Section 119 &amp; State Highway Compliance Certification</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-[#d8c3ad] hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* Certificate / Document Style Preview */}
        <div className="p-6 bg-[#0a0e18] rounded-lg border border-[#313540] font-mono text-xs space-y-4 text-[#dfe2f1]">
          <div className="flex justify-between items-start border-b border-[#313540] pb-3">
            <div>
              <div className="text-sm font-bold text-[#ffc174]">COMMONWEALTH OF MASSACHUSETTS</div>
              <div className="text-xs text-[#d8c3ad]">Department of Transportation • Municipal Public Works Division</div>
              <div className="text-[10px] text-[#4cd7f6] mt-1">REPORT REF: DOT-MA-2026-OCT-8902</div>
            </div>
            <div className="text-right">
              <div className="text-[10px] text-[#d8c3ad]">DATE: OCTOBER 19, 2026</div>
              <div className="text-[10px] text-[#4cd7f6] font-bold">STATUS: CERTIFIED COMPLIANT</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-[#d8c3ad] text-[10px] block">JURISDICTION / DISTRICT</span>
              <span className="font-bold">{district} &amp; Connected Arterials</span>
            </div>
            <div>
              <span className="text-[#d8c3ad] text-[10px] block">CHIEF CERTIFYING ENGINEER</span>
              <span className="font-bold">Marcus Vance, PE (Lic. #48291)</span>
            </div>
          </div>

          <div className="p-3 bg-[#171b26] rounded border border-[#313540] space-y-2">
            <div className="font-bold text-[#ffc174] text-xs">EXECUTIVE TELEMETRIC SUMMARY</div>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2 bg-[#0a0e18] rounded">
                <div className="text-[10px] text-[#d8c3ad]">SURFACE NETWORK</div>
                <div className="text-sm font-bold text-[#4cd7f6]">1,248 km</div>
              </div>
              <div className="p-2 bg-[#0a0e18] rounded">
                <div className="text-[10px] text-[#d8c3ad]">ROAD SAFETY INDEX</div>
                <div className="text-sm font-bold text-[#dfe2f1]">86.4 / 100 (B+)</div>
              </div>
              <div className="p-2 bg-[#0a0e18] rounded">
                <div className="text-[10px] text-[#d8c3ad]">P1 EMERGENCY SLA</div>
                <div className="text-sm font-bold text-[#ffc174]">100% Compliant</div>
              </div>
            </div>
          </div>

          <div className="space-y-1 text-xs text-[#d8c3ad]">
            <div className="font-bold text-[#dfe2f1]">Autonomous Fleet Verification:</div>
            <p className="leading-relaxed text-[11px]">
              Survey conducted using 142 mobile bus, sweeper, and patrol vehicles utilizing calibrated YOLO-RoadDefect-v9x computer vision and LiDAR profilometry with 98.4% empirical accuracy. All high-risk sub-base failures and critical potholes under 48-hour mandates have been dispatched with zero SLA violations.
            </p>
          </div>

          <div className="pt-3 border-t border-[#313540] flex justify-between items-center text-[10px] text-[#d8c3ad]">
            <span>Digital Cryptographic Signature: 0x8F92...B39A</span>
            <span className="text-[#4cd7f6] font-bold">STATE REIMBURSEMENT APPROVED</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-2 border-t border-[#313540]">
          <span className="font-mono text-xs text-[#d8c3ad]">
            Format: Official State PDF Document
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-[#262a35] text-[#dfe2f1] rounded font-mono text-xs"
            >
              Cancel
            </button>
            <button
              onClick={handleDownloadPdf}
              disabled={downloading}
              className="px-4 py-2 bg-[#ffc174] text-[#472a00] font-bold rounded font-mono text-xs uppercase hover:brightness-110 flex items-center gap-1.5 shadow-sm"
            >
              <span className="material-symbols-outlined text-sm">print</span>
              {downloading ? 'Preparing Document...' : 'Print / Save Official PDF'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
