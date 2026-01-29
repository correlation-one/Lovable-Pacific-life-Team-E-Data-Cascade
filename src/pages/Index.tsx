import { useState } from "react";
import { CaseProvider, useCaseContext } from "@/context/CaseContext";
import { WorkQueue } from "@/components/WorkQueue/WorkQueue";
import { CaseDetail } from "@/components/CaseDetail/CaseDetail";

function AppContent() {
  const { cases, selectCase, selectedCaseId } = useCaseContext();

  const handleSelectCase = (caseId: string) => {
    selectCase(caseId);
  };

  const handleBack = () => {
    selectCase(null);
  };

  if (selectedCaseId) {
    return <CaseDetail onBack={handleBack} />;
  }

  return <WorkQueue cases={cases} onSelectCase={handleSelectCase} />;
}

export default function Index() {
  return (
    <CaseProvider>
      <div className="min-h-screen bg-background">
        <AppContent />
      </div>
    </CaseProvider>
  );
}
