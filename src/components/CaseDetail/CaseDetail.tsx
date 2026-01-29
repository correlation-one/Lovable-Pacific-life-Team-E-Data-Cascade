import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCaseContext } from "@/context/CaseContext";
import { CaseHeader } from "./CaseHeader";
import { ComponentProgress } from "./ComponentProgress";
import { DemoControls } from "./DemoControls";
import { AIReconciliationDemo } from "./AIReconciliationDemo";
import { HealthHistoryQuestions } from "./HealthHistoryQuestions";
import { OverviewTab } from "./Tabs/OverviewTab";
import { DocumentsTab } from "./Tabs/DocumentsTab";
import { EvidenceTab } from "./Tabs/EvidenceTab";
import { GapsTab } from "./Tabs/GapsTab";
import { AuditTrailTab } from "./Tabs/AuditTrailTab";
import { mockEvidenceRules, mockFieldVerifications } from "@/data/mockData";
import {
  LayoutDashboard,
  FileText,
  Target,
  AlertCircle,
  History,
} from "lucide-react";

interface CaseDetailProps {
  onBack: () => void;
}

export function CaseDetail({ onBack }: CaseDetailProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [showAIDemo, setShowAIDemo] = useState(false);
  const [showHealthHistory, setShowHealthHistory] = useState(false);
  const {
    selectedCase,
    documents,
    gaps,
    evidenceOrders,
    notifications,
    auditEvents,
    demoCompleted,
    toggleMissingDemographics,
    verifyDemographics,
    orderEvidence,
    toggleEvidenceFailure,
    receiveEvidence,
    closeGap,
    advanceStage,
    addNotification,
    completeDemoSuccess,
    resetDemo,
  } = useCaseContext();

  if (!selectedCase) return null;

  const openGapsCount = gaps.filter(
    (g) => g.caseId === selectedCase.id && g.status !== "closed"
  ).length;

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
    setActiveTab("documents");
  };

  const handleComponentClick = (component: string) => {
    // Navigate to relevant tab based on component
    switch (component) {
      case "documents":
        setActiveTab("documents");
        break;
      case "evidence":
        setActiveTab("evidence");
        break;
      case "gaps":
        setActiveTab("gaps");
        break;
      case "application":
      case "verification":
        setActiveTab("overview");
        break;
    }
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
        {/* Component Progress */}
        <ComponentProgress
          caseData={selectedCase}
          gaps={gaps}
          evidenceOrders={evidenceOrders}
          documents={documents}
          onComponentClick={handleComponentClick}
        />

        {/* Main Workspace - Full Width */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5 mb-3">
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
            <TabsTrigger value="gaps" className="text-xs gap-1">
              <AlertCircle className="w-3 h-3" />
              Unresolved
            </TabsTrigger>
            <TabsTrigger value="audit" className="text-xs gap-1">
              <History className="w-3 h-3" />
              Audit Trail
            </TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[calc(100vh-420px)]">
            <TabsContent value="overview" className="mt-0">
              <OverviewTab caseData={selectedCase} gaps={gaps} evidenceOrders={evidenceOrders} />
            </TabsContent>
            <TabsContent value="documents" className="mt-0">
              <DocumentsTab documents={documents} fieldVerifications={mockFieldVerifications} caseId={selectedCase.id} />
            </TabsContent>
            <TabsContent value="evidence" className="mt-0">
              <EvidenceTab 
                evidenceOrders={evidenceOrders} 
                evidenceRules={mockEvidenceRules} 
                caseId={selectedCase.id}
                onShowResolution={() => setShowAIDemo(true)}
              />
            </TabsContent>
            <TabsContent value="gaps" className="mt-0">
              <GapsTab 
                gaps={gaps} 
                caseId={selectedCase.id} 
                onCloseGap={closeGap}
                onShowAIResolution={() => setShowAIDemo(true)}
                onShowHealthHistory={() => setShowHealthHistory(true)}
              />
            </TabsContent>
            <TabsContent value="audit" className="mt-0">
              <AuditTrailTab events={auditEvents} caseId={selectedCase.id} />
            </TabsContent>
          </ScrollArea>
        </Tabs>

        {/* Demo Controls - Bottom */}
        <DemoControls
          caseId={selectedCase.id}
          demoCompleted={demoCompleted}
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
          onShowAIReconciliation={() => setShowAIDemo(true)}
          onShowHealthHistory={() => setShowHealthHistory(true)}
          onResetDemo={resetDemo}
        />
      </div>

      {/* AI Reconciliation Demo Modal */}
      <AIReconciliationDemo
        isOpen={showAIDemo}
        onClose={() => setShowAIDemo(false)}
        onComplete={() => {
          completeDemoSuccess(selectedCase.id);
        }}
      />

      {/* Health History Questions */}
      <HealthHistoryQuestions
        isOpen={showHealthHistory}
        onClose={() => setShowHealthHistory(false)}
        onComplete={() => {
          completeDemoSuccess(selectedCase.id);
        }}
      />
    </div>
  );
}
