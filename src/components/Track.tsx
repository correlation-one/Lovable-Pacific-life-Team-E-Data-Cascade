import { motion } from "framer-motion";

interface TrackProps {
  path: string;
  animated?: boolean;
  highlight?: boolean;
}

export function Track({ path, animated = true, highlight = false }: TrackProps) {
  return (
    <g>
      {/* Track shadow */}
      <path
        d={path}
        fill="none"
        stroke="hsl(var(--background))"
        strokeWidth={10}
        strokeLinecap="round"
        style={{ filter: "blur(2px)" }}
      />
      
      {/* Main track */}
      <path
        d={path}
        fill="none"
        stroke={highlight ? "hsl(var(--secondary))" : "hsl(var(--muted))"}
        strokeWidth={6}
        strokeLinecap="round"
        opacity={highlight ? 1 : 0.6}
      />
      
      {/* Track center line */}
      <path
        d={path}
        fill="none"
        stroke="hsl(var(--border))"
        strokeWidth={2}
        strokeLinecap="round"
        strokeDasharray="8 8"
      />

      {/* Animated flow indicator */}
      {animated && (
        <motion.path
          d={path}
          fill="none"
          stroke={highlight ? "hsl(var(--primary))" : "hsl(var(--secondary) / 0.5)"}
          strokeWidth={2}
          strokeLinecap="round"
          strokeDasharray="20 40"
          initial={{ strokeDashoffset: 0 }}
          animate={{ strokeDashoffset: -60 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />
      )}
    </g>
  );
}
