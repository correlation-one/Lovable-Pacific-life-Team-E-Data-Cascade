import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { JOURNEY_STAGES, JourneyStage, StageStatus } from "@/types/case";
import { Check, Clock, AlertTriangle, Circle, ChevronRight } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { WhaleIcon } from "@/components/WhaleIcon";
import humpbackWhale from "@/assets/humpback-whale.jpg";

interface JourneyTrackerProps {
  currentStage: JourneyStage;
  stageStatus: StageStatus;
  stageOwners: Record<JourneyStage, string>;
  stageETAs: Record<JourneyStage, string>;
  stageBlockers: Record<JourneyStage, string | null>;
  onStageClick?: (stage: JourneyStage) => void;
  activeTab?: string;
}

const getStageIcon = (
  stage: JourneyStage,
  currentStage: JourneyStage,
  stageStatus: StageStatus
) => {
  if (stage < currentStage) {
    return <Check className="w-4 h-4" />;
  }
  if (stage === currentStage) {
    if (stageStatus === "blocked") {
      return <AlertTriangle className="w-4 h-4" />;
    }
    if (stageStatus === "completed") {
      return <Check className="w-4 h-4" />;
    }
    return <Clock className="w-4 h-4" />;
  }
  return <Circle className="w-3 h-3" />;
};

const getStageColor = (
  stage: JourneyStage,
  currentStage: JourneyStage,
  stageStatus: StageStatus
) => {
  if (stage < currentStage) {
    return "bg-emerald-500 text-white border-emerald-500";
  }
  if (stage === currentStage) {
    if (stageStatus === "blocked") {
      return "bg-destructive text-destructive-foreground border-destructive";
    }
    if (stageStatus === "completed") {
      return "bg-emerald-500 text-white border-emerald-500";
    }
    return "bg-primary text-primary-foreground border-primary";
  }
  return "bg-muted text-muted-foreground border-border";
};

const getConnectorColor = (
  stage: JourneyStage,
  currentStage: JourneyStage,
  stageStatus: StageStatus
) => {
  if (stage < currentStage) {
    return "bg-emerald-500";
  }
  if (stage === currentStage && stageStatus === "completed") {
    return "bg-emerald-500";
  }
  return "bg-border";
};

// Whale position calculation for swimming animation
const getWhalePosition = (currentStage: JourneyStage) => {
  // Position whale between 0 and 100% based on current stage (1-8)
  return ((currentStage - 1) / 7) * 100;
};

export function JourneyTracker({
  currentStage,
  stageStatus,
  stageOwners,
  stageETAs,
  stageBlockers,
  onStageClick,
  activeTab,
}: JourneyTrackerProps) {
  const stages = Object.entries(JOURNEY_STAGES) as [string, string][];
  const whalePosition = getWhalePosition(currentStage);

  return (
    <div className="w-full bg-card border border-border rounded-xl shadow-sm overflow-hidden">
      {/* Ocean background strip */}
      <div 
        className="h-2 w-full"
        style={{
          backgroundImage: `url(${humpbackWhale})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <img 
              src={humpbackWhale} 
              alt="Whale" 
              className="w-6 h-6 rounded-full object-cover border-2 border-[#003366]"
            />
            Whale Watcher Journey
          </h3>
          <div className="flex items-center gap-2 text-xs">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Surfaced
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-primary" />
              Swimming
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-destructive" />
              Beached
            </span>
          </div>
        </div>

        {/* Swimming Whale Indicator */}
        <div className="relative h-12 mb-2 rounded-lg overflow-hidden">
          {/* Ocean background */}
          <div 
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `url(${humpbackWhale})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center 60%',
            }}
          />
          <div className="absolute inset-x-0 top-1/2 h-1 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-400 rounded-full opacity-50" />
          <motion.div
            className="absolute top-1/2 -translate-y-1/2"
            initial={{ left: `${whalePosition}%` }}
            animate={{ 
              left: `${whalePosition}%`,
              y: [0, -6, 0, -3, 0]
            }}
            transition={{ 
              left: { duration: 0.5, ease: "easeInOut" },
              y: { duration: 2, repeat: Infinity, ease: "easeInOut" }
            }}
          >
            <div className="relative -translate-x-1/2">
              <img 
                src={humpbackWhale} 
                alt="Whale progress" 
                className={cn(
                  "w-10 h-10 rounded-full object-cover border-2 shadow-lg transition-all",
                  stageStatus === "blocked" 
                    ? "border-destructive grayscale" 
                    : "border-[#003366]"
                )}
              />
              {stageStatus === "blocked" && (
                <motion.div
                  className="absolute -top-1 -right-1"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <AlertTriangle className="w-4 h-4 text-destructive fill-destructive/20" />
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>

      <div className="flex items-start justify-between overflow-x-auto pb-2">
        {stages.map(([stageNum, stageName], index) => {
          const stage = parseInt(stageNum) as JourneyStage;
          const isLast = index === stages.length - 1;
          const blocker = stageBlockers[stage];
          const owner = stageOwners[stage];
          const eta = stageETAs[stage];

          return (
            <div
              key={stage}
              className="flex items-start flex-1 min-w-[100px]"
            >
              <div className="flex flex-col items-center">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => onStageClick?.(stage)}
                      className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all cursor-pointer",
                        getStageColor(stage, currentStage, stageStatus)
                      )}
                    >
                      {getStageIcon(stage, currentStage, stageStatus)}
                    </motion.button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="max-w-[200px]">
                    <div className="text-xs space-y-1">
                      <p className="font-medium">{stageName}</p>
                      <p>Owner: {owner}</p>
                      <p>ETA: {eta}</p>
                      {blocker && (
                        <p className="text-destructive">Blocker: {blocker}</p>
                      )}
                    </div>
                  </TooltipContent>
                </Tooltip>

                <div className="mt-2 text-center max-w-[90px]">
                  <p className="text-[10px] font-medium text-foreground leading-tight">
                    {stageName}
                  </p>
                  {stage === currentStage && blocker && (
                    <p className="text-[9px] text-destructive mt-0.5 truncate">
                      {blocker}
                    </p>
                  )}
                </div>
              </div>

              {!isLast && (
                <div className="flex-1 flex items-center pt-5 px-1">
                  <div
                    className={cn(
                      "h-0.5 flex-1 transition-colors",
                      getConnectorColor(stage, currentStage, stageStatus)
                    )}
                  />
                  <ChevronRight
                    className={cn(
                      "w-3 h-3 -ml-1",
                      stage < currentStage
                        ? "text-emerald-500"
                        : "text-muted-foreground"
                    )}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
      </div>
    </div>
  );
}
