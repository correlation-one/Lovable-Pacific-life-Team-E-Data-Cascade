import { motion, AnimatePresence } from "framer-motion";
import { WorkflowNode } from "./WorkflowNode";
import { WorkflowConnection } from "./WorkflowConnection";
import { StepStatus } from "./types";

interface DetailedViewProps {
  currentStep: number;
  hasError: boolean;
}

// Detailed process steps with AI opportunities - 13 steps now
const detailedSteps = [
  { 
    id: "fill", 
    label: "Fill Application", 
    description: "Applicant or Agent", 
    x: 80, 
    y: 150, 
    puppet: "client" as const,
    aiEnabled: false,
    aiCapability: ""
  },
  { 
    id: "validate", 
    label: "Auto-Detect", 
    description: "Real-time validation", 
    x: 200, 
    y: 150, 
    puppet: "ai" as const,
    aiEnabled: true,
    aiCapability: "Pattern recognition catches city-state mismatch, DL format errors as user types"
  },
  { 
    id: "submit", 
    label: "Submit App", 
    description: "Clean data", 
    x: 320, 
    y: 150, 
    puppet: "client" as const,
    aiEnabled: false,
    aiCapability: ""
  },
  { 
    id: "mvr", 
    label: "Request MVR", 
    description: "Motor Vehicle Report", 
    x: 440, 
    y: 150, 
    puppet: "ai" as const,
    aiEnabled: true,
    aiCapability: "Smart ordering - infers correct state from historical data"
  },
  { 
    id: "error", 
    label: "MVR Failed", 
    description: "DL info errors", 
    x: 560, 
    y: 150, 
    puppet: "system" as const,
    aiEnabled: false
  },
  { 
    id: "detect", 
    label: "Gap Detected", 
    description: "AI classifies issue", 
    x: 680, 
    y: 150, 
    puppet: "ai" as const,
    aiEnabled: true,
    aiCapability: "AI diagnostics classify root cause (state mismatch, expired license, etc.)"
  },
  { 
    id: "notify", 
    label: "Notify Client", 
    description: "Request documents", 
    x: 800, 
    y: 150, 
    puppet: "ai" as const,
    aiEnabled: true,
    aiCapability: "NLG generates personalized gap notifications & chatbot assistance"
  },
  { 
    id: "upload", 
    label: "Upload DL", 
    description: "Front & back images", 
    x: 800, 
    y: 300, 
    puppet: "document" as const,
    aiEnabled: false
  },
  { 
    id: "review", 
    label: "Review Docs", 
    description: "OCR extraction", 
    x: 680, 
    y: 300, 
    puppet: "ai" as const,
    aiEnabled: true,
    aiCapability: "OCR + LLM extracts name, address, license number, state"
  },
  { 
    id: "correct", 
    label: "Correct Data", 
    description: "Fix discrepancies", 
    x: 560, 
    y: 300, 
    puppet: "ai" as const,
    aiEnabled: true,
    aiCapability: "Entity resolution & predictive correction"
  },
  { 
    id: "update", 
    label: "Update System", 
    description: "Validated info", 
    x: 440, 
    y: 300, 
    puppet: "ai" as const,
    aiEnabled: true,
    aiCapability: "Auto-update of structured fields, no manual rekeying"
  },
  { 
    id: "catalog", 
    label: "Data Catalog", 
    description: "Shared repository", 
    x: 440, 
    y: 420, 
    puppet: "system" as const,
    aiEnabled: false,
    aiCapability: ""
  },
  { 
    id: "reissue", 
    label: "Reissue MVR", 
    description: "New request sent", 
    x: 320, 
    y: 300, 
    puppet: "ai" as const,
    aiEnabled: true,
    aiCapability: "Autonomous agents trigger re-order once data confirmed"
  },
  { 
    id: "complete", 
    label: "Continue UW", 
    description: "Underwriting proceeds", 
    x: 200, 
    y: 300, 
    puppet: "ai" as const,
    aiEnabled: true,
    aiCapability: "Predictive risk scoring & straight-through processing"
  },
];

const connections = [
  { from: "fill", to: "validate", path: "M 130 150 L 150 150" },
  { from: "validate", to: "submit", path: "M 250 150 L 270 150" },
  { from: "submit", to: "mvr", path: "M 370 150 L 390 150" },
  { from: "mvr", to: "error", path: "M 490 150 L 510 150", label: "Fails" },
  { from: "error", to: "detect", path: "M 610 150 L 630 150" },
  { from: "detect", to: "notify", path: "M 730 150 L 750 150" },
  { from: "notify", to: "upload", path: "M 800 195 L 800 255" },
  { from: "upload", to: "review", path: "M 755 300 L 730 300" },
  { from: "review", to: "correct", path: "M 635 300 L 610 300" },
  { from: "correct", to: "update", path: "M 515 300 L 490 300" },
  { from: "update", to: "catalog", path: "M 440 345 L 440 375" },
  { from: "update", to: "reissue", path: "M 395 300 L 370 300" },
  { from: "reissue", to: "complete", path: "M 275 300 L 250 300" },
];

const labelPositions: Record<string, { x: number; y: number }> = {
  "mvr-error": { x: 500, y: 130 },
};

// AI capability details for each step
const aiStepDetails = [
  "📝 Applicant or insurance agent enters application details (name, address, DL info)",
  "🤖 AI auto-detects errors in real-time: city-state mismatch, invalid DL format, missing fields",
  "✅ Application submitted with validated, clean data",
  "🤖 Smart ordering infers correct licensing state from context",
  "❌ MVR request failed due to remaining data error",
  "🤖 AI classifies gap: state mismatch, name variance, or expired license detected",
  "🤖 NLG generates personalized notification requesting correct documentation",
  "📄 Client uploads front & back of driver's license",
  "🤖 OCR + LLM extracts and verifies all fields automatically",
  "🤖 Entity resolution corrects discrepancies with predictive suggestions",
  "🤖 System auto-updates with validated information, no manual rekeying",
  "📚 Validated data synced to shared data catalog for cross-system access",
  "🤖 Autonomous agent triggers new MVR request automatically",
  "🤖 Predictive analytics accelerate final risk assessment → STP",
];

export function DetailedView({ currentStep, hasError }: DetailedViewProps) {
  const getStatus = (index: number): StepStatus => {
    if (index < currentStep) return "complete";
    if (index === currentStep) {
      if (index === 4 && hasError) return "error";
      return "active";
    }
    return "pending";
  };

  // Count AI-enabled steps
  const aiEnabledCount = detailedSteps.filter(s => s.aiEnabled).length;

  return (
    <svg viewBox="0 0 880 560" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
      {/* Title */}
      <text x="440" y="28" textAnchor="middle" className="fill-foreground text-base font-bold">
        Insurance Underwriting: AI-Enhanced Gap Resolution
      </text>
      <text x="440" y="46" textAnchor="middle" className="fill-muted-foreground text-[10px]">
        Detailed workflow showing {aiEnabledCount} AI-enabled steps with shared data catalog integration
      </text>

      {/* AI Summary Banner */}
      <g transform="translate(65, 56)">
        <motion.rect
          x="0"
          y="0"
          width="750"
          height="24"
          rx="12"
          fill="hsl(280 100% 60% / 0.12)"
          stroke="hsl(280 100% 60% / 0.3)"
          strokeWidth={1}
          animate={{ opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        />
        <text x="375" y="16" textAnchor="middle" className="fill-foreground text-[9px] font-medium">
          ✨ {aiEnabledCount} of 13 steps leverage AI: Real-time validation, OCR, LLM, NLG, predictive analytics, autonomous agents
        </text>
      </g>

      {/* Phase labels */}
      <g className="fill-muted-foreground text-[8px] font-mono">
        <text x="440" y="92" textAnchor="middle">← Application & Initial Request Phase →</text>
        <text x="500" y="390" textAnchor="middle">← Resolution & Completion Phase →</text>
      </g>

      {/* Validation callout */}
      <g transform="translate(140, 98)">
        <motion.rect
          x="0"
          y="0"
          width="160"
          height="18"
          rx="4"
          fill="hsl(280 100% 60% / 0.15)"
          stroke="hsl(280 100% 60% / 0.4)"
          strokeWidth={1}
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <text x="80" y="12" textAnchor="middle" className="fill-foreground text-[8px]">
          🔍 Catches errors before submit
        </text>
      </g>

      {/* Connections */}
      {connections.map((conn, i) => (
        <WorkflowConnection
          key={conn.from + conn.to}
          path={conn.path}
          isActive={i <= currentStep}
          isError={i === 3 && hasError && currentStep >= 4}
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
          size={38}
          showDescription={true}
          aiEnabled={step.aiEnabled}
          aiCapability={step.aiCapability}
        />
      ))}

      {/* Legend */}
      <g transform="translate(30, 415)">
        <text x="0" y="0" className="fill-foreground text-[9px] font-semibold">Legend:</text>
        
        {/* AI indicator */}
        <motion.circle
          cx="50"
          cy="-3"
          r="5"
          fill="hsl(280 100% 60%)"
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <text x="58" y="0" className="fill-foreground text-[8px] font-semibold">AI</text>
        
        <circle cx="95" cy="-3" r="5" className="fill-primary" />
        <text x="104" y="0" className="fill-muted-foreground text-[8px]">Client/Agent</text>
        
        <circle cx="170" cy="-3" r="5" className="fill-secondary" />
        <text x="179" y="0" className="fill-muted-foreground text-[8px]">System</text>
        
        <rect x="225" y="-7" width="8" height="8" rx="1" className="fill-card stroke-border" />
        <text x="237" y="0" className="fill-muted-foreground text-[8px]">Document</text>
        
        {/* Validation example */}
        <g transform="translate(300, 0)">
          <rect x="0" y="-10" width="280" height="18" rx="4" fill="hsl(280 100% 60% / 0.08)" />
          <text x="140" y="2" textAnchor="middle" className="fill-muted-foreground text-[8px]">
            Auto-Detect Example: "Miami, TX" → ⚠️ "Miami is in FL, not TX"
          </text>
        </g>
      </g>

      {/* AI Capability detail for current step */}
      <AnimatePresence mode="wait">
        <motion.g
          key={currentStep}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <rect x="30" y="445" width="820" height="32" rx="6" className="fill-card stroke-border" />
          <text x="440" y="465" textAnchor="middle" className="fill-foreground text-[10px] font-medium">
            Step {currentStep + 1}/14: {aiStepDetails[Math.min(currentStep, 13)]}
          </text>
        </motion.g>
      </AnimatePresence>

      {/* Current step indicator */}
      <g transform="translate(640, 490)">
        <rect x="0" y="0" width="200" height="18" rx="4" className="fill-muted/50" />
        <text x="100" y="12" textAnchor="middle" className="fill-muted-foreground text-[8px]">
          {detailedSteps[Math.min(currentStep, 13)]?.aiEnabled ? "🤖 AI-Assisted Step" : "👤 Manual/System Step"}
        </text>
      </g>
    </svg>
  );
}
