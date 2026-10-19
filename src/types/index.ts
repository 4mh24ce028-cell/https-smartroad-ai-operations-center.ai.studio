export type SeverityLevel = 'P1_CRITICAL' | 'P2_HIGH' | 'P3_MEDIUM' | 'P4_LOW';

export type DefectType = 
  | 'POTHOLE' 
  | 'LONGITUDINAL_CRACK' 
  | 'TRANSVERSE_CRACK' 
  | 'ALLIGATOR_CRACK' 
  | 'RUTTING' 
  | 'MANHOLE_SUBSIDENCE' 
  | 'DELAMINATION';

export type DefectStatus = 'NEW' | 'TRIAGED' | 'DISPATCHED' | 'IN_REPAIR' | 'VERIFIED' | 'RESOLVED';

export interface DefectItem {
  id: string;
  code: string; // e.g. DEF-8902
  type: DefectType;
  title: string;
  severity: SeverityLevel;
  severityNumber: number; // 1 to 4
  confidence: number; // e.g. 98.9
  street: string;
  district: string;
  lat: number;
  long: number;
  hazardSpan: string; // e.g. "8.4m Hazard Span"
  depth?: string; // e.g. "8.5cm"
  volume?: string; // e.g. "0.12 m³"
  surfaceArea?: string; // e.g. "14.2 m²"
  detectedBy: string; // e.g. "Patrol Van #04"
  detectedTimeAgo: string; // e.g. "2m ago"
  timestamp: string;
  slaRemainingSeconds: number; // For live countdown
  slaTotalSeconds: number;
  estCost: number;
  recommendedAction: string;
  actionDetails: string;
  status: DefectStatus;
  workOrderId?: string;
  assignedContractor?: string;
  mapX: number; // percentage on map canvas (0-100)
  mapY: number; // percentage on map canvas (0-100)
  boundingBoxes?: {
    x: number;
    y: number;
    width: number;
    height: number;
    label: string;
    conf: number;
    severityColor: 'amber' | 'red' | 'cyan';
  }[];
}

export interface PatrolVehicle {
  id: string;
  name: string;
  unitCode: string;
  type: 'VAN' | 'SWEEPER' | 'UAV' | 'BUS';
  status: 'SCANNING' | 'LIDAR ACTIVE' | 'THERMAL' | 'EN ROUTE' | 'STANDBY';
  speedMph: number;
  altMeters?: number;
  lat: number;
  long: number;
  mapX: number;
  mapY: number;
  operator: string;
  camId: string;
  fps: number;
  resolution: string;
}

export interface ContractorCrew {
  id: string;
  name: string;
  company: string;
  crewNumber: string;
  activeZone: string;
  personnelCount: number;
  equipment: string;
  slaCompliance: number; // e.g. 99.2%
  currentStatus: 'DISPATCHED' | 'ON_SITE' | 'STANDBY' | 'EN_ROUTE';
  currentTicket?: string;
  etaMinutes?: number;
  hotMixCapacityTons: number;
  availableHotMixTons: number;
}

export interface WorkOrder {
  id: string;
  defectId: string;
  defectCode: string;
  title: string;
  location: string;
  contractor: string;
  crewId: string;
  severity: SeverityLevel;
  status: 'PENDING' | 'ACKNOWLEDGED' | 'EN_ROUTE' | 'ON_SITE' | 'COMPLETED' | 'VERIFIED';
  dispatchedAt: string;
  targetArrival: string;
  slaDeadline: string;
  slaHoursLeft: number;
  estCost: number;
  materials: string;
}

export interface CorridorStats {
  id: string;
  name: string;
  lengthKm: number;
  pciScore: number; // Pavement Condition Index 0-100
  p1Count: number;
  p2Count: number;
  p3Count: number;
  lastScannedTime: string;
  busCount: number;
  status: 'CRITICAL_ATTENTION' | 'ACCEPTABLE' | 'OPTIMAL';
}

export interface MonthlyPciPoint {
  month: string;
  pci: number;
  isForecast?: boolean;
  defects: number;
}

export interface PredictiveRoadSegment {
  id: string;
  name: string;
  corridor: string;
  district: string;
  lengthKm: number;
  currentPci: number;
  failureThresholdPci: number;
  decayRatePtsPerMonth: number;
  estimatedDaysToFailure: number;
  predictedFailureDate: string;
  historicalDefectCount6Mo: number;
  trafficLoadEsal: string;
  surfaceAgeYears: number;
  riskLevel: 'CRITICAL_URGENT' | 'HIGH_WATCH' | 'MODERATE' | 'STABLE';
  recommendedIntervention: string;
  proactiveCost: number;
  reactiveFailureCost: number;
  savingsEstimate: number;
  monthlyTrend: MonthlyPciPoint[];
}

export type ActiveScreen = 
  | 'damage-detection-gis-map'
  | 'inspection-defect-analytics'
  | 'predictive-maintenance'
  | 'contractor-dispatch-sla'
  | 'safety-index-reports'
  | 'sensor-calibration';
