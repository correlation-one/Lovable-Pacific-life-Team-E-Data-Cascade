import { motion, AnimatePresence } from "framer-motion";
import { WorkflowNode } from "./WorkflowNode";
import { WorkflowConnection } from "./WorkflowConnection";
import { StepStatus } from "./types";

interface ExecutiveViewProps {
  currentStep: number;
}

// Simplified executive view - 4 main stages
const executiveSteps = [
  { id: "apply", label: "Application", description: "$500K Life Insurance", x: 150, y: 200, puppet: "client" as const },
  { id: "verify", label: "Verification", description: "Data & Documents", x: 400, y: 200, puppet: "system" as const },
  { id: "resolve", label: "Gap Resolution", description: "Fix Issues", x: 650, y: 200, puppet: "underwriter" as const },
  { id: "complete", label: "Approved", description: "Policy Issued", x: 900, y: 200, puppet: "client" as const },
];

const connections = [
  { from: "apply", to: "verify", path: "M 210 200 L 340 200" },
  { from: "verify", to: "resolve", path: "M 460 200 L 590 200" },
  { from: "resolve", to: "complete", path: "M 710 200 L 840 200" },
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
    <svg viewBox="0 0 1050 400" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
      {/* Title */}
      <text x="525" y="50" textAnchor="middle" className="fill-foreground text-lg font-bold">
        Life Insurance Application Journey
      </text>
      <text x="525" y="75" textAnchor="middle" className="fill-muted-foreground text-xs">
        From application to approval in 4 simple steps
      </text>

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
        />
      ))}

      {/* Progress bar */}
      <g transform="translate(150, 320)">
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
        <text x="375" y="30" textAnchor="middle" className="fill-muted-foreground text-xs">
          Progress: {Math.round((execStep / 3) * 100)}%
        </text>
      </g>

      {/* Key message */}
      <AnimatePresence mode="wait">
        <motion.g
          key={execStep}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          <rect x="300" y="360" width="450" height="30" rx="6" className="fill-card stroke-border" />
          <text x="525" y="380" textAnchor="middle" className="fill-foreground text-xs font-medium">
            {execStep === 0 && "📋 Client submits application for $500K policy"}
            {execStep === 1 && "🔍 System gathering required evidence & documents"}
            {execStep === 2 && "✏️ Resolving data gaps and verifying information"}
            {execStep === 3 && "✅ Application approved, underwriting complete!"}
          </text>
        </motion.g>
      </AnimatePresence>
    </svg>
  );
}
