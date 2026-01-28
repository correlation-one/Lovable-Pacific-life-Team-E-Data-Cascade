import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, AlertTriangle, Edit2, Save, X, FileSearch, ArrowRight, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ExtractedField {
  key: string;
  label: string;
  extractedValue: string;
  applicationValue: string;
  status: "match" | "mismatch" | "missing";
  aiSuggestion?: string;
}

const initialFields: ExtractedField[] = [
  {
    key: "fullName",
    label: "Full Name",
    extractedValue: "JOHN MICHAEL SMITH",
    applicationValue: "John M. Smith",
    status: "match",
  },
  {
    key: "licenseNumber",
    label: "License Number",
    extractedValue: "S123-456-78-901",
    applicationValue: "S123-456-78-901",
    status: "match",
  },
  {
    key: "address",
    label: "Street Address",
    extractedValue: "456 OAK AVENUE",
    applicationValue: "123 Main Street",
    status: "mismatch",
    aiSuggestion: "Address change detected - applicant may have moved recently",
  },
  {
    key: "city",
    label: "City",
    extractedValue: "ORLANDO",
    applicationValue: "Miami",
    status: "mismatch",
    aiSuggestion: "City differs - recommend using license address for MVR",
  },
  {
    key: "state",
    label: "State",
    extractedValue: "FL",
    applicationValue: "FL",
    status: "match",
  },
  {
    key: "expiration",
    label: "License Expiration",
    extractedValue: "01/15/2028",
    applicationValue: "",
    status: "missing",
    aiSuggestion: "Expiration date was missing from application - now captured",
  },
  {
    key: "dob",
    label: "Date of Birth",
    extractedValue: "01/15/1985",
    applicationValue: "01/15/1985",
    status: "match",
  },
];

export function DocumentReview() {
  const [fields, setFields] = useState<ExtractedField[]>(initialFields);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [resolvedFields, setResolvedFields] = useState<Set<string>>(new Set());

  const mismatchCount = fields.filter(f => f.status === "mismatch" && !resolvedFields.has(f.key)).length;
  const missingCount = fields.filter(f => f.status === "missing" && !resolvedFields.has(f.key)).length;

  const startEditing = (field: ExtractedField) => {
    setEditingField(field.key);
    setEditValue(field.extractedValue);
  };

  const saveEdit = (key: string) => {
    setFields(prev => prev.map(f => 
      f.key === key 
        ? { ...f, applicationValue: editValue, status: "match" as const }
        : f
    ));
    setResolvedFields(prev => new Set([...prev, key]));
    setEditingField(null);
  };

  const useExtractedValue = (field: ExtractedField) => {
    setFields(prev => prev.map(f => 
      f.key === field.key 
        ? { ...f, applicationValue: f.extractedValue, status: "match" as const }
        : f
    ));
    setResolvedFields(prev => new Set([...prev, field.key]));
  };

  const allResolved = mismatchCount === 0 && missingCount === 0;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          <FileSearch className="h-5 w-5 text-primary" />
          Document Review & Data Correction
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          AI has extracted data from the uploaded license. Review and resolve any discrepancies.
        </p>
      </div>

      {/* Status Banner */}
      <motion.div
        className={`mb-6 p-4 rounded-lg border flex items-center justify-between ${
          allResolved 
            ? "bg-green-500/10 border-green-500/30" 
            : "bg-amber-500/10 border-amber-500/30"
        }`}
        animate={{ opacity: [0.9, 1, 0.9] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="flex items-center gap-3">
          {allResolved ? (
            <CheckCircle className="h-5 w-5 text-green-500" />
          ) : (
            <AlertTriangle className="h-5 w-5 text-amber-500" />
          )}
          <div>
            <p className="text-sm font-medium">
              {allResolved 
                ? "All discrepancies resolved!" 
                : `${mismatchCount + missingCount} issue${mismatchCount + missingCount > 1 ? "s" : ""} need attention`}
            </p>
            <p className="text-xs text-muted-foreground">
              {allResolved 
                ? "Data is ready for system update" 
                : "Review the highlighted fields below"}
            </p>
          </div>
        </div>
        {!allResolved && (
          <div className="flex gap-2">
            <Badge variant="outline" className="border-amber-500/50 text-amber-600">
              {mismatchCount} mismatch{mismatchCount !== 1 ? "es" : ""}
            </Badge>
            <Badge variant="outline" className="border-blue-500/50 text-blue-600">
              {missingCount} missing
            </Badge>
          </div>
        )}
      </motion.div>

      {/* AI Assistance Notice */}
      <div className="mb-6 p-3 rounded-lg flex items-center gap-3" style={{ background: "hsl(280 100% 60% / 0.08)" }}>
        <Sparkles className="h-5 w-5" style={{ color: "hsl(280 100% 60%)" }} />
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">AI Suggestions:</span> Click "Use Extracted" to accept AI-extracted values, or manually edit if needed
        </p>
      </div>

      {/* Fields Comparison Table */}
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left text-xs font-medium text-muted-foreground p-3">Field</th>
              <th className="text-left text-xs font-medium text-muted-foreground p-3">Application Value</th>
              <th className="text-center text-xs font-medium text-muted-foreground p-3 w-12"></th>
              <th className="text-left text-xs font-medium text-muted-foreground p-3">Extracted from License</th>
              <th className="text-left text-xs font-medium text-muted-foreground p-3">Status</th>
              <th className="text-right text-xs font-medium text-muted-foreground p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {fields.map((field, index) => (
              <motion.tr
                key={field.key}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`border-t ${
                  field.status === "mismatch" && !resolvedFields.has(field.key)
                    ? "bg-amber-500/5"
                    : field.status === "missing" && !resolvedFields.has(field.key)
                    ? "bg-blue-500/5"
                    : ""
                }`}
              >
                <td className="p-3">
                  <span className="text-sm font-medium">{field.label}</span>
                </td>
                <td className="p-3">
                  {editingField === field.key ? (
                    <Input
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="h-8 text-sm"
                      autoFocus
                    />
                  ) : (
                    <span className={`text-sm font-mono ${field.status === "missing" && !resolvedFields.has(field.key) ? "text-muted-foreground italic" : ""}`}>
                      {field.applicationValue || "(not provided)"}
                    </span>
                  )}
                </td>
                <td className="p-3 text-center">
                  {field.status !== "match" && !resolvedFields.has(field.key) && (
                    <ArrowRight className="h-4 w-4 text-muted-foreground mx-auto" />
                  )}
                </td>
                <td className="p-3">
                  <span className="text-sm font-mono" style={{ color: "hsl(280 100% 60%)" }}>
                    {field.extractedValue}
                  </span>
                </td>
                <td className="p-3">
                  <StatusBadge status={field.status} resolved={resolvedFields.has(field.key)} />
                </td>
                <td className="p-3 text-right">
                  {field.status !== "match" && !resolvedFields.has(field.key) && (
                    <div className="flex items-center justify-end gap-2">
                      {editingField === field.key ? (
                        <>
                          <Button size="sm" variant="ghost" onClick={() => setEditingField(null)}>
                            <X className="h-4 w-4" />
                          </Button>
                          <Button size="sm" onClick={() => saveEdit(field.key)}>
                            <Save className="h-4 w-4 mr-1" />
                            Save
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button size="sm" variant="ghost" onClick={() => startEditing(field)}>
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => useExtractedValue(field)}>
                            Use Extracted
                          </Button>
                        </>
                      )}
                    </div>
                  )}
                  {resolvedFields.has(field.key) && (
                    <CheckCircle className="h-4 w-4 text-green-500 inline" />
                  )}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* AI Suggestions for mismatches */}
      <AnimatePresence>
        {fields.filter(f => f.aiSuggestion && (f.status === "mismatch" || f.status === "missing") && !resolvedFields.has(f.key)).length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 p-4 rounded-lg border bg-card"
          >
            <h4 className="text-sm font-semibold flex items-center gap-2 mb-3">
              <Sparkles className="h-4 w-4" style={{ color: "hsl(280 100% 60%)" }} />
              AI Insights
            </h4>
            <div className="space-y-2">
              {fields.filter(f => f.aiSuggestion && !resolvedFields.has(f.key)).map(field => (
                <div key={field.key} className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">{field.label}:</span> {field.aiSuggestion}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Actions */}
      <div className="flex justify-end gap-3 mt-6">
        <Button variant="outline">Request New Upload</Button>
        <Button disabled={!allResolved}>
          {allResolved ? "Update System & Reissue MVR" : "Resolve All Issues to Continue"}
        </Button>
      </div>
    </div>
  );
}

function StatusBadge({ status, resolved }: { status: "match" | "mismatch" | "missing"; resolved: boolean }) {
  if (resolved) {
    return (
      <Badge variant="outline" className="border-green-500/50 text-green-600 text-xs">
        <CheckCircle className="h-3 w-3 mr-1" />
        Resolved
      </Badge>
    );
  }

  switch (status) {
    case "match":
      return (
        <Badge variant="outline" className="border-green-500/50 text-green-600 text-xs">
          <CheckCircle className="h-3 w-3 mr-1" />
          Match
        </Badge>
      );
    case "mismatch":
      return (
        <Badge variant="outline" className="border-amber-500/50 text-amber-600 text-xs">
          <AlertTriangle className="h-3 w-3 mr-1" />
          Mismatch
        </Badge>
      );
    case "missing":
      return (
        <Badge variant="outline" className="border-blue-500/50 text-blue-600 text-xs">
          Missing
        </Badge>
      );
  }
}
