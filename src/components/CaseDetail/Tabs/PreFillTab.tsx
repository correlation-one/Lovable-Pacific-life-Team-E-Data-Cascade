import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  CheckCircle,
  AlertTriangle,
  Clock,
  ChevronDown,
  FileText,
  Edit,
  History,
  AlertCircle,
} from "lucide-react";
import { ApplicationSection, ApplicationField, VerificationStatus } from "@/types/case";
import { cn } from "@/lib/utils";
import { format, parseISO } from "date-fns";

interface PreFillTabProps {
  sections: ApplicationSection[];
  onVerifyField?: (fieldId: string) => void;
  onEditField?: (fieldId: string, value: string) => void;
}

const sourceColors = {
  applicant: "bg-blue-100 text-blue-700",
  document: "bg-purple-100 text-purple-700",
  evidence: "bg-emerald-100 text-emerald-700",
  internal: "bg-slate-100 text-slate-700",
  prefilled: "bg-amber-100 text-amber-700",
};

const statusIcons: Record<VerificationStatus, React.ReactNode> = {
  pending: <Clock className="w-3 h-3 text-muted-foreground" />,
  verified: <CheckCircle className="w-3 h-3 text-emerald-500" />,
  rejected: <AlertTriangle className="w-3 h-3 text-destructive" />,
  "needs-clarification": <AlertCircle className="w-3 h-3 text-amber-500" />,
};

export function PreFillTab({ sections, onVerifyField, onEditField }: PreFillTabProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>("SEC-001");
  const [showChangeLog, setShowChangeLog] = useState<string | null>(null);

  const totalFields = sections.reduce((acc, s) => acc + s.fields.length, 0);
  const verifiedFields = sections.reduce(
    (acc, s) => acc + s.fields.filter((f) => f.verificationStatus === "verified").length,
    0
  );
  const conflictFields = sections.reduce(
    (acc, s) => acc + s.fields.filter((f) => f.conflictIndicator).length,
    0
  );
  const overallCompletion = Math.round(
    sections.reduce((acc, s) => acc + s.completionPercentage, 0) / sections.length
  );

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Overall Completion</p>
              <div className="flex items-center gap-3">
                <Progress value={overallCompletion} className="flex-1 h-2" />
                <span className="text-lg font-bold">{overallCompletion}%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Fields Verified</p>
                <p className="text-2xl font-bold text-emerald-600">
                  {verifiedFields}/{totalFields}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-emerald-500" />
            </div>
          </CardContent>
        </Card>

        <Card className={cn(conflictFields > 0 && "border-destructive/50")}>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Conflicts</p>
                <p className="text-2xl font-bold text-destructive">{conflictFields}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-destructive" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Ready for Signature</p>
                <Badge
                  variant={overallCompletion === 100 ? "default" : "secondary"}
                  className="mt-1"
                >
                  {overallCompletion === 100 ? "Yes" : "Not Yet"}
                </Badge>
              </div>
              <FileText className="w-8 h-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Application Sections */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Dynamic Application View
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {sections.map((section) => (
            <Collapsible
              key={section.id}
              open={expandedSection === section.id}
              onOpenChange={() =>
                setExpandedSection(expandedSection === section.id ? null : section.id)
              }
            >
              <CollapsibleTrigger className="w-full">
                <div className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <ChevronDown
                      className={cn(
                        "w-4 h-4 transition-transform",
                        expandedSection === section.id && "rotate-180"
                      )}
                    />
                    <span className="font-medium text-sm">{section.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Progress
                      value={section.completionPercentage}
                      className="w-24 h-2"
                    />
                    <span className="text-xs text-muted-foreground w-10">
                      {section.completionPercentage}%
                    </span>
                  </div>
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="p-4 border border-t-0 rounded-b-lg bg-muted/20 space-y-3">
                  {section.fields.map((field) => (
                    <div
                      key={field.id}
                      className={cn(
                        "p-3 rounded-lg bg-background border",
                        field.conflictIndicator && "border-destructive/50 bg-destructive/5"
                      )}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="text-xs text-muted-foreground">
                              {field.label}
                            </p>
                            {field.conflictIndicator && (
                              <Badge
                                variant="destructive"
                                className="text-[10px] h-4"
                              >
                                Conflict
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm font-medium mt-0.5">
                            {field.value || <span className="text-muted-foreground italic">Not provided</span>}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {statusIcons[field.verificationStatus]}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => onEditField?.(field.id, field.value)}
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                          {field.changeLog.length > 0 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={() =>
                                setShowChangeLog(
                                  showChangeLog === field.id ? null : field.id
                                )
                              }
                            >
                              <History className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 mt-2 text-[10px]">
                        <Badge
                          variant="secondary"
                          className={cn("text-[10px]", sourceColors[field.source])}
                        >
                          {field.source}
                        </Badge>
                        <span className="text-muted-foreground">
                          Confidence: {field.confidence}%
                        </span>
                        <span className="text-muted-foreground">
                          Updated:{" "}
                          {format(parseISO(field.lastUpdated), "MMM d, h:mm a")}
                        </span>
                      </div>

                      {/* Change Log */}
                      {showChangeLog === field.id && field.changeLog.length > 0 && (
                        <div className="mt-3 pt-3 border-t space-y-2">
                          <p className="text-xs font-medium text-muted-foreground">
                            Change History
                          </p>
                          <ScrollArea className="max-h-[150px]">
                            {field.changeLog.map((entry, idx) => (
                              <div
                                key={idx}
                                className="text-xs p-2 bg-muted rounded mb-1"
                              >
                                <div className="flex items-center justify-between">
                                  <span className="font-medium">
                                    {entry.previousValue || "(empty)"} → {entry.newValue}
                                  </span>
                                  <span className="text-muted-foreground">
                                    {format(parseISO(entry.timestamp), "MMM d, h:mm a")}
                                  </span>
                                </div>
                                <p className="text-muted-foreground mt-0.5">
                                  Source: {entry.source} • {entry.reason}
                                </p>
                              </div>
                            ))}
                          </ScrollArea>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </CardContent>
      </Card>

      {/* Completion Meter */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium">Application Completion Status</p>
            <Badge variant={overallCompletion === 100 ? "default" : "secondary"}>
              {overallCompletion === 100
                ? "Ready for Applicant Signature"
                : `${100 - overallCompletion}% remaining`}
            </Badge>
          </div>
          <div className="space-y-2">
            {sections.map((section) => (
              <div key={section.id} className="flex items-center gap-3">
                <span className="text-xs w-32 truncate">{section.name}</span>
                <Progress value={section.completionPercentage} className="flex-1 h-2" />
                <span className="text-xs text-muted-foreground w-8">
                  {section.completionPercentage}%
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
