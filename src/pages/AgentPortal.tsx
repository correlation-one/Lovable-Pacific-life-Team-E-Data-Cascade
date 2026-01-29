import { useState } from "react";
import { CaseProvider, useCaseContext } from "@/context/CaseContext";
import { AgentCaseList } from "@/components/AgentPortal/AgentCaseList";
import { AgentCaseDetail } from "@/components/AgentPortal/AgentCaseDetail";

function AgentPortalContent() {
  const { cases, selectCase, selectedCaseId } = useCaseContext();

  if (selectedCaseId) {
    return <AgentCaseDetail onBack={() => selectCase(null)} />;
  }

  return <AgentCaseList cases={cases} onSelectCase={selectCase} />;
}

export default function AgentPortal() {
  return (
    <CaseProvider>
      <div className="min-h-screen bg-background">
        <AgentPortalContent />
      </div>
    </CaseProvider>
  );
}
