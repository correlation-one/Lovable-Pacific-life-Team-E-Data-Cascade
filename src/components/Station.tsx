import { motion } from "framer-motion";
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react";

interface StationProps {
  x: number;
  y: number;
  name: string;
  status: "idle" | "processing" | "success" | "alert";
  description?: string;
  size?: number;
}

const statusConfig = {
  idle: {
    ringClass: "stroke-muted-foreground/50",
    bgClass: "fill-station",
    icon: null,
    glowClass: "",
  },
  processing: {
    ringClass: "stroke-secondary",
    bgClass: "fill-station",
    icon: Loader2,
    glowClass: "glow-teal",
  },
  success: {
    ringClass: "stroke-success",
    bgClass: "fill-station",
    icon: CheckCircle,
    glowClass: "",
  },
  alert: {
    ringClass: "stroke-destructive",
    bgClass: "fill-station",
    icon: AlertCircle,
    glowClass: "glow-red",
  },
};

export function Station({ 
  x, 
  y, 
  name, 
  status, 
  description,
  size = 50 
}: StationProps) {
  const config = statusConfig[status];
  const IconComponent = config.icon;

  return (
    <motion.g
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {/* Station outer glow */}
      {status === "processing" && (
        <motion.circle
          cx={x}
          cy={y}
          r={size + 10}
          className="fill-secondary/10 stroke-secondary/30"
          strokeWidth={2}
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
      
      {status === "alert" && (
        <motion.circle
          cx={x}
          cy={y}
          r={size + 10}
          className="fill-destructive/10 stroke-destructive/50"
          strokeWidth={2}
          animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 0.8, repeat: Infinity }}
        />
      )}

      {/* Station background */}
      <circle
        cx={x}
        cy={y}
        r={size}
        className={`${config.bgClass} ${config.ringClass}`}
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

      {/* Station name */}
      <text
        x={x}
        y={y - 5}
        textAnchor="middle"
        className="fill-foreground text-xs font-semibold"
      >
        {name}
      </text>

      {/* Status indicator */}
      {IconComponent && (
        <g transform={`translate(${x - 8}, ${y + 8})`}>
          <motion.g
            animate={status === "processing" ? { rotate: 360 } : {}}
            transition={status === "processing" ? { duration: 1, repeat: Infinity, ease: "linear" } : {}}
          >
            <IconComponent 
              size={16} 
              className={
                status === "alert" ? "text-destructive" : 
                status === "success" ? "text-success" : 
                "text-secondary"
              }
            />
          </motion.g>
        </g>
      )}

      {/* Description tooltip area */}
      {description && (
        <text
          x={x}
          y={y + size + 20}
          textAnchor="middle"
          className="fill-muted-foreground text-[10px] font-mono"
        >
          {description}
        </text>
      )}
    </motion.g>
  );
}
