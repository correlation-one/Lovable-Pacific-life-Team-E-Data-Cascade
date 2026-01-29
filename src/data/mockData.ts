import {
  Case,
  Document,
  FieldVerification,
  Gap,
  EvidenceOrder,
  Notification,
  AuditEvent,
  ApplicationSection,
  EvidenceRule,
  CommTemplate,
  NextBestAction,
  Blocker,
  DecisionPacket,
} from "@/types/case";

// Sample Cases (10 cases across different stages)
export const mockCases: Case[] = [
  {
    id: "CASE-2024-001",
    applicantName: "John A. Martinez",
    dob: "1985-03-15",
    age: 39,
    state: "CA",
    productType: "Term Life 20",
    coverageAmount: 500000,
    stage: 8,
    stageStatus: "completed",
    priority: "medium",
    slaDue: "2024-02-15T17:00:00Z",
    createdDate: "2024-01-20T09:00:00Z",
    updatedDate: "2024-02-10T14:30:00Z",
    assignedTo: "Sarah Chen",
    assignedTeam: "underwriter",
    submissionChannel: "agent",
    completenessScore: 100,
    riskFlags: [],
    blockers: [],
    stageOwners: {
      1: "System", 2: "System", 3: "Evidence Team", 4: "Evidence Team",
      5: "Case Manager", 6: "Case Manager", 7: "Underwriter", 8: "Underwriter"
    },
    stageETAs: {
      1: "2024-01-20", 2: "2024-01-21", 3: "2024-01-23", 4: "2024-01-25",
      5: "2024-01-28", 6: "2024-02-01", 7: "2024-02-05", 8: "2024-02-10"
    },
    stageBlockers: { 1: null, 2: null, 3: null, 4: null, 5: null, 6: null, 7: null, 8: null }
  },
  {
    id: "CASE-2024-002",
    applicantName: "Emily R. Thompson",
    dob: "1978-07-22",
    age: 46,
    state: "TX",
    productType: "Whole Life",
    coverageAmount: 750000,
    stage: 4,
    stageStatus: "blocked",
    priority: "high",
    slaDue: "2024-02-20T17:00:00Z",
    createdDate: "2024-02-01T10:00:00Z",
    updatedDate: "2024-02-12T16:45:00Z",
    assignedTo: "Mike Johnson",
    assignedTeam: "evidence-team",
    submissionChannel: "broker",
    completenessScore: 72,
    riskFlags: ["Missing demographic info", "Evidence pending"],
    blockers: ["Missing verified SSN - required for evidence ordering"],
    stageOwners: {
      1: "System", 2: "System", 3: "Evidence Team", 4: "Evidence Team",
      5: "Case Manager", 6: "Case Manager", 7: "Underwriter", 8: "Underwriter"
    },
    stageETAs: {
      1: "2024-02-01", 2: "2024-02-02", 3: "2024-02-05", 4: "2024-02-08",
      5: "2024-02-12", 6: "2024-02-15", 7: "2024-02-18", 8: "2024-02-20"
    },
    stageBlockers: { 1: null, 2: null, 3: null, 4: "Missing verified SSN", 5: null, 6: null, 7: null, 8: null }
  },
  {
    id: "CASE-2024-003",
    applicantName: "Susan Berry",
    dob: "1983-11-08",
    age: 42,
    state: "FL",
    productType: "Promise Life",
    coverageAmount: 500000,
    stage: 3,
    stageStatus: "blocked",
    priority: "urgent",
    slaDue: "2024-02-18T17:00:00Z",
    createdDate: "2024-02-05T11:00:00Z",
    updatedDate: "2024-02-13T09:15:00Z",
    assignedTo: "Lisa Park",
    assignedTeam: "evidence-team",
    submissionChannel: "direct",
    completenessScore: 65,
    riskFlags: ["DOB mismatch across sources", "Low confidence extraction"],
    blockers: ["Conflicting DOB values - verification required"],
    stageOwners: {
      1: "System", 2: "System", 3: "Evidence Team", 4: "Evidence Team",
      5: "Case Manager", 6: "Case Manager", 7: "Underwriter", 8: "Underwriter"
    },
    stageETAs: {
      1: "2024-02-05", 2: "2024-02-06", 3: "2024-02-08", 4: "2024-02-10",
      5: "2024-02-13", 6: "2024-02-15", 7: "2024-02-17", 8: "2024-02-18"
    },
    stageBlockers: { 1: null, 2: null, 3: "DOB conflict requires resolution", 4: null, 5: null, 6: null, 7: null, 8: null }
  },
  {
    id: "CASE-2024-004",
    applicantName: "Jennifer L. Davis",
    dob: "1982-05-30",
    age: 41,
    state: "NY",
    productType: "Term Life 30",
    coverageAmount: 300000,
    stage: 6,
    stageStatus: "in-progress",
    priority: "medium",
    slaDue: "2024-02-22T17:00:00Z",
    createdDate: "2024-02-03T14:00:00Z",
    updatedDate: "2024-02-13T11:20:00Z",
    assignedTo: "David Kim",
    assignedTeam: "case-manager",
    submissionChannel: "agent",
    completenessScore: 88,
    riskFlags: ["Pending medical clarification"],
    blockers: [],
    stageOwners: {
      1: "System", 2: "System", 3: "Evidence Team", 4: "Evidence Team",
      5: "Case Manager", 6: "Case Manager", 7: "Underwriter", 8: "Underwriter"
    },
    stageETAs: {
      1: "2024-02-03", 2: "2024-02-04", 3: "2024-02-06", 4: "2024-02-08",
      5: "2024-02-10", 6: "2024-02-15", 7: "2024-02-19", 8: "2024-02-22"
    },
    stageBlockers: { 1: null, 2: null, 3: null, 4: null, 5: null, 6: null, 7: null, 8: null }
  },
  {
    id: "CASE-2024-005",
    applicantName: "Michael S. Brown",
    dob: "1975-09-12",
    age: 48,
    state: "IL",
    productType: "Whole Life",
    coverageAmount: 500000,
    stage: 5,
    stageStatus: "in-progress",
    priority: "low",
    slaDue: "2024-02-25T17:00:00Z",
    createdDate: "2024-02-06T09:30:00Z",
    updatedDate: "2024-02-13T13:45:00Z",
    assignedTo: "Amy Rodriguez",
    assignedTeam: "case-manager",
    submissionChannel: "broker",
    completenessScore: 82,
    riskFlags: [],
    blockers: [],
    stageOwners: {
      1: "System", 2: "System", 3: "Evidence Team", 4: "Evidence Team",
      5: "Case Manager", 6: "Case Manager", 7: "Underwriter", 8: "Underwriter"
    },
    stageETAs: {
      1: "2024-02-06", 2: "2024-02-07", 3: "2024-02-09", 4: "2024-02-12",
      5: "2024-02-15", 6: "2024-02-18", 7: "2024-02-22", 8: "2024-02-25"
    },
    stageBlockers: { 1: null, 2: null, 3: null, 4: null, 5: null, 6: null, 7: null, 8: null }
  },
  {
    id: "CASE-2024-006",
    applicantName: "Amanda J. Wilson",
    dob: "1988-02-28",
    age: 36,
    state: "WA",
    productType: "Term Life 20",
    coverageAmount: 400000,
    stage: 2,
    stageStatus: "in-progress",
    priority: "medium",
    slaDue: "2024-02-28T17:00:00Z",
    createdDate: "2024-02-10T08:00:00Z",
    updatedDate: "2024-02-13T10:00:00Z",
    assignedTo: "System",
    assignedTeam: "case-manager",
    submissionChannel: "direct",
    completenessScore: 45,
    riskFlags: ["Document processing in progress"],
    blockers: [],
    stageOwners: {
      1: "System", 2: "System", 3: "Evidence Team", 4: "Evidence Team",
      5: "Case Manager", 6: "Case Manager", 7: "Underwriter", 8: "Underwriter"
    },
    stageETAs: {
      1: "2024-02-10", 2: "2024-02-12", 3: "2024-02-15", 4: "2024-02-18",
      5: "2024-02-21", 6: "2024-02-24", 7: "2024-02-27", 8: "2024-02-28"
    },
    stageBlockers: { 1: null, 2: null, 3: null, 4: null, 5: null, 6: null, 7: null, 8: null }
  },
  {
    id: "CASE-2024-007",
    applicantName: "Christopher P. Lee",
    dob: "1992-06-15",
    age: 31,
    state: "CO",
    productType: "Universal Life",
    coverageAmount: 600000,
    stage: 7,
    stageStatus: "in-progress",
    priority: "high",
    slaDue: "2024-02-16T17:00:00Z",
    createdDate: "2024-01-28T15:00:00Z",
    updatedDate: "2024-02-13T15:30:00Z",
    assignedTo: "Sarah Chen",
    assignedTeam: "underwriter",
    submissionChannel: "agent",
    completenessScore: 95,
    riskFlags: [],
    blockers: [],
    stageOwners: {
      1: "System", 2: "System", 3: "Evidence Team", 4: "Evidence Team",
      5: "Case Manager", 6: "Case Manager", 7: "Underwriter", 8: "Underwriter"
    },
    stageETAs: {
      1: "2024-01-28", 2: "2024-01-29", 3: "2024-01-31", 4: "2024-02-02",
      5: "2024-02-05", 6: "2024-02-08", 7: "2024-02-13", 8: "2024-02-16"
    },
    stageBlockers: { 1: null, 2: null, 3: null, 4: null, 5: null, 6: null, 7: null, 8: null }
  },
  {
    id: "CASE-2024-008",
    applicantName: "Patricia M. Anderson",
    dob: "1970-12-03",
    age: 53,
    state: "AZ",
    productType: "Term Life 10",
    coverageAmount: 250000,
    stage: 4,
    stageStatus: "blocked",
    priority: "urgent",
    slaDue: "2024-02-14T17:00:00Z",
    createdDate: "2024-02-02T12:00:00Z",
    updatedDate: "2024-02-13T08:00:00Z",
    assignedTo: "Mike Johnson",
    assignedTeam: "evidence-team",
    submissionChannel: "broker",
    completenessScore: 78,
    riskFlags: ["Evidence order failed", "SLA at risk"],
    blockers: ["MVR order failed - invalid license number"],
    stageOwners: {
      1: "System", 2: "System", 3: "Evidence Team", 4: "Evidence Team",
      5: "Case Manager", 6: "Case Manager", 7: "Underwriter", 8: "Underwriter"
    },
    stageETAs: {
      1: "2024-02-02", 2: "2024-02-03", 3: "2024-02-05", 4: "2024-02-07",
      5: "2024-02-09", 6: "2024-02-11", 7: "2024-02-13", 8: "2024-02-14"
    },
    stageBlockers: { 1: null, 2: null, 3: null, 4: "MVR order failed", 5: null, 6: null, 7: null, 8: null }
  },
  {
    id: "CASE-2024-009",
    applicantName: "Daniel T. Garcia",
    dob: "1995-04-20",
    age: 28,
    state: "NV",
    productType: "Term Life 30",
    coverageAmount: 350000,
    stage: 1,
    stageStatus: "in-progress",
    priority: "low",
    slaDue: "2024-03-05T17:00:00Z",
    createdDate: "2024-02-13T09:00:00Z",
    updatedDate: "2024-02-13T09:00:00Z",
    assignedTo: "System",
    assignedTeam: "case-manager",
    submissionChannel: "direct",
    completenessScore: 25,
    riskFlags: [],
    blockers: [],
    stageOwners: {
      1: "System", 2: "System", 3: "Evidence Team", 4: "Evidence Team",
      5: "Case Manager", 6: "Case Manager", 7: "Underwriter", 8: "Underwriter"
    },
    stageETAs: {
      1: "2024-02-13", 2: "2024-02-15", 3: "2024-02-19", 4: "2024-02-22",
      5: "2024-02-26", 6: "2024-02-28", 7: "2024-03-03", 8: "2024-03-05"
    },
    stageBlockers: { 1: null, 2: null, 3: null, 4: null, 5: null, 6: null, 7: null, 8: null }
  },
  {
    id: "CASE-2024-010",
    applicantName: "Sandra K. Taylor",
    dob: "1983-08-10",
    age: 40,
    state: "OR",
    productType: "Whole Life",
    coverageAmount: 450000,
    stage: 6,
    stageStatus: "in-progress",
    priority: "medium",
    slaDue: "2024-02-24T17:00:00Z",
    createdDate: "2024-02-04T10:30:00Z",
    updatedDate: "2024-02-13T12:00:00Z",
    assignedTo: "David Kim",
    assignedTeam: "case-manager",
    submissionChannel: "agent",
    completenessScore: 90,
    riskFlags: [],
    blockers: [],
    stageOwners: {
      1: "System", 2: "System", 3: "Evidence Team", 4: "Evidence Team",
      5: "Case Manager", 6: "Case Manager", 7: "Underwriter", 8: "Underwriter"
    },
    stageETAs: {
      1: "2024-02-04", 2: "2024-02-05", 3: "2024-02-07", 4: "2024-02-09",
      5: "2024-02-12", 6: "2024-02-16", 7: "2024-02-20", 8: "2024-02-24"
    },
    stageBlockers: { 1: null, 2: null, 3: null, 4: null, 5: null, 6: null, 7: null, 8: null }
  }
];

// Documents for CASE-2024-003 (with conflicts)
export const mockDocuments: Document[] = [
  {
    id: "DOC-001",
    caseId: "CASE-2024-003",
    name: "Driver's License",
    type: "ID Document",
    source: "Applicant Upload",
    receivedDate: "2024-02-05T11:30:00Z",
    processingStatus: "processed",
    extractedFields: [
      { field: "Full Name", value: "Susan Berry", confidence: 98, sourceDocId: "DOC-001" },
      { field: "DOB", value: "1983-11-08", confidence: 95, sourceDocId: "DOC-001" },
      { field: "Address", value: "123 Palm Ave, Miami, FL 33101", confidence: 92, sourceDocId: "DOC-001" },
      { field: "License Number", value: "W123-456-78-901-0", confidence: 99, sourceDocId: "DOC-001" },
    ],
    conflicts: [],
    confidence: 96
  },
  {
    id: "DOC-002",
    caseId: "CASE-2024-003",
    name: "Birth Certificate",
    type: "Identity Document",
    source: "Applicant Upload",
    receivedDate: "2024-02-05T11:35:00Z",
    processingStatus: "processed",
    extractedFields: [
      { field: "Full Name", value: "Robert Kenneth Williams", confidence: 97, sourceDocId: "DOC-002" },
      { field: "DOB", value: "1990-11-18", confidence: 88, sourceDocId: "DOC-002" },
      { field: "Place of Birth", value: "Jacksonville, FL", confidence: 94, sourceDocId: "DOC-002" },
    ],
    conflicts: [
      {
        field: "DOB",
        values: [
          { value: "1983-11-08", source: "Driver's License", docId: "DOC-001" },
          { value: "1983-11-18", source: "Birth Certificate", docId: "DOC-002" }
        ]
      }
    ],
    confidence: 72
  },
  {
    id: "DOC-003",
    caseId: "CASE-2024-003",
    name: "Application Form",
    type: "Application",
    source: "Agent Submission",
    receivedDate: "2024-02-05T11:00:00Z",
    processingStatus: "processed",
    extractedFields: [
      { field: "Full Name", value: "Robert K Williams", confidence: 99, sourceDocId: "DOC-003" },
      { field: "DOB", value: "1983-11-08", confidence: 99, sourceDocId: "DOC-003" },
      { field: "SSN", value: "***-**-1234", confidence: 99, sourceDocId: "DOC-003" },
      { field: "Email", value: "rwilliams@email.com", confidence: 99, sourceDocId: "DOC-003" },
      { field: "Phone", value: "(305) 555-1234", confidence: 99, sourceDocId: "DOC-003" },
      { field: "Smoker Status", value: "Non-Smoker", confidence: 99, sourceDocId: "DOC-003" },
    ],
    conflicts: [],
    confidence: 99
  },
  {
    id: "DOC-004",
    caseId: "CASE-2024-003",
    name: "Medical Records Summary",
    type: "Medical",
    source: "APS Provider",
    receivedDate: "2024-02-08T14:00:00Z",
    processingStatus: "processed",
    extractedFields: [
      { field: "Patient Name", value: "Susan Berry", confidence: 85, sourceDocId: "DOC-004" },
      { field: "DOB", value: "11/08/1983", confidence: 45, sourceDocId: "DOC-004" },
      { field: "Blood Pressure", value: "128/82", confidence: 78, sourceDocId: "DOC-004" },
      { field: "Height", value: "5'10\"", confidence: 92, sourceDocId: "DOC-004" },
      { field: "Weight", value: "175 lbs", confidence: 90, sourceDocId: "DOC-004" },
    ],
    conflicts: [],
    confidence: 58
  },
  {
    id: "DOC-005",
    caseId: "CASE-2024-001",
    name: "Application Form",
    type: "Application",
    source: "Agent Submission",
    receivedDate: "2024-01-20T09:15:00Z",
    processingStatus: "processed",
    extractedFields: [
      { field: "Full Name", value: "John A. Martinez", confidence: 99, sourceDocId: "DOC-005" },
      { field: "DOB", value: "1985-03-15", confidence: 99, sourceDocId: "DOC-005" },
      { field: "SSN", value: "***-**-5678", confidence: 99, sourceDocId: "DOC-005" },
    ],
    conflicts: [],
    confidence: 99
  }
];

// Field Verifications
export const mockFieldVerifications: FieldVerification[] = [
  {
    id: "FV-001",
    caseId: "CASE-2024-003",
    fieldName: "Full Name",
    currentValue: "Susan Berry",
    source: "Driver's License",
    confidence: 98,
    verificationStatus: "verified",
    verifiedBy: "Lisa Park",
    verifiedDate: "2024-02-06T10:00:00Z"
  },
  {
    id: "FV-002",
    caseId: "CASE-2024-003",
    fieldName: "DOB",
    currentValue: "1983-11-08",
    source: "Multiple Sources (Conflict)",
    confidence: 45,
    verificationStatus: "needs-clarification",
    conflictIndicator: true
  },
  {
    id: "FV-003",
    caseId: "CASE-2024-003",
    fieldName: "Address",
    currentValue: "123 Palm Ave, Miami, FL 33101",
    source: "Driver's License",
    confidence: 92,
    verificationStatus: "pending"
  },
  {
    id: "FV-004",
    caseId: "CASE-2024-002",
    fieldName: "SSN",
    currentValue: "***-**-9876",
    source: "Application Form",
    confidence: 99,
    verificationStatus: "pending"
  }
];

// Gaps
export const mockGaps: Gap[] = [
  {
    id: "GAP-001",
    caseId: "CASE-2024-003",
    type: "verification-needed",
    description: "DOB mismatch between Driver's License and Birth Certificate",
    questions: [
      "Please confirm your correct date of birth",
      "Provide additional documentation to verify DOB"
    ],
    severity: "high",
    priority: "high",
    status: "requested",
    ownerTeam: "case-manager",
    requestedFrom: "Applicant",
    dueDate: "2024-02-16T17:00:00Z",
    createdDate: "2024-02-06T11:00:00Z",
    relatedFields: ["DOB"],
    relatedEvidenceOrders: [],
    timeline: [
      { status: "open", timestamp: "2024-02-06T11:00:00Z", actor: "System" },
      { status: "requested", timestamp: "2024-02-06T14:00:00Z", actor: "Lisa Park" }
    ]
  },
  {
    id: "GAP-010",
    caseId: "CASE-2024-003",
    type: "evidence-failure",
    description: "MVR order blocked - Driver's license details require verification",
    questions: [
      "Verify driver's license number is correct",
      "Confirm license issuing state matches application",
      "Provide clear copy of driver's license if needed"
    ],
    severity: "critical",
    priority: "urgent",
    status: "open",
    ownerTeam: "evidence-team",
    requestedFrom: "Agent",
    dueDate: "2024-02-15T17:00:00Z",
    createdDate: "2024-02-13T10:00:00Z",
    relatedFields: ["License Number", "License State"],
    relatedEvidenceOrders: ["EO-003"],
    timeline: [
      { status: "open", timestamp: "2024-02-13T10:00:00Z", actor: "System" }
    ]
  },
  {
    id: "GAP-011",
    caseId: "CASE-2024-003",
    type: "missing-info",
    description: "Health History - Incomplete medical questionnaire",
    questions: [
      "Complete Part B of medical history questionnaire",
      "Provide details on prior hospitalizations",
      "Clarify medication history for past 5 years"
    ],
    severity: "high",
    priority: "high",
    status: "open",
    ownerTeam: "underwriter",
    requestedFrom: "Applicant",
    dueDate: "2024-02-18T17:00:00Z",
    createdDate: "2024-02-12T14:00:00Z",
    relatedFields: ["Health History", "Medical Questionnaire"],
    relatedEvidenceOrders: [],
    timeline: [
      { status: "open", timestamp: "2024-02-12T14:00:00Z", actor: "System" }
    ]
  },
  {
    id: "GAP-002",
    caseId: "CASE-2024-002",
    type: "missing-info",
    description: "SSN verification required before ordering MVR",
    questions: [
      "Please verify SSN matches applicant records"
    ],
    severity: "critical",
    priority: "urgent",
    status: "open",
    ownerTeam: "evidence-team",
    requestedFrom: "Internal",
    dueDate: "2024-02-14T17:00:00Z",
    createdDate: "2024-02-08T09:00:00Z",
    relatedFields: ["SSN"],
    relatedEvidenceOrders: ["EO-002"],
    timeline: [
      { status: "open", timestamp: "2024-02-08T09:00:00Z", actor: "System" }
    ]
  },
  {
    id: "GAP-003",
    caseId: "CASE-2024-008",
    type: "evidence-failure",
    description: "MVR order failed due to invalid license number format",
    questions: [
      "Provide correct driver's license number",
      "Confirm issuing state"
    ],
    severity: "critical",
    priority: "urgent",
    status: "requested",
    ownerTeam: "evidence-team",
    requestedFrom: "Applicant",
    dueDate: "2024-02-14T12:00:00Z",
    createdDate: "2024-02-10T08:00:00Z",
    relatedFields: ["License Number"],
    relatedEvidenceOrders: ["EO-005"],
    timeline: [
      { status: "open", timestamp: "2024-02-10T08:00:00Z", actor: "System" },
      { status: "requested", timestamp: "2024-02-10T10:00:00Z", actor: "Mike Johnson" }
    ]
  },
  {
    id: "GAP-004",
    caseId: "CASE-2024-004",
    type: "clarification",
    description: "Medical history clarification needed for prior surgery",
    questions: [
      "Please provide details of the 2019 surgical procedure",
      "Include post-operative follow-up records"
    ],
    severity: "medium",
    priority: "medium",
    status: "received",
    ownerTeam: "case-manager",
    requestedFrom: "Applicant",
    dueDate: "2024-02-18T17:00:00Z",
    createdDate: "2024-02-09T14:00:00Z",
    relatedFields: ["Medical History"],
    relatedEvidenceOrders: [],
    timeline: [
      { status: "open", timestamp: "2024-02-09T14:00:00Z", actor: "System" },
      { status: "requested", timestamp: "2024-02-09T16:00:00Z", actor: "David Kim" },
      { status: "received", timestamp: "2024-02-12T11:00:00Z", actor: "Applicant" }
    ]
  },
  {
    id: "GAP-005",
    caseId: "CASE-2024-001",
    type: "document-request",
    description: "Annual physical exam records",
    questions: ["Provide most recent physical exam results"],
    severity: "low",
    priority: "low",
    status: "closed",
    ownerTeam: "case-manager",
    requestedFrom: "Applicant",
    dueDate: "2024-02-01T17:00:00Z",
    createdDate: "2024-01-22T10:00:00Z",
    closedDate: "2024-01-28T15:00:00Z",
    relatedFields: ["Medical Records"],
    relatedEvidenceOrders: [],
    timeline: [
      { status: "open", timestamp: "2024-01-22T10:00:00Z", actor: "System" },
      { status: "requested", timestamp: "2024-01-22T14:00:00Z", actor: "Amy Rodriguez" },
      { status: "received", timestamp: "2024-01-26T09:00:00Z", actor: "Applicant" },
      { status: "verified", timestamp: "2024-01-28T14:00:00Z", actor: "Amy Rodriguez" },
      { status: "closed", timestamp: "2024-01-28T15:00:00Z", actor: "Amy Rodriguez" }
    ]
  }
];

// Evidence Orders
export const mockEvidenceOrders: EvidenceOrder[] = [
  {
    id: "EO-001",
    caseId: "CASE-2024-001",
    type: "MVR",
    status: "received",
    prerequisiteChecks: [
      { field: "License Number", required: true, status: "met" },
      { field: "State", required: true, status: "met" },
      { field: "DOB", required: true, status: "met" }
    ],
    orderedDate: "2024-01-25T10:00:00Z",
    receivedDate: "2024-01-27T14:00:00Z",
    priority: 1,
    dependencies: []
  },
  {
    id: "EO-002",
    caseId: "CASE-2024-002",
    type: "MVR",
    status: "planned",
    prerequisiteChecks: [
      { field: "License Number", required: true, status: "met" },
      { field: "State", required: true, status: "met" },
      { field: "SSN", required: true, status: "unmet" }
    ],
    priority: 1,
    dependencies: ["SSN Verification"]
  },
  {
    id: "EO-003",
    caseId: "CASE-2024-003",
    type: "MIB",
    status: "planned",
    prerequisiteChecks: [
      { field: "SSN", required: true, status: "met" },
      { field: "DOB", required: true, status: "unmet" }
    ],
    priority: 2,
    dependencies: ["DOB Verification"]
  },
  {
    id: "EO-004",
    caseId: "CASE-2024-001",
    type: "APS",
    status: "received",
    prerequisiteChecks: [
      { field: "Physician Name", required: true, status: "met" },
      { field: "DOB", required: true, status: "met" }
    ],
    orderedDate: "2024-01-26T11:00:00Z",
    receivedDate: "2024-02-02T09:00:00Z",
    priority: 2,
    dependencies: []
  },
  {
    id: "EO-005",
    caseId: "CASE-2024-008",
    type: "MVR",
    status: "failed",
    prerequisiteChecks: [
      { field: "License Number", required: true, status: "met" },
      { field: "State", required: true, status: "met" }
    ],
    failureReason: "Invalid license number format - expected format: A1234567890123",
    orderedDate: "2024-02-09T10:00:00Z",
    priority: 1,
    dependencies: []
  },
  {
    id: "EO-006",
    caseId: "CASE-2024-007",
    type: "Labs",
    status: "received",
    prerequisiteChecks: [
      { field: "Address", required: true, status: "met" },
      { field: "DOB", required: true, status: "met" }
    ],
    orderedDate: "2024-02-05T14:00:00Z",
    receivedDate: "2024-02-10T16:00:00Z",
    priority: 1,
    dependencies: []
  }
];

// Evidence Rules
export const mockEvidenceRules: EvidenceRule[] = [
  {
    id: "ER-001",
    evidenceType: "MVR",
    action: "request-first",
    prerequisites: ["License Number", "State", "DOB"],
    description: "Motor Vehicle Report required for all applications with driving history"
  },
  {
    id: "ER-002",
    evidenceType: "MIB",
    action: "request-first",
    prerequisites: ["SSN", "DOB", "Full Name"],
    description: "Medical Information Bureau check for prior applications"
  },
  {
    id: "ER-003",
    evidenceType: "APS",
    action: "request-next",
    prerequisites: ["Physician Name", "DOB", "Medical Authorization"],
    description: "Attending Physician Statement if coverage > $500K or age > 45"
  },
  {
    id: "ER-004",
    evidenceType: "Labs",
    action: "request-next",
    prerequisites: ["Address", "DOB"],
    description: "Laboratory exam if coverage > $250K"
  },
  {
    id: "ER-005",
    evidenceType: "Rx-Check",
    action: "request-first",
    prerequisites: ["SSN", "DOB"],
    description: "Prescription history check for all applications"
  },
  {
    id: "ER-006",
    evidenceType: "Credit",
    action: "do-not-request",
    prerequisites: ["SSN"],
    description: "Credit check - not required for standard term policies"
  }
];

// Notifications
export const mockNotifications: Notification[] = [
  {
    id: "NOTIF-001",
    caseId: "CASE-2024-002",
    triggerType: "missing-info-for-evidence",
    recipientRole: "case-manager",
    channel: "in-app",
    sentDate: "2024-02-08T09:15:00Z",
    subject: "Missing Information Required for Evidence Ordering",
    body: "SSN verification is required before MVR can be ordered for case CASE-2024-002. Please verify the SSN or request clarification from the applicant.",
    relatedGapId: "GAP-002",
    read: false
  },
  {
    id: "NOTIF-002",
    caseId: "CASE-2024-008",
    triggerType: "evidence-order-failure",
    recipientRole: "evidence-team",
    channel: "email",
    sentDate: "2024-02-09T10:30:00Z",
    subject: "MVR Order Failed - CASE-2024-008",
    body: "The MVR order for Patricia M. Anderson has failed. Reason: Invalid license number format. Please review and resubmit with corrected information.",
    relatedEvidenceOrderId: "EO-005",
    relatedGapId: "GAP-003",
    read: true
  },
  {
    id: "NOTIF-003",
    caseId: "CASE-2024-003",
    triggerType: "gap-created",
    recipientRole: "case-manager",
    channel: "in-app",
    sentDate: "2024-02-06T11:05:00Z",
    subject: "New Gap Created - DOB Verification Required",
    body: "A conflict has been detected in the date of birth across documents. Please review and request clarification from the applicant.",
    relatedGapId: "GAP-001",
    read: true
  },
  {
    id: "NOTIF-004",
    caseId: "CASE-2024-007",
    triggerType: "stage-change",
    recipientRole: "underwriter",
    channel: "in-app",
    sentDate: "2024-02-13T15:00:00Z",
    subject: "Case Ready for Underwriting Review",
    body: "Case CASE-2024-007 for Christopher P. Lee has completed gap closure and is now ready for underwriting review.",
    read: false
  },
  {
    id: "NOTIF-005",
    caseId: "CASE-2024-003",
    triggerType: "gap-reminder",
    recipientRole: "case-manager",
    channel: "email",
    sentDate: "2024-02-13T09:00:00Z",
    subject: "Reminder: Gap Response Pending - DOB Verification",
    body: "This is a reminder that the DOB verification request for case CASE-2024-003 has been pending for 7 days. Please follow up with the applicant.",
    relatedGapId: "GAP-001",
    read: false
  }
];

// Audit Events
export const mockAuditEvents: AuditEvent[] = [
  {
    id: "AE-001",
    caseId: "CASE-2024-003",
    eventType: "document-received",
    timestamp: "2024-02-05T11:00:00Z",
    actor: "System",
    actorType: "system",
    details: "Application Form received from Agent Submission",
    relatedEntityType: "Document",
    relatedEntityId: "DOC-003"
  },
  {
    id: "AE-002",
    caseId: "CASE-2024-003",
    eventType: "document-processed",
    timestamp: "2024-02-05T11:15:00Z",
    actor: "System",
    actorType: "system",
    details: "Application Form processed successfully. 6 fields extracted.",
    relatedEntityType: "Document",
    relatedEntityId: "DOC-003"
  },
  {
    id: "AE-003",
    caseId: "CASE-2024-003",
    eventType: "field-extracted",
    timestamp: "2024-02-05T11:45:00Z",
    actor: "System",
    actorType: "system",
    details: "DOB conflict detected between Driver's License (1983-11-08) and Birth Certificate (1983-11-18)",
    relatedEntityType: "FieldVerification",
    relatedEntityId: "FV-002"
  },
  {
    id: "AE-004",
    caseId: "CASE-2024-003",
    eventType: "gap-created",
    timestamp: "2024-02-06T11:00:00Z",
    actor: "System",
    actorType: "system",
    details: "Gap created: DOB mismatch between Driver's License and Birth Certificate",
    relatedEntityType: "Gap",
    relatedEntityId: "GAP-001"
  },
  {
    id: "AE-005",
    caseId: "CASE-2024-003",
    eventType: "notification-sent",
    timestamp: "2024-02-06T14:00:00Z",
    actor: "Lisa Park",
    actorType: "user",
    details: "Clarification request sent to applicant for DOB verification",
    relatedEntityType: "Gap",
    relatedEntityId: "GAP-001"
  },
  {
    id: "AE-006",
    caseId: "CASE-2024-003",
    eventType: "stage-change",
    timestamp: "2024-02-06T15:00:00Z",
    actor: "System",
    actorType: "system",
    details: "Stage changed from 'Documents & Data Ingested' to 'Case Evaluated'. Status: Blocked due to DOB conflict.",
    relatedEntityType: "Case",
    relatedEntityId: "CASE-2024-003"
  },
  {
    id: "AE-007",
    caseId: "CASE-2024-008",
    eventType: "evidence-ordered",
    timestamp: "2024-02-09T10:00:00Z",
    actor: "Mike Johnson",
    actorType: "user",
    details: "MVR order submitted for Patricia M. Anderson",
    relatedEntityType: "EvidenceOrder",
    relatedEntityId: "EO-005"
  },
  {
    id: "AE-008",
    caseId: "CASE-2024-008",
    eventType: "evidence-failed",
    timestamp: "2024-02-09T10:15:00Z",
    actor: "System",
    actorType: "system",
    details: "MVR order failed: Invalid license number format - expected format: A1234567890123",
    relatedEntityType: "EvidenceOrder",
    relatedEntityId: "EO-005"
  },
  {
    id: "AE-009",
    caseId: "CASE-2024-008",
    eventType: "gap-created",
    timestamp: "2024-02-10T08:00:00Z",
    actor: "System",
    actorType: "system",
    details: "Gap created due to MVR order failure - Invalid license number",
    relatedEntityType: "Gap",
    relatedEntityId: "GAP-003"
  },
  {
    id: "AE-010",
    caseId: "CASE-2024-001",
    eventType: "gap-closed",
    timestamp: "2024-01-28T15:00:00Z",
    actor: "Amy Rodriguez",
    actorType: "user",
    details: "Gap closed: Annual physical exam records received and verified",
    relatedEntityType: "Gap",
    relatedEntityId: "GAP-005"
  },
  {
    id: "AE-011",
    caseId: "CASE-2024-001",
    eventType: "stage-change",
    timestamp: "2024-02-10T14:30:00Z",
    actor: "Sarah Chen",
    actorType: "user",
    details: "Case advanced to Stage 8: Decision-Ready Case. All gaps closed, evidence complete.",
    relatedEntityType: "Case",
    relatedEntityId: "CASE-2024-001"
  },
  {
    id: "AE-012",
    caseId: "CASE-2024-003",
    eventType: "field-verified",
    timestamp: "2024-02-06T10:00:00Z",
    actor: "Lisa Park",
    actorType: "user",
    details: "Full Name verified as 'Susan Berry' from Driver's License",
    relatedEntityType: "FieldVerification",
    relatedEntityId: "FV-001"
  }
];

// Application Sections (for Pre-Fill view)
export const mockApplicationSections: ApplicationSection[] = [
  {
    id: "SEC-001",
    name: "Applicant Information",
    completionPercentage: 100,
    fields: [
      {
        id: "AF-001", name: "fullName", label: "Full Name", value: "Susan Berry",
        source: "document", confidence: 98, verificationStatus: "verified",
        conflictIndicator: false, lastUpdated: "2024-02-06T10:00:00Z", updatedBy: "Lisa Park",
        changeLog: []
      },
      {
        id: "AF-002", name: "dob", label: "Date of Birth", value: "1983-11-08",
        source: "document", confidence: 45, verificationStatus: "needs-clarification",
        conflictIndicator: true, lastUpdated: "2024-02-05T11:45:00Z", updatedBy: "System",
        changeLog: [
          { timestamp: "2024-02-05T11:30:00Z", previousValue: "", newValue: "1983-11-08", source: "Driver's License", reason: "Initial extraction" },
          { timestamp: "2024-02-05T11:35:00Z", previousValue: "1983-11-08", newValue: "1983-11-18", source: "Birth Certificate", reason: "Conflicting value detected" }
        ]
      },
      {
        id: "AF-003", name: "ssn", label: "Social Security Number", value: "***-**-1234",
        source: "applicant", confidence: 99, verificationStatus: "verified",
        conflictIndicator: false, lastUpdated: "2024-02-05T11:00:00Z", updatedBy: "System",
        changeLog: []
      },
      {
        id: "AF-004", name: "email", label: "Email Address", value: "rwilliams@email.com",
        source: "applicant", confidence: 99, verificationStatus: "verified",
        conflictIndicator: false, lastUpdated: "2024-02-05T11:00:00Z", updatedBy: "System",
        changeLog: []
      },
      {
        id: "AF-005", name: "phone", label: "Phone Number", value: "(305) 555-1234",
        source: "applicant", confidence: 99, verificationStatus: "verified",
        conflictIndicator: false, lastUpdated: "2024-02-05T11:00:00Z", updatedBy: "System",
        changeLog: []
      }
    ]
  },
  {
    id: "SEC-002",
    name: "Demographics",
    completionPercentage: 85,
    fields: [
      {
        id: "AF-006", name: "address", label: "Street Address", value: "123 Palm Ave",
        source: "document", confidence: 92, verificationStatus: "pending",
        conflictIndicator: false, lastUpdated: "2024-02-05T11:30:00Z", updatedBy: "System",
        changeLog: []
      },
      {
        id: "AF-007", name: "city", label: "City", value: "Miami",
        source: "document", confidence: 92, verificationStatus: "pending",
        conflictIndicator: false, lastUpdated: "2024-02-05T11:30:00Z", updatedBy: "System",
        changeLog: []
      },
      {
        id: "AF-008", name: "state", label: "State", value: "FL",
        source: "document", confidence: 92, verificationStatus: "verified",
        conflictIndicator: false, lastUpdated: "2024-02-05T11:30:00Z", updatedBy: "System",
        changeLog: []
      },
      {
        id: "AF-009", name: "zip", label: "ZIP Code", value: "33101",
        source: "document", confidence: 92, verificationStatus: "pending",
        conflictIndicator: false, lastUpdated: "2024-02-05T11:30:00Z", updatedBy: "System",
        changeLog: []
      }
    ]
  },
  {
    id: "SEC-003",
    name: "Health Information",
    completionPercentage: 70,
    fields: [
      {
        id: "AF-010", name: "smokerStatus", label: "Smoker Status", value: "Non-Smoker",
        source: "applicant", confidence: 99, verificationStatus: "verified",
        conflictIndicator: false, lastUpdated: "2024-02-05T11:00:00Z", updatedBy: "System",
        changeLog: []
      },
      {
        id: "AF-011", name: "height", label: "Height", value: "5'10\"",
        source: "evidence", confidence: 92, verificationStatus: "verified",
        conflictIndicator: false, lastUpdated: "2024-02-08T14:00:00Z", updatedBy: "System",
        changeLog: []
      },
      {
        id: "AF-012", name: "weight", label: "Weight", value: "175 lbs",
        source: "evidence", confidence: 90, verificationStatus: "verified",
        conflictIndicator: false, lastUpdated: "2024-02-08T14:00:00Z", updatedBy: "System",
        changeLog: []
      },
      {
        id: "AF-013", name: "bloodPressure", label: "Blood Pressure", value: "128/82",
        source: "evidence", confidence: 78, verificationStatus: "pending",
        conflictIndicator: false, lastUpdated: "2024-02-08T14:00:00Z", updatedBy: "System",
        changeLog: []
      }
    ]
  },
  {
    id: "SEC-004",
    name: "Coverage Details",
    completionPercentage: 100,
    fields: [
      {
        id: "AF-014", name: "productType", label: "Product Type", value: "Universal Life",
        source: "applicant", confidence: 99, verificationStatus: "verified",
        conflictIndicator: false, lastUpdated: "2024-02-05T11:00:00Z", updatedBy: "System",
        changeLog: []
      },
      {
        id: "AF-015", name: "coverageAmount", label: "Coverage Amount", value: "$1,000,000",
        source: "applicant", confidence: 99, verificationStatus: "verified",
        conflictIndicator: false, lastUpdated: "2024-02-05T11:00:00Z", updatedBy: "System",
        changeLog: []
      },
      {
        id: "AF-016", name: "beneficiary", label: "Primary Beneficiary", value: "Sarah Williams (Spouse)",
        source: "applicant", confidence: 99, verificationStatus: "verified",
        conflictIndicator: false, lastUpdated: "2024-02-05T11:00:00Z", updatedBy: "System",
        changeLog: []
      }
    ]
  },
  {
    id: "SEC-005",
    name: "Declarations",
    completionPercentage: 50,
    fields: [
      {
        id: "AF-017", name: "criminalHistory", label: "Criminal History", value: "No",
        source: "applicant", confidence: 99, verificationStatus: "pending",
        conflictIndicator: false, lastUpdated: "2024-02-05T11:00:00Z", updatedBy: "System",
        changeLog: []
      },
      {
        id: "AF-018", name: "hazardousActivities", label: "Hazardous Activities", value: "",
        source: "applicant", confidence: 0, verificationStatus: "pending",
        conflictIndicator: false, lastUpdated: "2024-02-05T11:00:00Z", updatedBy: "System",
        changeLog: []
      }
    ]
  }
];

// Communication Templates
export const mockCommTemplates: CommTemplate[] = [
  {
    id: "CT-001",
    name: "Missing Info for Evidence Ordering",
    triggerType: "missing-info-for-evidence",
    subject: "Action Required: Missing Information for Evidence Ordering",
    body: "Dear Team,\n\nThe following information is required before we can proceed with evidence ordering for case {{caseId}}:\n\n{{missingItems}}\n\nPlease take action to obtain this information.\n\nRegards,\nUnderwriting System",
    recipientRoles: ["case-manager", "evidence-team"]
  },
  {
    id: "CT-002",
    name: "Evidence Order Failure Notification",
    triggerType: "evidence-order-failure",
    subject: "Alert: Evidence Order Failed - {{caseId}}",
    body: "An evidence order has failed for case {{caseId}}.\n\nEvidence Type: {{evidenceType}}\nReason: {{failureReason}}\n\nPlease review and take corrective action.",
    recipientRoles: ["evidence-team", "case-manager"]
  },
  {
    id: "CT-003",
    name: "Gap Reminder (3-Day)",
    triggerType: "gap-reminder",
    subject: "Reminder: Outstanding Gap - {{gapDescription}}",
    body: "This is a reminder that the following gap has been open for 3 days:\n\nCase: {{caseId}}\nGap: {{gapDescription}}\nDue: {{dueDate}}\n\nPlease follow up.",
    recipientRoles: ["case-manager"]
  },
  {
    id: "CT-004",
    name: "Gap Escalation (7-Day)",
    triggerType: "gap-escalation",
    subject: "ESCALATION: Gap Overdue - {{caseId}}",
    body: "The following gap has been open for 7 days and requires immediate attention:\n\nCase: {{caseId}}\nGap: {{gapDescription}}\nOriginal Due: {{dueDate}}\n\nPlease escalate and resolve.",
    recipientRoles: ["case-manager", "underwriter"]
  }
];

// Next Best Actions (for a specific case)
export const getNextBestActions = (caseId: string): NextBestAction[] => {
  const caseData = mockCases.find(c => c.id === caseId);
  if (!caseData) return [];

  const actions: NextBestAction[] = [];

  if (caseData.stage === 3 && caseData.stageStatus === "blocked") {
    actions.push({
      id: "NBA-001",
      action: "Resolve DOB conflict before proceeding",
      priority: "urgent",
      dueDate: "2024-02-14",
      relatedTo: "GAP-001"
    });
  }

  if (caseData.stage === 4 && caseData.stageStatus === "blocked") {
    actions.push({
      id: "NBA-002",
      action: "Verify missing demographic info",
      priority: "high",
      dueDate: "2024-02-15",
      relatedTo: "GAP-002"
    });
  }

  if (caseData.blockers.some(b => b.includes("MVR"))) {
    actions.push({
      id: "NBA-003",
      action: "Resubmit MVR with corrected license number",
      priority: "urgent",
      dueDate: "2024-02-14",
      relatedTo: "EO-005"
    });
  }

  return actions;
};

// Blockers (for a specific case)
export const getBlockers = (caseId: string): Blocker[] => {
  const gaps = mockGaps.filter(g => g.caseId === caseId && g.status !== "closed");
  return gaps.map(g => ({
    id: g.id,
    description: g.description,
    owner: g.ownerTeam === "case-manager" ? "David Kim" : "Mike Johnson",
    ownerTeam: g.ownerTeam,
    dueDate: g.dueDate,
    stage: mockCases.find(c => c.id === caseId)?.stage || 1,
    severity: g.severity
  }));
};

// Decision Packet (for completed cases)
export const getDecisionPacket = (caseId: string): DecisionPacket | null => {
  const caseData = mockCases.find(c => c.id === caseId);
  if (!caseData || caseData.stage < 7) return null;

  const caseEvidence = mockEvidenceOrders.filter(e => e.caseId === caseId);
  const caseGaps = mockGaps.filter(g => g.caseId === caseId && g.status === "closed");

  return {
    caseId,
    caseSummary: {
      applicantName: caseData.applicantName,
      dob: caseData.dob,
      state: caseData.state,
      productType: caseData.productType,
      coverageAmount: caseData.coverageAmount
    },
    evidenceReceived: caseEvidence
      .filter(e => e.status === "received")
      .map(e => ({ type: e.type, receivedDate: e.receivedDate! })),
    evidenceOutstanding: caseEvidence
      .filter(e => e.status !== "received")
      .map(e => ({ type: e.type, status: e.status })),
    completenessScore: caseData.completenessScore,
    riskFlags: caseData.riskFlags,
    exceptionsOverrides: [],
    keyDataFields: [
      { field: "Full Name", value: caseData.applicantName, source: "Application", confidence: 99, verified: true },
      { field: "DOB", value: caseData.dob, source: "Driver's License", confidence: 95, verified: true },
      { field: "State", value: caseData.state, source: "Application", confidence: 99, verified: true },
      { field: "Coverage Amount", value: `$${caseData.coverageAmount.toLocaleString()}`, source: "Application", confidence: 99, verified: true }
    ],
    gapClosureConfirmations: caseGaps.map(g => ({
      gapId: g.id,
      description: g.description,
      closedDate: g.closedDate!,
      closedBy: "Case Manager"
    })),
    readyForExport: caseData.stage === 8
  };
};
