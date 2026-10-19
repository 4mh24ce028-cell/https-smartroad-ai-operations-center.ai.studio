import React, { useState } from 'react';
import { WorkOrder, ContractorCrew, DefectItem } from '../../types';

interface ContractorDispatchScreenProps {
  workOrders: WorkOrder[];
  contractorCrews: ContractorCrew[];
  defects: DefectItem[];
  onAddNewWorkOrder: (order: WorkOrder) => void;
  onUpdateOrderStatus: (orderId: string, newStatus: WorkOrder['status']) => void;
}

export const ContractorDispatchScreen: React.FC<ContractorDispatchScreenProps> = ({
  workOrders,
  contractorCrews,
  defects,
  onAddNewWorkOrder,
  onUpdateOrderStatus
}) => {
  const [selectedCrew, setSelectedCrew] = useState<string>('crew-02');
  const [selectedDefectId, setSelectedDefectId] = useState<string>(defects[0]?.id || '');
  const [activeTab, setActiveTab] = useState<'KANBAN' | 'CREWS' | 'LOGS'>('KANBAN');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleQuickDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    const defect = defects.find(d => d.id === selectedDefectId);
    const crew = contractorCrews.find(c => c.id === selectedCrew);
    if (!defect || !crew) return;

    const newOrder: WorkOrder = {
      id: `WO-${defect.code.replace('DEF-', '')}-${Date.now().toString().slice(-4)}`,
      defectId: defect.id,
      defectCode: defect.code,
      title: defect.title,
      location: defect.street,
      contractor: crew.company,
      crewId: crew.id,
      severity: defect.severity,
      status: 'EN_ROUTE',
      dispatchedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      targetArrival: 'In 25 mins',
      slaDeadline: 'Within 2 hours',
      slaHoursLeft: 2.0,
      estCost: defect.estCost,
      materials: defect.recommendedAction
    };

    onAddNewWorkOrder(newOrder);
    setShowCreateModal(false);
  };

  return (
    <div className="w-full flex flex-col gap-6 p-4 sm:p-6 bg-[#0f131d]">
      
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-[#171b26] rounded-xl border border-[#313540]">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#ffc174] text-xl">local_shipping</span>
            <h1 className="text-xl font-bold text-[#dfe2f1]">
              Contractor Dispatch &amp; SLA Management
            </h1>
          </div>
          <p className="font-mono text-xs text-[#d8c3ad] mt-0.5">
            Automated work order routing, asphalt crew tracking, and legally mandated municipal SLA countdowns
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-[#262a35] rounded p-1 border border-[#313540]">
            {(['KANBAN', 'CREWS', 'LOGS'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1 rounded font-mono text-xs font-bold transition-colors ${
                  activeTab === tab ? 'bg-[#ffc174] text-[#472a00]' : 'text-[#d8c3ad] hover:text-[#dfe2f1]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="px-3 py-1.5 bg-[#4cd7f6] text-[#003640] rounded font-mono text-xs font-bold uppercase hover:brightness-110 transition-all flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-sm">add_circle</span>
            Issue Work Order
          </button>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
        <div className="p-4 bg-[#1c1f2a] rounded-xl border border-[#313540]">
          <div className="flex items-center justify-between text-[#d8c3ad] text-xs">
            <span>ACTIVE CREWS</span>
            <span className="material-symbols-outlined text-[#ffc174] text-base">engineering</span>
          </div>
          <div className="text-3xl font-bold text-[#ffc174] my-1">14</div>
          <p className="text-[10px] text-[#4cd7f6]">Spread across 6 municipal zones</p>
        </div>

        <div className="p-4 bg-[#1c1f2a] rounded-xl border border-[#313540]">
          <div className="flex items-center justify-between text-[#d8c3ad] text-xs">
            <span>SLA COMPLIANCE</span>
            <span className="material-symbols-outlined text-[#4cd7f6] text-base">task_alt</span>
          </div>
          <div className="text-3xl font-bold text-[#4cd7f6] my-1">100.0%</div>
          <p className="text-[10px] text-[#d8c3ad]">0 SLA breaches in last 30 days</p>
        </div>

        <div className="p-4 bg-[#1c1f2a] rounded-xl border border-[#313540]">
          <div className="flex items-center justify-between text-[#d8c3ad] text-xs">
            <span>AVG RESPONSE TIME</span>
            <span className="material-symbols-outlined text-[#dfe2f1] text-base">timer</span>
          </div>
          <div className="text-3xl font-bold text-[#dfe2f1] my-1">28<span className="text-base font-normal">m</span></div>
          <p className="text-[10px] text-[#4cd7f6]">Target: &lt;45m for emergency P1</p>
        </div>

        <div className="p-4 bg-[#1c1f2a] rounded-xl border border-[#313540]">
          <div className="flex items-center justify-between text-[#d8c3ad] text-xs">
            <span>COMMITTED BUDGET</span>
            <span className="material-symbols-outlined text-[#ffc174] text-base">payments</span>
          </div>
          <div className="text-3xl font-bold text-[#ffc174] my-1">$24,800</div>
          <p className="text-[10px] text-[#d8c3ad]">FY26 Municipal Pavement Fund</p>
        </div>
      </div>

      {/* Main Content Area */}
      {activeTab === 'KANBAN' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          
          {/* Column 1: Escalated P1 */}
          <div className="flex flex-col gap-3 p-3 bg-[#171b26] rounded-xl border border-[#313540]">
            <div className="flex items-center justify-between pb-2 border-b border-[#313540]">
              <span className="font-mono text-xs font-bold text-[#ffb4ab] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#ffb4ab] animate-pulse"></span>
                P1 ESCALATED (<span className="text-[#dfe2f1]">1</span>)
              </span>
              <span className="font-mono text-[10px] text-[#d8c3ad]">&lt;2H SLA</span>
            </div>

            <div className="p-3 bg-[#1c1f2a] rounded-lg border border-[#93000a]/50 flex flex-col gap-2">
              <div className="flex justify-between items-center text-[10px] font-mono">
                <span className="text-[#ffb4ab] font-bold">DEF-8902 • CRITICAL</span>
                <span className="text-[#dfe2f1] bg-[#0a0e18] px-1.5 py-0.5 rounded">01:42:18</span>
              </div>
              <p className="text-xs font-semibold text-[#dfe2f1]">Severe Longitudinal Crack &amp; Sub-base Failure</p>
              <p className="font-mono text-[10px] text-[#d8c3ad]">5th Ave &amp; Pine St</p>
              <div className="flex items-center justify-between pt-2 border-t border-[#313540]">
                <span className="font-mono text-xs text-[#ffc174] font-bold">$1,420</span>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="px-2 py-1 bg-[#ffc174] text-[#472a00] font-mono text-[10px] font-bold rounded uppercase hover:brightness-110"
                >
                  Dispatch Now
                </button>
              </div>
            </div>
          </div>

          {/* Column 2: Dispatched & En Route */}
          <div className="flex flex-col gap-3 p-3 bg-[#171b26] rounded-xl border border-[#313540]">
            <div className="flex items-center justify-between pb-2 border-b border-[#313540]">
              <span className="font-mono text-xs font-bold text-[#ffc174] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#ffc174]"></span>
                EN ROUTE ({workOrders.filter(w => w.status === 'EN_ROUTE').length})
              </span>
              <span className="font-mono text-[10px] text-[#d8c3ad]">TRANSIT</span>
            </div>

            {workOrders.filter(w => w.status === 'EN_ROUTE').map(wo => (
              <div key={wo.id} className="p-3 bg-[#1c1f2a] rounded-lg border border-[#ffc174]/40 flex flex-col gap-2">
                <div className="flex justify-between items-center text-[10px] font-mono">
                  <span className="text-[#ffc174] font-bold">{wo.id}</span>
                  <span className="text-[#4cd7f6]">{wo.targetArrival}</span>
                </div>
                <p className="text-xs font-semibold text-[#dfe2f1]">{wo.title}</p>
                <div className="font-mono text-[10px] text-[#d8c3ad]">
                  <div>Crew: {wo.contractor}</div>
                  <div>Loc: {wo.location}</div>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-[#313540]">
                  <span className="font-mono text-xs text-[#ffc174] font-bold">${wo.estCost.toLocaleString()}</span>
                  <button
                    onClick={() => onUpdateOrderStatus(wo.id, 'ON_SITE')}
                    className="px-2 py-1 bg-[#262a35] hover:bg-[#353944] text-[#dfe2f1] font-mono text-[10px] rounded uppercase border border-[#313540]"
                  >
                    Mark On-Site
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Column 3: On-Site Remediating */}
          <div className="flex flex-col gap-3 p-3 bg-[#171b26] rounded-xl border border-[#313540]">
            <div className="flex items-center justify-between pb-2 border-b border-[#313540]">
              <span className="font-mono text-xs font-bold text-[#4cd7f6] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#4cd7f6] animate-pulse"></span>
                ON-SITE IN-PROGRESS ({workOrders.filter(w => w.status === 'ON_SITE').length})
              </span>
              <span className="font-mono text-[10px] text-[#d8c3ad]">PAVING</span>
            </div>

            {workOrders.filter(w => w.status === 'ON_SITE').map(wo => (
              <div key={wo.id} className="p-3 bg-[#1c1f2a] rounded-lg border border-[#4cd7f6]/40 flex flex-col gap-2">
                <div className="flex justify-between items-center text-[10px] font-mono">
                  <span className="text-[#4cd7f6] font-bold">{wo.id}</span>
                  <span className="text-[#ffc174] animate-pulse">PAVING NOW</span>
                </div>
                <p className="text-xs font-semibold text-[#dfe2f1]">{wo.title}</p>
                <div className="font-mono text-[10px] text-[#d8c3ad]">
                  <div>Crew: {wo.contractor}</div>
                  <div>{wo.materials}</div>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-[#313540]">
                  <span className="font-mono text-xs text-[#ffc174] font-bold">${wo.estCost.toLocaleString()}</span>
                  <button
                    onClick={() => onUpdateOrderStatus(wo.id, 'COMPLETED')}
                    className="px-2 py-1 bg-[#4cd7f6] text-[#003640] font-mono text-[10px] font-bold rounded uppercase hover:brightness-110"
                  >
                    Complete Patch
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Column 4: Completed & Verified */}
          <div className="flex flex-col gap-3 p-3 bg-[#171b26] rounded-xl border border-[#313540]">
            <div className="flex items-center justify-between pb-2 border-b border-[#313540]">
              <span className="font-mono text-xs font-bold text-[#acedff] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#acedff]"></span>
                COMPLETED &amp; CLOSED ({workOrders.filter(w => w.status === 'COMPLETED').length})
              </span>
              <span className="font-mono text-[10px] text-[#d8c3ad]">SIGN-OFF</span>
            </div>

            {workOrders.filter(w => w.status === 'COMPLETED').map(wo => (
              <div key={wo.id} className="p-3 bg-[#1c1f2a] rounded-lg border border-[#313540] flex flex-col gap-2 opacity-85">
                <div className="flex justify-between items-center text-[10px] font-mono">
                  <span className="text-[#acedff] font-bold">{wo.id}</span>
                  <span className="text-[#4cd7f6]">VERIFIED OK</span>
                </div>
                <p className="text-xs font-semibold text-[#dfe2f1]">{wo.title}</p>
                <p className="font-mono text-[10px] text-[#d8c3ad]">{wo.location}</p>
                <div className="flex items-center justify-between pt-2 border-t border-[#313540] font-mono text-[10px]">
                  <span className="text-[#ffc174] font-bold">${wo.estCost.toLocaleString()}</span>
                  <span className="text-[#4cd7f6] flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">verified</span>
                    DOT Sealed
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* Crews Fleet Status Grid */}
      {activeTab === 'CREWS' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {contractorCrews.map(crew => (
            <div key={crew.id} className="p-4 bg-[#1c1f2a] rounded-xl border border-[#313540] flex flex-col gap-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#313540]">
                <div>
                  <h3 className="text-sm font-bold text-[#dfe2f1]">{crew.name}</h3>
                  <p className="font-mono text-[11px] text-[#d8c3ad]">{crew.activeZone}</p>
                </div>
                <span className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold uppercase ${
                  crew.currentStatus === 'ON_SITE' 
                    ? 'bg-[#4cd7f6]/20 text-[#4cd7f6] border border-[#4cd7f6]/30'
                    : crew.currentStatus === 'EN_ROUTE'
                    ? 'bg-[#ffc174]/20 text-[#ffc174] border border-[#ffc174]/30'
                    : 'bg-[#262a35] text-[#dfe2f1]'
                }`}>
                  {crew.currentStatus}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-2 bg-[#171b26] rounded border border-[#313540]">
                  <span className="text-[10px] text-[#d8c3ad] block">PERSONNEL</span>
                  <span className="text-sm font-bold text-[#dfe2f1]">{crew.personnelCount} Road Technicians</span>
                </div>
                <div className="p-2 bg-[#171b26] rounded border border-[#313540]">
                  <span className="text-[10px] text-[#d8c3ad] block">SLA COMPLIANCE</span>
                  <span className="text-sm font-bold text-[#4cd7f6]">{crew.slaCompliance}%</span>
                </div>
              </div>

              <div className="font-mono text-xs">
                <span className="text-[10px] text-[#d8c3ad] block mb-1">EQUIPMENT LOADOUT</span>
                <p className="text-xs text-[#dfe2f1]">{crew.equipment}</p>
              </div>

              <div className="pt-2 border-t border-[#313540] flex items-center justify-between font-mono text-xs">
                <span className="text-[#d8c3ad]">Hot-Mix Capacity:</span>
                <span className="text-[#ffc174] font-bold">
                  {crew.availableHotMixTons} / {crew.hotMixCapacityTons} Tons Remaining
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Logs Table */}
      {activeTab === 'LOGS' && (
        <div className="w-full p-4 bg-[#1c1f2a] rounded-xl border border-[#313540] overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-[#313540] text-[#d8c3ad] text-[10px] uppercase font-bold tracking-wider">
                <th className="py-2.5 px-3">Ticket ID</th>
                <th className="py-2.5 px-3">Defect Description</th>
                <th className="py-2.5 px-3">Contractor Entity</th>
                <th className="py-2.5 px-3">Dispatched Time</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Incurred Cost</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#313540]/60">
              {workOrders.map(wo => (
                <tr key={wo.id} className="hover:bg-[#262a35]/60 transition-colors">
                  <td className="py-3 px-3 font-bold text-[#ffc174]">{wo.id}</td>
                  <td className="py-3 px-3 text-[#dfe2f1] font-sans">{wo.title}</td>
                  <td className="py-3 px-3 text-[#d8c3ad]">{wo.contractor}</td>
                  <td className="py-3 px-3 text-[#d8c3ad]">{wo.dispatchedAt}</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-[#262a35] text-[#4cd7f6]">
                      {wo.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-bold text-[#dfe2f1]">${wo.estCost.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal: Issue Work Order */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0a0e18]/80 backdrop-blur-md">
          <div className="w-full max-w-lg bg-[#171b26] border border-[#313540] rounded-xl shadow-2xl p-6 flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#313540]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#ffc174]">send_time_extension</span>
                <h3 className="text-base font-bold text-[#dfe2f1]">Dispatch Municipal Contractor</h3>
              </div>
              <button 
                onClick={() => setShowCreateModal(false)}
                className="text-[#d8c3ad] hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleQuickDispatch} className="flex flex-col gap-4">
              <div>
                <label className="font-mono text-xs text-[#d8c3ad] block mb-1">SELECT ANOMALY TARGET</label>
                <select
                  value={selectedDefectId}
                  onChange={(e) => setSelectedDefectId(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0a0e18] border border-[#313540] rounded text-xs text-[#dfe2f1] font-mono outline-none"
                >
                  {defects.map(d => (
                    <option key={d.id} value={d.id}>
                      {d.code} - {d.title} ({d.street}) - ${d.estCost}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-mono text-xs text-[#d8c3ad] block mb-1">ASSIGN CONTRACTOR CREW</label>
                <select
                  value={selectedCrew}
                  onChange={(e) => setSelectedCrew(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0a0e18] border border-[#313540] rounded text-xs text-[#dfe2f1] font-mono outline-none"
                >
                  {contractorCrews.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} - {c.activeZone} (Status: {c.currentStatus})
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-3 bg-[#1c1f2a] rounded-lg border border-[#313540] text-xs font-mono space-y-1">
                <div className="flex justify-between text-[#d8c3ad]">
                  <span>Mandated Response SLA:</span>
                  <span className="text-[#ffb4ab] font-bold">&lt; 2 Hours</span>
                </div>
                <div className="flex justify-between text-[#d8c3ad]">
                  <span>Work Order Notification:</span>
                  <span className="text-[#4cd7f6]">Dispatch via City Link Radios</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#313540]">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-[#262a35] text-[#dfe2f1] rounded font-mono text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#ffc174] text-[#472a00] font-bold rounded font-mono text-xs uppercase hover:brightness-110 shadow-sm"
                >
                  Confirm &amp; Transmit Work Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
