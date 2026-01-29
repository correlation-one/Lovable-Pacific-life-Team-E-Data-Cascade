import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  AlertTriangle,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  FileText,
  Clock,
  Target,
  Eye,
} from "lucide-react";
import { Gap, EvidenceOrder, Document, FieldVerification, Priority, GapSeverity } from "@/types/case";
import { cn } from "@/lib/utils";
import { format, parseISO } from "date-fns";

interface ActionableItemsProps {
  gaps: Gap[];
  evidenceOrders: EvidenceOrder[];
  documents: Document[];
  fieldVerifications: FieldVerification[];
  caseId: string;
  onCloseGap?: (gapId: string) => void;
  onViewField?: (fieldName: string, docId?: string) => void;
  onActionClick?: (action: ActionItem) => void;
}

interface ActionItem {
  id: string;
  type: "gap" | "evidence" | "conflict" | "verification";
  priority: Priority;
  severity?: GapSeverity;
  title: string;
  description: string;
  field?: string;
  fieldValue?: string;
  source?: string;
  action: string;
  actionLabel: string;
  dueDate?: string;
  status: "outstanding" | "in-progress" | "resolved";
}

const priorityOrder: Record<Priority, number> = {
  urgent: 0,
  high: 1,
  medium: 2,
  low: 3,
};

const priorityColors: Record<Priority, string> = {
  urgent: "bg-red-100 text-red-700 border-red-300",
  high: "bg-amber-100 text-amber-700 border-amber-300",
  medium: "bg-blue-100 text-blue-700 border-blue-300",
  low: "bg-slate-100 text-slate-700 border-slate-300",
};

export function ActionableItems({
  gaps,
  evidenceOrders,
  documents,
  fieldVerifications,
  caseId,
  onCloseGap,
  onViewField,
  onActionClick,
}: ActionableItemsProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  // Build unified action items from all sources
  const actionItems: ActionItem[] = [];

  // From gaps - MVR and Health History for focused prototype
  gaps
    .filter((g) => g.caseId === caseId && g.status !== "closed" && 
      (g.description.toLowerCase().includes("mvr") || 
       g.description.toLowerCase().includes("health history") ||
       g.relatedFields.some(f => f.toLowerCase().includes("driving") || f.toLowerCase().includes("license") || f.toLowerCase().includes("health"))))
    .forEach((gap) => {
      actionItems.push({
        id: gap.id,
        type: "gap",
        priority: gap.priority,
        severity: gap.severity,
        title: gap.description,
        description: gap.questions[0] || "Missing information required",
        field: gap.relatedFields[0],
        action: "close-gap",
        actionLabel: gap.status === "open" ? "Request Info" : "Close Gap",
        dueDate: gap.dueDate,
        status: "outstanding",
      });
    });

  // From failed evidence - only MVR for focused prototype
  evidenceOrders
    .filter((e) => e.caseId === caseId && e.status === "failed" && e.type === "MVR")
    .forEach((evidence) => {
      actionItems.push({
        id: evidence.id,
        type: "evidence",
        priority: "high",
        title: `${evidence.type} retrieval failed`,
        description: evidence.failureReason || "Evidence could not be retrieved",
        action: "retry-evidence",
        actionLabel: "Retry Order",
        status: "outstanding",
      });
    });

  // Document conflicts and field verifications removed for MVR-focused prototype

  // Sort by priority
  actionItems.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  // Separate outstanding vs resolved
  const outstandingItems = actionItems.filter((i) => i.status === "outstanding");
  const resolvedGaps = gaps.filter((g) => g.caseId === caseId && g.status === "closed");

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <Target className="w-4 h-4" />
            Action Items
          </CardTitle>
          <div className="flex items-center gap-2 text-xs">
            <Badge variant="outline" className="gap-1">
              <AlertTriangle className="w-3 h-3 text-amber-500" />
              {outstandingItems.length} Outstanding
            </Badge>
            <Badge variant="outline" className="gap-1 text-emerald-600">
              <CheckCircle className="w-3 h-3" />
              {resolvedGaps.length} Resolved
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="outstanding" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-3">
            <TabsTrigger value="outstanding" className="text-xs gap-1">
              Outstanding ({outstandingItems.length})
            </TabsTrigger>
            <TabsTrigger value="resolved" className="text-xs gap-1">
              Resolved ({resolvedGaps.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="outstanding" className="mt-0 space-y-2">
            {outstandingItems.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground text-sm">
                <CheckCircle className="w-8 h-8 mx-auto mb-2 text-emerald-500" />
                No outstanding items
              </div>
            ) : (
              outstandingItems.map((item) => (
                <Collapsible
                  key={item.id}
                  open={expandedItems.has(item.id)}
                  onOpenChange={() => toggleExpanded(item.id)}
                >
                  <div
                    className={cn(
                      "rounded-lg border p-3 transition-all",
                      item.priority === "urgent" && "border-l-4 border-l-red-500",
                      item.priority === "high" && "border-l-4 border-l-amber-500",
                      item.priority === "medium" && "border-l-4 border-l-blue-500"
                    )}
                  >
                    <CollapsibleTrigger asChild>
                      <div className="flex items-start justify-between cursor-pointer hover:bg-muted/30 -m-1 p-1 rounded">
                        <div className="flex items-start gap-2 flex-1 min-w-0">
                          <ChevronDown
                            className={cn(
                              "w-4 h-4 mt-0.5 transition-transform flex-shrink-0",
                              !expandedItems.has(item.id) && "-rotate-90"
                            )}
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-sm font-medium truncate">{item.title}</span>
                              <Badge className={cn("text-[10px]", priorityColors[item.priority])}>
                                {item.priority}
                              </Badge>
                              <Badge variant="outline" className="text-[10px] capitalize">
                                {item.type}
                              </Badge>
                            </div>
                            {item.dueDate && (
                              <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                Due: {format(parseISO(item.dueDate), "MMM d")}
                              </p>
                            )}
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs h-7 ml-2 flex-shrink-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            onActionClick?.(item);
                          }}
                        >
                          {item.actionLabel}
                          <ChevronRight className="w-3 h-3 ml-1" />
                        </Button>
                      </div>
                    </CollapsibleTrigger>

                    <CollapsibleContent>
                      <div className="mt-3 pt-3 border-t space-y-3">
                        <p className="text-xs text-muted-foreground">{item.description}</p>

                        {/* Direct field access */}
                        {item.field && (
                          <div className="bg-muted/50 rounded p-2">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
                                  Field
                                </p>
                                <p className="text-sm font-mono">{item.field}</p>
                                {item.fieldValue && (
                                  <p className="text-xs text-foreground mt-0.5">
                                    Current: <span className="font-medium">{item.fieldValue}</span>
                                  </p>
                                )}
                              </div>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-xs h-7"
                                onClick={() => onViewField?.(item.field!, item.source)}
                              >
                                <Eye className="w-3 h-3 mr-1" />
                                View in Doc
                              </Button>
                            </div>
                            {item.source && (
                              <p className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1">
                                <FileText className="w-3 h-3" />
                                Source: {item.source}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </CollapsibleContent>
                  </div>
                </Collapsible>
              ))
            )}
          </TabsContent>

          <TabsContent value="resolved" className="mt-0 space-y-2">
            {resolvedGaps.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground text-sm">
                No resolved items yet
              </div>
            ) : (
              resolvedGaps.map((gap) => (
                <div
                  key={gap.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/50"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    <span className="text-sm text-foreground">{gap.description}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {gap.closedDate && format(parseISO(gap.closedDate), "MMM d")}
                  </span>
                </div>
              ))
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
