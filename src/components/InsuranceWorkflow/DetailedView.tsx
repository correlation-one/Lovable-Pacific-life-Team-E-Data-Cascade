import { motion, AnimatePresence } from "framer-motion";
import { WorkflowNode } from "./WorkflowNode";
import { WorkflowConnection } from "./WorkflowConnection";
import { StepStatus } from "./types";

interface DetailedViewProps {
  currentStep: number;
  hasError: boolean;
}

// Detailed process steps with AI opportunities
const detailedSteps = [
  { 
    id: "submit", 
    label: "Submit App", 
    description: "Client applies", 
    x: 100, 
    y: 150, 
    puppet: "client" as const,
    aiEnabled: true,
    aiCapability: "Real-time validation & auto-correction suggestions"
  },
  { 
    id: "mvr", 
    label: "Request MVR", 
    description: "Motor Vehicle Report", 
    x: 250, 
    y: 150, 
    puppet: "ai" as const,
    aiEnabled: true,
    aiCapability: "Smart ordering - infers correct state from historical data"
  },
  { 
    id: "error", 
    label: "MVR Failed", 
    description: "DL info errors", 
    x: 400, 
    y: 150, 
    puppet: "system" as const,
    aiEnabled: false
  },
  { 
    id: "detect", 
    label: "Gap Detected", 
    description: "System identifies gap", 
    x: 550, 
    y: 150, 
    puppet: "ai" as const,
    aiEnabled: true,
    aiCapability: "AI diagnostics classify root cause (state mismatch, expired license, etc.)"
  },
  { 
    id: "notify", 
    label: "Notify Client", 
    description: "Request documents", 
    x: 700, 
    y: 150, 
    puppet: "ai" as const,
    aiEnabled: true,
    aiCapability: "NLG generates personalized gap notifications & chatbot assistance"
  },
  { 
    id: "upload", 
    label: "Upload DL", 
    description: "Front & back images", 
    x: 850, 
    y: 150, 
    puppet: "document" as const,
    aiEnabled: false
  },
  { 
    id: "review", 
    label: "Review Docs", 
    description: "Human or automated", 
    x: 850, 
    y: 300, 
    puppet: "ai" as const,
    aiEnabled: true,
    aiCapability: "OCR + LLM extracts name, address, license number, state"
  },
  { 
    id: "correct", 
    label: "Correct Data", 
    description: "Fix discrepancies", 
    x: 700, 
    y: 300, 
    puppet: "ai" as const,
    aiEnabled: true,
    aiCapability: "Entity resolution & predictive correction"
  },
  { 
    id: "update", 
    label: "Update System", 
    description: "Validated info", 
    x: 550, 
    y: 300, 
    puppet: "ai" as const,
    aiEnabled: true,
    aiCapability: "Auto-update of structured fields, no manual rekeying"
  },
  { 
    id: "reissue", 
    label: "Reissue MVR", 
    description: "New request sent", 
    x: 400, 
    y: 300, 
    puppet: "ai" as const,
    aiEnabled: true,
    aiCapability: "Autonomous agents trigger re-order once data confirmed"
  },
  { 
    id: "receive", 
    label: "MVR Received", 
    description: "Report obtained", 
    x: 250, 
    y: 300, 
    puppet: "system" as const,
    aiEnabled: false
  },
  { 
    id: "complete", 
    label: "Continue UW", 
    description: "Underwriting proceeds", 
    x: 100, 
    y: 300, 
    puppet: "ai" as const,
    aiEnabled: true,
    aiCapability: "Predictive risk scoring & straight-through processing"
  },
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

// AI capability details for each step
const aiStepDetails = [
  "🤖 Pattern recognition validates DL format before submission",
  "🤖 Smart ordering infers correct licensing state",
  "❌ MVR request failed due to data error",
  "🤖 AI classifies gap: state mismatch detected",
  "🤖 NLG generates personalized notification to client",
  "📄 Client uploads driver's license images",
  "🤖 OCR + LLM extracts and verifies all fields",
  "🤖 Entity resolution corrects discrepancies automatically",
  "🤖 System auto-updates with validated information",
  "🤖 Autonomous agent triggers new MVR request",
  "✅ Accurate MVR successfully retrieved",
  "🤖 Predictive analytics accelerate final risk assessment",
];

export function DetailedView({ currentStep, hasError }: DetailedViewProps) {
  const getStatus = (index: number): StepStatus => {
    if (index < currentStep) return "complete";
    if (index === currentStep) {
      if (index === 2 && hasError) return "error";
      return "active";
    }
    return "pending";
  };

  // Count AI-enabled steps
  const aiEnabledCount = detailedSteps.filter(s => s.aiEnabled).length;

  return (
    <svg viewBox="0 0 950 520" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
      {/* Title */}
      <text x="475" y="30" textAnchor="middle" className="fill-foreground text-base font-bold">
        Insurance Underwriting: AI-Enhanced Gap Resolution
      </text>
      <text x="475" y="50" textAnchor="middle" className="fill-muted-foreground text-[10px]">
        Detailed workflow showing {aiEnabledCount} AI-enabled steps for MVR retrieval failure handling
      </text>

      {/* AI Summary Banner */}
      <g transform="translate(100, 60)">
        <motion.rect
          x="0"
          y="0"
          width="750"
          height="26"
          rx="13"
          fill="hsl(280 100% 60% / 0.12)"
          stroke="hsl(280 100% 60% / 0.3)"
          strokeWidth={1}
          animate={{ opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        />
        <text x="375" y="18" textAnchor="middle" className="fill-foreground text-[10px] font-medium">
          ✨ {aiEnabledCount} of 12 steps leverage AI: OCR, LLM extraction, NLG, predictive analytics, autonomous agents
        </text>
      </g>

      {/* Phase labels */}
      <g className="fill-muted-foreground text-[9px] font-mono">
        <text x="475" y="100" textAnchor="middle">← Initial Request Phase →</text>
        <text x="475" y="395" textAnchor="middle">← Resolution & Completion Phase →</text>
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
          aiEnabled={step.aiEnabled}
          aiCapability={step.aiCapability}
        />
      ))}

      {/* Legend */}
      <g transform="translate(30, 420)">
        <text x="0" y="0" className="fill-foreground text-[10px] font-semibold">Legend:</text>
        
        {/* AI indicator */}
        <motion.circle
          cx="55"
          cy="-3"
          r="6"
          fill="hsl(280 100% 60%)"
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <text x="64" y="0" className="fill-foreground text-[9px] font-semibold">AI</text>
        <text x="78" y="0" className="fill-muted-foreground text-[9px]">AI-enabled</text>
        
        <circle cx="150" cy="-3" r="6" className="fill-primary" />
        <text x="162" y="0" className="fill-muted-foreground text-[9px]">Client</text>
        
        <circle cx="205" cy="-3" r="6" className="fill-secondary" />
        <text x="217" y="0" className="fill-muted-foreground text-[9px]">System</text>
        
        <circle cx="270" cy="-3" r="6" className="fill-accent" />
        <text x="282" y="0" className="fill-muted-foreground text-[9px]">Underwriter</text>
        
        <rect x="345" y="-8" width="10" height="10" rx="2" className="fill-card stroke-border" />
        <text x="360" y="0" className="fill-muted-foreground text-[9px]">Document</text>
      </g>

      {/* AI Capability detail for current step */}
      <AnimatePresence mode="wait">
        <motion.g
          key={currentStep}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <rect x="30" y="445" width="890" height="35" rx="8" className="fill-card stroke-border" />
          <text x="475" y="467" textAnchor="middle" className="fill-foreground text-[11px] font-medium">
            Step {currentStep + 1}/12: {aiStepDetails[Math.min(currentStep, 11)]}
          </text>
        </motion.g>
      </AnimatePresence>

      {/* Current step indicator */}
      <g transform="translate(700, 495)">
        <rect x="0" y="0" width="220" height="20" rx="4" className="fill-muted/50" />
        <text x="110" y="14" textAnchor="middle" className="fill-muted-foreground text-[9px]">
          {detailedSteps[Math.min(currentStep, 11)]?.aiEnabled ? "🤖 AI-Assisted Step" : "Manual/System Step"}
        </text>
      </g>
    </svg>
  );
}
