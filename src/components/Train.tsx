import { motion } from "framer-motion";

interface TrainProps {
  path: string;
  duration: number;
  delay?: number;
  color?: "amber" | "teal" | "red";
  size?: "sm" | "md" | "lg";
  dataLabel?: string;
}

const colorClasses = {
  amber: "fill-train stroke-primary",
  teal: "fill-secondary stroke-secondary",
  red: "fill-destructive stroke-destructive",
};

const sizeConfig = {
  sm: { width: 16, height: 8, radius: 2 },
  md: { width: 24, height: 12, radius: 3 },
  lg: { width: 32, height: 16, radius: 4 },
};

export function Train({ 
  path, 
  duration, 
  delay = 0, 
  color = "amber",
  size = "md",
  dataLabel
}: TrainProps) {
  const { width, height, radius } = sizeConfig[size];

  return (
    <motion.g
      initial={{ offsetDistance: "0%" }}
      animate={{ offsetDistance: "100%" }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "linear",
      }}
      style={{
        offsetPath: `path("${path}")`,
        offsetRotate: "auto",
      }}
    >
      {/* Train glow */}
      <motion.rect
        x={-width / 2 - 2}
        y={-height / 2 - 2}
        width={width + 4}
        height={height + 4}
        rx={radius + 1}
        className={`${colorClasses[color]} opacity-30`}
        style={{ filter: "blur(4px)" }}
      />
      
      {/* Train body */}
      <rect
        x={-width / 2}
        y={-height / 2}
        width={width}
        height={height}
        rx={radius}
        className={colorClasses[color]}
        strokeWidth={1.5}
      />
      
      {/* Train windows */}
      <rect
        x={-width / 2 + 3}
        y={-height / 2 + 2}
        width={width - 6}
        height={height - 4}
        rx={radius - 1}
        className="fill-background/30"
      />
      
      {/* Front light */}
      <motion.circle
        cx={width / 2 - 2}
        cy={0}
        r={2}
        className="fill-primary"
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 0.5, repeat: Infinity }}
      />

      {/* Data label tooltip */}
      {dataLabel && (
        <text
          y={-height / 2 - 8}
          textAnchor="middle"
          className="fill-muted-foreground text-[8px] font-mono"
        >
          {dataLabel}
        </text>
      )}
    </motion.g>
  );
}
