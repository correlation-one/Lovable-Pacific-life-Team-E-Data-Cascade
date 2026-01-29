import { useState } from "react";
import { CaseProvider, useCaseContext } from "@/context/CaseContext";
import { WorkQueue } from "@/components/WorkQueue/WorkQueue";
import { CaseDetail } from "@/components/CaseDetail/CaseDetail";
import pacificLifeLogo from "@/assets/pacific-life-logo.svg";

function AppHeader() {
  return (
    <header className="bg-[#003366] text-white py-4 px-6 shadow-lg">
      <div className="flex items-center gap-4">
        <img src={pacificLifeLogo} alt="Pacific Life" className="h-10" />
        <div className="border-l border-white/30 pl-4">
          <h1 className="text-xl font-bold tracking-tight">Whale Watcher</h1>
          <p className="text-xs text-white/70">
            Dynamic Policy Application Journey
          </p>
        </div>
      </div>
    </header>
  );
}

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
        <AppHeader />
        <AppContent />
      </div>
    </CaseProvider>
  );
}
