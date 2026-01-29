import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  FileWarning,
} from "lucide-react";
import { Case, Gap, EvidenceOrder, JOURNEY_STAGES } from "@/types/case";
import { cn } from "@/lib/utils";

interface OverviewTabProps {
  caseData: Case;
  gaps: Gap[];
  evidenceOrders: EvidenceOrder[];
}

export function OverviewTab({ caseData, gaps, evidenceOrders }: OverviewTabProps) {
  const openGaps = gaps.filter((g) => g.caseId === caseData.id && g.status !== "closed");
  const closedGaps = gaps.filter((g) => g.caseId === caseData.id && g.status === "closed");
  const failedEvidence = evidenceOrders.filter(
    (e) => e.caseId === caseData.id && e.status === "failed"
  );
  const receivedEvidence = evidenceOrders.filter(
    (e) => e.caseId === caseData.id && e.status === "received"
  );

  const criticalGaps = openGaps.filter((g) => g.severity === "critical" || g.priority === "urgent");

  return (
    <div className="space-y-4">
      {/* Status Banner - simplified */}
      <Card className={cn(
        "border-l-4",
        caseData.stageStatus === "blocked" ? "border-l-destructive bg-destructive/5" : "border-l-primary bg-primary/5"
      )}>
        <CardContent className="py-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold">
                {JOURNEY_STAGES[caseData.stage]}
              </p>
              <p className="text-xs text-muted-foreground">
                Status:{" "}
                <span
                  className={cn(
                    "font-medium",
                    caseData.stageStatus === "blocked" && "text-destructive",
                    caseData.stageStatus === "completed" && "text-emerald-600",
                    caseData.stageStatus === "in-progress" && "text-primary"
                  )}
                >
                  {caseData.stageStatus.replace("-", " ").toUpperCase()}
                </span>
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-2xl font-bold">{caseData.completenessScore}%</p>
                <p className="text-[10px] text-muted-foreground uppercase">Complete</p>
              </div>
              <Progress value={caseData.completenessScore} className="w-20 h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Critical Items Alert - if any */}
      {(criticalGaps.length > 0 || failedEvidence.length > 0) && (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardContent className="py-3">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-destructive">Requires Immediate Attention</p>
                <ul className="text-xs text-muted-foreground mt-1 space-y-0.5">
                  {criticalGaps.map((gap) => (
                    <li key={gap.id}>• {gap.description}</li>
                  ))}
                  {failedEvidence.map((e) => (
                    <li key={e.id}>• {e.type} retrieval failed: {e.failureReason}</li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Key Metrics - condensed grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <MetricCard
          icon={<TrendingUp className="w-4 h-4" />}
          label="Progress"
          value={`${caseData.completenessScore}%`}
          subtext={`Stage ${caseData.stage}/8`}
        />
        <MetricCard
          icon={<AlertTriangle className="w-4 h-4" />}
          label="Unresolved"
          value={openGaps.length.toString()}
          subtext={`${closedGaps.length} resolved`}
          alert={openGaps.length > 0}
        />
        <MetricCard
          icon={<FileWarning className="w-4 h-4" />}
          label="Evidence"
          value={receivedEvidence.length.toString()}
          subtext={failedEvidence.length > 0 ? `${failedEvidence.length} failed` : "All good"}
          alert={failedEvidence.length > 0}
        />
        <MetricCard
          icon={<Clock className="w-4 h-4" />}
          label="Risk Flags"
          value={caseData.riskFlags.length.toString()}
          subtext="active"
          alert={caseData.riskFlags.length > 0}
        />
      </div>

      {/* Stage Checklist - simplified */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Current Stage Checklist</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1.5">
            {getStageChecklist(caseData.stage, caseData, openGaps, evidenceOrders).map(
              (item, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex items-center gap-2 text-xs py-1 px-2 rounded",
                    item.completed && "bg-emerald-50/50 dark:bg-emerald-950/20",
                    item.blocked && "bg-destructive/5"
                  )}
                >
                  {item.completed ? (
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                  ) : item.blocked ? (
                    <AlertTriangle className="w-3.5 h-3.5 text-destructive flex-shrink-0" />
                  ) : (
                    <Clock className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                  )}
                  <span
                    className={cn(
                      item.completed && "text-muted-foreground",
                      item.blocked && "text-destructive font-medium"
                    )}
                  >
                    {item.label}
                  </span>
                </div>
              )
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function MetricCard({
  icon,
  label,
  value,
  subtext,
  alert,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  subtext: string;
  alert?: boolean;
}) {
  return (
    <Card className={cn(alert && "border-amber-500/50")}>
      <CardContent className="py-3 px-3">
        <div className="flex items-center gap-2 mb-1">
          <span className={cn("text-muted-foreground", alert && "text-amber-500")}>
            {icon}
          </span>
          <span className="text-xs text-muted-foreground">{label}</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className={cn("text-xl font-bold", alert && "text-amber-600")}>{value}</span>
          <span className="text-[10px] text-muted-foreground">{subtext}</span>
        </div>
      </CardContent>
    </Card>
  );
}

function getStageChecklist(
  stage: number,
  caseData: Case,
  openGaps: Gap[],
  evidenceOrders: EvidenceOrder[]
) {
  const checklists: Record<number, { label: string; completed: boolean; blocked?: boolean }[]> = {
    1: [
      { label: "Application received", completed: true },
      { label: "Initial validation", completed: true },
      { label: "Case created", completed: true },
    ],
    2: [
      { label: "Documents uploaded", completed: true },
      { label: "OCR completed", completed: caseData.completenessScore > 50 },
      { label: "Fields mapped", completed: caseData.completenessScore > 70 },
    ],
    3: [
      { label: "Completeness check", completed: caseData.completenessScore > 60 },
      { label: "Risk assessment", completed: caseData.riskFlags.length === 0, blocked: caseData.riskFlags.length > 0 },
      { label: "Conflicts resolved", completed: openGaps.filter((g) => g.type === "verification-needed").length === 0 },
    ],
    4: [
      { label: "Evidence identified", completed: evidenceOrders.length > 0 },
      { label: "Prerequisites met", completed: !evidenceOrders.some((e) => e.prerequisiteChecks.some((p) => p.status === "unmet")), blocked: evidenceOrders.some((e) => e.prerequisiteChecks.some((p) => p.status === "unmet")) },
      { label: "Orders submitted", completed: evidenceOrders.some((e) => e.status === "ordered" || e.status === "received") },
    ],
    5: [
      { label: "Pre-fill complete", completed: caseData.completenessScore > 80 },
      { label: "Sections reviewed", completed: caseData.completenessScore > 85 },
      { label: "Ready for signature", completed: caseData.completenessScore === 100 },
    ],
    6: [
      { label: "Gaps packaged", completed: true },
      { label: "Requests sent", completed: openGaps.some((g) => g.status !== "open") },
      { label: "All gaps closed", completed: openGaps.length === 0, blocked: openGaps.length > 0 },
    ],
    7: [
      { label: "Evidence received", completed: !evidenceOrders.some((e) => e.status !== "received" && e.caseId === caseData.id) },
      { label: "UW notified", completed: caseData.stage >= 7 },
      { label: "Packet prepared", completed: caseData.stage >= 7 },
    ],
    8: [
      { label: "Summary complete", completed: true },
      { label: "Verifications confirmed", completed: true },
      { label: "Ready for export", completed: caseData.stage === 8 && caseData.stageStatus === "completed" },
    ],
  };

  return checklists[stage] || [];
}
