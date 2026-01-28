import { motion, AnimatePresence } from "framer-motion";
import { WorkflowNode } from "./WorkflowNode";
import { WorkflowConnection } from "./WorkflowConnection";
import { StepStatus } from "./types";

interface DetailedViewProps {
  currentStep: number;
  hasError: boolean;
}

// Detailed process steps
const detailedSteps = [
  { id: "submit", label: "Submit App", description: "Client applies", x: 100, y: 150, puppet: "client" as const },
  { id: "mvr", label: "Request MVR", description: "Motor Vehicle Report", x: 250, y: 150, puppet: "system" as const },
  { id: "error", label: "MVR Failed", description: "DL info errors", x: 400, y: 150, puppet: "system" as const },
  { id: "detect", label: "Gap Detected", description: "System identifies gap", x: 550, y: 150, puppet: "system" as const },
  { id: "notify", label: "Notify Client", description: "Request documents", x: 700, y: 150, puppet: "system" as const },
  { id: "upload", label: "Upload DL", description: "Front & back images", x: 850, y: 150, puppet: "document" as const },
  { id: "review", label: "Review Docs", description: "Human or automated", x: 850, y: 300, puppet: "underwriter" as const },
  { id: "correct", label: "Correct Data", description: "Fix discrepancies", x: 700, y: 300, puppet: "underwriter" as const },
  { id: "update", label: "Update System", description: "Validated info", x: 550, y: 300, puppet: "system" as const },
  { id: "reissue", label: "Reissue MVR", description: "New request sent", x: 400, y: 300, puppet: "system" as const },
  { id: "receive", label: "MVR Received", description: "Report obtained", x: 250, y: 300, puppet: "system" as const },
  { id: "complete", label: "Continue UW", description: "Underwriting proceeds", x: 100, y: 300, puppet: "underwriter" as const },
];

const connections = [
  { from: "submit", to: "mvr", path: "M 155 150 L 195 150" },
  { from: "mvr", to: "error", path: "M 305 150 L 345 150", label: "Fails" },
  { from: "error", to: "detect", path: "M 455 150 L 495 150" },
  { from: "detect", to: "notify", path: "M 605 150 L 645 150" },
  { from: "notify", to: "upload", path: "M 755 150 L 795 150" },
  { from: "upload", to: "review", path: "M 850 205 L 850 245" },
  { from: "review", to: "correct", path: "M 795 300 L 755 300" },
  { from: "correct", to: "update", path: "M 645 300 L 605 300" },
  { from: "update", to: "reissue", path: "M 495 300 L 455 300" },
  { from: "reissue", to: "receive", path: "M 345 300 L 305 300" },
  { from: "receive", to: "complete", path: "M 195 300 L 155 300" },
];

const labelPositions: Record<string, { x: number; y: number }> = {
  "mvr-error": { x: 325, y: 130 },
};

export function DetailedView({ currentStep, hasError }: DetailedViewProps) {
  const getStatus = (index: number): StepStatus => {
    if (index < currentStep) return "complete";
    if (index === currentStep) {
      if (index === 2 && hasError) return "error";
      return "active";
    }
    return "pending";
  };

  return (
    <svg viewBox="0 0 950 450" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
      {/* Title */}
      <text x="475" y="40" textAnchor="middle" className="fill-foreground text-base font-bold">
        Insurance Underwriting: Gap Resolution Process
      </text>
      <text x="475" y="60" textAnchor="middle" className="fill-muted-foreground text-[10px]">
        Detailed workflow for handling MVR (Motor Vehicle Report) retrieval failures
      </text>

      {/* Phase labels */}
      <g className="fill-muted-foreground text-[9px] font-mono">
        <text x="475" y="90" textAnchor="middle">← Initial Request Phase →</text>
        <text x="475" y="390" textAnchor="middle">← Resolution & Completion Phase →</text>
      </g>

      {/* Connections */}
      {connections.map((conn, i) => (
        <WorkflowConnection
          key={conn.from + conn.to}
          path={conn.path}
          isActive={i <= currentStep}
          isError={i === 1 && hasError && currentStep >= 2}
          label={conn.label}
          labelPosition={conn.label ? labelPositions[`${conn.from}-${conn.to}`] : undefined}
        />
      ))}

      {/* Steps */}
      {detailedSteps.map((step, i) => (
        <WorkflowNode
          key={step.id}
          x={step.x}
          y={step.y}
          label={step.label}
          description={step.description}
          status={getStatus(i)}
          puppet={step.puppet}
          size={42}
          showDescription={true}
        />
      ))}

      {/* Legend */}
      <g transform="translate(30, 410)">
        <text x="0" y="0" className="fill-foreground text-[10px] font-semibold">Legend:</text>
        <circle cx="60" cy="-3" r="6" className="fill-primary" />
        <text x="72" y="0" className="fill-muted-foreground text-[9px]">Client</text>
        <circle cx="120" cy="-3" r="6" className="fill-secondary" />
        <text x="132" y="0" className="fill-muted-foreground text-[9px]">System</text>
        <circle cx="185" cy="-3" r="6" className="fill-accent" />
        <text x="197" y="0" className="fill-muted-foreground text-[9px]">Underwriter</text>
        <rect x="265" y="-8" width="10" height="10" rx="2" className="fill-card stroke-border" />
        <text x="280" y="0" className="fill-muted-foreground text-[9px]">Document</text>
      </g>

      {/* Current step indicator */}
      <AnimatePresence mode="wait">
        <motion.g
          key={currentStep}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <rect x="600" y="405" width="320" height="25" rx="6" className="fill-card stroke-border" />
          <text x="760" y="422" textAnchor="middle" className="fill-foreground text-[10px] font-medium">
            Step {currentStep + 1}/12: {detailedSteps[Math.min(currentStep, 11)]?.label}
          </text>
        </motion.g>
      </AnimatePresence>
    </svg>
  );
}
