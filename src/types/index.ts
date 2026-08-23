export type CollectorStatus = 'healthy' | 'warning' | 'error' | 'healing' | 'idle';
export type Severity = 'low' | 'medium' | 'high' | 'critical';
export type HealingStage = 'failure_detected' | 'change_identified' | 'repair_generated' | 'rerunning' | 'recovery_verified';

export type HealingWorkflowStep =
  | 'idle'
  | 'change_detected'
  | 'healing_required'
  | 'repair_in_progress'
  | 'awaiting_approval'
  | 'verification'
  | 'recovered';

export interface HealingWorkflowState {
  step: HealingWorkflowStep;
  collectorId: string;
  timestamp: string | null;
  failureDescription: string | null;
  repairInstruction: string | null;
  recordsRecovered: number | null;
  schemaIntegrity: number | null;
  verified: boolean;
}

export interface Collector {
  id: string;
  name: string;
  target: string;
  status: CollectorStatus;
  lastRun: string;
  recordsCollected: number;
  successRate: number;
  schedule: string;
}

export interface ScrapeRun {
  id: string;
  collectorId: string;
  startTime: string;
  endTime?: string;
  recordsCollected: number;
  success: boolean;
  errors: string[];
}

export interface ScrapedRecord {
  id: string;
  product: string;
  price: string;
  rating: number;
  availability: string;
  lastUpdated: string;
  collectorId: string;
  status: CollectorStatus;
}

export interface HealingEvent {
  id: string;
  collectorId: string;
  timestamp: string;
  stages: HealingStage[];
  failureReason: string;
  oldSelector: string;
  newSelector: string;
  recordsRecovered: number;
  resolved: boolean;
  resolutionTime?: string;
}

export interface ChangeEvent {
  id: string;
  url: string;
  domain: string;
  changeDescription: string;
  severity: Severity;
  detectedAt: string;
  status: 'repaired' | 'monitoring' | 'pending';
  selector?: string;
}

export interface SystemMetric {
  label: string;
  value: number;
  unit: string;
  trend?: string;
}

export interface ActivityEvent {
  id: string;
  type: 'collector_completed' | 'change_detected' | 'healing_generated' | 'collector_healed' | 'schema_verified' | 'records_collected';
  message: string;
  timestamp: string;
  collectorId?: string;
}
