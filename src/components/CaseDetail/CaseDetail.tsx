import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCaseContext } from "@/context/CaseContext";
import { CaseHeader } from "./CaseHeader";
import { JourneyTracker } from "./JourneyTracker";
import { CaseSnapshot } from "./CaseSnapshot";
import { RightRail } from "./RightRail";
import { DemoControls } from "./DemoControls";
import { OverviewTab } from "./Tabs/OverviewTab";
import { DocumentsTab } from "./Tabs/DocumentsTab";
import { EvidenceTab } from "./Tabs/EvidenceTab";
import { PreFillTab } from "./Tabs/PreFillTab";
import { GapsTab } from "./Tabs/GapsTab";
import { AuditTrailTab } from "./Tabs/AuditTrailTab";
import { getNextBestActions, getBlockers, mockEvidenceRules, mockApplicationSections, mockFieldVerifications } from "@/data/mockData";
import {
  LayoutDashboard,
  FileText,
  Target,
  FormInput,
  AlertCircle,
  Bell,
  Package,
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
  const evidenceIssuesCount = evidenceOrders.filter(
    (e) => e.caseId === selectedCase.id && e.status === "failed"
  ).length;

  const nextBestActions = getNextBestActions(selectedCase.id);
  const blockers = getBlockers(selectedCase.id);

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

  return (
    <div className="min-h-screen bg-background">
      <CaseHeader
        caseData={selectedCase}
        openGapsCount={openGapsCount}
        evidenceIssuesCount={evidenceIssuesCount}
        onBack={onBack}
      />

      <div className="p-6 space-y-6">
        <JourneyTracker
          currentStage={selectedCase.stage}
          stageStatus={selectedCase.stageStatus}
          stageOwners={selectedCase.stageOwners}
          stageETAs={selectedCase.stageETAs}
          stageBlockers={selectedCase.stageBlockers}
          activeTab={activeTab}
        />

        <div className="grid grid-cols-12 gap-6">
          {/* Left: Case Snapshot */}
          <div className="col-span-12 lg:col-span-2">
            <CaseSnapshot
              caseData={selectedCase}
              openGapsCount={openGapsCount}
              blockersCount={blockers.length}
            />
          </div>

          {/* Center: Main Workspace */}
          <div className="col-span-12 lg:col-span-7">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 mb-4">
                <TabsTrigger value="overview" className="text-xs gap-1">
                  <LayoutDashboard className="w-3 h-3" />
                  <span className="hidden sm:inline">Overview</span>
                </TabsTrigger>
                <TabsTrigger value="documents" className="text-xs gap-1">
                  <FileText className="w-3 h-3" />
                  <span className="hidden sm:inline">Docs</span>
                </TabsTrigger>
                <TabsTrigger value="evidence" className="text-xs gap-1">
                  <Target className="w-3 h-3" />
                  <span className="hidden sm:inline">Evidence</span>
                </TabsTrigger>
                <TabsTrigger value="prefill" className="text-xs gap-1">
                  <FormInput className="w-3 h-3" />
                  <span className="hidden sm:inline">Pre-Fill</span>
                </TabsTrigger>
                <TabsTrigger value="gaps" className="text-xs gap-1">
                  <AlertCircle className="w-3 h-3" />
                  <span className="hidden sm:inline">Gaps</span>
                </TabsTrigger>
                <TabsTrigger value="comms" className="text-xs gap-1">
                  <Bell className="w-3 h-3" />
                  <span className="hidden sm:inline">Comms</span>
                </TabsTrigger>
                <TabsTrigger value="packet" className="text-xs gap-1">
                  <Package className="w-3 h-3" />
                  <span className="hidden sm:inline">Packet</span>
                </TabsTrigger>
                <TabsTrigger value="audit" className="text-xs gap-1">
                  <History className="w-3 h-3" />
                  <span className="hidden sm:inline">Audit</span>
                </TabsTrigger>
              </TabsList>

              <ScrollArea className="h-[calc(100vh-350px)]">
                <TabsContent value="overview" className="mt-0">
                  <OverviewTab caseData={selectedCase} gaps={gaps} evidenceOrders={evidenceOrders} />
                </TabsContent>
                <TabsContent value="documents" className="mt-0">
                  <DocumentsTab documents={documents} fieldVerifications={mockFieldVerifications} caseId={selectedCase.id} />
                </TabsContent>
                <TabsContent value="evidence" className="mt-0">
                  <EvidenceTab evidenceOrders={evidenceOrders} evidenceRules={mockEvidenceRules} caseId={selectedCase.id} />
                </TabsContent>
                <TabsContent value="prefill" className="mt-0">
                  <PreFillTab sections={mockApplicationSections} />
                </TabsContent>
                <TabsContent value="gaps" className="mt-0">
                  <GapsTab gaps={gaps} caseId={selectedCase.id} onCloseGap={closeGap} />
                </TabsContent>
                <TabsContent value="comms" className="mt-0">
                  <div className="text-center py-8 text-muted-foreground">
                    Notifications Center - {notifications.filter((n) => n.caseId === selectedCase.id).length} messages
                  </div>
                </TabsContent>
                <TabsContent value="packet" className="mt-0">
                  <div className="text-center py-8 text-muted-foreground">
                    Decision Packet - {selectedCase.stage >= 7 ? "Ready" : "Not yet available"}
                  </div>
                </TabsContent>
                <TabsContent value="audit" className="mt-0">
                  <AuditTrailTab events={auditEvents} caseId={selectedCase.id} />
                </TabsContent>
              </ScrollArea>
            </Tabs>
          </div>

          {/* Right Rail */}
          <div className="col-span-12 lg:col-span-3 space-y-4">
            <DemoControls
              caseId={selectedCase.id}
              onToggleMissingDemographics={(m) => toggleMissingDemographics(selectedCase.id, m)}
              onVerifyDemographics={() => verifyDemographics(selectedCase.id)}
              onOrderEvidence={() => orderEvidence(selectedCase.id, "MVR")}
              onToggleEvidenceFailure={(f) => toggleEvidenceFailure(selectedCase.id, f)}
              onReceiveEvidence={() => receiveEvidence(selectedCase.id, "MVR")}
              onCloseGap={() => gaps.filter((g) => g.caseId === selectedCase.id && g.status !== "closed")[0] && closeGap(gaps.filter((g) => g.caseId === selectedCase.id && g.status !== "closed")[0].id)}
              onAdvanceStage={() => advanceStage(selectedCase.id)}
              onSendNotification={handleSendNotification}
            />
            <RightRail
              nextBestActions={nextBestActions}
              blockers={blockers}
              watchers={["Sarah Chen", "Mike Johnson"]}
              notes={["High-value case - expedite if possible"]}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
