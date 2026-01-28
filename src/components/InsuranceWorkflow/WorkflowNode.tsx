import { motion } from "framer-motion";
import { Puppet } from "./Puppet";
import { StepStatus } from "./types";

interface WorkflowNodeProps {
  x: number;
  y: number;
  label: string;
  description: string;
  status: StepStatus;
  puppet?: "client" | "system" | "underwriter" | "document";
  size?: number;
  showDescription?: boolean;
}

const statusColors = {
  pending: "stroke-muted-foreground/50",
  active: "stroke-secondary",
  complete: "stroke-success",
  error: "stroke-destructive",
  success: "stroke-success",
};

export function WorkflowNode({
  x,
  y,
  label,
  description,
  status,
  puppet,
  size = 60,
  showDescription = true,
}: WorkflowNodeProps) {
  const isActive = status === "active";
  const isError = status === "error";

  return (
    <motion.g
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {/* Background glow */}
      {isActive && (
        <motion.circle
          cx={x}
          cy={y}
          r={size + 15}
          className={isError ? "fill-destructive/10" : "fill-secondary/10"}
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}

      {/* Main node circle */}
      <circle
        cx={x}
        cy={y}
        r={size}
        className={`fill-card ${statusColors[status]}`}
        strokeWidth={3}
      />

      {/* Inner decorative ring */}
      <circle
        cx={x}
        cy={y}
        r={size - 8}
        className="fill-none stroke-border"
        strokeWidth={1}
        strokeDasharray="4 4"
      />

      {/* Puppet character */}
      {puppet && (
        <Puppet
          type={puppet}
          x={x}
          y={y}
          isActive={isActive}
          isError={isError}
          size={size * 0.7}
        />
      )}

      {/* Label */}
      <text
        x={x}
        y={y + size + 20}
        textAnchor="middle"
        className="fill-foreground text-xs font-semibold"
      >
        {label}
      </text>

      {/* Description */}
      {showDescription && (
        <text
          x={x}
          y={y + size + 35}
          textAnchor="middle"
          className="fill-muted-foreground text-[10px] font-mono"
        >
          {description}
        </text>
      )}

      {/* Status indicator */}
      {status === "complete" && (
        <motion.circle
          cx={x + size * 0.7}
          cy={y - size * 0.7}
          r={10}
          className="fill-success"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
        >
          <title>Complete</title>
        </motion.circle>
      )}
      {status === "error" && (
        <motion.circle
          cx={x + size * 0.7}
          cy={y - size * 0.7}
          r={10}
          className="fill-destructive"
          initial={{ scale: 0 }}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 0.5, repeat: Infinity }}
        >
          <title>Error</title>
        </motion.circle>
      )}
    </motion.g>
  );
}
