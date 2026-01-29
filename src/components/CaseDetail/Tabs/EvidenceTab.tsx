import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Play,
  RotateCcw,
  Settings,
  FileText,
  ArrowRight,
} from "lucide-react";
import { EvidenceOrder, EvidenceRule, EvidenceType } from "@/types/case";
import { cn } from "@/lib/utils";
import { format, parseISO } from "date-fns";

interface EvidenceTabProps {
  evidenceOrders: EvidenceOrder[];
  evidenceRules: EvidenceRule[];
  caseId: string;
  onOrderEvidence?: (type: EvidenceType) => void;
  onRetryOrder?: (orderId: string) => void;
  onOverride?: (orderId: string) => void;
}

const statusConfig = {
  planned: { icon: Clock, color: "text-muted-foreground", bg: "bg-muted" },
  ordered: { icon: Play, color: "text-blue-600", bg: "bg-blue-100" },
  failed: { icon: XCircle, color: "text-destructive", bg: "bg-destructive/10" },
  received: { icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-100" },
};

export function EvidenceTab({
  evidenceOrders,
  evidenceRules,
  caseId,
  onOrderEvidence,
  onRetryOrder,
  onOverride,
}: EvidenceTabProps) {
  const caseOrders = evidenceOrders.filter((e) => e.caseId === caseId);
  const failedOrders = caseOrders.filter((e) => e.status === "failed");
  const blockedOrders = caseOrders.filter((e) =>
    e.prerequisiteChecks.some((p) => p.status === "unmet")
  );

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Total Orders</p>
                <p className="text-2xl font-bold">{caseOrders.length}</p>
              </div>
              <FileText className="w-8 h-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Received</p>
                <p className="text-2xl font-bold text-emerald-600">
                  {caseOrders.filter((e) => e.status === "received").length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-emerald-500" />
            </div>
          </CardContent>
        </Card>

        <Card className={cn(failedOrders.length > 0 && "border-destructive/50")}>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Failed</p>
                <p className="text-2xl font-bold text-destructive">
                  {failedOrders.length}
                </p>
              </div>
              <XCircle className="w-8 h-8 text-destructive" />
            </div>
          </CardContent>
        </Card>

        <Card className={cn(blockedOrders.length > 0 && "border-amber-500/50")}>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Blocked</p>
                <p className="text-2xl font-bold text-amber-600">
                  {blockedOrders.length}
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-amber-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rules Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Evidence Strategy & Sequencing Rules
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Evidence Type</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Prerequisites</TableHead>
                <TableHead>Description</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {evidenceRules.map((rule) => (
                <TableRow key={rule.id}>
                  <TableCell className="font-medium">{rule.evidenceType}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={cn(
                        rule.action === "request-first"
                          ? "text-emerald-600 border-emerald-300"
                          : rule.action === "request-next"
                          ? "text-blue-600 border-blue-300"
                          : "text-muted-foreground"
                      )}
                    >
                      {rule.action.replace("-", " ")}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {rule.prerequisites.map((prereq, idx) => (
                        <Badge key={idx} variant="secondary" className="text-[10px]">
                          {prereq}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground max-w-[300px]">
                    {rule.description}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Order Tracker */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Evidence Order Tracker
          </CardTitle>
        </CardHeader>
        <CardContent>
          {caseOrders.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No evidence orders for this case yet.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Prerequisites</TableHead>
                  <TableHead>Ordered</TableHead>
                  <TableHead>Received</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {caseOrders.map((order) => {
                  const StatusIcon = statusConfig[order.status].icon;
                  const hasUnmet = order.prerequisiteChecks.some(
                    (p) => p.status === "unmet"
                  );

                  return (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.type}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div
                            className={cn(
                              "w-6 h-6 rounded-full flex items-center justify-center",
                              statusConfig[order.status].bg
                            )}
                          >
                            <StatusIcon
                              className={cn("w-3 h-3", statusConfig[order.status].color)}
                            />
                          </div>
                          <span className="text-sm capitalize">{order.status}</span>
                        </div>
                        {order.failureReason && (
                          <p className="text-xs text-destructive mt-1">
                            {order.failureReason}
                          </p>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {order.prerequisiteChecks.map((check, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-1 text-xs"
                            >
                              {check.status === "met" ? (
                                <CheckCircle className="w-3 h-3 text-emerald-500" />
                              ) : check.status === "overridden" ? (
                                <AlertTriangle className="w-3 h-3 text-amber-500" />
                              ) : (
                                <XCircle className="w-3 h-3 text-destructive" />
                              )}
                              <span
                                className={cn(
                                  check.status === "unmet" && "text-destructive"
                                )}
                              >
                                {check.field}
                              </span>
                            </div>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {order.orderedDate
                          ? format(parseISO(order.orderedDate), "MMM d, h:mm a")
                          : "-"}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {order.receivedDate
                          ? format(parseISO(order.receivedDate), "MMM d, h:mm a")
                          : "-"}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {order.status === "planned" && !hasUnmet && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-xs h-7"
                              onClick={() => onOrderEvidence?.(order.type)}
                            >
                              <Play className="w-3 h-3 mr-1" />
                              Order
                            </Button>
                          )}
                          {order.status === "planned" && hasUnmet && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-xs h-7 text-amber-600"
                              onClick={() => onOverride?.(order.id)}
                            >
                              <AlertTriangle className="w-3 h-3 mr-1" />
                              Override
                            </Button>
                          )}
                          {order.status === "failed" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-xs h-7"
                              onClick={() => onRetryOrder?.(order.id)}
                            >
                              <RotateCcw className="w-3 h-3 mr-1" />
                              Retry
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Exception Handling */}
      {(failedOrders.length > 0 || blockedOrders.length > 0) && (
        <Card className="border-amber-500/30">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2 text-amber-600">
              <AlertTriangle className="w-4 h-4" />
              Exception Handling Required
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {failedOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-3 bg-destructive/5 rounded-lg border border-destructive/20"
              >
                <div>
                  <p className="text-sm font-medium">
                    {order.type} Order Failed
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {order.failureReason}
                  </p>
                </div>
                <Button size="sm" variant="outline">
                  <RotateCcw className="w-3 h-3 mr-1" />
                  Retry
                </Button>
              </div>
            ))}
            {blockedOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-3 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800"
              >
                <div>
                  <p className="text-sm font-medium">
                    {order.type} Blocked - Missing Prerequisites
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Required:{" "}
                    {order.prerequisiteChecks
                      .filter((p) => p.status === "unmet")
                      .map((p) => p.field)
                      .join(", ")}
                  </p>
                </div>
                <Button size="sm" variant="outline">
                  <Settings className="w-3 h-3 mr-1" />
                  Override
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
