import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  AlertTriangle,
  CheckCircle,
  Sparkles,
  FileText,
  Eye,
  ArrowRight,
  X,
  RefreshCw,
  Car,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AIReconciliationDemoProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

type DemoStep = "initial" | "problem" | "ai-analyzing" | "ai-resolved" | "mvr-success";

export function AIReconciliationDemo({ isOpen, onClose, onComplete }: AIReconciliationDemoProps) {
  const [currentStep, setCurrentStep] = useState<DemoStep>("initial");
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setCurrentStep("initial");
      setIsAutoPlaying(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const stepDurations: Record<DemoStep, number> = {
      initial: 2500,
      problem: 3500,
      "ai-analyzing": 4000,
      "ai-resolved": 3000,
      "mvr-success": 2000,
    };

    const stepOrder: DemoStep[] = ["initial", "problem", "ai-analyzing", "ai-resolved", "mvr-success"];
    const currentIndex = stepOrder.indexOf(currentStep);

    if (currentIndex < stepOrder.length - 1) {
      const timer = setTimeout(() => {
        setCurrentStep(stepOrder[currentIndex + 1]);
      }, stepDurations[currentStep]);
      return () => clearTimeout(timer);
    } else {
      setIsAutoPlaying(false);
    }
  }, [currentStep, isAutoPlaying]);

  const handleAutoPlay = () => {
    setCurrentStep("initial");
    setIsAutoPlaying(true);
  };

  const handleStepClick = (step: DemoStep) => {
    setIsAutoPlaying(false);
    setCurrentStep(step);
  };

  if (!isOpen) return null;

  const steps: { id: DemoStep; label: string }[] = [
    { id: "initial", label: "Document Ingested" },
    { id: "problem", label: "Issue Detected" },
    { id: "ai-analyzing", label: "AI Analyzing" },
    { id: "ai-resolved", label: "AI Resolved" },
    { id: "mvr-success", label: "MVR Retrieved" },
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="w-full max-w-4xl bg-card border border-border rounded-xl shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b bg-muted/30">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="font-semibold">AI-Powered Document Reconciliation</h2>
                <p className="text-sm text-muted-foreground">
                  Demonstrating automated resolution of unreadable driver's license data
                </p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Progress Steps */}
          <div className="px-6 py-3 border-b bg-muted/10">
            <div className="flex items-center justify-between">
              {steps.map((step, idx) => (
                <button
                  key={step.id}
                  onClick={() => handleStepClick(step.id)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all",
                    currentStep === step.id
                      ? "bg-primary text-primary-foreground"
                      : steps.findIndex((s) => s.id === currentStep) > idx
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  )}
                >
                  {steps.findIndex((s) => s.id === currentStep) > idx ? (
                    <CheckCircle className="w-3 h-3" />
                  ) : (
                    <span className="w-4 h-4 rounded-full bg-current/20 flex items-center justify-center text-[10px]">
                      {idx + 1}
                    </span>
                  )}
                  {step.label}
                </button>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="p-6 min-h-[400px]">
            <AnimatePresence mode="wait">
              {currentStep === "initial" && (
                <StepInitial key="initial" />
              )}
              {currentStep === "problem" && (
                <StepProblem key="problem" />
              )}
              {currentStep === "ai-analyzing" && (
                <StepAnalyzing key="ai-analyzing" />
              )}
              {currentStep === "ai-resolved" && (
                <StepResolved key="ai-resolved" />
              )}
              {currentStep === "mvr-success" && (
                <StepSuccess key="mvr-success" />
              )}
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-4 border-t bg-muted/30">
            <Button variant="outline" size="sm" onClick={handleAutoPlay}>
              <RefreshCw className="w-3 h-3 mr-2" />
              Replay Demo
            </Button>
            {currentStep === "mvr-success" && (
              <Button onClick={() => { onComplete(); onClose(); }}>
                <CheckCircle className="w-4 h-4 mr-2" />
                Apply Resolution
              </Button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function StepInitial() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-4"
    >
      <div className="text-center mb-6">
        <Badge className="mb-2">Step 1</Badge>
        <h3 className="text-lg font-semibold">Driver's License Ingested via OCR</h3>
        <p className="text-sm text-muted-foreground">Initial document processing complete</p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-3">
              <FileText className="w-4 h-4" />
              <span className="text-sm font-medium">Driver's License</span>
            </div>
            <div className="bg-muted rounded-lg p-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Name:</span>
                <span className="font-medium">Susan Berry</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">DOB:</span>
                <span className="font-medium">11/08/1983</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">State:</span>
                <span className="font-medium">Florida</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">License #:</span>
                <span className="font-mono font-medium">W123-4<span className="bg-amber-200 dark:bg-amber-900 px-1 rounded">??</span>-78-901-0</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4 space-y-3">
            <div className="flex items-center gap-2 mb-3">
              <Eye className="w-4 h-4" />
              <span className="text-sm font-medium">OCR Extraction Results</span>
            </div>
            <ExtractedField field="Full Name" value="Susan Berry" confidence={98} />
            <ExtractedField field="Date of Birth" value="11/08/1983" confidence={95} />
            <ExtractedField field="State" value="FL" confidence={99} />
            <ExtractedField field="License Number" value="W123-4??-78-901-0" confidence={42} hasIssue />
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}

function StepProblem() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-4"
    >
      <div className="text-center mb-6">
        <Badge variant="destructive" className="mb-2">Step 2</Badge>
        <h3 className="text-lg font-semibold">MVR Retrieval Failed</h3>
        <p className="text-sm text-muted-foreground">Unreadable license number blocked evidence ordering</p>
      </div>

      <Card className="border-destructive/50 bg-destructive/5">
        <CardContent className="py-4">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-full bg-destructive/10">
              <AlertTriangle className="w-6 h-6 text-destructive" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-destructive">Evidence Order Blocked</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Motor Vehicle Report (MVR) cannot be retrieved. The driver's license number 
                contains unreadable characters due to image quality issues.
              </p>
              <div className="mt-3 p-3 bg-background rounded-lg border">
                <p className="text-xs text-muted-foreground mb-2">Extracted Value:</p>
                <code className="text-sm font-mono">
                  W123-4<span className="bg-destructive/20 text-destructive px-1 rounded font-bold">??</span>-78-901-0
                </code>
                <p className="text-xs text-muted-foreground mt-2">
                  Characters at positions 6-7 could not be read (42% confidence)
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-4 text-sm text-muted-foreground">
            <h4 className="font-medium text-foreground mb-3">Traditional Resolution</h4>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <X className="w-4 h-4 text-destructive mt-0.5" />
                Contact applicant for new document
              </li>
              <li className="flex items-start gap-2">
                <X className="w-4 h-4 text-destructive mt-0.5" />
                Wait 2-5 business days
              </li>
              <li className="flex items-start gap-2">
                <X className="w-4 h-4 text-destructive mt-0.5" />
                Re-process document manually
              </li>
            </ul>
            <p className="mt-3 text-amber-600 font-medium">Est. delay: 3-7 days</p>
          </CardContent>
        </Card>

        <Card className="border-primary/50 bg-primary/5">
          <CardContent className="pt-4 text-sm">
            <h4 className="font-medium flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-primary" />
              AI-Powered Resolution
            </h4>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5" />
                Cross-reference with application data
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5" />
                Analyze partial character patterns
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5" />
                Auto-verify with state DMV format
              </li>
            </ul>
            <p className="mt-3 text-emerald-600 font-medium">Est. time: ~30 seconds</p>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}

function StepAnalyzing() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-4"
    >
      <div className="text-center mb-6">
        <Badge className="mb-2 bg-purple-500">Step 3</Badge>
        <h3 className="text-lg font-semibold">AI Reconciliation in Progress</h3>
        <p className="text-sm text-muted-foreground">Analyzing multiple data sources to reconstruct value</p>
      </div>

      <Card>
        <CardContent className="py-6 space-y-6">
          <AIAnalysisStep
            icon={<FileText className="w-4 h-4" />}
            title="Cross-referencing Application Form"
            description="Checking license number provided on original application"
            result="Found: W123-456-78-901-0"
            status="complete"
            delay={0}
          />
          <AIAnalysisStep
            icon={<Eye className="w-4 h-4" />}
            title="Character Pattern Analysis"
            description="Analyzing partial pixel data from unreadable region"
            result="High probability: '56' (87% match)"
            status="complete"
            delay={0.3}
          />
          <AIAnalysisStep
            icon={<CheckCircle className="w-4 h-4" />}
            title="Florida DMV Format Validation"
            description="Verifying against FL license number schema"
            result="Format matches: W###-###-##-###-#"
            status="complete"
            delay={0.6}
          />
          <AIAnalysisStep
            icon={<Sparkles className="w-4 h-4" />}
            title="Confidence Scoring"
            description="Computing final reconciled value confidence"
            result="Final confidence: 97%"
            status="processing"
            delay={0.9}
          />
        </CardContent>
      </Card>
    </motion.div>
  );
}

function StepResolved() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-4"
    >
      <div className="text-center mb-6">
        <Badge className="mb-2 bg-emerald-500">Step 4</Badge>
        <h3 className="text-lg font-semibold">License Number Reconciled</h3>
        <p className="text-sm text-muted-foreground">AI successfully reconstructed the unreadable value</p>
      </div>

      <Card className="border-emerald-500/50 bg-emerald-50/50 dark:bg-emerald-950/20">
        <CardContent className="py-6">
          <div className="flex items-center justify-center gap-8">
            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-2">BEFORE</p>
              <div className="p-4 bg-background rounded-lg border border-destructive/30">
                <code className="text-lg font-mono">
                  W123-4<span className="bg-destructive/20 text-destructive px-1 rounded">??</span>-78-901-0
                </code>
                <p className="text-xs text-destructive mt-2">42% confidence</p>
              </div>
            </div>

            <ArrowRight className="w-8 h-8 text-emerald-500" />

            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-2">AFTER (AI RECONCILED)</p>
              <div className="p-4 bg-background rounded-lg border border-emerald-500/30">
                <code className="text-lg font-mono">
                  W123-4<span className="bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-400 px-1 rounded font-bold">56</span>-78-901-0
                </code>
                <p className="text-xs text-emerald-600 mt-2 flex items-center justify-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  97% confidence
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-background rounded-lg border">
            <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              AI Resolution Summary
            </h4>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Data Sources Used</p>
                <p className="font-medium">3 sources</p>
              </div>
              <div>
                <p className="text-muted-foreground">Resolution Time</p>
                <p className="font-medium">28 seconds</p>
              </div>
              <div>
                <p className="text-muted-foreground">Human Review Required</p>
                <p className="font-medium text-emerald-600">No</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function StepSuccess() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-4"
    >
      <div className="text-center mb-6">
        <Badge className="mb-2 bg-emerald-500">Step 5</Badge>
        <h3 className="text-lg font-semibold">MVR Successfully Retrieved</h3>
        <p className="text-sm text-muted-foreground">Evidence ordering unblocked and completed</p>
      </div>

      <Card className="border-emerald-500/50">
        <CardContent className="py-6">
          <div className="flex items-center justify-center gap-4 mb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
              className="p-4 rounded-full bg-emerald-100 dark:bg-emerald-900/30"
            >
              <Car className="w-8 h-8 text-emerald-600" />
            </motion.div>
            <div>
              <h4 className="text-lg font-semibold text-emerald-700 dark:text-emerald-400">
                Motor Vehicle Report Received
              </h4>
              <p className="text-sm text-muted-foreground">
                DMV record successfully retrieved for Susan Berry
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-xs text-muted-foreground mb-2">License Status</p>
              <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-400">Valid</Badge>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-xs text-muted-foreground mb-2">Violations</p>
              <p className="font-medium">0 in last 3 years</p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-xs text-muted-foreground mb-2">License Class</p>
              <p className="font-medium">Class E (Standard)</p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-xs text-muted-foreground mb-2">Expiration</p>
              <p className="font-medium">11/08/2028</p>
            </div>
          </div>

          <div className="mt-6 p-4 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg border border-emerald-200 dark:border-emerald-800">
            <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">Gap Automatically Closed</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Evidence requirement satisfied. Case can proceed to next stage.
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function ExtractedField({ field, value, confidence, hasIssue }: { field: string; value: string; confidence: number; hasIssue?: boolean }) {
  return (
    <div className={cn(
      "flex items-center justify-between p-2 rounded",
      hasIssue ? "bg-destructive/10 border border-destructive/30" : "bg-muted/50"
    )}>
      <div>
        <p className="text-xs text-muted-foreground">{field}</p>
        <p className={cn("text-sm font-mono", hasIssue && "text-destructive")}>{value}</p>
      </div>
      <div className="flex items-center gap-2">
        <Progress value={confidence} className={cn("w-12 h-1.5", hasIssue && "[&>div]:bg-destructive")} />
        <span className={cn("text-xs font-medium", hasIssue ? "text-destructive" : confidence >= 90 ? "text-emerald-600" : "text-amber-600")}>
          {confidence}%
        </span>
        {hasIssue && <AlertTriangle className="w-4 h-4 text-destructive" />}
      </div>
    </div>
  );
}

function AIAnalysisStep({ icon, title, description, result, status, delay }: { icon: React.ReactNode; title: string; description: string; result: string; status: "pending" | "processing" | "complete"; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      className="flex items-start gap-4"
    >
      <div className={cn(
        "p-2 rounded-full",
        status === "complete" ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600" :
        status === "processing" ? "bg-primary/10 text-primary animate-pulse" :
        "bg-muted text-muted-foreground"
      )}>
        {icon}
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium">{title}</h4>
          {status === "complete" && <CheckCircle className="w-4 h-4 text-emerald-500" />}
          {status === "processing" && (
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
              <RefreshCw className="w-4 h-4 text-primary" />
            </motion.div>
          )}
        </div>
        <p className="text-xs text-muted-foreground">{description}</p>
        {(status === "complete" || status === "processing") && (
          <p className={cn("text-xs mt-1 font-medium", status === "complete" ? "text-emerald-600" : "text-primary")}>
            {result}
          </p>
        )}
      </div>
    </motion.div>
  );
}
