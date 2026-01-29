import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  Users,
  FileWarning,
  Target,
} from "lucide-react";
import { Case, Gap, EvidenceOrder, JOURNEY_STAGES } from "@/types/case";

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

  return (
    <div className="space-y-6">
      {/* Status Banner - Pizza Tracker Output */}
      <Card className="border-primary/30 bg-primary/5">
        <CardContent className="py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-primary/10">
                <Target className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold">
                  Whale Tracker – Status and visibility to internal and external parties
                </p>
                <p className="text-xs text-muted-foreground">
                  Current Stage: {JOURNEY_STAGES[caseData.stage]} • Status:{" "}
                  <span
                    className={
                      caseData.stageStatus === "blocked"
                        ? "text-destructive"
                        : caseData.stageStatus === "completed"
                        ? "text-emerald-600"
                        : "text-primary"
                    }
                  >
                    {caseData.stageStatus.replace("-", " ").toUpperCase()}
                  </span>
                </p>
              </div>
            </div>
            <Badge
              variant={caseData.stageStatus === "blocked" ? "destructive" : "default"}
              className="text-sm"
            >
              Stage {caseData.stage} of 8
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs text-muted-foreground flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              Completeness
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <span className="text-2xl font-bold">{caseData.completenessScore}%</span>
              <Progress value={caseData.completenessScore} className="w-20 h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs text-muted-foreground flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              Open Gaps
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <span className="text-2xl font-bold">{openGaps.length}</span>
              <span className="text-xs text-muted-foreground">
                {closedGaps.length} closed
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs text-muted-foreground flex items-center gap-1">
              <FileText className="w-3 h-3" />
              Evidence Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <span className="text-2xl font-bold text-emerald-600">
                {receivedEvidence.length}
              </span>
              <span className="text-xs">
                {failedEvidence.length > 0 && (
                  <span className="text-destructive">{failedEvidence.length} failed</span>
                )}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Risk Flags
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <span className="text-2xl font-bold">{caseData.riskFlags.length}</span>
              <span className="text-xs text-muted-foreground">active</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gap Closure Confirmation */}
      {closedGaps.length > 0 && (
        <Card className="border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-950/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
              <CheckCircle className="w-4 h-4" />
              Confirmation of gap closure
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground mb-2">
              Outstanding data received and gaps are closed:
            </p>
            <div className="space-y-1.5">
              {closedGaps.slice(0, 3).map((gap) => (
                <div
                  key={gap.id}
                  className="flex items-center justify-between text-xs bg-white dark:bg-background rounded px-2 py-1.5"
                >
                  <span className="font-medium">{gap.description}</span>
                  <Badge variant="outline" className="text-emerald-600 border-emerald-300">
                    Closed
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Current Stage Checklist */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Stage {caseData.stage} Checklist: {JOURNEY_STAGES[caseData.stage]}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {getStageChecklist(caseData.stage, caseData, openGaps, evidenceOrders).map(
              (item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 text-sm"
                >
                  {item.completed ? (
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                  ) : item.blocked ? (
                    <AlertTriangle className="w-4 h-4 text-destructive" />
                  ) : (
                    <Clock className="w-4 h-4 text-muted-foreground" />
                  )}
                  <span
                    className={
                      item.completed
                        ? "text-muted-foreground line-through"
                        : item.blocked
                        ? "text-destructive"
                        : ""
                    }
                  >
                    {item.label}
                  </span>
                </div>
              )
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Users className="w-4 h-4" />
            Team & Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground mb-2">Current Owner</p>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium text-sm">
                  {caseData.assignedTo.split(" ").map((n) => n[0]).join("")}
                </div>
                <div>
                  <p className="text-sm font-medium">{caseData.assignedTo}</p>
                  <p className="text-xs text-muted-foreground capitalize">
                    {caseData.assignedTeam.replace("-", " ")}
                  </p>
                </div>
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-2">Submission</p>
              <p className="text-sm capitalize">{caseData.submissionChannel} channel</p>
              <p className="text-xs text-muted-foreground">
                Created: {new Date(caseData.createdDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
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
      { label: "Initial data validation", completed: true },
      { label: "Case created in system", completed: true },
    ],
    2: [
      { label: "Documents uploaded", completed: true },
      { label: "OCR extraction completed", completed: caseData.completenessScore > 50 },
      { label: "Field mapping verified", completed: caseData.completenessScore > 70 },
    ],
    3: [
      { label: "Completeness check", completed: caseData.completenessScore > 60 },
      { label: "Risk assessment", completed: caseData.riskFlags.length === 0, blocked: caseData.riskFlags.length > 0 },
      { label: "Conflicts resolved", completed: openGaps.filter((g) => g.type === "verification-needed").length === 0 },
    ],
    4: [
      { label: "Evidence requirements identified", completed: evidenceOrders.length > 0 },
      { label: "Prerequisites verified", completed: !evidenceOrders.some((e) => e.prerequisiteChecks.some((p) => p.status === "unmet")), blocked: evidenceOrders.some((e) => e.prerequisiteChecks.some((p) => p.status === "unmet")) },
      { label: "Evidence orders submitted", completed: evidenceOrders.some((e) => e.status === "ordered" || e.status === "received") },
    ],
    5: [
      { label: "Application pre-filled", completed: caseData.completenessScore > 80 },
      { label: "All sections reviewed", completed: caseData.completenessScore > 85 },
      { label: "Ready for applicant signature", completed: caseData.completenessScore === 100 },
    ],
    6: [
      { label: "Gaps identified and packaged", completed: true },
      { label: "Information requests sent", completed: openGaps.some((g) => g.status !== "open") },
      { label: "All gaps closed", completed: openGaps.length === 0, blocked: openGaps.length > 0 },
    ],
    7: [
      { label: "All evidence received", completed: !evidenceOrders.some((e) => e.status !== "received" && e.caseId === caseData.id) },
      { label: "UW review notification sent", completed: caseData.stage >= 7 },
      { label: "Decision packet prepared", completed: caseData.stage >= 7 },
    ],
    8: [
      { label: "Case summary complete", completed: true },
      { label: "All verifications confirmed", completed: true },
      { label: "Ready for export", completed: caseData.stage === 8 && caseData.stageStatus === "completed" },
    ],
  };

  return checklists[stage] || [];
}
