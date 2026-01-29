import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Clock,
  User,
  Bot,
  FileText,
  AlertTriangle,
  CheckCircle,
  Send,
  ArrowRight,
} from "lucide-react";
import { AuditEvent, AuditEventType } from "@/types/case";
import { cn } from "@/lib/utils";
import { format, parseISO } from "date-fns";

interface AuditTrailTabProps {
  events: AuditEvent[];
  caseId: string;
}

const eventConfig: Record<AuditEventType, { icon: React.ElementType; color: string }> = {
  "stage-change": { icon: ArrowRight, color: "text-primary" },
  "gap-created": { icon: AlertTriangle, color: "text-amber-500" },
  "gap-updated": { icon: FileText, color: "text-blue-500" },
  "gap-closed": { icon: CheckCircle, color: "text-emerald-500" },
  "evidence-planned": { icon: Clock, color: "text-muted-foreground" },
  "evidence-ordered": { icon: Send, color: "text-blue-500" },
  "evidence-failed": { icon: AlertTriangle, color: "text-destructive" },
  "evidence-received": { icon: CheckCircle, color: "text-emerald-500" },
  "document-received": { icon: FileText, color: "text-blue-500" },
  "document-processed": { icon: CheckCircle, color: "text-emerald-500" },
  "document-failed": { icon: AlertTriangle, color: "text-destructive" },
  "field-extracted": { icon: FileText, color: "text-purple-500" },
  "field-verified": { icon: CheckCircle, color: "text-emerald-500" },
  "field-overridden": { icon: AlertTriangle, color: "text-amber-500" },
  "notification-sent": { icon: Send, color: "text-blue-500" },
  "case-assigned": { icon: User, color: "text-primary" },
  "case-priority-changed": { icon: AlertTriangle, color: "text-amber-500" },
};

export function AuditTrailTab({ events, caseId }: AuditTrailTabProps) {
  const caseEvents = events
    .filter((e) => e.caseId === caseId)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          <Clock className="w-4 h-4" />
          Audit Trail - What happened, when, by whom, and why
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px] pr-4">
          <div className="space-y-4">
            {caseEvents.map((event) => {
              const config = eventConfig[event.eventType];
              const Icon = config?.icon || FileText;
              return (
                <div key={event.id} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={cn("w-8 h-8 rounded-full bg-muted flex items-center justify-center", config?.color)}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="w-px flex-1 bg-border mt-2" />
                  </div>
                  <div className="flex-1 pb-4">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="text-[10px] capitalize">
                        {event.eventType.replace(/-/g, " ")}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {format(parseISO(event.timestamp), "MMM d, yyyy h:mm a")}
                      </span>
                    </div>
                    <p className="text-sm">{event.details}</p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                      {event.actorType === "system" ? (
                        <Bot className="w-3 h-3" />
                      ) : (
                        <User className="w-3 h-3" />
                      )}
                      <span>{event.actor}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
