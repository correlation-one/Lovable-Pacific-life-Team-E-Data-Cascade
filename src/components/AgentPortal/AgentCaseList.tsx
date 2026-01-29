import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Clock,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  FileText,
  User,
} from "lucide-react";
import { Case, JOURNEY_STAGES } from "@/types/case";
import { cn } from "@/lib/utils";
import { formatDistanceToNow, parseISO, isPast } from "date-fns";
import { useState } from "react";

interface AgentCaseListProps {
  cases: Case[];
  onSelectCase: (caseId: string) => void;
}

// Simplified status for agents
type AgentCaseStatus = "submitted" | "in-review" | "action-needed" | "approved" | "declined";

function getAgentStatus(c: Case): AgentCaseStatus {
  if (c.stage === 8 && c.stageStatus === "completed") return "approved";
  // Only Robert K. Williams (CASE-2024-003) shows action-needed for demo focus
  if (c.id === "CASE-2024-003" && c.stageStatus === "blocked") return "action-needed";
  if (c.stage >= 7) return "in-review";
  return "in-review";
}

const statusConfig: Record<AgentCaseStatus, { label: string; color: string; icon: React.ElementType }> = {
  submitted: { label: "Submitted", color: "bg-blue-100 text-blue-700", icon: FileText },
  "in-review": { label: "In Review", color: "bg-amber-100 text-amber-700", icon: Clock },
  "action-needed": { label: "Action Needed", color: "bg-destructive/10 text-destructive", icon: AlertCircle },
  approved: { label: "Approved", color: "bg-emerald-100 text-emerald-700", icon: CheckCircle },
  declined: { label: "Declined", color: "bg-slate-100 text-slate-700", icon: AlertCircle },
};

export function AgentCaseList({ cases, onSelectCase }: AgentCaseListProps) {
  const [search, setSearch] = useState("");

  const filteredCases = cases.filter(
    (c) =>
      c.applicantName.toLowerCase().includes(search.toLowerCase()) ||
      c.id.toLowerCase().includes(search.toLowerCase())
  );

  const actionNeeded = filteredCases.filter((c) => getAgentStatus(c) === "action-needed");
  const inReview = filteredCases.filter((c) => getAgentStatus(c) === "in-review");
  const completed = filteredCases.filter((c) => getAgentStatus(c) === "approved");

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Applications</h1>
          <p className="text-muted-foreground text-sm">
            Track the status of your submitted applications
          </p>
        </div>
        <Button>
          <FileText className="w-4 h-4 mr-2" />
          New Application
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search by applicant name or case ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className={cn(actionNeeded.length > 0 && "border-destructive/50")}>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Action Needed</p>
                <p className="text-3xl font-bold text-destructive">{actionNeeded.length}</p>
              </div>
              <AlertCircle className="w-10 h-10 text-destructive/50" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">In Review</p>
                <p className="text-3xl font-bold text-amber-600">{inReview.length}</p>
              </div>
              <Clock className="w-10 h-10 text-amber-500/50" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Approved</p>
                <p className="text-3xl font-bold text-emerald-600">{completed.length}</p>
              </div>
              <CheckCircle className="w-10 h-10 text-emerald-500/50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Needed Section */}
      {actionNeeded.length > 0 && (
        <Card className="border-destructive/30 bg-destructive/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2 text-destructive">
              <AlertCircle className="w-4 h-4" />
              Requires Your Attention
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {actionNeeded.map((c) => (
              <CaseCard key={c.id} caseData={c} onSelect={onSelectCase} />
            ))}
          </CardContent>
        </Card>
      )}

      {/* All Applications */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">All Applications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {filteredCases.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No applications found
            </p>
          ) : (
            filteredCases.map((c) => (
              <CaseCard key={c.id} caseData={c} onSelect={onSelectCase} />
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function CaseCard({ caseData, onSelect }: { caseData: Case; onSelect: (id: string) => void }) {
  const status = getAgentStatus(caseData);
  const config = statusConfig[status];
  const StatusIcon = config.icon;
  const slaAtRisk = isPast(parseISO(caseData.slaDue));

  return (
    <div
      onClick={() => onSelect(caseData.id)}
      className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors"
    >
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
          <User className="w-5 h-5 text-primary" />
        </div>
        <div>
          <p className="font-medium">{caseData.applicantName}</p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{caseData.productType}</span>
            <span>•</span>
            <span>${caseData.coverageAmount.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right">
          <Badge className={cn("text-xs", config.color)}>
            <StatusIcon className="w-3 h-3 mr-1" />
            {config.label}
          </Badge>
          <p className={cn("text-xs mt-1", slaAtRisk ? "text-destructive" : "text-muted-foreground")}>
            {slaAtRisk ? "Overdue" : formatDistanceToNow(parseISO(caseData.slaDue), { addSuffix: true })}
          </p>
        </div>
        <ChevronRight className="w-5 h-5 text-muted-foreground" />
      </div>
    </div>
  );
}
