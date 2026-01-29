import React, { createContext, useContext, useState, useCallback } from "react";
import {
  Case,
  Document,
  Gap,
  EvidenceOrder,
  Notification,
  AuditEvent,
  JourneyStage,
  StageStatus,
  AuditEventType,
} from "@/types/case";
import {
  mockCases,
  mockDocuments,
  mockGaps,
  mockEvidenceOrders,
  mockNotifications,
  mockAuditEvents,
} from "@/data/mockData";

interface CaseContextType {
  cases: Case[];
  selectedCaseId: string | null;
  selectedCase: Case | null;
  documents: Document[];
  gaps: Gap[];
  evidenceOrders: EvidenceOrder[];
  notifications: Notification[];
  auditEvents: AuditEvent[];
  demoCompleted: boolean;
  
  // Actions
  selectCase: (caseId: string | null) => void;
  updateCaseStage: (caseId: string, stage: JourneyStage, status: StageStatus) => void;
  updateCaseStatus: (caseId: string, status: StageStatus) => void;
  addGap: (gap: Gap) => void;
  updateGapStatus: (gapId: string, status: Gap["status"]) => void;
  closeGap: (gapId: string) => void;
  updateEvidenceOrder: (orderId: string, updates: Partial<EvidenceOrder>) => void;
  addNotification: (notification: Notification) => void;
  addAuditEvent: (event: Omit<AuditEvent, "id">) => void;
  
  // Demo Controls
  toggleMissingDemographics: (caseId: string, missing: boolean) => void;
  verifyDemographics: (caseId: string) => void;
  orderEvidence: (caseId: string, evidenceType: EvidenceOrder["type"]) => void;
  toggleEvidenceFailure: (caseId: string, failed: boolean) => void;
  receiveEvidence: (caseId: string, evidenceType: EvidenceOrder["type"]) => void;
  advanceStage: (caseId: string) => void;
  completeDemoSuccess: (caseId: string) => void;
  resetDemo: () => void;
}

const CaseContext = createContext<CaseContextType | null>(null);

export function CaseProvider({ children }: { children: React.ReactNode }) {
  const [cases, setCases] = useState<Case[]>(mockCases);
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [documents, setDocuments] = useState<Document[]>(mockDocuments);
  const [gaps, setGaps] = useState<Gap[]>(mockGaps);
  const [evidenceOrders, setEvidenceOrders] = useState<EvidenceOrder[]>(mockEvidenceOrders);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [demoCompleted, setDemoCompleted] = useState(false);
  const [auditEvents, setAuditEvents] = useState<AuditEvent[]>(mockAuditEvents);

  const selectedCase = cases.find((c) => c.id === selectedCaseId) || null;

  const selectCase = useCallback((caseId: string | null) => {
    setSelectedCaseId(caseId);
  }, []);

  const addAuditEvent = useCallback((event: Omit<AuditEvent, "id">) => {
    const newEvent: AuditEvent = {
      ...event,
      id: `AE-${Date.now()}`,
    };
    setAuditEvents((prev) => [newEvent, ...prev]);
  }, []);

  const updateCaseStage = useCallback(
    (caseId: string, stage: JourneyStage, status: StageStatus) => {
      setCases((prev) =>
        prev.map((c) =>
          c.id === caseId
            ? { ...c, stage, stageStatus: status, updatedDate: new Date().toISOString() }
            : c
        )
      );
      addAuditEvent({
        caseId,
        eventType: "stage-change",
        timestamp: new Date().toISOString(),
        actor: "System",
        actorType: "system",
        details: `Stage changed to ${stage}: ${status}`,
        relatedEntityType: "Case",
        relatedEntityId: caseId,
      });
    },
    [addAuditEvent]
  );

  const updateCaseStatus = useCallback(
    (caseId: string, status: StageStatus) => {
      setCases((prev) =>
        prev.map((c) =>
          c.id === caseId
            ? { ...c, stageStatus: status, updatedDate: new Date().toISOString() }
            : c
        )
      );
    },
    []
  );

  const addGap = useCallback(
    (gap: Gap) => {
      setGaps((prev) => [...prev, gap]);
      addAuditEvent({
        caseId: gap.caseId,
        eventType: "gap-created",
        timestamp: new Date().toISOString(),
        actor: "System",
        actorType: "system",
        details: `Gap created: ${gap.description}`,
        relatedEntityType: "Gap",
        relatedEntityId: gap.id,
      });
    },
    [addAuditEvent]
  );

  const updateGapStatus = useCallback(
    (gapId: string, status: Gap["status"]) => {
      setGaps((prev) =>
        prev.map((g) =>
          g.id === gapId
            ? {
                ...g,
                status,
                timeline: [
                  ...g.timeline,
                  { status, timestamp: new Date().toISOString(), actor: "User" },
                ],
              }
            : g
        )
      );
      const gap = gaps.find((g) => g.id === gapId);
      if (gap) {
        addAuditEvent({
          caseId: gap.caseId,
          eventType: "gap-updated",
          timestamp: new Date().toISOString(),
          actor: "User",
          actorType: "user",
          details: `Gap status updated to: ${status}`,
          relatedEntityType: "Gap",
          relatedEntityId: gapId,
        });
      }
    },
    [gaps, addAuditEvent]
  );

  const closeGap = useCallback(
    (gapId: string) => {
      setGaps((prev) =>
        prev.map((g) =>
          g.id === gapId
            ? {
                ...g,
                status: "closed" as const,
                closedDate: new Date().toISOString(),
                timeline: [
                  ...g.timeline,
                  { status: "closed" as const, timestamp: new Date().toISOString(), actor: "User" },
                ],
              }
            : g
        )
      );
      const gap = gaps.find((g) => g.id === gapId);
      if (gap) {
        addAuditEvent({
          caseId: gap.caseId,
          eventType: "gap-closed",
          timestamp: new Date().toISOString(),
          actor: "User",
          actorType: "user",
          details: `Gap closed: ${gap.description}`,
          relatedEntityType: "Gap",
          relatedEntityId: gapId,
        });
      }
    },
    [gaps, addAuditEvent]
  );

  const updateEvidenceOrder = useCallback(
    (orderId: string, updates: Partial<EvidenceOrder>) => {
      setEvidenceOrders((prev) =>
        prev.map((e) => (e.id === orderId ? { ...e, ...updates } : e))
      );
    },
    []
  );

  const addNotification = useCallback(
    (notification: Notification) => {
      setNotifications((prev) => [notification, ...prev]);
      addAuditEvent({
        caseId: notification.caseId,
        eventType: "notification-sent",
        timestamp: new Date().toISOString(),
        actor: "System",
        actorType: "system",
        details: `Notification sent: ${notification.subject}`,
        relatedEntityType: "Notification",
        relatedEntityId: notification.id,
      });
    },
    [addAuditEvent]
  );

  // Demo Controls
  const toggleMissingDemographics = useCallback(
    (caseId: string, missing: boolean) => {
      if (missing) {
        const newGap: Gap = {
          id: `GAP-DEMO-${Date.now()}`,
          caseId,
          type: "missing-info",
          description: "Missing demographic info required for evidence ordering",
          questions: ["Please provide verified SSN", "Confirm date of birth"],
          severity: "critical",
          priority: "urgent",
          status: "open",
          ownerTeam: "case-manager",
          requestedFrom: "Internal",
          dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
          createdDate: new Date().toISOString(),
          relatedFields: ["SSN", "DOB"],
          relatedEvidenceOrders: [],
          timeline: [{ status: "open", timestamp: new Date().toISOString(), actor: "System" }],
        };
        addGap(newGap);
        setCases((prev) =>
          prev.map((c) =>
            c.id === caseId
              ? {
                  ...c,
                  stageStatus: "blocked",
                  blockers: [...c.blockers, "Missing demographic info"],
                  riskFlags: [...c.riskFlags, "Missing demographic info"],
                }
              : c
          )
        );
      } else {
        setGaps((prev) =>
          prev.filter(
            (g) => !(g.caseId === caseId && g.description.includes("demographic"))
          )
        );
        setCases((prev) =>
          prev.map((c) =>
            c.id === caseId
              ? {
                  ...c,
                  stageStatus: "in-progress",
                  blockers: c.blockers.filter((b) => !b.includes("demographic")),
                  riskFlags: c.riskFlags.filter((r) => !r.includes("demographic")),
                }
              : c
          )
        );
      }
    },
    [addGap]
  );

  const verifyDemographics = useCallback(
    (caseId: string) => {
      const demoGaps = gaps.filter(
        (g) => g.caseId === caseId && g.description.includes("demographic")
      );
      demoGaps.forEach((g) => closeGap(g.id));
      setCases((prev) =>
        prev.map((c) =>
          c.id === caseId
            ? {
                ...c,
                stageStatus: "in-progress",
                blockers: c.blockers.filter((b) => !b.includes("demographic")),
                riskFlags: c.riskFlags.filter((r) => !r.includes("demographic")),
                completenessScore: Math.min(100, c.completenessScore + 15),
              }
            : c
        )
      );
      addAuditEvent({
        caseId,
        eventType: "field-verified",
        timestamp: new Date().toISOString(),
        actor: "Demo User",
        actorType: "user",
        details: "Demographics verified via demo control",
        relatedEntityType: "Case",
        relatedEntityId: caseId,
      });
    },
    [gaps, closeGap, addAuditEvent]
  );

  const orderEvidence = useCallback(
    (caseId: string, evidenceType: EvidenceOrder["type"]) => {
      const newOrder: EvidenceOrder = {
        id: `EO-DEMO-${Date.now()}`,
        caseId,
        type: evidenceType,
        status: "ordered",
        prerequisiteChecks: [],
        orderedDate: new Date().toISOString(),
        priority: 1,
        dependencies: [],
      };
      setEvidenceOrders((prev) => [...prev, newOrder]);
      addAuditEvent({
        caseId,
        eventType: "evidence-ordered",
        timestamp: new Date().toISOString(),
        actor: "Demo User",
        actorType: "user",
        details: `${evidenceType} ordered via demo control`,
        relatedEntityType: "EvidenceOrder",
        relatedEntityId: newOrder.id,
      });
    },
    [addAuditEvent]
  );

  const toggleEvidenceFailure = useCallback(
    (caseId: string, failed: boolean) => {
      const caseOrders = evidenceOrders.filter((e) => e.caseId === caseId);
      if (caseOrders.length > 0) {
        const order = caseOrders[0];
        setEvidenceOrders((prev) =>
          prev.map((e) =>
            e.id === order.id
              ? {
                  ...e,
                  status: failed ? "failed" : "ordered",
                  failureReason: failed ? "Demo: Invalid data format" : undefined,
                }
              : e
          )
        );
        if (failed) {
          const newGap: Gap = {
            id: `GAP-EV-${Date.now()}`,
            caseId,
            type: "evidence-failure",
            description: `${order.type} order failed - Invalid data format`,
            questions: ["Correct the invalid data and resubmit"],
            severity: "critical",
            priority: "urgent",
            status: "open",
            ownerTeam: "evidence-team",
            requestedFrom: "Internal",
            dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
            createdDate: new Date().toISOString(),
            relatedFields: [],
            relatedEvidenceOrders: [order.id],
            timeline: [{ status: "open", timestamp: new Date().toISOString(), actor: "System" }],
          };
          addGap(newGap);
          addAuditEvent({
            caseId,
            eventType: "evidence-failed",
            timestamp: new Date().toISOString(),
            actor: "System",
            actorType: "system",
            details: `${order.type} order failed: Invalid data format`,
            relatedEntityType: "EvidenceOrder",
            relatedEntityId: order.id,
          });
        }
      }
    },
    [evidenceOrders, addGap, addAuditEvent]
  );

  const receiveEvidence = useCallback(
    (caseId: string, evidenceType: EvidenceOrder["type"]) => {
      setEvidenceOrders((prev) =>
        prev.map((e) =>
          e.caseId === caseId && e.type === evidenceType
            ? { ...e, status: "received", receivedDate: new Date().toISOString() }
            : e
        )
      );
      const order = evidenceOrders.find(
        (e) => e.caseId === caseId && e.type === evidenceType
      );
      if (order) {
        addAuditEvent({
          caseId,
          eventType: "evidence-received",
          timestamp: new Date().toISOString(),
          actor: "System",
          actorType: "system",
          details: `${evidenceType} received`,
          relatedEntityType: "EvidenceOrder",
          relatedEntityId: order.id,
        });
      }
    },
    [evidenceOrders, addAuditEvent]
  );

  const advanceStage = useCallback(
    (caseId: string) => {
      const caseData = cases.find((c) => c.id === caseId);
      if (caseData && caseData.stage < 8) {
        const nextStage = (caseData.stage + 1) as JourneyStage;
        updateCaseStage(caseId, nextStage, "in-progress");
      }
    },
    [cases, updateCaseStage]
  );

  const completeDemoSuccess = useCallback(
    (caseId: string) => {
      // Mark all evidence as received
      setEvidenceOrders((prev) =>
        prev.map((e) =>
          e.caseId === caseId
            ? { ...e, status: "received", receivedDate: new Date().toISOString(), failureReason: undefined }
            : e
        )
      );
      // Close all gaps
      setGaps((prev) =>
        prev.map((g) =>
          g.caseId === caseId
            ? { ...g, status: "closed" as const, closedDate: new Date().toISOString() }
            : g
        )
      );
      // Mark documents as processed with no conflicts
      setDocuments((prev) =>
        prev.map((d) =>
          d.caseId === caseId
            ? { ...d, processingStatus: "processed" as const, conflicts: [] }
            : d
        )
      );
      // Update case to completed state
      setCases((prev) =>
        prev.map((c) =>
          c.id === caseId
            ? {
                ...c,
                stage: 8 as JourneyStage,
                stageStatus: "completed",
                completenessScore: 100,
                blockers: [],
                riskFlags: [],
              }
            : c
        )
      );
      setDemoCompleted(true);
      addAuditEvent({
        caseId,
        eventType: "stage-change",
        timestamp: new Date().toISOString(),
        actor: "System",
        actorType: "system",
        details: "MVR successfully retrieved - Case ready for decision",
        relatedEntityType: "Case",
        relatedEntityId: caseId,
      });
    },
    [addAuditEvent]
  );

  const resetDemo = useCallback(() => {
    setCases(mockCases);
    setDocuments(mockDocuments);
    setGaps(mockGaps);
    setEvidenceOrders(mockEvidenceOrders);
    setNotifications(mockNotifications);
    setAuditEvents(mockAuditEvents);
    setDemoCompleted(false);
  }, []);

  return (
    <CaseContext.Provider
      value={{
        cases,
        selectedCaseId,
        selectedCase,
        documents,
        gaps,
        evidenceOrders,
        notifications,
        auditEvents,
        demoCompleted,
        selectCase,
        updateCaseStage,
        updateCaseStatus,
        addGap,
        updateGapStatus,
        closeGap,
        updateEvidenceOrder,
        addNotification,
        addAuditEvent,
        toggleMissingDemographics,
        verifyDemographics,
        orderEvidence,
        toggleEvidenceFailure,
        receiveEvidence,
        advanceStage,
        completeDemoSuccess,
        resetDemo,
      }}
    >
      {children}
    </CaseContext.Provider>
  );
}

export function useCaseContext() {
  const context = useContext(CaseContext);
  if (!context) {
    throw new Error("useCaseContext must be used within a CaseProvider");
  }
  return context;
}
