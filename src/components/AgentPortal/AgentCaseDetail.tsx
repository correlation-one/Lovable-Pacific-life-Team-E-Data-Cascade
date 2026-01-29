import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  User,
  Calendar,
  DollarSign,
  MapPin,
  Upload,
  MessageSquare,
  Phone,
} from "lucide-react";
import { useCaseContext } from "@/context/CaseContext";
import { JOURNEY_STAGES, Gap } from "@/types/case";
import { cn } from "@/lib/utils";
import { format, parseISO, formatDistanceToNow, isPast } from "date-fns";

interface AgentCaseDetailProps {
  onBack: () => void;
}

// Simplified journey stages for agent view
const AGENT_STAGES = [
  { id: 1, label: "Submitted", range: [1, 2] },
  { id: 2, label: "Under Review", range: [3, 4, 5] },
  { id: 3, label: "Information Needed", range: [6] },
  { id: 4, label: "Final Review", range: [7] },
  { id: 5, label: "Decision", range: [8] },
];

export function AgentCaseDetail({ onBack }: AgentCaseDetailProps) {
  const { selectedCase, gaps } = useCaseContext();

  if (!selectedCase) return null;

  // Filter gaps that require agent/applicant action
  const agentGaps = gaps.filter(
    (g) =>
      g.caseId === selectedCase.id &&
      g.status !== "closed" &&
      (g.requestedFrom === "Applicant" || g.requestedFrom === "Agent")
  );

  const currentAgentStage = AGENT_STAGES.find((s) =>
    s.range.includes(selectedCase.stage)
  );
  const stageProgress =
    (AGENT_STAGES.findIndex((s) => s.range.includes(selectedCase.stage)) + 1) /
    AGENT_STAGES.length;

  const slaAtRisk = isPast(parseISO(selectedCase.slaDue));
  const isBlocked = selectedCase.stageStatus === "blocked";

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <p className="text-xs text-muted-foreground">Application</p>
          <h1 className="text-xl font-bold">{selectedCase.applicantName}</h1>
        </div>
        <Badge
          className={cn(
            "text-sm",
            isBlocked
              ? "bg-destructive/10 text-destructive"
              : selectedCase.stage === 8
              ? "bg-emerald-100 text-emerald-700"
              : "bg-amber-100 text-amber-700"
          )}
        >
          {isBlocked ? "Action Needed" : currentAgentStage?.label}
        </Badge>
      </div>

      {/* Progress Tracker - Simplified */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Application Progress</span>
              <span className="font-medium">
                {Math.round(stageProgress * 100)}% Complete
              </span>
            </div>
            <Progress value={stageProgress * 100} className="h-2" />
            <div className="flex justify-between">
              {AGENT_STAGES.map((stage, idx) => {
                const isCurrent = stage.range.includes(selectedCase.stage);
                const isPast = AGENT_STAGES.findIndex((s) =>
                  s.range.includes(selectedCase.stage)
                ) > idx;
                return (
                  <div
                    key={stage.id}
                    className={cn(
                      "flex flex-col items-center gap-1",
                      isCurrent ? "text-primary" : isPast ? "text-emerald-600" : "text-muted-foreground"
                    )}
                  >
                    <div
                      className={cn(
                        "w-3 h-3 rounded-full",
                        isCurrent
                          ? "bg-primary"
                          : isPast
                          ? "bg-emerald-500"
                          : "bg-muted"
                      )}
                    />
                    <span className="text-[10px] text-center max-w-[60px]">
                      {stage.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Required Alert */}
      {agentGaps.length > 0 && (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2 text-destructive">
              <AlertCircle className="w-4 h-4" />
              Information Needed
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Please provide the following to continue processing:
            </p>
            {agentGaps.map((gap) => (
              <div
                key={gap.id}
                className="p-3 rounded-lg bg-background border space-y-2"
              >
                <p className="text-sm font-medium">{gap.description}</p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  {gap.questions.map((q, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      {q}
                    </li>
                  ))}
                </ul>
                <div className="flex items-center gap-2 pt-2">
                  <Button size="sm" className="text-xs">
                    <Upload className="w-3 h-3 mr-1" />
                    Upload Documents
                  </Button>
                  <Button size="sm" variant="outline" className="text-xs">
                    <MessageSquare className="w-3 h-3 mr-1" />
                    Send Response
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Application Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Application Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                <User className="w-4 h-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Applicant</p>
                <p className="text-sm font-medium">{selectedCase.applicantName}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                <Calendar className="w-4 h-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Age</p>
                <p className="text-sm font-medium">{selectedCase.age} years</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                <MapPin className="w-4 h-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">State</p>
                <p className="text-sm font-medium">{selectedCase.state}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                <FileText className="w-4 h-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Product</p>
                <p className="text-sm font-medium">{selectedCase.productType}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                <DollarSign className="w-4 h-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Coverage Amount</p>
                <p className="text-sm font-medium">
                  ${selectedCase.coverageAmount.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                <Clock className="w-4 h-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Submitted</p>
                <p className="text-sm font-medium">
                  {format(parseISO(selectedCase.createdDate), "MMM d, yyyy")}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timeline / Status Updates - Simplified */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Status Updates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {selectedCase.stage >= 1 && (
              <TimelineItem
                icon={CheckCircle}
                title="Application Submitted"
                date={selectedCase.createdDate}
                completed
              />
            )}
            {selectedCase.stage >= 3 && (
              <TimelineItem
                icon={FileText}
                title="Documents Received"
                date={selectedCase.createdDate}
                completed
              />
            )}
            {selectedCase.stage >= 4 && (
              <TimelineItem
                icon={Clock}
                title="Underwriting Review Started"
                date={selectedCase.updatedDate}
                completed={selectedCase.stage > 4}
              />
            )}
            {agentGaps.length > 0 && (
              <TimelineItem
                icon={AlertCircle}
                title="Additional Information Requested"
                date={agentGaps[0]?.createdDate || selectedCase.updatedDate}
                highlight
              />
            )}
            {selectedCase.stage === 8 && (
              <TimelineItem
                icon={CheckCircle}
                title="Application Approved"
                date={selectedCase.updatedDate}
                completed
              />
            )}
          </div>
        </CardContent>
      </Card>

      {/* Expected Timeline */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Estimated Decision</p>
              <p className={cn("text-sm font-medium", slaAtRisk && "text-destructive")}>
                {slaAtRisk
                  ? `Delayed - was expected ${formatDistanceToNow(parseISO(selectedCase.slaDue), { addSuffix: true })}`
                  : format(parseISO(selectedCase.slaDue), "MMMM d, yyyy")}
              </p>
            </div>
            <Button variant="outline" size="sm">
              <Phone className="w-3 h-3 mr-2" />
              Contact Support
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function TimelineItem({
  icon: Icon,
  title,
  date,
  completed,
  highlight,
}: {
  icon: React.ElementType;
  title: string;
  date: string;
  completed?: boolean;
  highlight?: boolean;
}) {
  return (
    <div className="flex gap-3">
      <div
        className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
          completed
            ? "bg-emerald-100 text-emerald-600"
            : highlight
            ? "bg-destructive/10 text-destructive"
            : "bg-muted text-muted-foreground"
        )}
      >
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1 pb-4 border-l-2 border-muted pl-4 -ml-4">
        <p className={cn("text-sm font-medium", highlight && "text-destructive")}>
          {title}
        </p>
        <p className="text-xs text-muted-foreground">
          {format(parseISO(date), "MMM d, yyyy 'at' h:mm a")}
        </p>
      </div>
    </div>
  );
}
