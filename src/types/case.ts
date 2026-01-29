// Case Journey Stages
export type JourneyStage = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export const JOURNEY_STAGES: Record<JourneyStage, string> = {
  1: "Application Initiated",
  2: "Documents & Data Ingested",
  3: "Case Evaluated",
  4: "Evidence Identified & Triggered",
  5: "Application Pre-Filled & Reviewed",
  6: "Gaps Closed Iteratively",
  7: "Case Prepared for Underwriting",
  8: "Decision-Ready Case",
};

export type StageStatus = "not-started" | "in-progress" | "blocked" | "completed";

export type Priority = "low" | "medium" | "high" | "urgent";

export type UserRole = "case-manager" | "evidence-team" | "underwriter" | "admin";

// Document types
export type DocumentProcessingStatus = "received" | "processing" | "processed" | "failed";

export interface ExtractedField {
  field: string;
  value: string;
  confidence: number;
  sourceDocId: string;
}

export interface FieldConflict {
  field: string;
  values: { value: string; source: string; docId: string }[];
}

export interface Document {
  id: string;
  caseId: string;
  name: string;
  type: string;
  source: string;
  receivedDate: string;
  processingStatus: DocumentProcessingStatus;
  extractedFields: ExtractedField[];
  conflicts: FieldConflict[];
  confidence: number;
}

// Field Verification
export type VerificationStatus = "pending" | "verified" | "rejected" | "needs-clarification";

export interface FieldVerification {
  id: string;
  caseId: string;
  fieldName: string;
  currentValue: string;
  source: string;
  confidence: number;
  verificationStatus: VerificationStatus;
  verifiedBy?: string;
  verifiedDate?: string;
  reason?: string;
  conflictIndicator?: boolean;
}

// Gap Management
export type GapStatus = "open" | "requested" | "reminder-sent" | "received" | "verified" | "closed";
export type GapSeverity = "low" | "medium" | "high" | "critical";
export type GapType = "missing-info" | "verification-needed" | "clarification" | "document-request" | "evidence-failure";

export interface GapTimeline {
  status: GapStatus;
  timestamp: string;
  actor: string;
}

export interface Gap {
  id: string;
  caseId: string;
  type: GapType;
  description: string;
  questions: string[];
  severity: GapSeverity;
  priority: Priority;
  status: GapStatus;
  ownerTeam: UserRole;
  requestedFrom: string;
  dueDate: string;
  createdDate: string;
  closedDate?: string;
  relatedFields: string[];
  relatedEvidenceOrders: string[];
  timeline: GapTimeline[];
}

// Evidence Orders
export type EvidenceStatus = "planned" | "ordered" | "failed" | "received";
export type EvidenceType = "MVR" | "MIB" | "APS" | "Labs" | "Rx-Check" | "Credit" | "Identity";

export interface PrerequisiteCheck {
  field: string;
  required: boolean;
  status: "met" | "unmet" | "overridden";
}

export interface EvidenceOrder {
  id: string;
  caseId: string;
  gapId?: string;
  type: EvidenceType;
  status: EvidenceStatus;
  prerequisiteChecks: PrerequisiteCheck[];
  failureReason?: string;
  orderedDate?: string;
  receivedDate?: string;
  priority: number;
  dependencies: string[];
  manualOverride?: boolean;
}

// Evidence Rules
export interface EvidenceRule {
  id: string;
  evidenceType: EvidenceType;
  action: "request-first" | "request-next" | "do-not-request";
  prerequisites: string[];
  description: string;
}

// Notifications
export type NotificationTrigger = 
  | "missing-info-for-evidence" 
  | "evidence-order-failure" 
  | "missing-info-for-uw-review" 
  | "missing-info-for-uw-decision"
  | "gap-created"
  | "gap-reminder"
  | "gap-escalation"
  | "stage-change";

export type NotificationChannel = "in-app" | "email";

export interface Notification {
  id: string;
  caseId: string;
  triggerType: NotificationTrigger;
  recipientRole: UserRole;
  channel: NotificationChannel;
  sentDate: string;
  subject: string;
  body: string;
  relatedGapId?: string;
  relatedEvidenceOrderId?: string;
  read: boolean;
}

// Audit Trail
export type AuditEventType = 
  | "stage-change" 
  | "gap-created" 
  | "gap-updated" 
  | "gap-closed"
  | "evidence-planned"
  | "evidence-ordered"
  | "evidence-failed"
  | "evidence-received"
  | "document-received"
  | "document-processed"
  | "document-failed"
  | "field-extracted"
  | "field-verified"
  | "field-overridden"
  | "notification-sent"
  | "case-assigned"
  | "case-priority-changed";

export interface AuditEvent {
  id: string;
  caseId: string;
  eventType: AuditEventType;
  timestamp: string;
  actor: string;
  actorType: "user" | "system";
  details: string;
  relatedEntityType?: string;
  relatedEntityId?: string;
}

// Main Case Entity
export interface Case {
  id: string;
  applicantName: string;
  dob: string;
  age: number;
  state: string;
  productType: string;
  coverageAmount: number;
  stage: JourneyStage;
  stageStatus: StageStatus;
  priority: Priority;
  slaDue: string;
  createdDate: string;
  updatedDate: string;
  assignedTo: string;
  assignedTeam: UserRole;
  submissionChannel: "agent" | "broker" | "direct";
  completenessScore: number;
  riskFlags: string[];
  blockers: string[];
  stageOwners: Record<JourneyStage, string>;
  stageETAs: Record<JourneyStage, string>;
  stageBlockers: Record<JourneyStage, string | null>;
}

// Application Pre-Fill Section
export interface ApplicationSection {
  id: string;
  name: string;
  fields: ApplicationField[];
  completionPercentage: number;
}

export interface ApplicationField {
  id: string;
  name: string;
  label: string;
  value: string;
  source: "applicant" | "document" | "evidence" | "internal" | "prefilled";
  confidence: number;
  verificationStatus: VerificationStatus;
  conflictIndicator: boolean;
  lastUpdated: string;
  updatedBy: string;
  changeLog: FieldChangeEntry[];
}

export interface FieldChangeEntry {
  timestamp: string;
  previousValue: string;
  newValue: string;
  source: string;
  reason: string;
}

// Decision Packet
export interface DecisionPacket {
  caseId: string;
  caseSummary: {
    applicantName: string;
    dob: string;
    state: string;
    productType: string;
    coverageAmount: number;
  };
  evidenceReceived: { type: EvidenceType; receivedDate: string }[];
  evidenceOutstanding: { type: EvidenceType; status: string }[];
  completenessScore: number;
  riskFlags: string[];
  exceptionsOverrides: string[];
  keyDataFields: {
    field: string;
    value: string;
    source: string;
    confidence: number;
    verified: boolean;
  }[];
  gapClosureConfirmations: {
    gapId: string;
    description: string;
    closedDate: string;
    closedBy: string;
  }[];
  readyForExport: boolean;
}

// Work Queue
export interface WorkQueueFilters {
  stage?: JourneyStage[];
  stageStatus?: StageStatus[];
  priority?: Priority[];
  slaRisk?: boolean;
  openGaps?: boolean;
  evidenceFailures?: boolean;
  assignedTo?: string;
  team?: UserRole;
}

// Communication Templates
export interface CommTemplate {
  id: string;
  name: string;
  triggerType: NotificationTrigger;
  subject: string;
  body: string;
  recipientRoles: UserRole[];
}

// Next Best Actions
export interface NextBestAction {
  id: string;
  action: string;
  priority: Priority;
  dueDate?: string;
  relatedTo: string;
}

// Blocker
export interface Blocker {
  id: string;
  description: string;
  owner: string;
  ownerTeam: UserRole;
  dueDate: string;
  stage: JourneyStage;
  severity: GapSeverity;
}
