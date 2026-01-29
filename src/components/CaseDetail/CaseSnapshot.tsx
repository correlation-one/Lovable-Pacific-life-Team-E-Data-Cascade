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
      <CardHeader className="pb-2 pt-3">
        <CardTitle className="text-xs flex items-center gap-2">
          <FileText className="w-3.5 h-3.5" />
          Case Snapshot
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 pb-3">
        {/* Top Row: Case ID + Applicant */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <User className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-sm font-medium">{caseData.applicantName}</span>
            <span className="text-xs text-muted-foreground">
              ({caseData.age}y, {caseData.state})
            </span>
          </div>
          <span className="font-mono text-xs text-muted-foreground">{caseData.id}</span>
        </div>

        {/* Middle Row: Product + Channel */}
        <div className="flex items-center gap-3 text-xs">
          <span className="font-medium">{caseData.productType}</span>
          <span className="text-muted-foreground">•</span>
          <span className="text-muted-foreground">
            ${caseData.coverageAmount.toLocaleString()}
          </span>
          <span className="text-muted-foreground">•</span>
          <Badge variant="secondary" className="capitalize text-xs py-0 h-5">
            {caseData.submissionChannel}
          </Badge>
        </div>

        {/* Bottom Row: Health Indicators */}
        <div className="flex items-center gap-4 pt-1 border-t">
          {/* Completeness */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Completeness</span>
            <div className="flex items-center gap-1.5">
              <Progress value={caseData.completenessScore} className="h-1.5 w-16" />
              <span className="text-xs font-medium">{caseData.completenessScore}%</span>
            </div>
          </div>

          {/* Risk Flags */}
          {caseData.riskFlags.length > 0 ? (
            <Badge variant="outline" className="gap-1 text-amber-600 border-amber-300 text-xs py-0 h-5">
              <AlertTriangle className="w-3 h-3" />
              {caseData.riskFlags.length} Risk
            </Badge>
          ) : null}

          {/* Blockers */}
          {blockersCount > 0 ? (
            <Badge variant="outline" className="gap-1 text-destructive border-destructive/50 text-xs py-0 h-5">
              <XCircle className="w-3 h-3" />
              {blockersCount} Blocked
            </Badge>
          ) : null}

          {/* Open Gaps */}
          {openGapsCount > 0 ? (
            <Badge variant="secondary" className="text-xs py-0 h-5">
              {openGapsCount} Open Gaps
            </Badge>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
