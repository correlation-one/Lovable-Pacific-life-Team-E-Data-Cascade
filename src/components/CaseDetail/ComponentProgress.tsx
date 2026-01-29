import { cn } from "@/lib/utils";
import { Case, Gap, EvidenceOrder, Document } from "@/types/case";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AlertTriangle, CheckCircle } from "lucide-react";

interface ComponentProgressProps {
  caseData: Case;
  gaps: Gap[];
  evidenceOrders: EvidenceOrder[];
  documents: Document[];
  onComponentClick?: (component: string) => void;
}

interface ComponentData {
  id: string;
  label: string;
  progress: number;
  total: number;
  completed: number;
  hasIssues: boolean;
  issueCount: number;
  color: string;
}

// Circular progress component
function CircularProgress({
  progress,
  size = 64,
  strokeWidth = 6,
  color,
  hasIssues,
}: {
  progress: number;
  size?: number;
  strokeWidth?: number;
  color: string;
  hasIssues: boolean;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-muted/30"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={hasIssues ? "hsl(var(--destructive))" : color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-500"
        />
      </svg>
      {/* Center content */}
      <div className="absolute inset-0 flex items-center justify-center">
        {progress === 100 ? (
          <CheckCircle className="w-5 h-5 text-emerald-500" />
        ) : hasIssues ? (
          <AlertTriangle className="w-4 h-4 text-destructive" />
        ) : (
          <span className="text-sm font-bold">{progress}%</span>
        )}
      </div>
    </div>
  );
}

export function ComponentProgress({
  caseData,
  gaps,
  evidenceOrders,
  documents,
  onComponentClick,
}: ComponentProgressProps) {
  const caseGaps = gaps.filter((g) => g.caseId === caseData.id);
  const caseEvidence = evidenceOrders.filter((e) => e.caseId === caseData.id);
  const caseDocs = documents.filter((d) => d.caseId === caseData.id);

  // Calculate component data
  const components: ComponentData[] = [
    {
      id: "application",
      label: "Case Status",
      progress: Math.min(100, caseData.completenessScore),
      total: 100,
      completed: caseData.completenessScore,
      hasIssues: caseData.completenessScore < 70,
      issueCount: caseData.completenessScore < 70 ? 1 : 0,
      color: "hsl(217, 91%, 60%)", // Blue
    },
    {
      id: "gaps",
      label: "Gap Resolution",
      progress: caseGaps.length > 0
        ? Math.round((caseGaps.filter((g) => g.status === "closed").length / caseGaps.length) * 100)
        : 100,
      total: caseGaps.length,
      completed: caseGaps.filter((g) => g.status === "closed").length,
      hasIssues: caseGaps.some((g) => g.status !== "closed" && (g.severity === "critical" || g.priority === "urgent")),
      issueCount: caseGaps.filter((g) => g.status !== "closed").length,
      color: "hsl(38, 92%, 50%)", // Amber
    },
  ];

  return (
    <div className="w-full bg-card border border-border rounded-lg shadow-sm p-4">

      {/* Component Grid */}
      <div className="grid grid-cols-2 gap-3">
        {components.map((component) => (
          <Tooltip key={component.id}>
            <TooltipTrigger asChild>
              <button
                onClick={() => onComponentClick?.(component.id)}
                className={cn(
                  "flex flex-col items-center p-3 rounded-lg transition-all",
                  "hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-ring",
                  component.hasIssues && "bg-destructive/5"
                )}
              >
                <CircularProgress
                  progress={component.progress}
                  color={component.color}
                  hasIssues={component.hasIssues}
                />
                <span className="text-xs font-medium mt-2 text-center leading-tight">
                  {component.label}
                </span>
                {component.issueCount > 0 && (
                  <span className="text-[10px] text-destructive mt-0.5">
                    {component.issueCount} issue{component.issueCount > 1 ? "s" : ""}
                  </span>
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <div className="text-xs space-y-1">
                <p className="font-medium">{component.label}</p>
                <p>{component.completed} of {component.total} complete</p>
                {component.hasIssues && (
                  <p className="text-destructive">{component.issueCount} issue{component.issueCount > 1 ? "s" : ""} detected</p>
                )}
              </div>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </div>
  );
}
