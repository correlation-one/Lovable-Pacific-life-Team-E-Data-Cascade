import { CaseProvider, useCaseContext } from "@/context/CaseContext";
import { WorkQueue } from "@/components/WorkQueue/WorkQueue";
import { CaseDetail } from "@/components/CaseDetail/CaseDetail";
import pacificLifeLogo from "@/assets/pacific-life-logo.svg";
import humpbackWhale from "@/assets/humpback-whale.jpg";

function AppHeader() {
  return (
    <header className="relative bg-[#003366] text-white shadow-lg overflow-hidden">
      {/* Background whale image */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url(${humpbackWhale})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 30%',
        }}
      />
      <div className="relative z-10 py-4 px-6 flex items-center gap-4">
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

  // Use CASE-2024-003 (Susan Berry) - has DOB conflicts, blocked status, open gaps
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
