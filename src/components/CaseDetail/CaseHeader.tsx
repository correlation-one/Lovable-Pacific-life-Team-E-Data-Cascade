import { Case, Priority, StageStatus, UserRole } from "@/types/case";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  User,
  Users,
  AlertCircle,
  FileWarning,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format, formatDistanceToNow, parseISO, isPast } from "date-fns";

interface CaseHeaderProps {
  caseData: Case;
  openGapsCount: number;
  evidenceIssuesCount: number;
  onBack: () => void;
}

const priorityColors: Record<Priority, string> = {
  low: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  medium: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  high: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
  urgent: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
};

const statusColors: Record<StageStatus, string> = {
  "not-started": "bg-muted text-muted-foreground",
  "in-progress": "bg-primary/10 text-primary",
  blocked: "bg-destructive/10 text-destructive",
  completed: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300",
};

const roleLabels: Record<UserRole, string> = {
  "case-manager": "Case Manager",
  "evidence-team": "Evidence Team",
  underwriter: "Underwriter",
  admin: "Admin",
};

export function CaseHeader({
  caseData,
  openGapsCount,
  evidenceIssuesCount,
  onBack,
}: CaseHeaderProps) {
  const slaDue = parseISO(caseData.slaDue);
  const slaAtRisk = isPast(slaDue);
  const slaText = slaAtRisk
    ? `Overdue by ${formatDistanceToNow(slaDue)}`
    : `${formatDistanceToNow(slaDue)} remaining`;

  return (
    <div className="bg-card border-b border-border px-4 py-2 sticky top-0 z-20 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
        {/* Left: Back + Case ID + Applicant */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="gap-1 text-muted-foreground hover:text-foreground h-7 px-2"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="h-6 w-px bg-border" />
          <div>
            <p className="text-[10px] text-muted-foreground leading-tight">Case ID</p>
            <p className="text-sm font-bold text-foreground">{caseData.id}</p>
          </div>
          <div className="h-6 w-px bg-border" />
          <div>
            <p className="text-[10px] text-muted-foreground leading-tight">Applicant</p>
            <p className="text-sm font-semibold text-foreground">{caseData.applicantName}</p>
          </div>
          <div className="h-6 w-px bg-border hidden sm:block" />
          <div className="hidden sm:block">
            <p className="text-[10px] text-muted-foreground leading-tight">Product</p>
            <p className="text-xs font-medium text-foreground">
              {caseData.productType} • ${caseData.coverageAmount.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Right: Status chips */}
        <div className="flex items-center gap-2 flex-wrap">
          <Badge className={cn("capitalize text-[10px] h-5", priorityColors[caseData.priority])}>
            {caseData.priority}
          </Badge>

          <div
            className={cn(
              "flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium",
              slaAtRisk
                ? "bg-destructive/10 text-destructive"
                : "bg-muted text-muted-foreground"
            )}
          >
            <Clock className="w-3 h-3" />
            {slaText}
          </div>

          <Badge className={cn("capitalize text-[10px] h-5", statusColors[caseData.stageStatus])}>
            {caseData.stageStatus.replace("-", " ")}
          </Badge>

          {openGapsCount > 0 && (
            <Badge variant="outline" className="gap-1 border-amber-500 text-amber-600 text-[10px] h-5">
              <AlertCircle className="w-3 h-3" />
              {openGapsCount} Unresolved
            </Badge>
          )}

          {evidenceIssuesCount > 0 && (
            <Badge variant="outline" className="gap-1 border-destructive text-destructive text-[10px] h-5">
              <FileWarning className="w-3 h-3" />
              {evidenceIssuesCount} Issues
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}