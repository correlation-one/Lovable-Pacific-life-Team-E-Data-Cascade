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
    <div className="bg-card border-b border-border px-6 py-4">
      <div className="flex items-center gap-4 mb-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="gap-1 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
      </div>

      <div className="flex flex-wrap items-start justify-between gap-4">
        {/* Left: Case ID and Applicant */}
        <div className="flex items-center gap-6">
          <div>
            <p className="text-xs text-muted-foreground">Case ID</p>
            <p className="text-lg font-bold text-foreground">{caseData.id}</p>
          </div>
          <div className="h-10 w-px bg-border" />
          <div>
            <p className="text-xs text-muted-foreground">Applicant</p>
            <p className="text-lg font-semibold text-foreground">
              {caseData.applicantName}
            </p>
          </div>
          <div className="h-10 w-px bg-border" />
          <div>
            <p className="text-xs text-muted-foreground">Product / Coverage</p>
            <p className="text-sm font-medium text-foreground">
              {caseData.productType} • ${caseData.coverageAmount.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Center: Owner & Team */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Assigned To</p>
              <p className="text-sm font-medium">{caseData.assignedTo}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Team</p>
              <p className="text-sm font-medium">
                {roleLabels[caseData.assignedTeam]}
              </p>
            </div>
          </div>
        </div>

        {/* Right: Priority, SLA, Status chips */}
        <div className="flex items-center gap-3 flex-wrap">
          <Badge className={cn("capitalize", priorityColors[caseData.priority])}>
            {caseData.priority}
          </Badge>

          <div
            className={cn(
              "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
              slaAtRisk
                ? "bg-destructive/10 text-destructive"
                : "bg-muted text-muted-foreground"
            )}
          >
            <Clock className="w-3 h-3" />
            {slaText}
          </div>

          <Badge className={cn("capitalize", statusColors[caseData.stageStatus])}>
            {caseData.stageStatus.replace("-", " ")}
          </Badge>

          {openGapsCount > 0 && (
            <Badge
              variant="outline"
              className="gap-1 border-amber-500 text-amber-600"
            >
              <AlertCircle className="w-3 h-3" />
              {openGapsCount} Open Gaps
            </Badge>
          )}

          {evidenceIssuesCount > 0 && (
            <Badge
              variant="outline"
              className="gap-1 border-destructive text-destructive"
            >
              <FileWarning className="w-3 h-3" />
              {evidenceIssuesCount} Evidence Issues
            </Badge>
          )}
        </div>
      </div>

      {/* Last Updated */}
      <p className="text-xs text-muted-foreground mt-3">
        Last updated: {format(parseISO(caseData.updatedDate), "MMM d, yyyy h:mm a")}
      </p>
    </div>
  );
}
