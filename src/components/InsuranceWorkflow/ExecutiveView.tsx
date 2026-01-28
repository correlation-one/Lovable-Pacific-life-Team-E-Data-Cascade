import { motion, AnimatePresence } from "framer-motion";
import { WorkflowNode } from "./WorkflowNode";
import { WorkflowConnection } from "./WorkflowConnection";
import { StepStatus } from "./types";

interface ExecutiveViewProps {
  currentStep: number;
}

// Simplified executive view - 4 main stages with AI opportunities
const executiveSteps = [
  { 
    id: "apply", 
    label: "Application", 
    description: "$500K Life Insurance", 
    x: 150, 
    y: 200, 
    puppet: "client" as const,
    aiEnabled: true,
    aiCapability: "Real-time validation & pattern recognition"
  },
  { 
    id: "verify", 
    label: "Verification", 
    description: "Data & Documents", 
    x: 400, 
    y: 200, 
    puppet: "ai" as const,
    aiEnabled: true,
    aiCapability: "Smart ordering, OCR & LLM extraction"
  },
  { 
    id: "resolve", 
    label: "Gap Resolution", 
    description: "Fix Issues", 
    x: 650, 
    y: 200, 
    puppet: "ai" as const,
    aiEnabled: true,
    aiCapability: "Automated diagnostics & NLG communications"
  },
  { 
    id: "complete", 
    label: "Approved", 
    description: "Policy Issued", 
    x: 900, 
    y: 200, 
    puppet: "underwriter" as const,
    aiEnabled: true,
    aiCapability: "Predictive risk scoring & STP"
  },
];

const connections = [
  { from: "apply", to: "verify", path: "M 210 200 L 340 200" },
  { from: "verify", to: "resolve", path: "M 460 200 L 590 200" },
  { from: "resolve", to: "complete", path: "M 710 200 L 840 200" },
];

// AI benefit messages for executive view
const aiBenefits = [
  { step: 0, message: "🤖 AI validates driver's license format in real-time → Fewer MVR errors" },
  { step: 1, message: "🤖 Smart ordering identifies correct state → MVR ordered accurately" },
  { step: 2, message: "🤖 Automated gap detection & client messaging → Faster resolution" },
  { step: 3, message: "🤖 Predictive analytics enable straight-through processing → Faster decisions" },
];

export function ExecutiveView({ currentStep }: ExecutiveViewProps) {
  const getStatus = (index: number): StepStatus => {
    if (index < currentStep) return "complete";
    if (index === currentStep) return "active";
    return "pending";
  };

  // Map simulation step to executive stage (0-11 simulation maps to 0-3 exec)
  const execStep = Math.min(Math.floor(currentStep / 3), 3);

  return (
    <svg viewBox="0 0 1050 480" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
      {/* Title */}
      <text x="525" y="40" textAnchor="middle" className="fill-foreground text-lg font-bold">
        Life Insurance Application Journey
      </text>
      <text x="525" y="62" textAnchor="middle" className="fill-muted-foreground text-xs">
        From application to approval in 4 simple steps
      </text>

      {/* AI Enhancement Banner */}
      <g transform="translate(200, 75)">
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
          ✨ AI-Enhanced Workflow — All 4 stages leverage intelligent automation
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
          size={55}
          aiEnabled={step.aiEnabled}
          aiCapability={step.aiCapability}
        />
      ))}

      {/* Progress bar */}
      <g transform="translate(150, 340)">
        <rect x="0" y="0" width="750" height="8" rx="4" className="fill-muted" />
        <motion.rect
          x="0"
          y="0"
          width={750}
          height="8"
          rx="4"
          className="fill-primary"
          initial={{ width: 0 }}
          animate={{ width: (execStep / 3) * 750 }}
          transition={{ duration: 0.5 }}
        />
        <text x="375" y="28" textAnchor="middle" className="fill-muted-foreground text-xs">
          Progress: {Math.round((execStep / 3) * 100)}%
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
          <rect x="175" y="380" width="700" height="40" rx="8" className="fill-card stroke-border" />
          <text x="525" y="405" textAnchor="middle" className="fill-foreground text-xs font-medium">
            {aiBenefits[execStep]?.message}
          </text>
        </motion.g>
      </AnimatePresence>

      {/* AI Legend */}
      <g transform="translate(150, 440)">
        <motion.circle
          cx="10"
          cy="0"
          r="8"
          fill="hsl(280 100% 60%)"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <text x="22" y="4" className="fill-foreground text-[10px] font-semibold">AI</text>
        <text x="42" y="4" className="fill-muted-foreground text-[10px]">= AI-enabled step with automation opportunity</text>
        
        <g transform="translate(350, 0)">
          <circle cx="10" cy="0" r="8" className="fill-primary" />
          <text x="24" y="4" className="fill-muted-foreground text-[10px]">Client</text>
        </g>
        <g transform="translate(430, 0)">
          <circle cx="10" cy="0" r="8" className="fill-accent" />
          <text x="24" y="4" className="fill-muted-foreground text-[10px]">Underwriter</text>
        </g>
      </g>
    </svg>
  );
}
