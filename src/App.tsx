import React, { useState } from 'react';
import { ActiveScreen, DefectItem, PatrolVehicle, WorkOrder, PredictiveRoadSegment } from './types';
import { INITIAL_DEFECTS, PATROL_VEHICLES, CONTRACTOR_CREWS, INITIAL_WORK_ORDERS } from './data/mockData';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { KpiMetricsStrip } from './components/KpiMetricsStrip';
import { GisMapCanvas } from './components/GisMapCanvas';
import { CameraStreamPanel } from './components/CameraStreamPanel';
import { IncidentAssessmentCard } from './components/IncidentAssessmentCard';
import { EdgeDetectionsFeed } from './components/EdgeDetectionsFeed';
import { DefectAnalyticsScreen } from './components/screens/DefectAnalyticsScreen';
import { PredictiveMaintenanceScreen } from './components/screens/PredictiveMaintenanceScreen';
import { ContractorDispatchScreen } from './components/screens/ContractorDispatchScreen';
import { SafetyReportsScreen } from './components/screens/SafetyReportsScreen';
import { SensorCalibrationScreen } from './components/screens/SensorCalibrationScreen';
import { AerialScanModal } from './components/modals/AerialScanModal';
import { DotReportModal } from './components/modals/DotReportModal';
import { CorridorAlertModal } from './components/modals/CorridorAlertModal';

interface ToastState {
  show: boolean;
  title: string;
  message: string;
  type?: 'success' | 'info' | 'warning';
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ActiveScreen>('damage-detection-gis-map');
  const [defects, setDefects] = useState<DefectItem[]>(INITIAL_DEFECTS);
  const [selectedDefect, setSelectedDefect] = useState<DefectItem>(INITIAL_DEFECTS[0]);
  const [vehicles] = useState<PatrolVehicle[]>(PATROL_VEHICLES);
  const [activeVehicle, setActiveVehicle] = useState<PatrolVehicle>(PATROL_VEHICLES[0]);
  const [contractorCrews, setContractorCrews] = useState(CONTRACTOR_CREWS);
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>(INITIAL_WORK_ORDERS);
  const [selectedDistrict, setSelectedDistrict] = useState<string>('Metro Central');

  // Modals state
  const [showAerialScan, setShowAerialScan] = useState(false);
  const [showDotReport, setShowDotReport] = useState(false);
  const [showCorridorAlert, setShowCorridorAlert] = useState(false);

  // Toast notification state
  const [toast, setToast] = useState<ToastState>({
    show: false,
    title: '',
    message: '',
    type: 'success'
  });

  const triggerToast = (title: string, message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    setToast({ show: true, title, message, type });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 4500);
  };

  const handleSelectDefect = (defect: DefectItem) => {
    setSelectedDefect(defect);
    // If vehicle matches detection unit, sync camera
    const matchedVehicle = vehicles.find(v => defect.detectedBy.includes(v.unitCode) || defect.detectedBy.includes(v.name));
    if (matchedVehicle) {
      setActiveVehicle(matchedVehicle);
    }
  };

  const handleSelectVehicle = (vehicle: PatrolVehicle) => {
    setActiveVehicle(vehicle);
    triggerToast(
      `Camera Stream Switched: ${vehicle.unitCode}`,
      `Locking optical telemetry feed from ${vehicle.name} (${vehicle.fps} FPS).`,
      'info'
    );
  };

  const handleDispatchContractor = (defect: DefectItem) => {
    // Update defect status
    setDefects(prev => prev.map(d => d.id === defect.id ? { ...d, status: 'DISPATCHED' as const } : d));
    
    // Add work order
    const newWo: WorkOrder = {
      id: `WO-${defect.code.replace('DEF-', '')}`,
      defectId: defect.id,
      defectCode: defect.code,
      title: defect.title,
      location: defect.street,
      contractor: 'Rapid Pave Systems (Crew #02)',
      crewId: 'crew-02',
      severity: defect.severity,
      status: 'EN_ROUTE',
      dispatchedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      targetArrival: '28 min',
      slaDeadline: '01:42:18',
      slaHoursLeft: 1.7,
      estCost: defect.estCost,
      materials: defect.recommendedAction
    };

    setWorkOrders(prev => [newWo, ...prev]);

    // Update crew status to active
    setContractorCrews(prev => prev.map(c => c.id === 'crew-02' ? { ...c, currentStatus: 'EN_ROUTE' as const, currentTicket: newWo.id } : c));

    triggerToast(
      `Work Order Dispatched #${newWo.id}`,
      `Crew #02 (Rapid Pave Systems) acknowledged & en route. Target arrival: 28 min.`
    );
  };

  const handleMarkVerified = (defectId: string) => {
    setDefects(prev => prev.map(d => d.id === defectId ? { ...d, status: 'VERIFIED' as const } : d));
    triggerToast(
      'Defect Marked as Verified',
      'Civil engineering sign-off logged in DOT asset ledger. GPS ground-truth confirmed.',
      'info'
    );
  };

  const handleFlagReview = (defectId: string) => {
    triggerToast(
      'Secondary Review Flagged',
      'Autonomous UAV flight route scheduled to perform stereoscopic re-scan of location.',
      'warning'
    );
  };

  const handleLogCitizenHazard = (defect: DefectItem) => {
    triggerToast(
      'Citizen Hazard Advisory Published',
      `Geo-tagged hazard advisory broadcasted to Waze and City 311 portal for ${defect.street}.`,
      'warning'
    );
  };

  const handleAerialScanCompleted = (newFound: number) => {
    triggerToast(
      'UAV Aerial Scan Ingested',
      `Aerial mission over ${selectedDistrict} complete. 14.8 km surveyed, 3 new potential micro-fissures logged.`,
      'success'
    );
  };

  const handleAddNewWorkOrder = (order: WorkOrder) => {
    setWorkOrders(prev => [order, ...prev]);
    setDefects(prev => prev.map(d => d.id === order.defectId ? { ...d, status: 'DISPATCHED' as const } : d));
    triggerToast(
      `Contractor Dispatched #${order.id}`,
      `${order.contractor} assigned to ${order.location}. Mandated SLA countdown started.`
    );
  };

  const handleScheduleIntervention = (segment: PredictiveRoadSegment) => {
    const newWo: WorkOrder = {
      id: `WO-PREV-${Date.now().toString().slice(-4)}`,
      defectId: segment.id,
      defectCode: `PREV-${segment.id.replace('seg-', '').toUpperCase()}`,
      title: `Proactive Pavement Stabilization: ${segment.name}`,
      location: segment.name,
      contractor: 'Rapid Pave Systems (Crew #02)',
      crewId: 'crew-02',
      severity: 'P2_HIGH',
      status: 'EN_ROUTE',
      dispatchedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      targetArrival: 'Tomorrow 07:00 AM',
      slaDeadline: `${segment.estimatedDaysToFailure} Days Window`,
      slaHoursLeft: segment.estimatedDaysToFailure * 24,
      estCost: segment.proactiveCost,
      materials: segment.recommendedIntervention
    };

    setWorkOrders(prev => [newWo, ...prev]);
    setCurrentScreen('contractor-dispatch-sla');

    triggerToast(
      `Proactive Work Order Scheduled #${newWo.id}`,
      `Preventative remediation crew locked for ${segment.name.split('(')[0]}. Estimated capital savings: $${segment.savingsEstimate.toLocaleString()}.`,
      'success'
    );
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: WorkOrder['status']) => {
    setWorkOrders(prev => prev.map(w => w.id === orderId ? { ...w, status: newStatus } : w));
    triggerToast(
      `Work Order ${orderId} Updated`,
      `Status transitioned to ${newStatus.replace('_', ' ')}. Inspection audit trail updated.`,
      'info'
    );
  };

  const criticalDefects = defects.filter(d => d.severity === 'P1_CRITICAL');

  return (
    <div className="min-h-screen bg-[#0f131d] text-[#dfe2f1] flex flex-col font-sans selection:bg-[#4cd7f6]/30">
      
      {/* Top Fixed Operations Header */}
      <Header
        currentScreen={currentScreen}
        onScreenChange={setCurrentScreen}
        onRunAerialScan={() => setShowAerialScan(true)}
        onExportDotReport={() => setShowDotReport(true)}
        selectedDistrict={selectedDistrict}
        onDistrictChange={setSelectedDistrict}
        criticalDefects={criticalDefects}
        onSelectDefect={handleSelectDefect}
      />

      {/* Main Body with Fixed Left Sidebar */}
      <div className="flex w-full pt-20">
        
        {/* Left Telemetry Sidebar */}
        <Sidebar
          currentScreen={currentScreen}
          onScreenChange={setCurrentScreen}
          priorityQueue={defects.filter(d => d.severity === 'P1_CRITICAL' || d.severity === 'P2_HIGH')}
          selectedDefectId={selectedDefect.id}
          onSelectDefect={handleSelectDefect}
        />

        {/* Content Viewport */}
        <main className="w-full pl-64 min-h-[calc(100vh-5rem)] flex flex-col bg-[#0f131d]">
          
          {/* Top Operational KPI Strip (Always visible or toggled) */}
          <KpiMetricsStrip
            criticalCount={criticalDefects.length}
            onCardClick={(key) => {
              if (key === 'critical' || key === 'anomalies') setCurrentScreen('inspection-defect-analytics');
              if (key === 'contractors') setCurrentScreen('contractor-dispatch-sla');
              if (key === 'safety') setCurrentScreen('safety-index-reports');
              if (key === 'latency') setCurrentScreen('sensor-calibration');
            }}
          />

          {/* Screen 1: Damage Detection & GIS Map */}
          {currentScreen === 'damage-detection-gis-map' && (
            <section className="w-full px-4 sm:px-6 py-4 grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
              
              {/* LEFT 7 cols (approx 60%): Tactical GIS Map */}
              <div className="xl:col-span-7 flex flex-col gap-4 w-full">
                <GisMapCanvas
                  defects={defects}
                  vehicles={vehicles}
                  selectedDefect={selectedDefect}
                  onSelectDefect={handleSelectDefect}
                  onSelectVehicle={handleSelectVehicle}
                  onFilterCorridor={() => setCurrentScreen('inspection-defect-analytics')}
                  onBroadcastAlert={() => setShowCorridorAlert(true)}
                />
              </div>

              {/* RIGHT 5 cols (approx 40%): Computer Vision Stream & Telemetry Card */}
              <div className="xl:col-span-5 flex flex-col gap-4 w-full">
                
                {/* 1. Live Camera Stream Box with Bounding Box Overlays */}
                <CameraStreamPanel
                  activeVehicle={activeVehicle}
                  onSwitchVehicle={(vehId) => {
                    const found = vehicles.find(v => v.id === vehId);
                    if (found) setActiveVehicle(found);
                  }}
                  allVehicles={vehicles}
                  selectedDefect={selectedDefect}
                />

                {/* 2. Automated Incident Assessment Card */}
                <IncidentAssessmentCard
                  defect={selectedDefect}
                  onDispatchContractor={handleDispatchContractor}
                  onMarkVerified={handleMarkVerified}
                  onFlagReview={handleFlagReview}
                  onLogCitizenHazard={handleLogCitizenHazard}
                />

                {/* 3. Recent Edge AI Detections Feed */}
                <EdgeDetectionsFeed
                  defects={defects}
                  selectedDefectId={selectedDefect.id}
                  onSelectDefect={handleSelectDefect}
                />

              </div>
            </section>
          )}

          {/* Screen 2: Inspection & Defect Analytics Screen */}
          {currentScreen === 'inspection-defect-analytics' && (
            <DefectAnalyticsScreen
              defects={defects}
              onSelectDefectForMap={(defect) => {
                setSelectedDefect(defect);
                setCurrentScreen('damage-detection-gis-map');
              }}
              onDispatchDefect={(defect) => {
                handleDispatchContractor(defect);
                setCurrentScreen('contractor-dispatch-sla');
              }}
            />
          )}

          {/* Screen: Predictive Maintenance */}
          {currentScreen === 'predictive-maintenance' && (
            <PredictiveMaintenanceScreen
              onScheduleIntervention={handleScheduleIntervention}
            />
          )}

          {/* Screen 3: Contractor Dispatch & SLA Screen */}
          {currentScreen === 'contractor-dispatch-sla' && (
            <ContractorDispatchScreen
              workOrders={workOrders}
              contractorCrews={contractorCrews}
              defects={defects}
              onAddNewWorkOrder={handleAddNewWorkOrder}
              onUpdateOrderStatus={handleUpdateOrderStatus}
            />
          )}

          {/* Screen 4: Safety Index & Reports Screen */}
          {currentScreen === 'safety-index-reports' && (
            <SafetyReportsScreen
              onExportDotReport={() => setShowDotReport(true)}
            />
          )}

          {/* Screen 5: LIDAR & Cam Calibration Screen */}
          {currentScreen === 'sensor-calibration' && (
            <SensorCalibrationScreen
              vehicles={vehicles}
            />
          )}

        </main>
      </div>

      {/* Interactive Modals */}
      <AerialScanModal
        isOpen={showAerialScan}
        onClose={() => setShowAerialScan(false)}
        district={selectedDistrict}
        onScanCompleted={handleAerialScanCompleted}
      />

      <DotReportModal
        isOpen={showDotReport}
        onClose={() => setShowDotReport(false)}
        district={selectedDistrict}
      />

      <CorridorAlertModal
        isOpen={showCorridorAlert}
        onClose={() => setShowCorridorAlert(false)}
        corridorName="Route 93 North Arterial Corridor"
        onBroadcastSuccess={(msg) => triggerToast('Emergency Corridor Advisory Transmitted', msg, 'warning')}
      />

      {/* Notification Toast Container */}
      <div 
        className={`fixed bottom-6 right-6 z-50 transition-all duration-300 pointer-events-auto p-4 bg-[#1c1f2a]/95 backdrop-blur-md rounded-lg shadow-2xl border flex items-center gap-3 max-w-md ${
          toast.show ? 'translate-y-0 opacity-100' : 'translate-y-24 opacity-0 pointer-events-none'
        } ${
          toast.type === 'warning' ? 'border-[#ffb4ab]/60' : toast.type === 'info' ? 'border-[#4cd7f6]/60' : 'border-[#ffc174]/60'
        }`}
      >
        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
          toast.type === 'warning' ? 'bg-[#93000a] text-[#ffb4ab]' : toast.type === 'info' ? 'bg-[#003640] text-[#4cd7f6]' : 'bg-[#ffc174] text-[#472a00]'
        }`}>
          <span className="material-symbols-outlined text-base">
            {toast.type === 'warning' ? 'warning' : toast.type === 'info' ? 'info' : 'check_circle'}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-sm text-[#dfe2f1] font-semibold leading-tight">
            {toast.title}
          </span>
          <span className="font-mono text-xs text-[#d8c3ad] mt-0.5 leading-snug">
            {toast.message}
          </span>
        </div>
      </div>

    </div>
  );
}
