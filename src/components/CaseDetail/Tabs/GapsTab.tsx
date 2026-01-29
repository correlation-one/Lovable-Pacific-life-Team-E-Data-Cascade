import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  Send,
  MessageSquare,
  ChevronRight,
  Package,
  AlertTriangle,
} from "lucide-react";
import { Gap, GapStatus, GapSeverity, Priority } from "@/types/case";
import { cn } from "@/lib/utils";
import { format, parseISO } from "date-fns";

interface GapsTabProps {
  gaps: Gap[];
  caseId: string;
  onCloseGap?: (gapId: string) => void;
  onSendRequest?: (gapId: string) => void;
  onSendReminder?: (gapId: string) => void;
  onShowAIResolution?: () => void;
  onShowHealthHistory?: () => void;
}

const statusConfig: Record<GapStatus, { icon: React.ElementType; color: string; bg: string }> = {
  open: { icon: AlertCircle, color: "text-amber-600", bg: "bg-amber-100" },
  requested: { icon: Send, color: "text-blue-600", bg: "bg-blue-100" },
  "reminder-sent": { icon: Clock, color: "text-purple-600", bg: "bg-purple-100" },
  received: { icon: MessageSquare, color: "text-emerald-600", bg: "bg-emerald-100" },
  verified: { icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-100" },
  closed: { icon: CheckCircle, color: "text-slate-600", bg: "bg-slate-100" },
};

const severityColors: Record<GapSeverity, string> = {
  low: "bg-slate-100 text-slate-700",
  medium: "bg-blue-100 text-blue-700",
  high: "bg-amber-100 text-amber-700",
  critical: "bg-red-100 text-red-700",
};

const priorityColors: Record<Priority, string> = {
  low: "border-slate-300",
  medium: "border-blue-300",
  high: "border-amber-300",
  urgent: "border-red-300",
};

export function GapsTab({
  gaps,
  caseId,
  onCloseGap,
  onSendRequest,
  onSendReminder,
  onShowAIResolution,
  onShowHealthHistory,
}: GapsTabProps) {
  const [selectedGap, setSelectedGap] = useState<Gap | null>(null);
  const caseGaps = gaps.filter((g) => g.caseId === caseId);
  const openGaps = caseGaps.filter((g) => g.status !== "closed");
  const closedGaps = caseGaps.filter((g) => g.status === "closed");

  // Group by type
  const gapsByType = caseGaps.reduce((acc, gap) => {
    if (!acc[gap.type]) acc[gap.type] = [];
    acc[gap.type].push(gap);
    return acc;
  }, {} as Record<string, Gap[]>);

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Total Items</p>
                <p className="text-2xl font-bold">{caseGaps.length}</p>
              </div>
              <Package className="w-8 h-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card className={cn(openGaps.length > 0 && "border-amber-500/50")}>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Open</p>
                <p className="text-2xl font-bold text-amber-600">{openGaps.length}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-amber-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Closed</p>
                <p className="text-2xl font-bold text-emerald-600">{closedGaps.length}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-emerald-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Critical</p>
                <p className="text-2xl font-bold text-destructive">
                  {caseGaps.filter((g) => g.severity === "critical" && g.status !== "closed").length}
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-destructive" />
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
              Confirmation of item resolution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground mb-2">
              The following items have been resolved and closed:
            </p>
            <div className="space-y-1">
              {closedGaps.map((gap) => (
                <div
                  key={gap.id}
                  className="flex items-center justify-between text-xs bg-white dark:bg-background rounded px-3 py-2"
                >
                  <span className="font-medium">{gap.description}</span>
                  <span className="text-muted-foreground">
                    Closed: {gap.closedDate && format(parseISO(gap.closedDate), "MMM d, yyyy")}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Gaps by Type */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">
            Items identified, sequenced, and packaged by type, priority, severity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(gapsByType).map(([type, typeGaps]) => (
              <div key={type} className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="capitalize">
                    {type.replace("-", " ")}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {typeGaps.length} item{typeGaps.length !== 1 ? "s" : ""}
                  </span>
                </div>
                <div className="grid gap-2">
                  {typeGaps.map((gap) => {
                    const StatusIcon = statusConfig[gap.status].icon;
                    
                    // Determine if this gap should trigger a resolution popup
                    const handleGapClick = () => {
                      if (gap.type === "evidence-failure" && onShowAIResolution) {
                        onShowAIResolution();
                      } else if (gap.type === "missing-info" && gap.description.toLowerCase().includes("health") && onShowHealthHistory) {
                        onShowHealthHistory();
                      } else {
                        setSelectedGap(gap);
                      }
                    };

                    // For gaps with resolution popups, don't use Dialog
                    const hasResolutionPopup = 
                      (gap.type === "evidence-failure" && onShowAIResolution) ||
                      (gap.type === "missing-info" && gap.description.toLowerCase().includes("health") && onShowHealthHistory);

                    if (hasResolutionPopup) {
                      return (
                        <div
                          key={gap.id}
                          className={cn(
                            "p-3 rounded-lg border cursor-pointer hover:bg-muted/50 transition-colors",
                            priorityColors[gap.priority],
                            gap.status === "closed" && "opacity-60"
                          )}
                          onClick={handleGapClick}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <div
                                  className={cn(
                                    "w-5 h-5 rounded-full flex items-center justify-center",
                                    statusConfig[gap.status].bg
                                  )}
                                >
                                  <StatusIcon
                                    className={cn("w-3 h-3", statusConfig[gap.status].color)}
                                  />
                                </div>
                                <span className="text-sm font-medium">
                                  {gap.description}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <span>Owner: {gap.ownerTeam}</span>
                                <span>•</span>
                                <span>
                                  Due: {format(parseISO(gap.dueDate), "MMM d")}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge
                                className={cn("text-[10px]", severityColors[gap.severity])}
                              >
                                {gap.severity}
                              </Badge>
                              <ChevronRight className="w-4 h-4 text-muted-foreground" />
                            </div>
                          </div>
                        </div>
                      );
                    }

                    return (
                      <Dialog key={gap.id}>
                        <DialogTrigger asChild>
                          <div
                            className={cn(
                              "p-3 rounded-lg border cursor-pointer hover:bg-muted/50 transition-colors",
                              priorityColors[gap.priority],
                              gap.status === "closed" && "opacity-60"
                            )}
                            onClick={() => setSelectedGap(gap)}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <div
                                    className={cn(
                                      "w-5 h-5 rounded-full flex items-center justify-center",
                                      statusConfig[gap.status].bg
                                    )}
                                  >
                                    <StatusIcon
                                      className={cn("w-3 h-3", statusConfig[gap.status].color)}
                                    />
                                  </div>
                                  <span className="text-sm font-medium">
                                    {gap.description}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <span>Owner: {gap.ownerTeam}</span>
                                  <span>•</span>
                                  <span>
                                    Due: {format(parseISO(gap.dueDate), "MMM d")}
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge
                                  className={cn("text-[10px]", severityColors[gap.severity])}
                                >
                                  {gap.severity}
                                </Badge>
                                <ChevronRight className="w-4 h-4 text-muted-foreground" />
                              </div>
                            </div>
                          </div>
                        </DialogTrigger>
                        <DialogContent className="max-w-lg">
                          <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                              <Package className="w-5 h-5" />
                              Item Details
                            </DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <p className="text-xs text-muted-foreground">Description</p>
                              <p className="text-sm font-medium">{gap.description}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-xs text-muted-foreground">Status</p>
                                <Badge className={cn(statusConfig[gap.status].bg, statusConfig[gap.status].color)}>
                                  {gap.status}
                                </Badge>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">Severity</p>
                                <Badge className={severityColors[gap.severity]}>
                                  {gap.severity}
                                </Badge>
                              </div>
                            </div>

                            <div>
                              <p className="text-xs text-muted-foreground mb-1">Questions</p>
                              <ul className="text-sm space-y-1">
                                {gap.questions.map((q, idx) => (
                                  <li key={idx} className="flex items-start gap-2">
                                    <span className="text-muted-foreground">{idx + 1}.</span>
                                    {q}
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div>
                              <p className="text-xs text-muted-foreground mb-2">Timeline</p>
                              <ScrollArea className="max-h-[150px]">
                                <div className="space-y-2">
                                  {gap.timeline.map((entry, idx) => (
                                    <div
                                      key={idx}
                                      className="flex items-center gap-3 text-xs"
                                    >
                                      <div className="w-2 h-2 rounded-full bg-primary" />
                                      <span className="font-medium capitalize">
                                        {entry.status}
                                      </span>
                                      <span className="text-muted-foreground">
                                        {format(parseISO(entry.timestamp), "MMM d, h:mm a")}
                                      </span>
                                      <span className="text-muted-foreground">
                                        by {entry.actor}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </ScrollArea>
                            </div>

                            <div className="flex items-center gap-2 pt-2 border-t">
                              {gap.status !== "closed" && (
                                <>
                                  {gap.status === "open" && (
                                    <Button
                                      size="sm"
                                      onClick={() => onSendRequest?.(gap.id)}
                                    >
                                      <Send className="w-3 h-3 mr-1" />
                                      Send Request
                                    </Button>
                                  )}
                                  {(gap.status === "requested" || gap.status === "reminder-sent") && (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => onSendReminder?.(gap.id)}
                                    >
                                      <Clock className="w-3 h-3 mr-1" />
                                      Send Reminder
                                    </Button>
                                  )}
                                  {(gap.status === "received" || gap.status === "verified") && (
                                    <Button
                                      size="sm"
                                      onClick={() => onCloseGap?.(gap.id)}
                                    >
                                      <CheckCircle className="w-3 h-3 mr-1" />
                                      Resolve Item
                                    </Button>
                                  )}
                                </>
                              )}
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Open Gaps Table */}
      {openGaps.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Unresolved Items Requiring Action</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {openGaps.map((gap) => {
                  const StatusIcon = statusConfig[gap.status].icon;
                  return (
                    <TableRow key={gap.id}>
                      <TableCell className="font-medium max-w-[200px] truncate">
                        {gap.description}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize text-xs">
                          {gap.type.replace("-", " ")}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={cn("text-xs", severityColors[gap.severity])}>
                          {gap.severity}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <StatusIcon
                            className={cn("w-3 h-3", statusConfig[gap.status].color)}
                          />
                          <span className="text-xs capitalize">{gap.status}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs">
                        {format(parseISO(gap.dueDate), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs h-7"
                          onClick={() => onCloseGap?.(gap.id)}
                        >
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Close
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
