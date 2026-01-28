import { motion } from "framer-motion";

interface WorkflowConnectionProps {
  path: string;
  isActive?: boolean;
  isError?: boolean;
  label?: string;
  labelPosition?: { x: number; y: number };
}

export function WorkflowConnection({
  path,
  isActive = false,
  isError = false,
  label,
  labelPosition,
}: WorkflowConnectionProps) {
  return (
    <g>
      {/* Track shadow */}
      <path
        d={path}
        fill="none"
        stroke="hsl(var(--background))"
        strokeWidth={8}
        strokeLinecap="round"
        style={{ filter: "blur(2px)" }}
      />

      {/* Main track */}
      <path
        d={path}
        fill="none"
        stroke={
          isError
            ? "hsl(var(--destructive))"
            : isActive
            ? "hsl(var(--secondary))"
            : "hsl(var(--muted))"
        }
        strokeWidth={4}
        strokeLinecap="round"
        opacity={isActive || isError ? 1 : 0.5}
      />

      {/* Center dashed line */}
      <path
        d={path}
        fill="none"
        stroke="hsl(var(--border))"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeDasharray="6 6"
      />

      {/* Animated flow */}
      {(isActive || isError) && (
        <motion.path
          d={path}
          fill="none"
          stroke={isError ? "hsl(var(--destructive))" : "hsl(var(--primary))"}
          strokeWidth={2}
          strokeLinecap="round"
          strokeDasharray="15 30"
          initial={{ strokeDashoffset: 0 }}
          animate={{ strokeDashoffset: -45 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
      )}

      {/* Label */}
      {label && labelPosition && (
        <g>
          <rect
            x={labelPosition.x - 40}
            y={labelPosition.y - 10}
            width={80}
            height={20}
            rx={4}
            className="fill-card/90"
          />
          <text
            x={labelPosition.x}
            y={labelPosition.y + 4}
            textAnchor="middle"
            className="fill-muted-foreground text-[9px] font-mono"
          >
            {label}
          </text>
        </g>
      )}
    </g>
  );
}
