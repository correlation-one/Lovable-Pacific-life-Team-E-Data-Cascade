import { motion } from "framer-motion";
import { 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  XCircle,
  ArrowRight,
  Database,
  FileText,
  Users,
  Building2,
  Car,
  Shield,
  Brain,
  Send,
  RefreshCw
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

type HandoffStatus = "complete" | "pending" | "missing" | "error" | "in-progress";

interface DataSource {
  id: string;
  name: string;
  icon: React.ElementType;
  status: HandoffStatus;
  lastUpdated?: string;
  missingFields?: string[];
  dataPoints?: number;
  receivedPoints?: number;
}

interface ProcessStage {
  id: string;
  name: string;
  status: HandoffStatus;
  owner: string;
  waitingOn?: string;
  completedAt?: string;
  aiAssisted?: boolean;
}

const statusConfig: Record<HandoffStatus, { icon: React.ElementType; color: string; bg: string; label: string }> = {
  complete: { icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/10", label: "Complete" },
  pending: { icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10", label: "Pending" },
  missing: { icon: AlertCircle, color: "text-orange-500", bg: "bg-orange-500/10", label: "Missing Data" },
  error: { icon: XCircle, color: "text-destructive", bg: "bg-destructive/10", label: "Error" },
  "in-progress": { icon: RefreshCw, color: "text-primary", bg: "bg-primary/10", label: "In Progress" },
};

// Mock data - would come from API in real implementation
const upstreamSources: DataSource[] = [
  {
    id: "crm",
    name: "CRM / Sales System",
    icon: Users,
    status: "complete",
    lastUpdated: "2 min ago",
    dataPoints: 12,
    receivedPoints: 12,
  },
  {
    id: "application",
    name: "Application Portal",
    icon: FileText,
    status: "complete",
    lastUpdated: "5 min ago",
    dataPoints: 45,
    receivedPoints: 45,
  },
  {
    id: "mvr",
    name: "MVR Provider (LexisNexis)",
    icon: Car,
    status: "error",
    lastUpdated: "10 min ago",
    missingFields: ["Driver License State Mismatch", "Unable to locate record"],
    dataPoints: 8,
    receivedPoints: 0,
  },
  {
    id: "mib",
    name: "MIB Check",
    icon: Database,
    status: "pending",
    dataPoints: 5,
    receivedPoints: 0,
  },
  {
    id: "rx",
    name: "Rx Database",
    icon: Database,
    status: "complete",
    lastUpdated: "8 min ago",
    dataPoints: 15,
    receivedPoints: 15,
  },
  {
    id: "aps",
    name: "APS (Attending Physician)",
    icon: FileText,
    status: "pending",
    missingFields: ["Awaiting physician response"],
    dataPoints: 20,
    receivedPoints: 0,
  },
];

const processStages: ProcessStage[] = [
  { id: "intake", name: "Application Intake", status: "complete", owner: "Agent", completedAt: "Jan 28, 10:15 AM" },
  { id: "validation", name: "AI Auto-Validation", status: "complete", owner: "System", completedAt: "Jan 28, 10:15 AM", aiAssisted: true },
  { id: "evidence", name: "Evidence Ordering", status: "complete", owner: "System", completedAt: "Jan 28, 10:16 AM", aiAssisted: true },
  { id: "mvr-retrieval", name: "MVR Retrieval", status: "error", owner: "LexisNexis", waitingOn: "Corrected DL data" },
  { id: "gap-detection", name: "Gap Detection", status: "complete", owner: "System", completedAt: "Jan 28, 10:20 AM", aiAssisted: true },
  { id: "client-outreach", name: "Client Notification", status: "complete", owner: "System", completedAt: "Jan 28, 10:21 AM", aiAssisted: true },
  { id: "doc-upload", name: "Document Upload", status: "in-progress", owner: "Client", waitingOn: "Client response" },
  { id: "doc-review", name: "Document Review (OCR)", status: "pending", owner: "System", aiAssisted: true },
  { id: "data-correction", name: "Data Correction", status: "pending", owner: "System", aiAssisted: true },
  { id: "mvr-reorder", name: "MVR Re-Order", status: "pending", owner: "System", aiAssisted: true },
  { id: "uw-review", name: "Underwriting Review", status: "pending", owner: "Underwriter" },
  { id: "decision", name: "Decision", status: "pending", owner: "Underwriter", aiAssisted: true },
];

const downstreamDestinations: DataSource[] = [
  {
    id: "policy-admin",
    name: "Policy Admin System",
    icon: Building2,
    status: "pending",
    dataPoints: 30,
    receivedPoints: 0,
  },
  {
    id: "reinsurance",
    name: "Reinsurance Portal",
    icon: Shield,
    status: "pending",
    dataPoints: 12,
    receivedPoints: 0,
  },
  {
    id: "billing",
    name: "Billing System",
    icon: Database,
    status: "pending",
    dataPoints: 8,
    receivedPoints: 0,
  },
  {
    id: "agent-portal",
    name: "Agent Portal",
    icon: Send,
    status: "pending",
    dataPoints: 5,
    receivedPoints: 0,
  },
];

function StatusBadge({ status }: { status: HandoffStatus }) {
  const config = statusConfig[status];
  const Icon = config.icon;
  
  return (
    <Badge variant="outline" className={`${config.bg} ${config.color} border-0 gap-1`}>
      <Icon size={12} className={status === "in-progress" ? "animate-spin" : ""} />
      {config.label}
    </Badge>
  );
}

function DataSourceCard({ source }: { source: DataSource }) {
  const Icon = source.icon;
  const progress = source.dataPoints ? (source.receivedPoints || 0) / source.dataPoints * 100 : 0;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-3 bg-card border border-border rounded-lg hover:border-primary/30 transition-colors"
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-muted">
            <Icon size={14} className="text-muted-foreground" />
          </div>
          <span className="text-sm font-medium">{source.name}</span>
        </div>
        <StatusBadge status={source.status} />
      </div>
      
      {source.dataPoints && (
        <div className="mb-2">
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>Data Points</span>
            <span>{source.receivedPoints || 0}/{source.dataPoints}</span>
          </div>
          <Progress value={progress} className="h-1.5" />
          {(source.receivedPoints || 0) > 0 && (
            <div className="flex items-center gap-1 mt-1.5 text-[10px] text-primary">
              <Send size={8} className="animate-pulse" />
              <span>Status synced to tracking dashboard</span>
            </div>
          )}
        </div>
      )}
      
      {source.lastUpdated && (
        <p className="text-xs text-muted-foreground">Updated {source.lastUpdated}</p>
      )}
      
      {source.missingFields && source.missingFields.length > 0 && (
        <div className="mt-2 p-2 bg-destructive/5 rounded border border-destructive/20">
          <p className="text-xs font-medium text-destructive mb-1">Issues:</p>
          <ul className="text-xs text-destructive/80 space-y-0.5">
            {source.missingFields.map((field, i) => (
              <li key={i}>• {field}</li>
            ))}
          </ul>
        </div>
      )}
    </motion.div>
  );
}

function ProcessTimeline({ stages }: { stages: ProcessStage[] }) {
  const currentStageIndex = stages.findIndex(s => s.status === "in-progress" || s.status === "error");
  
  return (
    <div className="space-y-1">
      {stages.map((stage, index) => {
        const config = statusConfig[stage.status];
        const Icon = config.icon;
        const isActive = index === currentStageIndex;
        
        return (
          <motion.div
            key={stage.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${
              isActive ? "bg-muted" : "hover:bg-muted/50"
            }`}
          >
            <div className={`p-1 rounded-full ${config.bg}`}>
              <Icon size={12} className={`${config.color} ${stage.status === "in-progress" ? "animate-spin" : ""}`} />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium truncate">{stage.name}</span>
                {stage.aiAssisted && (
                  <Brain size={12} className="text-purple-500 flex-shrink-0" />
                )}
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>{stage.owner}</span>
                {stage.completedAt && <span>• {stage.completedAt}</span>}
                {stage.waitingOn && (
                  <span className="text-amber-500">• Waiting: {stage.waitingOn}</span>
                )}
              </div>
            </div>
            
            <StatusBadge status={stage.status} />
          </motion.div>
        );
      })}
    </div>
  );
}

export function HandoffDashboard() {
  const completedStages = processStages.filter(s => s.status === "complete").length;
  const totalStages = processStages.length;
  const overallProgress = (completedStages / totalStages) * 100;
  
  const upstreamComplete = upstreamSources.filter(s => s.status === "complete").length;
  const upstreamWithIssues = upstreamSources.filter(s => s.status === "error" || s.status === "missing").length;
  
  return (
    <div className="space-y-6">
      {/* Dashboard Status Banner */}
      <Card className="border-primary/30 bg-primary/5">
        <CardContent className="py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-primary/10">
                <RefreshCw size={16} className="text-primary animate-spin" style={{ animationDuration: '3s' }} />
              </div>
              <div>
                <p className="text-sm font-medium">Real-Time Tracking Dashboard</p>
                <p className="text-xs text-muted-foreground">
                  Each data point receipt automatically syncs status to this dashboard
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Live</span>
              </div>
              <span>•</span>
              <span>Last sync: Just now</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Header */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Case Progress</p>
                <p className="text-2xl font-bold">{Math.round(overallProgress)}%</p>
              </div>
              <Progress value={overallProgress} className="w-16 h-16 [&>div]:rounded-full" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Data Sources</p>
                <p className="text-2xl font-bold">{upstreamComplete}/{upstreamSources.length}</p>
              </div>
              <Database className="text-muted-foreground" size={24} />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {upstreamWithIssues > 0 && (
                <span className="text-destructive">{upstreamWithIssues} with issues</span>
              )}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Current Stage</p>
                <p className="text-lg font-bold">Document Upload</p>
              </div>
              <Clock className="text-amber-500" size={24} />
            </div>
            <p className="text-xs text-muted-foreground mt-1">Waiting on client</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Blocking Issue</p>
                <p className="text-lg font-bold text-destructive">MVR Failed</p>
              </div>
              <AlertCircle className="text-destructive" size={24} />
            </div>
            <p className="text-xs text-muted-foreground mt-1">DL state mismatch</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upstream Sources */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <ArrowRight size={16} className="text-primary rotate-180" />
              Upstream Data Sources
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 max-h-[500px] overflow-y-auto">
            {upstreamSources.map(source => (
              <DataSourceCard key={source.id} source={source} />
            ))}
          </CardContent>
        </Card>
        
        {/* Process Timeline */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <RefreshCw size={16} className="text-primary" />
              Process Stages
            </CardTitle>
          </CardHeader>
          <CardContent className="max-h-[500px] overflow-y-auto">
            <ProcessTimeline stages={processStages} />
          </CardContent>
        </Card>
        
        {/* Downstream Destinations */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <ArrowRight size={16} className="text-primary" />
              Downstream Destinations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 max-h-[500px] overflow-y-auto">
            {downstreamDestinations.map(dest => (
              <DataSourceCard key={dest.id} source={dest} />
            ))}
            
            <div className="mt-4 p-3 bg-muted/50 rounded-lg border border-dashed border-border">
              <p className="text-xs text-muted-foreground text-center">
                Downstream handoffs will activate once underwriting decision is complete
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Action Required Section */}
      <Card className="border-amber-500/30 bg-amber-500/5">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2 text-amber-600">
            <AlertCircle size={16} />
            Action Required
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3 bg-card rounded-lg border border-border">
              <div className="flex items-center gap-2 mb-2">
                <XCircle size={14} className="text-destructive" />
                <span className="text-sm font-medium">MVR Retrieval Failed</span>
              </div>
              <p className="text-xs text-muted-foreground mb-2">
                Driver's license state (SC) doesn't match actual state (NC). Client notified to upload correct documentation.
              </p>
              <Badge variant="outline" className="text-xs">Waiting: Client Document Upload</Badge>
            </div>
            
            <div className="p-3 bg-card rounded-lg border border-border">
              <div className="flex items-center gap-2 mb-2">
                <Clock size={14} className="text-amber-500" />
                <span className="text-sm font-medium">APS Pending</span>
              </div>
              <p className="text-xs text-muted-foreground mb-2">
                Attending Physician Statement requested. Typically takes 5-10 business days.
              </p>
              <Badge variant="outline" className="text-xs">Requested: Jan 28, 2025</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
