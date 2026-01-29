import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { JOURNEY_STAGES, JourneyStage, StageStatus } from "@/types/case";
import { Check, AlertTriangle, Circle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";

interface JourneyTrackerProps {
  currentStage: JourneyStage;
  stageStatus: StageStatus;
  stageOwners: Record<JourneyStage, string>;
  stageETAs: Record<JourneyStage, string>;
  stageBlockers: Record<JourneyStage, string | null>;
  onStageClick?: (stage: JourneyStage) => void;
  activeTab?: string;
}

// Simplified stage groupings for clearer progress
const STAGE_GROUPS = [
  { label: "Intake", stages: [1, 2] as JourneyStage[], parallel: false },
  { label: "Evaluation", stages: [3, 4] as JourneyStage[], parallel: true },
  { label: "Resolution", stages: [5, 6] as JourneyStage[], parallel: true },
  { label: "Decision", stages: [7, 8] as JourneyStage[], parallel: false },
];

export function JourneyTracker({
  currentStage,
  stageStatus,
  stageOwners,
  stageETAs,
  stageBlockers,
  onStageClick,
}: JourneyTrackerProps) {
  // Calculate overall progress percentage
  const progressPercent = Math.round(((currentStage - 1) / 7) * 100);
  
  // Determine which group is active
  const activeGroupIndex = STAGE_GROUPS.findIndex(g => 
    g.stages.includes(currentStage)
  );

  return (
    <div className="w-full bg-card border border-border rounded-lg shadow-sm">
      <div className="p-4">
        {/* Header with progress */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <h3 className="text-sm font-semibold text-foreground">
              Journey Progress
            </h3>
            {stageStatus === "blocked" && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-destructive/10 text-destructive text-xs font-medium">
                <AlertTriangle className="w-3 h-3" />
                Blocked
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Progress value={progressPercent} className="h-2 w-24" />
              <span className="text-sm font-bold text-foreground">{progressPercent}%</span>
            </div>
          </div>
        </div>

        {/* Stage Groups - categorical view */}
        <div className="flex items-stretch gap-2">
          {STAGE_GROUPS.map((group, groupIdx) => {
            const isGroupComplete = group.stages.every(s => s < currentStage);
            const isGroupActive = group.stages.some(s => s === currentStage);
            const hasBlocker = group.stages.some(s => stageBlockers[s]);
            
            // Calculate group progress
            let groupProgress = 0;
            if (isGroupComplete) {
              groupProgress = 100;
            } else if (isGroupActive) {
              const stagesComplete = group.stages.filter(s => s < currentStage).length;
              const currentStageProgress = stageStatus === "completed" ? 1 : 0.5;
              groupProgress = Math.round(((stagesComplete + currentStageProgress) / group.stages.length) * 100);
            }

            return (
              <div
                key={group.label}
                className={cn(
                  "flex-1 rounded-lg border p-3 transition-all",
                  isGroupActive && "border-primary bg-primary/5",
                  isGroupComplete && "border-emerald-500/50 bg-emerald-50/50 dark:bg-emerald-950/20",
                  !isGroupActive && !isGroupComplete && "border-border bg-muted/30",
                  hasBlocker && isGroupActive && "border-destructive bg-destructive/5"
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-foreground">{group.label}</span>
                  <div className="flex items-center gap-1">
                    {group.parallel && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                            ∥
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs">Parallel tracks</p>
                        </TooltipContent>
                      </Tooltip>
                    )}
                    <span className="text-xs text-muted-foreground">{groupProgress}%</span>
                  </div>
                </div>
                
                {/* Individual stages within group */}
                <div className={cn(
                  "flex gap-1",
                  group.parallel ? "flex-row" : "flex-col"
                )}>
                  {group.stages.map((stage) => {
                    const stageName = JOURNEY_STAGES[stage];
                    const isComplete = stage < currentStage;
                    const isCurrent = stage === currentStage;
                    const blocker = stageBlockers[stage];

                    return (
                      <Tooltip key={stage}>
                        <TooltipTrigger asChild>
                          <button
                            onClick={() => onStageClick?.(stage)}
                            className={cn(
                              "flex items-center gap-1.5 px-2 py-1 rounded text-left transition-all text-xs",
                              "hover:bg-muted/50",
                              isComplete && "text-emerald-700 dark:text-emerald-400",
                              isCurrent && !blocker && "text-primary font-medium",
                              isCurrent && blocker && "text-destructive font-medium",
                              !isComplete && !isCurrent && "text-muted-foreground"
                            )}
                          >
                            {isComplete ? (
                              <Check className="w-3 h-3 text-emerald-500 flex-shrink-0" />
                            ) : isCurrent && blocker ? (
                              <AlertTriangle className="w-3 h-3 text-destructive flex-shrink-0" />
                            ) : isCurrent ? (
                              <motion.div
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                                className="w-2 h-2 rounded-full bg-primary flex-shrink-0"
                              />
                            ) : (
                              <Circle className="w-2 h-2 text-muted-foreground flex-shrink-0" />
                            )}
                            <span className="truncate">{stageName.split(" ").slice(0, 2).join(" ")}</span>
                          </button>
                        </TooltipTrigger>
                        <TooltipContent side="bottom" className="max-w-[200px]">
                          <div className="text-xs space-y-1">
                            <p className="font-medium">{stageName}</p>
                            <p>Owner: {stageOwners[stage]}</p>
                            <p>ETA: {stageETAs[stage]}</p>
                            {blocker && (
                              <p className="text-destructive">Blocker: {blocker}</p>
                            )}
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
