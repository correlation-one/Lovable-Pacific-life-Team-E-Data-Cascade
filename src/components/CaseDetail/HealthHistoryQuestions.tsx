import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  ClipboardList, 
  CheckCircle2, 
  AlertCircle,
  Clock
} from "lucide-react";
import { cn } from "@/lib/utils";

interface HealthHistoryQuestionsProps {
  isOpen: boolean;
  onClose: () => void;
}

interface HealthQuestion {
  id: string;
  question: string;
  category: string;
  status: "answered" | "unanswered" | "needs-clarification";
  answer?: string;
}

const healthQuestions: HealthQuestion[] = [
  {
    id: "HQ-001",
    question: "Have you ever been diagnosed with or treated for heart disease, high blood pressure, or any cardiovascular condition?",
    category: "Cardiovascular",
    status: "answered",
    answer: "No"
  },
  {
    id: "HQ-002",
    question: "Have you ever been diagnosed with or treated for diabetes or elevated blood sugar?",
    category: "Metabolic",
    status: "answered",
    answer: "No"
  },
  {
    id: "HQ-003",
    question: "Have you ever been diagnosed with or treated for cancer, tumor, or any malignancy?",
    category: "Oncology",
    status: "answered",
    answer: "No"
  },
  {
    id: "HQ-004",
    question: "In the past 5 years, have you consulted a physician for any illness or injury requiring treatment for more than 7 days?",
    category: "General Health",
    status: "needs-clarification",
    answer: "Yes - back pain 2022"
  },
  {
    id: "HQ-005",
    question: "Are you currently taking any prescription medications?",
    category: "Medications",
    status: "unanswered"
  },
  {
    id: "HQ-006",
    question: "Have you ever been advised to have surgery that has not yet been performed?",
    category: "Surgical History",
    status: "answered",
    answer: "No"
  },
  {
    id: "HQ-007",
    question: "Have you ever been treated for or diagnosed with any mental health condition including anxiety or depression?",
    category: "Mental Health",
    status: "answered",
    answer: "No"
  },
  {
    id: "HQ-008",
    question: "Have you used tobacco or nicotine products in the past 12 months?",
    category: "Lifestyle",
    status: "answered",
    answer: "No"
  },
  {
    id: "HQ-009",
    question: "What is your current height and weight?",
    category: "Biometrics",
    status: "needs-clarification",
    answer: "5'8\" - weight not provided"
  },
  {
    id: "HQ-010",
    question: "Do you have any family history of heart disease, stroke, diabetes, or cancer before age 60?",
    category: "Family History",
    status: "unanswered"
  },
];

const statusConfig = {
  answered: {
    icon: CheckCircle2,
    label: "Answered",
    className: "bg-emerald-100 text-emerald-700 border-emerald-300"
  },
  unanswered: {
    icon: AlertCircle,
    label: "Unanswered",
    className: "bg-red-100 text-red-700 border-red-300"
  },
  "needs-clarification": {
    icon: Clock,
    label: "Needs Clarification",
    className: "bg-amber-100 text-amber-700 border-amber-300"
  }
};

export function HealthHistoryQuestions({ isOpen, onClose }: HealthHistoryQuestionsProps) {
  const answered = healthQuestions.filter(q => q.status === "answered").length;
  const unanswered = healthQuestions.filter(q => q.status === "unanswered").length;
  const needsClarification = healthQuestions.filter(q => q.status === "needs-clarification").length;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl h-[80vh] flex flex-col p-0">
        <DialogHeader className="px-6 py-4 border-b flex-shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-primary" />
              Health History Questionnaire
            </DialogTitle>
          </div>
          <div className="flex items-center gap-3 mt-2">
            <Badge variant="outline" className="gap-1 text-emerald-600">
              <CheckCircle2 className="w-3 h-3" />
              {answered} Answered
            </Badge>
            <Badge variant="outline" className="gap-1 text-red-600">
              <AlertCircle className="w-3 h-3" />
              {unanswered} Unanswered
            </Badge>
            <Badge variant="outline" className="gap-1 text-amber-600">
              <Clock className="w-3 h-3" />
              {needsClarification} Need Clarification
            </Badge>
          </div>
        </DialogHeader>
        
        <ScrollArea className="flex-1 px-6 py-4">
          <div className="space-y-4">
            {healthQuestions.map((q, index) => {
              const config = statusConfig[q.status];
              const StatusIcon = config.icon;
              
              return (
                <div
                  key={q.id}
                  className={cn(
                    "rounded-lg border p-4 transition-all",
                    q.status === "unanswered" && "border-l-4 border-l-red-500",
                    q.status === "needs-clarification" && "border-l-4 border-l-amber-500"
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs text-muted-foreground font-mono">
                          Q{index + 1}
                        </span>
                        <Badge variant="outline" className="text-[10px]">
                          {q.category}
                        </Badge>
                        <Badge className={cn("text-[10px]", config.className)}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {config.label}
                        </Badge>
                      </div>
                      <p className="text-sm">{q.question}</p>
                      {q.answer && (
                        <div className="mt-2 bg-muted/50 rounded px-3 py-2">
                          <span className="text-xs text-muted-foreground">Response: </span>
                          <span className="text-sm font-medium">{q.answer}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
