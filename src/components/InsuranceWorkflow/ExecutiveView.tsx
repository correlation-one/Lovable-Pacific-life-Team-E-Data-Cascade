import { motion, AnimatePresence } from "framer-motion";
import { WorkflowNode } from "./WorkflowNode";
import { WorkflowConnection } from "./WorkflowConnection";
import { StepStatus } from "./types";

interface ExecutiveViewProps {
  currentStep: number;
}

// Simplified executive view - 5 main stages with AI opportunities
const executiveSteps = [
  { 
    id: "fill", 
    label: "Fill Application", 
    description: "Applicant or Agent", 
    x: 100, 
    y: 200, 
    puppet: "client" as const,
    aiEnabled: false,
    aiCapability: ""
  },
  { 
    id: "validate", 
    label: "Auto-Validation", 
    description: "Real-time checks", 
    x: 280, 
    y: 200, 
    puppet: "ai" as const,
    aiEnabled: true,
    aiCapability: "Catches city-state mismatch, DL format errors in real-time"
  },
  { 
    id: "verify", 
    label: "Verification", 
    description: "Data & Documents", 
    x: 460, 
    y: 200, 
    puppet: "ai" as const,
    aiEnabled: true,
    aiCapability: "Smart ordering, OCR & LLM extraction"
  },
  { 
    id: "resolve", 
    label: "Gap Resolution", 
    description: "Fix Issues", 
    x: 640, 
    y: 200, 
    puppet: "ai" as const,
    aiEnabled: true,
    aiCapability: "Automated diagnostics & NLG communications"
  },
  { 
    id: "complete", 
    label: "Approved", 
    description: "Policy Issued", 
    x: 820, 
    y: 200, 
    puppet: "underwriter" as const,
    aiEnabled: true,
    aiCapability: "Predictive risk scoring & STP"
  },
];

const connections = [
  { from: "fill", to: "validate", path: "M 155 200 L 225 200" },
  { from: "validate", to: "verify", path: "M 335 200 L 405 200" },
  { from: "verify", to: "resolve", path: "M 515 200 L 585 200" },
  { from: "resolve", to: "complete", path: "M 695 200 L 765 200" },
];

// AI benefit messages for executive view
const aiBenefits = [
  { step: 0, message: "📝 Applicant or agent enters policy application details" },
  { step: 1, message: "🤖 AI validates in real-time: catches city-state mismatch, invalid DL format → Errors fixed before submission" },
  { step: 2, message: "🤖 Smart ordering identifies correct state → MVR ordered accurately" },
  { step: 3, message: "🤖 Automated gap detection & client messaging → Faster resolution" },
  { step: 4, message: "🤖 Predictive analytics enable straight-through processing → Faster decisions" },
];

export function ExecutiveView({ currentStep }: ExecutiveViewProps) {
  const getStatus = (index: number): StepStatus => {
    if (index < currentStep) return "complete";
    if (index === currentStep) return "active";
    return "pending";
  };

  // Map simulation step to executive stage (0-12 simulation maps to 0-4 exec)
  const execStep = Math.min(Math.floor(currentStep / 2.6), 4);

  return (
    <svg viewBox="0 0 920 480" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
      {/* Title */}
      <text x="460" y="40" textAnchor="middle" className="fill-foreground text-lg font-bold">
        Life Insurance Application Journey
      </text>
      <text x="460" y="62" textAnchor="middle" className="fill-muted-foreground text-xs">
        From application to approval in 5 simple steps
      </text>

      {/* AI Enhancement Banner */}
      <g transform="translate(135, 75)">
        <motion.rect
          x="0"
          y="0"
          width="650"
          height="32"
          rx="16"
          fill="hsl(280 100% 60% / 0.15)"
          stroke="hsl(280 100% 60% / 0.4)"
          strokeWidth={1}
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        <text x="325" y="21" textAnchor="middle" className="fill-foreground text-xs font-semibold">
          ✨ AI-Enhanced Workflow — 4 of 5 stages leverage intelligent automation
        </text>
      </g>

      {/* Connections */}
      {connections.map((conn, i) => (
        <WorkflowConnection
          key={conn.from + conn.to}
          path={conn.path}
          isActive={i <= execStep}
        />
      ))}

      {/* Steps */}
      {executiveSteps.map((step, i) => (
        <WorkflowNode
          key={step.id}
          x={step.x}
          y={step.y}
          label={step.label}
          description={step.description}
          status={getStatus(i <= execStep ? (i < execStep ? 2 : 1) : 0)}
          puppet={step.puppet}
          size={50}
          aiEnabled={step.aiEnabled}
          aiCapability={step.aiCapability}
        />
      ))}

      {/* Progress bar */}
      <g transform="translate(100, 340)">
        <rect x="0" y="0" width="720" height="8" rx="4" className="fill-muted" />
        <motion.rect
          x="0"
          y="0"
          width={720}
          height="8"
          rx="4"
          className="fill-primary"
          initial={{ width: 0 }}
          animate={{ width: (execStep / 4) * 720 }}
          transition={{ duration: 0.5 }}
        />
        <text x="360" y="28" textAnchor="middle" className="fill-muted-foreground text-xs">
          Progress: {Math.round((execStep / 4) * 100)}%
        </text>
      </g>

      {/* AI Benefit message */}
      <AnimatePresence mode="wait">
        <motion.g
          key={execStep}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          <rect x="60" y="380" width="800" height="40" rx="8" className="fill-card stroke-border" />
          <text x="460" y="405" textAnchor="middle" className="fill-foreground text-xs font-medium">
            {aiBenefits[execStep]?.message}
          </text>
        </motion.g>
      </AnimatePresence>

      {/* AI Legend */}
      <g transform="translate(100, 440)">
        <motion.circle
          cx="10"
          cy="0"
          r="8"
          fill="hsl(280 100% 60%)"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <text x="22" y="4" className="fill-foreground text-[10px] font-semibold">AI</text>
        <text x="42" y="4" className="fill-muted-foreground text-[10px]">= AI-enabled step</text>
        
        <g transform="translate(180, 0)">
          <circle cx="10" cy="0" r="8" className="fill-primary" />
          <text x="24" y="4" className="fill-muted-foreground text-[10px]">Client/Agent</text>
        </g>
        <g transform="translate(300, 0)">
          <circle cx="10" cy="0" r="8" className="fill-accent" />
          <text x="24" y="4" className="fill-muted-foreground text-[10px]">Underwriter</text>
        </g>
        
        {/* Example callout */}
        <g transform="translate(450, -5)">
          <rect x="0" y="-8" width="260" height="22" rx="4" fill="hsl(280 100% 60% / 0.1)" stroke="hsl(280 100% 60% / 0.3)" />
          <text x="130" y="5" textAnchor="middle" className="fill-muted-foreground text-[9px]">
            Example: City "Miami" + State "Texas" → AI flags mismatch
          </text>
        </g>
      </g>
    </svg>
  );
}
