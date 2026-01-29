import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
  ChevronDown,
  Eye,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import { Document, FieldVerification } from "@/types/case";
import { cn } from "@/lib/utils";
import { format, parseISO } from "date-fns";

interface DocumentsTabProps {
  documents: Document[];
  fieldVerifications: FieldVerification[];
  caseId: string;
  onVerifyField?: (fieldId: string) => void;
  onRequestClarification?: (fieldId: string) => void;
}

const statusColors = {
  received: "bg-blue-100 text-blue-700",
  processing: "bg-amber-100 text-amber-700",
  processed: "bg-emerald-100 text-emerald-700",
  failed: "bg-red-100 text-red-700",
};

const confidenceColor = (confidence: number) => {
  if (confidence >= 90) return "text-emerald-600";
  if (confidence >= 70) return "text-amber-600";
  return "text-destructive";
};

export function DocumentsTab({
  documents,
  fieldVerifications,
  caseId,
  onVerifyField,
  onRequestClarification,
}: DocumentsTabProps) {
  const [expandedDoc, setExpandedDoc] = useState<string | null>(null);
  const caseDocuments = documents.filter((d) => d.caseId === caseId);
  const caseFields = fieldVerifications.filter((f) => f.caseId === caseId);

  const hasConflicts = caseDocuments.some((d) => d.conflicts.length > 0);
  const lowConfidenceDocs = caseDocuments.filter((d) => d.confidence < 70);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Total Documents</p>
                <p className="text-2xl font-bold">{caseDocuments.length}</p>
              </div>
              <FileText className="w-8 h-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card className={cn(hasConflicts && "border-destructive/50")}>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Conflicts Detected</p>
                <p className="text-2xl font-bold text-destructive">
                  {caseDocuments.reduce((acc, d) => acc + d.conflicts.length, 0)}
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-destructive" />
            </div>
          </CardContent>
        </Card>

        <Card className={cn(lowConfidenceDocs.length > 0 && "border-amber-500/50")}>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Low Confidence</p>
                <p className="text-2xl font-bold text-amber-600">
                  {lowConfidenceDocs.length}
                </p>
              </div>
              <HelpCircle className="w-8 h-8 text-amber-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Documents Grid */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Document Intake</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Document</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Received</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Confidence</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {caseDocuments.map((doc) => (
                <Collapsible
                  key={doc.id}
                  open={expandedDoc === doc.id}
                  onOpenChange={() =>
                    setExpandedDoc(expandedDoc === doc.id ? null : doc.id)
                  }
                >
                  <TableRow className="cursor-pointer hover:bg-muted/50">
                    <TableCell className="font-medium">
                      <CollapsibleTrigger className="flex items-center gap-2">
                        <ChevronDown
                          className={cn(
                            "w-4 h-4 transition-transform",
                            expandedDoc === doc.id && "rotate-180"
                          )}
                        />
                        {doc.name}
                        {doc.conflicts.length > 0 && (
                          <AlertCircle className="w-4 h-4 text-destructive" />
                        )}
                      </CollapsibleTrigger>
                    </TableCell>
                    <TableCell>{doc.type}</TableCell>
                    <TableCell>{doc.source}</TableCell>
                    <TableCell>
                      {format(parseISO(doc.receivedDate), "MMM d, h:mm a")}
                    </TableCell>
                    <TableCell>
                      <Badge className={cn("capitalize", statusColors[doc.processingStatus])}>
                        {doc.processingStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={doc.confidence} className="w-16 h-2" />
                        <span className={cn("text-xs font-medium", confidenceColor(doc.confidence))}>
                          {doc.confidence}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                  <CollapsibleContent asChild>
                    <tr>
                      <td colSpan={7} className="bg-muted/30 p-4">
                        <div className="space-y-4">
                          {/* Extracted Fields */}
                          <div>
                            <p className="text-xs font-medium mb-2">Extracted Fields</p>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                              {doc.extractedFields.map((field, idx) => (
                                <div
                                  key={idx}
                                  className="bg-background rounded p-2 border"
                                >
                                  <p className="text-[10px] text-muted-foreground">
                                    {field.field}
                                  </p>
                                  <p className="text-sm font-medium">{field.value}</p>
                                  <div className="flex items-center justify-between mt-1">
                                    <span
                                      className={cn(
                                        "text-[10px] font-medium",
                                        confidenceColor(field.confidence)
                                      )}
                                    >
                                      {field.confidence}% confidence
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Conflicts */}
                          {doc.conflicts.length > 0 && (
                            <div className="p-3 bg-destructive/10 rounded-lg border border-destructive/30">
                              <p className="text-xs font-medium text-destructive mb-2 flex items-center gap-1">
                                <AlertTriangle className="w-3 h-3" />
                                Conflicting Values Detected
                              </p>
                              {doc.conflicts.map((conflict, idx) => (
                                <div key={idx} className="space-y-1">
                                  <p className="text-xs font-medium">{conflict.field}</p>
                                  <div className="flex flex-wrap gap-2">
                                    {conflict.values.map((v, vIdx) => (
                                      <Badge
                                        key={vIdx}
                                        variant="outline"
                                        className="text-xs"
                                      >
                                        {v.value} ({v.source})
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  </CollapsibleContent>
                </Collapsible>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Field Verification Queue */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Field Verification Queue</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Field</TableHead>
                <TableHead>Current Value</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Confidence</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {caseFields.map((field) => (
                <TableRow key={field.id}>
                  <TableCell className="font-medium">
                    {field.fieldName}
                    {field.conflictIndicator && (
                      <AlertCircle className="w-4 h-4 text-destructive inline ml-2" />
                    )}
                  </TableCell>
                  <TableCell>{field.currentValue}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {field.source}
                  </TableCell>
                  <TableCell>
                    <span className={cn("text-sm font-medium", confidenceColor(field.confidence))}>
                      {field.confidence}%
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={cn(
                        field.verificationStatus === "verified"
                          ? "text-emerald-600 border-emerald-300"
                          : field.verificationStatus === "needs-clarification"
                          ? "text-destructive border-destructive/50"
                          : "text-muted-foreground"
                      )}
                    >
                      {field.verificationStatus.replace("-", " ")}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs h-7"
                        onClick={() => onVerifyField?.(field.id)}
                        disabled={field.verificationStatus === "verified"}
                      >
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Verify
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs h-7"
                        onClick={() => onRequestClarification?.(field.id)}
                      >
                        <HelpCircle className="w-3 h-3 mr-1" />
                        Clarify
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
