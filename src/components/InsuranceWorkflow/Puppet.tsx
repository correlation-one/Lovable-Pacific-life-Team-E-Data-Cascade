import { motion } from "framer-motion";

interface PuppetProps {
  type: "client" | "system" | "underwriter" | "document";
  x: number;
  y: number;
  isActive?: boolean;
  isError?: boolean;
  size?: number;
}

const puppetColors = {
  client: {
    body: "hsl(var(--primary))",
    accent: "hsl(var(--primary-foreground))",
  },
  system: {
    body: "hsl(var(--secondary))",
    accent: "hsl(var(--secondary-foreground))",
  },
  underwriter: {
    body: "hsl(var(--accent))",
    accent: "hsl(var(--accent-foreground))",
  },
  document: {
    body: "hsl(var(--muted))",
    accent: "hsl(var(--foreground))",
  },
};

export function Puppet({ type, x, y, isActive = false, isError = false, size = 40 }: PuppetProps) {
  const colors = puppetColors[type];
  const errorColor = "hsl(var(--destructive))";

  return (
    <motion.g
      initial={{ scale: 0 }}
      animate={{ 
        scale: 1,
        y: isActive ? [0, -3, 0] : 0,
      }}
      transition={{
        scale: { type: "spring", stiffness: 300, damping: 20 },
        y: isActive ? { duration: 0.5, repeat: Infinity, ease: "easeInOut" } : {},
      }}
    >
      {/* Puppet glow when active */}
      {isActive && (
        <motion.circle
          cx={x}
          cy={y}
          r={size * 0.8}
          fill={isError ? errorColor : colors.body}
          opacity={0.2}
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      )}

      {type === "client" && (
        <>
          {/* Client puppet - friendly person shape */}
          <circle
            cx={x}
            cy={y - size * 0.3}
            r={size * 0.25}
            fill={isError ? errorColor : colors.body}
          />
          {/* Body */}
          <ellipse
            cx={x}
            cy={y + size * 0.15}
            rx={size * 0.3}
            ry={size * 0.35}
            fill={isError ? errorColor : colors.body}
          />
          {/* Arms */}
          <motion.line
            x1={x - size * 0.3}
            y1={y}
            x2={x - size * 0.5}
            y2={y + size * 0.2}
            stroke={isError ? errorColor : colors.body}
            strokeWidth={4}
            strokeLinecap="round"
            animate={isActive ? { x2: [x - size * 0.5, x - size * 0.4, x - size * 0.5] } : {}}
            transition={{ duration: 0.8, repeat: Infinity }}
          />
          <motion.line
            x1={x + size * 0.3}
            y1={y}
            x2={x + size * 0.5}
            y2={y + size * 0.2}
            stroke={isError ? errorColor : colors.body}
            strokeWidth={4}
            strokeLinecap="round"
            animate={isActive ? { x2: [x + size * 0.5, x + size * 0.4, x + size * 0.5] } : {}}
            transition={{ duration: 0.8, repeat: Infinity, delay: 0.4 }}
          />
          {/* Face */}
          <circle cx={x - 5} cy={y - size * 0.35} r={2} fill={colors.accent} />
          <circle cx={x + 5} cy={y - size * 0.35} r={2} fill={colors.accent} />
          <path
            d={`M ${x - 4} ${y - size * 0.2} Q ${x} ${y - size * 0.12} ${x + 4} ${y - size * 0.2}`}
            fill="none"
            stroke={colors.accent}
            strokeWidth={1.5}
          />
        </>
      )}

      {type === "system" && (
        <>
          {/* System puppet - robot/computer shape */}
          <rect
            x={x - size * 0.35}
            y={y - size * 0.4}
            width={size * 0.7}
            height={size * 0.5}
            rx={4}
            fill={isError ? errorColor : colors.body}
          />
          {/* Screen */}
          <rect
            x={x - size * 0.25}
            y={y - size * 0.3}
            width={size * 0.5}
            height={size * 0.3}
            rx={2}
            fill={colors.accent}
            opacity={0.3}
          />
          {/* Antenna */}
          <motion.line
            x1={x}
            y1={y - size * 0.4}
            x2={x}
            y2={y - size * 0.55}
            stroke={isError ? errorColor : colors.body}
            strokeWidth={3}
            animate={isActive ? { y2: [y - size * 0.55, y - size * 0.6, y - size * 0.55] } : {}}
            transition={{ duration: 0.5, repeat: Infinity }}
          />
          <motion.circle
            cx={x}
            cy={y - size * 0.6}
            r={4}
            fill={isActive ? (isError ? errorColor : "hsl(var(--primary))") : colors.body}
            animate={isActive ? { opacity: [1, 0.5, 1] } : {}}
            transition={{ duration: 0.3, repeat: Infinity }}
          />
          {/* Body/base */}
          <rect
            x={x - size * 0.25}
            y={y + size * 0.15}
            width={size * 0.5}
            height={size * 0.35}
            rx={3}
            fill={isError ? errorColor : colors.body}
          />
          {/* Eyes */}
          <motion.circle
            cx={x - 8}
            cy={y - size * 0.2}
            r={4}
            fill={isActive ? "hsl(var(--primary))" : "hsl(var(--foreground))"}
            animate={isActive ? { opacity: [1, 0.3, 1] } : {}}
            transition={{ duration: 0.5, repeat: Infinity }}
          />
          <motion.circle
            cx={x + 8}
            cy={y - size * 0.2}
            r={4}
            fill={isActive ? "hsl(var(--primary))" : "hsl(var(--foreground))"}
            animate={isActive ? { opacity: [1, 0.3, 1] } : {}}
            transition={{ duration: 0.5, repeat: Infinity, delay: 0.25 }}
          />
        </>
      )}

      {type === "underwriter" && (
        <>
          {/* Underwriter puppet - person with glasses/professional look */}
          <circle
            cx={x}
            cy={y - size * 0.3}
            r={size * 0.25}
            fill={isError ? errorColor : colors.body}
          />
          {/* Body with tie */}
          <ellipse
            cx={x}
            cy={y + size * 0.15}
            rx={size * 0.32}
            ry={size * 0.38}
            fill={isError ? errorColor : colors.body}
          />
          {/* Tie */}
          <polygon
            points={`${x},${y - size * 0.05} ${x - 5},${y + size * 0.1} ${x},${y + size * 0.4} ${x + 5},${y + size * 0.1}`}
            fill="hsl(var(--primary))"
          />
          {/* Glasses */}
          <rect
            x={x - 12}
            y={y - size * 0.4}
            width={10}
            height={8}
            rx={2}
            fill="none"
            stroke={colors.accent}
            strokeWidth={1.5}
          />
          <rect
            x={x + 2}
            y={y - size * 0.4}
            width={10}
            height={8}
            rx={2}
            fill="none"
            stroke={colors.accent}
            strokeWidth={1.5}
          />
          <line
            x1={x - 2}
            y1={y - size * 0.36}
            x2={x + 2}
            y2={y - size * 0.36}
            stroke={colors.accent}
            strokeWidth={1.5}
          />
          {/* Eyes behind glasses */}
          <circle cx={x - 7} cy={y - size * 0.35} r={2} fill={colors.accent} />
          <circle cx={x + 7} cy={y - size * 0.35} r={2} fill={colors.accent} />
          {/* Clipboard in hand */}
          <motion.g
            animate={isActive ? { rotate: [-5, 5, -5] } : {}}
            transition={{ duration: 1, repeat: Infinity }}
            style={{ transformOrigin: `${x + size * 0.4}px ${y}px` }}
          >
            <rect
              x={x + size * 0.35}
              y={y - size * 0.1}
              width={size * 0.25}
              height={size * 0.35}
              rx={2}
              fill="hsl(var(--card))"
              stroke="hsl(var(--border))"
            />
            <line
              x1={x + size * 0.4}
              y1={y}
              x2={x + size * 0.55}
              y2={y}
              stroke="hsl(var(--muted-foreground))"
              strokeWidth={1}
            />
            <line
              x1={x + size * 0.4}
              y1={y + 6}
              x2={x + size * 0.55}
              y2={y + 6}
              stroke="hsl(var(--muted-foreground))"
              strokeWidth={1}
            />
          </motion.g>
        </>
      )}

      {type === "document" && (
        <>
          {/* Document puppet - animated paper/ID card */}
          <motion.g
            animate={isActive ? { rotate: [-2, 2, -2] } : {}}
            transition={{ duration: 0.8, repeat: Infinity }}
            style={{ transformOrigin: `${x}px ${y}px` }}
          >
            <rect
              x={x - size * 0.4}
              y={y - size * 0.3}
              width={size * 0.8}
              height={size * 0.55}
              rx={3}
              fill={isError ? errorColor : "hsl(var(--card))"}
              stroke={isError ? errorColor : "hsl(var(--border))"}
              strokeWidth={2}
            />
            {/* Photo placeholder */}
            <rect
              x={x - size * 0.3}
              y={y - size * 0.2}
              width={size * 0.25}
              height={size * 0.3}
              rx={2}
              fill="hsl(var(--muted))"
            />
            {/* Text lines */}
            <line
              x1={x}
              y1={y - size * 0.15}
              x2={x + size * 0.3}
              y2={y - size * 0.15}
              stroke="hsl(var(--muted-foreground))"
              strokeWidth={2}
            />
            <line
              x1={x}
              y1={y - size * 0.02}
              x2={x + size * 0.25}
              y2={y - size * 0.02}
              stroke="hsl(var(--muted-foreground))"
              strokeWidth={2}
            />
            <line
              x1={x}
              y1={y + size * 0.1}
              x2={x + size * 0.2}
              y2={y + size * 0.1}
              stroke="hsl(var(--muted-foreground))"
              strokeWidth={2}
            />
            {/* Error X or success check */}
            {isError && (
              <g>
                <line
                  x1={x - size * 0.15}
                  y1={y + size * 0.35}
                  x2={x + size * 0.15}
                  y2={y + size * 0.55}
                  stroke={errorColor}
                  strokeWidth={3}
                />
                <line
                  x1={x + size * 0.15}
                  y1={y + size * 0.35}
                  x2={x - size * 0.15}
                  y2={y + size * 0.55}
                  stroke={errorColor}
                  strokeWidth={3}
                />
              </g>
            )}
          </motion.g>
          {/* Little legs for the document puppet */}
          <motion.line
            x1={x - size * 0.15}
            y1={y + size * 0.25}
            x2={x - size * 0.2}
            y2={y + size * 0.5}
            stroke="hsl(var(--border))"
            strokeWidth={3}
            strokeLinecap="round"
            animate={isActive ? { x2: [x - size * 0.2, x - size * 0.15, x - size * 0.2] } : {}}
            transition={{ duration: 0.4, repeat: Infinity }}
          />
          <motion.line
            x1={x + size * 0.15}
            y1={y + size * 0.25}
            x2={x + size * 0.2}
            y2={y + size * 0.5}
            stroke="hsl(var(--border))"
            strokeWidth={3}
            strokeLinecap="round"
            animate={isActive ? { x2: [x + size * 0.2, x + size * 0.15, x + size * 0.2] } : {}}
            transition={{ duration: 0.4, repeat: Infinity, delay: 0.2 }}
          />
        </>
      )}
    </motion.g>
  );
}
