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
  ClipboardList,
  MessageSquare,
  ArrowRight,
  X,
  RefreshCw,
  Mail,
  FileText,
  Brain,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface HealthHistoryResolutionDemoProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

type DemoStep = "initial" | "problem" | "ai-outreach" | "response-received" | "gap-resolved";

export function HealthHistoryResolutionDemo({ isOpen, onClose, onComplete }: HealthHistoryResolutionDemoProps) {
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
      "ai-outreach": 4000,
      "response-received": 3000,
      "gap-resolved": 2000,
    };

    const stepOrder: DemoStep[] = ["initial", "problem", "ai-outreach", "response-received", "gap-resolved"];
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
    { id: "initial", label: "Gap Detected" },
    { id: "problem", label: "Missing Answers" },
    { id: "ai-outreach", label: "AI Outreach" },
    { id: "response-received", label: "Response Received" },
    { id: "gap-resolved", label: "Gap Resolved" },
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
                <ClipboardList className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="font-semibold">AI-Powered Gap Resolution</h2>
                <p className="text-sm text-muted-foreground">
                  Demonstrating automated health history questionnaire completion
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
              {currentStep === "initial" && <StepInitial key="initial" />}
              {currentStep === "problem" && <StepProblem key="problem" />}
              {currentStep === "ai-outreach" && <StepOutreach key="ai-outreach" />}
              {currentStep === "response-received" && <StepResponseReceived key="response-received" />}
              {currentStep === "gap-resolved" && <StepResolved key="gap-resolved" />}
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-4 border-t bg-muted/30">
            <Button variant="outline" size="sm" onClick={handleAutoPlay}>
              <RefreshCw className="w-3 h-3 mr-2" />
              Replay Demo
            </Button>
            {currentStep === "gap-resolved" && (
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
        <h3 className="text-lg font-semibold">Health History Gap Detected</h3>
        <p className="text-sm text-muted-foreground">Questionnaire analysis complete - missing responses identified</p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-3">
              <ClipboardList className="w-4 h-4" />
              <span className="text-sm font-medium">Health History Questionnaire</span>
            </div>
            <div className="bg-muted rounded-lg p-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Applicant:</span>
                <span className="font-medium">Susan Berry</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Submitted:</span>
                <span className="font-medium">Jan 15, 2026</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Questions:</span>
                <span className="font-medium">10</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Status:</span>
                <Badge variant="destructive" className="text-xs">Incomplete</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4 space-y-3">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span className="text-sm font-medium">Gap Summary</span>
            </div>
            <QuestionStatus question="Cardiovascular history" status="answered" />
            <QuestionStatus question="Diabetes/blood sugar" status="answered" />
            <QuestionStatus question="Cancer history" status="answered" />
            <QuestionStatus question="Recent physician visits" status="needs-clarification" />
            <QuestionStatus question="Current medications" status="unanswered" />
            <QuestionStatus question="Family history" status="unanswered" />
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
        <h3 className="text-lg font-semibold">Underwriting Blocked</h3>
        <p className="text-sm text-muted-foreground">Missing health information prevents risk assessment</p>
      </div>

      <Card className="border-destructive/50 bg-destructive/5">
        <CardContent className="py-4">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-full bg-destructive/10">
              <AlertTriangle className="w-6 h-6 text-destructive" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-destructive">Critical Gap: Health History Incomplete</h4>
              <p className="text-sm text-muted-foreground mt-1">
                2 questions are unanswered and 1 response requires clarification. 
                Risk assessment cannot proceed without complete medical disclosure.
              </p>
              <div className="mt-3 space-y-2">
                <div className="p-2 bg-background rounded border border-destructive/30">
                  <p className="text-xs text-muted-foreground">Q5: Current Medications</p>
                  <p className="text-sm font-medium text-destructive">No response provided</p>
                </div>
                <div className="p-2 bg-background rounded border border-destructive/30">
                  <p className="text-xs text-muted-foreground">Q10: Family History</p>
                  <p className="text-sm font-medium text-destructive">No response provided</p>
                </div>
                <div className="p-2 bg-background rounded border border-amber-300">
                  <p className="text-xs text-muted-foreground">Q4: Physician Visits</p>
                  <p className="text-sm font-medium text-amber-600">"Yes - back pain 2022" - needs details</p>
                </div>
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
                Manual email to applicant
              </li>
              <li className="flex items-start gap-2">
                <X className="w-4 h-4 text-destructive mt-0.5" />
                Wait for applicant response
              </li>
              <li className="flex items-start gap-2">
                <X className="w-4 h-4 text-destructive mt-0.5" />
                Follow-up calls if no response
              </li>
            </ul>
            <p className="mt-3 text-amber-600 font-medium">Est. delay: 5-10 days</p>
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
                Generate personalized questionnaire
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5" />
                Multi-channel outreach (SMS + Email)
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5" />
                Auto-validate and extract responses
              </li>
            </ul>
            <p className="mt-3 text-emerald-600 font-medium">Est. time: 24-48 hours</p>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}

function StepOutreach() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-4"
    >
      <div className="text-center mb-6">
        <Badge className="mb-2 bg-purple-500">Step 3</Badge>
        <h3 className="text-lg font-semibold">AI Outreach in Progress</h3>
        <p className="text-sm text-muted-foreground">Generating personalized follow-up communication</p>
      </div>

      <Card>
        <CardContent className="py-6 space-y-6">
          <AIAnalysisStep
            icon={<Brain className="w-4 h-4" />}
            title="Analyzing Missing Information"
            description="Identifying specific questions requiring applicant response"
            result="3 items requiring follow-up identified"
            status="complete"
            delay={0}
          />
          <AIAnalysisStep
            icon={<MessageSquare className="w-4 h-4" />}
            title="Generating Personalized Questions"
            description="Creating clear, applicant-friendly follow-up prompts"
            result="Follow-up questionnaire generated"
            status="complete"
            delay={0.3}
          />
          <AIAnalysisStep
            icon={<Mail className="w-4 h-4" />}
            title="Sending Multi-Channel Outreach"
            description="Dispatching via email and SMS for faster response"
            result="Sent to susan.berry@email.com"
            status="complete"
            delay={0.6}
          />
          <AIAnalysisStep
            icon={<Sparkles className="w-4 h-4" />}
            title="Monitoring for Response"
            description="Tracking applicant engagement and response status"
            result="Response received ✓"
            status="processing"
            delay={0.9}
          />
        </CardContent>
      </Card>
    </motion.div>
  );
}

function StepResponseReceived() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-4"
    >
      <div className="text-center mb-6">
        <Badge className="mb-2 bg-blue-500">Step 4</Badge>
        <h3 className="text-lg font-semibold">Applicant Response Received</h3>
        <p className="text-sm text-muted-foreground">AI extracting and validating response data</p>
      </div>

      <Card className="border-blue-500/50 bg-blue-50/50 dark:bg-blue-950/20">
        <CardContent className="py-6">
          <div className="flex items-center gap-3 mb-4">
            <Mail className="w-5 h-5 text-blue-500" />
            <div>
              <p className="font-medium">Response from Susan Berry</p>
              <p className="text-xs text-muted-foreground">Received 2 hours after outreach</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="p-3 bg-background rounded-lg border">
              <p className="text-xs text-muted-foreground mb-1">Q5: Current Medications</p>
              <p className="text-sm">"I take Lisinopril 10mg daily for mild hypertension, prescribed in 2023."</p>
              <div className="flex items-center gap-2 mt-2">
                <CheckCircle className="w-3 h-3 text-emerald-500" />
                <span className="text-xs text-emerald-600">AI Validated: Standard antihypertensive</span>
              </div>
            </div>

            <div className="p-3 bg-background rounded-lg border">
              <p className="text-xs text-muted-foreground mb-1">Q4: Physician Visit Details</p>
              <p className="text-sm">"Saw Dr. Smith in Feb 2022 for lower back strain from gardening. Treated with physical therapy for 3 weeks. Fully resolved, no ongoing issues."</p>
              <div className="flex items-center gap-2 mt-2">
                <CheckCircle className="w-3 h-3 text-emerald-500" />
                <span className="text-xs text-emerald-600">AI Validated: Acute condition, resolved</span>
              </div>
            </div>

            <div className="p-3 bg-background rounded-lg border">
              <p className="text-xs text-muted-foreground mb-1">Q10: Family History</p>
              <p className="text-sm">"Father had Type 2 diabetes diagnosed at age 65. Mother healthy, no significant conditions."</p>
              <div className="flex items-center gap-2 mt-2">
                <CheckCircle className="w-3 h-3 text-emerald-500" />
                <span className="text-xs text-emerald-600">AI Validated: Late-onset family history noted</span>
              </div>
            </div>
          </div>
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
        <Badge className="mb-2 bg-emerald-500">Step 5</Badge>
        <h3 className="text-lg font-semibold">Health History Gap Resolved</h3>
        <p className="text-sm text-muted-foreground">All questions answered - ready for underwriting</p>
      </div>

      <Card className="border-emerald-500/50 bg-emerald-50/50 dark:bg-emerald-950/20">
        <CardContent className="py-6">
          <div className="flex items-center justify-center gap-8">
            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-2">BEFORE</p>
              <div className="p-4 bg-background rounded-lg border border-destructive/30">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <AlertTriangle className="w-4 h-4 text-destructive" />
                    <span>2 Unanswered</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    <span>1 Needs Clarification</span>
                  </div>
                </div>
                <p className="text-xs text-destructive mt-3">Blocked</p>
              </div>
            </div>

            <ArrowRight className="w-8 h-8 text-emerald-500" />

            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-2">AFTER (AI RESOLVED)</p>
              <div className="p-4 bg-background rounded-lg border border-emerald-500/30">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    <span>10/10 Answered</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    <span>All Validated</span>
                  </div>
                </div>
                <p className="text-xs text-emerald-600 mt-3 flex items-center justify-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Ready for Review
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
                <p className="text-muted-foreground">Outreach Channels</p>
                <p className="font-medium">Email + SMS</p>
              </div>
              <div>
                <p className="text-muted-foreground">Response Time</p>
                <p className="font-medium">2 hours</p>
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

function QuestionStatus({ question, status }: { question: string; status: "answered" | "unanswered" | "needs-clarification" }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted-foreground truncate">{question}</span>
      {status === "answered" && <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />}
      {status === "unanswered" && <AlertTriangle className="w-4 h-4 text-destructive flex-shrink-0" />}
      {status === "needs-clarification" && <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" />}
    </div>
  );
}

function AIAnalysisStep({
  icon,
  title,
  description,
  result,
  status,
  delay,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  result: string;
  status: "complete" | "processing";
  delay: number;
}) {
  const [visible, setVisible] = useState(false);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay * 1000);
    return () => clearTimeout(timer);
  }, [delay]);

  useEffect(() => {
    if (visible && status === "complete") {
      const timer = setTimeout(() => setShowResult(true), 800);
      return () => clearTimeout(timer);
    }
  }, [visible, status]);

  if (!visible) return <div className="h-16" />;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-start gap-4"
    >
      <div className={cn(
        "p-2 rounded-lg",
        status === "complete" ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-primary/10 text-primary"
      )}>
        {icon}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <h4 className="font-medium text-sm">{title}</h4>
          {status === "complete" && showResult && (
            <CheckCircle className="w-4 h-4 text-emerald-500" />
          )}
        </div>
        <p className="text-xs text-muted-foreground">{description}</p>
        {showResult && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs font-medium text-emerald-600 mt-1"
          >
            {result}
          </motion.p>
        )}
        {status === "processing" && !showResult && (
          <Progress className="h-1 mt-2" value={65} />
        )}
      </div>
    </motion.div>
  );
}
