import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCaseContext } from "@/context/CaseContext";
import { CaseHeader } from "./CaseHeader";
import { JourneyTracker } from "./JourneyTracker";
import { CaseSnapshot } from "./CaseSnapshot";
import { ActionableItems } from "./ActionableItems";
import { DemoControls } from "./DemoControls";
import { OverviewTab } from "./Tabs/OverviewTab";
import { DocumentsTab } from "./Tabs/DocumentsTab";
import { EvidenceTab } from "./Tabs/EvidenceTab";
import { AuditTrailTab } from "./Tabs/AuditTrailTab";
import { mockEvidenceRules, mockFieldVerifications } from "@/data/mockData";
import {
  LayoutDashboard,
  FileText,
  Target,
  History,
} from "lucide-react";

interface CaseDetailProps {
  onBack: () => void;
}

export function CaseDetail({ onBack }: CaseDetailProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const {
    selectedCase,
    documents,
    gaps,
    evidenceOrders,
    notifications,
    auditEvents,
    toggleMissingDemographics,
    verifyDemographics,
    orderEvidence,
    toggleEvidenceFailure,
    receiveEvidence,
    closeGap,
    advanceStage,
    addNotification,
  } = useCaseContext();

  if (!selectedCase) return null;

  const openGapsCount = gaps.filter(
    (g) => g.caseId === selectedCase.id && g.status !== "closed"
  ).length;
  const blockers = selectedCase.blockers?.length || 0;

  const handleSendNotification = (type: string) => {
    addNotification({
      id: `NOTIF-${Date.now()}`,
      caseId: selectedCase.id,
      triggerType: type as any,
      recipientRole: "case-manager",
      channel: "in-app",
      sentDate: new Date().toISOString(),
      subject: `Notification: ${type.replace(/-/g, " ")}`,
      body: `Demo notification for ${selectedCase.id}`,
      read: false,
    });
  };

  const handleViewField = (fieldName: string, docId?: string) => {
    // Switch to documents tab and highlight the field
    setActiveTab("documents");
    // In a real app, would scroll to and highlight the specific field
  };

  return (
    <div className="min-h-screen bg-background">
      <CaseHeader
        caseData={selectedCase}
        openGapsCount={openGapsCount}
        evidenceIssuesCount={evidenceOrders.filter(e => e.status === "failed").length}
        onBack={onBack}
      />

      <div className="p-6 space-y-4">
        {/* Compact Journey + Snapshot row */}
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 lg:col-span-9">
            <JourneyTracker
              currentStage={selectedCase.stage}
              stageStatus={selectedCase.stageStatus}
              stageOwners={selectedCase.stageOwners}
              stageETAs={selectedCase.stageETAs}
              stageBlockers={selectedCase.stageBlockers}
              activeTab={activeTab}
            />
          </div>
          <div className="col-span-12 lg:col-span-3">
            <CaseSnapshot
              caseData={selectedCase}
              openGapsCount={openGapsCount}
              blockersCount={blockers}
            />
          </div>
        </div>

        <div className="grid grid-cols-12 gap-4">
          {/* Main Workspace - wider */}
          <div className="col-span-12 lg:col-span-8">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4 mb-3">
                <TabsTrigger value="overview" className="text-xs gap-1">
                  <LayoutDashboard className="w-3 h-3" />
                  Overview
                </TabsTrigger>
                <TabsTrigger value="documents" className="text-xs gap-1">
                  <FileText className="w-3 h-3" />
                  Documents
                </TabsTrigger>
                <TabsTrigger value="evidence" className="text-xs gap-1">
                  <Target className="w-3 h-3" />
                  Evidence
                </TabsTrigger>
                <TabsTrigger value="audit" className="text-xs gap-1">
                  <History className="w-3 h-3" />
                  Audit Trail
                </TabsTrigger>
              </TabsList>

              <ScrollArea className="h-[calc(100vh-380px)]">
                <TabsContent value="overview" className="mt-0">
                  <OverviewTab caseData={selectedCase} gaps={gaps} evidenceOrders={evidenceOrders} />
                </TabsContent>
                <TabsContent value="documents" className="mt-0">
                  <DocumentsTab documents={documents} fieldVerifications={mockFieldVerifications} caseId={selectedCase.id} />
                </TabsContent>
                <TabsContent value="evidence" className="mt-0">
                  <EvidenceTab evidenceOrders={evidenceOrders} evidenceRules={mockEvidenceRules} caseId={selectedCase.id} />
                </TabsContent>
                <TabsContent value="audit" className="mt-0">
                  <AuditTrailTab events={auditEvents} caseId={selectedCase.id} />
                </TabsContent>
              </ScrollArea>
            </Tabs>
          </div>

          {/* Right Side - Action Items + Demo Controls */}
          <div className="col-span-12 lg:col-span-4 space-y-4">
            {/* Actionable Items - unified workbench */}
            <ActionableItems
              gaps={gaps}
              evidenceOrders={evidenceOrders}
              documents={documents}
              fieldVerifications={mockFieldVerifications}
              caseId={selectedCase.id}
              onCloseGap={closeGap}
              onViewField={handleViewField}
            />

            {/* Demo Controls - collapsed by default in production */}
            <DemoControls
              caseId={selectedCase.id}
              onToggleMissingDemographics={(m) => toggleMissingDemographics(selectedCase.id, m)}
              onVerifyDemographics={() => verifyDemographics(selectedCase.id)}
              onOrderEvidence={() => orderEvidence(selectedCase.id, "MVR")}
              onToggleEvidenceFailure={(f) => toggleEvidenceFailure(selectedCase.id, f)}
              onReceiveEvidence={() => receiveEvidence(selectedCase.id, "MVR")}
              onCloseGap={() => {
                const openGap = gaps.find((g) => g.caseId === selectedCase.id && g.status !== "closed");
                if (openGap) closeGap(openGap.id);
              }}
              onAdvanceStage={() => advanceStage(selectedCase.id)}
              onSendNotification={handleSendNotification}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
