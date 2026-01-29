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

  // Use CASE-2024-003 (Robert K. Williams) - has DOB conflicts, blocked status, open gaps
  const unresolvedCase = cases.find(c => c.id === "CASE-2024-003") || cases[0];
  return <WorkQueue cases={[unresolvedCase]} onSelectCase={handleSelectCase} />;
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
