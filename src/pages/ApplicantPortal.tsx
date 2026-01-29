import { motion } from "framer-motion";
import { CheckCircle2, Clock, FileText, Shield, Activity, TrendingUp, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import pacificLifeLogo from "@/assets/pacific-life-logo.svg";
import humpbackWhale from "@/assets/humpback-whale.jpg";

// Simple 4-stage journey for applicants
const journeyStages = [
  { id: 1, label: "App Submitted", icon: FileText },
  { id: 2, label: "In Review", icon: Clock },
  { id: 3, label: "In Underwriting", icon: Shield },
  { id: 4, label: "Policy Issued", icon: CheckCircle2 },
];

// Mock applicant data
const applicantData = {
  name: "Robert K. Williams",
  applicationId: "APP-2024-003",
  submittedDate: "January 15, 2024",
  currentStage: 3,
  estimatedCompletion: "January 28, 2024",
  policyType: "Term Life - 20 Year",
  coverageAmount: "$500,000",
};

// Status metrics with sparkline-style indicators
const statusMetrics = [
  { 
    label: "Application Completeness", 
    value: 92, 
    trend: "up",
    color: "hsl(var(--destructive))",
    data: [60, 70, 75, 85, 88, 92]
  },
  { 
    label: "Document Verification", 
    value: 85, 
    trend: "up",
    color: "hsl(var(--success))",
    data: [40, 55, 65, 75, 80, 85]
  },
  { 
    label: "Medical Review", 
    value: 70, 
    trend: "stable",
    color: "hsl(var(--secondary))",
    data: [50, 55, 60, 65, 68, 70]
  },
  { 
    label: "Risk Assessment", 
    value: 45, 
    trend: "up",
    color: "hsl(var(--success))",
    data: [10, 20, 28, 35, 40, 45]
  },
];

// Mini sparkline component
function Sparkline({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const width = 80;
  const height = 24;
  
  const points = data.map((value, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((value - min) / range) * height;
    return `${x},${y}`;
  }).join(" ");

  return (
    <svg width={width} height={height} className="overflow-visible">
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx={(data.length - 1) / (data.length - 1) * width}
        cy={height - ((data[data.length - 1] - min) / range) * height}
        r={3}
        fill={color}
      />
    </svg>
  );
}

export default function ApplicantPortal() {
  const currentStage = applicantData.currentStage;
  const progressPercent = ((currentStage - 1) / (journeyStages.length - 1)) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      {/* Header with whale background */}
      <header 
        className="relative border-b bg-card/80 backdrop-blur-sm overflow-hidden"
        style={{
          backgroundImage: `url(${humpbackWhale})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-card via-card/95 to-card/80" />
        <div className="relative container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src={pacificLifeLogo} alt="Pacific Life" className="h-10" />
            <div>
              <h1 className="text-xl font-semibold text-foreground">My Application</h1>
              <p className="text-sm text-muted-foreground">Track your policy journey</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-foreground">{applicantData.name}</p>
            <p className="text-xs text-muted-foreground">{applicantData.applicationId}</p>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 space-y-8">
        {/* Journey Tracker - Horizontal Timeline */}
        <Card className="overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Application Journey
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="relative">
              {/* Progress track */}
              <div className="absolute top-6 left-0 right-0 h-1 bg-muted rounded-full mx-12">
                <motion.div 
                  className="h-full bg-primary rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>

              {/* Stages */}
              <div className="relative flex justify-between items-start px-4">
                {journeyStages.map((stage, index) => {
                  const isComplete = index + 1 < currentStage;
                  const isCurrent = index + 1 === currentStage;
                  const StageIcon = stage.icon;

                  return (
                    <div key={stage.id} className="flex flex-col items-center gap-2 z-10">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: index * 0.15, type: "spring" }}
                        className={`
                          w-12 h-12 rounded-full flex items-center justify-center
                          ${isComplete 
                            ? "bg-success text-success-foreground" 
                            : isCurrent 
                              ? "bg-primary text-primary-foreground ring-4 ring-primary/20" 
                              : "bg-muted text-muted-foreground"
                          }
                        `}
                      >
                        {isComplete ? (
                          <CheckCircle2 className="h-6 w-6" />
                        ) : (
                          <StageIcon className="h-5 w-5" />
                        )}
                      </motion.div>
                      <span className={`text-xs font-medium text-center max-w-[80px] ${
                        isCurrent ? "text-primary" : isComplete ? "text-foreground" : "text-muted-foreground"
                      }`}>
                        {stage.label}
                      </span>
                      {isCurrent && (
                        <Badge variant="secondary" className="text-[10px] animate-pulse">
                          Current
                        </Badge>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Whale indicator swimming along the track */}
              <motion.div
                className="absolute top-2 z-20"
                initial={{ left: "3%" }}
                animate={{ left: `${Math.max(3, Math.min(progressPercent - 2, 90))}%` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              >
                <motion.img
                  src={humpbackWhale}
                  alt="Progress"
                  className="w-10 h-6 object-cover rounded-full border-2 border-primary shadow-lg"
                  animate={{ y: [0, -3, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.div>
            </div>

            {/* Estimated completion */}
            <div className="mt-8 p-4 bg-muted/50 rounded-lg flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Estimated Completion</p>
                <p className="font-semibold text-foreground">{applicantData.estimatedCompletion}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Submitted</p>
                <p className="font-medium text-foreground">{applicantData.submittedDate}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Two-column layout: Details + Status Metrics */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Application Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Application Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Policy Type</p>
                  <p className="font-medium">{applicantData.policyType}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Coverage Amount</p>
                  <p className="font-medium">{applicantData.coverageAmount}</p>
                </div>
              </div>

              <div className="pt-4 border-t space-y-3">
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <Clock className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">In Underwriting Review</p>
                    <p className="text-xs text-muted-foreground">Your application is being reviewed by our underwriting team</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-secondary/10 rounded-lg border border-secondary/20">
                  <div className="p-2 bg-secondary/20 rounded-full">
                    <AlertCircle className="h-4 w-4 text-secondary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Action Needed</p>
                    <p className="text-xs text-muted-foreground">Please upload a copy of your driver's license</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Status Metrics with Sparklines */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Progress Indicators
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {statusMetrics.map((metric, index) => (
                <motion.div
                  key={metric.label}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-4 p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{metric.label}</p>
                    <Progress value={metric.value} className="h-1.5 mt-2" />
                  </div>
                  <div className="flex items-center gap-3">
                    <Sparkline data={metric.data} color={metric.color} />
                    <span className="text-sm font-semibold w-10 text-right">{metric.value}%</span>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Footer info */}
        <div className="text-center text-sm text-muted-foreground">
          <p>Questions about your application? Call us at 1-800-PACIFIC or email support@pacificlife.com</p>
        </div>
      </main>
    </div>
  );
}
