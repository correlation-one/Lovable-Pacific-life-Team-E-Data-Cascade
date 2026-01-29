import { Case } from "@/types/case";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Calendar,
  MapPin,
  FileText,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { format, parseISO } from "date-fns";

interface CaseSnapshotProps {
  caseData: Case;
  openGapsCount: number;
  blockersCount: number;
}

export function CaseSnapshot({
  caseData,
  openGapsCount,
  blockersCount,
}: CaseSnapshotProps) {
  return (
    <Card className="h-fit">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <FileText className="w-4 h-4" />
          Case Snapshot
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Case Number */}
        <div>
          <p className="text-xs text-muted-foreground">Case Number</p>
          <p className="font-mono text-sm font-medium">{caseData.id}</p>
        </div>

        {/* Applicant Info */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Applicant
          </p>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-sm">
              <User className="w-3.5 h-3.5 text-muted-foreground" />
              <span>{caseData.applicantName}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
              <span>
                {format(parseISO(caseData.dob), "MMM d, yyyy")} (Age {caseData.age})
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
              <span>{caseData.state}</span>
            </div>
          </div>
        </div>

        {/* Submission Info */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Submission
          </p>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="capitalize text-xs">
              {caseData.submissionChannel}
            </Badge>
            <span className="text-xs text-muted-foreground">channel</span>
          </div>
        </div>

        {/* Product & Coverage */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Product
          </p>
          <div className="space-y-1.5">
            <p className="text-sm font-medium">{caseData.productType}</p>
            <div className="flex items-center gap-2 text-sm">
              <DollarSign className="w-3.5 h-3.5 text-muted-foreground" />
              <span>${caseData.coverageAmount.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Health Indicators */}
        <div className="space-y-3 pt-2 border-t">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Health Indicators
          </p>

          {/* Completeness Score */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Completeness</span>
              <span className="font-medium">{caseData.completenessScore}%</span>
            </div>
            <Progress value={caseData.completenessScore} className="h-1.5" />
          </div>

          {/* Risk Flags */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Risk Flags</span>
            <div className="flex items-center gap-1">
              {caseData.riskFlags.length > 0 ? (
                <Badge
                  variant="outline"
                  className="gap-1 text-amber-600 border-amber-300"
                >
                  <AlertTriangle className="w-3 h-3" />
                  {caseData.riskFlags.length}
                </Badge>
              ) : (
                <Badge
                  variant="outline"
                  className="gap-1 text-emerald-600 border-emerald-300"
                >
                  <CheckCircle className="w-3 h-3" />
                  None
                </Badge>
              )}
            </div>
          </div>

          {/* Blockers */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Blockers</span>
            <div className="flex items-center gap-1">
              {blockersCount > 0 ? (
                <Badge
                  variant="outline"
                  className="gap-1 text-destructive border-destructive/50"
                >
                  <XCircle className="w-3 h-3" />
                  {blockersCount}
                </Badge>
              ) : (
                <Badge
                  variant="outline"
                  className="gap-1 text-emerald-600 border-emerald-300"
                >
                  <CheckCircle className="w-3 h-3" />
                  None
                </Badge>
              )}
            </div>
          </div>

          {/* Open Gaps */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Open Gaps</span>
            <Badge variant="secondary">{openGapsCount}</Badge>
          </div>
        </div>

        {/* Risk Flags List */}
        {caseData.riskFlags.length > 0 && (
          <div className="space-y-1.5 pt-2 border-t">
            <p className="text-xs font-medium text-muted-foreground">
              Active Risk Flags
            </p>
            <div className="space-y-1">
              {caseData.riskFlags.map((flag, index) => (
                <div
                  key={index}
                  className="text-xs text-amber-600 bg-amber-50 dark:bg-amber-950/30 px-2 py-1 rounded"
                >
                  {flag}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
