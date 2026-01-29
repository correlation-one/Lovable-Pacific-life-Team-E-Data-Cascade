import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  Filter,
  Clock,
  AlertTriangle,
  User,
  Users,
  ChevronRight,
} from "lucide-react";
import { Case, JOURNEY_STAGES, Priority, StageStatus } from "@/types/case";
import { cn } from "@/lib/utils";
import { formatDistanceToNow, parseISO, isPast } from "date-fns";

interface WorkQueueProps {
  cases: Case[];
  onSelectCase: (caseId: string) => void;
}

const priorityColors: Record<Priority, string> = {
  low: "bg-slate-100 text-slate-700",
  medium: "bg-blue-100 text-blue-700",
  high: "bg-amber-100 text-amber-700",
  urgent: "bg-red-100 text-red-700",
};

const statusColors: Record<StageStatus, string> = {
  "not-started": "bg-muted text-muted-foreground",
  "in-progress": "bg-primary/10 text-primary",
  blocked: "bg-destructive/10 text-destructive",
  completed: "bg-emerald-100 text-emerald-700",
};

export function WorkQueue({ cases, onSelectCase }: WorkQueueProps) {
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredCases = cases.filter((c) => {
    const matchesSearch =
      c.applicantName.toLowerCase().includes(search.toLowerCase()) ||
      c.id.toLowerCase().includes(search.toLowerCase());
    const matchesStage = stageFilter === "all" || c.stage.toString() === stageFilter;
    const matchesStatus = statusFilter === "all" || c.stageStatus === statusFilter;
    return matchesSearch && matchesStage && matchesStatus;
  });

  const myCases = filteredCases.filter((c) => c.assignedTo !== "System");
  const teamCases = filteredCases;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Work Queue</h1>
        <p className="text-muted-foreground text-sm">
          Manage and process underwriting cases
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or case ID..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <Select value={stageFilter} onValueChange={setStageFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by stage" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stages</SelectItem>
                {Object.entries(JOURNEY_STAGES).map(([num, name]) => (
                  <SelectItem key={num} value={num}>
                    Stage {num}: {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="blocked">Blocked</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Total Cases</p>
                <p className="text-2xl font-bold">{cases.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-destructive/30">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Blocked</p>
                <p className="text-2xl font-bold text-destructive">
                  {cases.filter((c) => c.stageStatus === "blocked").length}
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-destructive" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-amber-500/30">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">SLA At Risk</p>
                <p className="text-2xl font-bold text-amber-600">
                  {cases.filter((c) => isPast(parseISO(c.slaDue))).length}
                </p>
              </div>
              <Clock className="w-8 h-8 text-amber-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-emerald-500/30">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Decision Ready</p>
                <p className="text-2xl font-bold text-emerald-600">
                  {cases.filter((c) => c.stage === 8).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Case Tabs */}
      <Tabs defaultValue="team" className="w-full">
        <TabsList>
          <TabsTrigger value="my" className="gap-2">
            <User className="w-4 h-4" />
            My Cases ({myCases.length})
          </TabsTrigger>
          <TabsTrigger value="team" className="gap-2">
            <Users className="w-4 h-4" />
            Team Queue ({teamCases.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="my">
          <CaseTable cases={myCases} onSelectCase={onSelectCase} />
        </TabsContent>

        <TabsContent value="team">
          <CaseTable cases={teamCases} onSelectCase={onSelectCase} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function CaseTable({
  cases,
  onSelectCase,
}: {
  cases: Case[];
  onSelectCase: (id: string) => void;
}) {
  return (
    <Card>
      <CardContent className="pt-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Case ID</TableHead>
              <TableHead>Applicant</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Stage</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>SLA</TableHead>
              <TableHead>Assigned</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cases.map((c) => {
              const slaAtRisk = isPast(parseISO(c.slaDue));
              return (
                <TableRow
                  key={c.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => onSelectCase(c.id)}
                >
                  <TableCell className="font-mono text-xs">{c.id}</TableCell>
                  <TableCell className="font-medium">{c.applicantName}</TableCell>
                  <TableCell className="text-sm">{c.productType}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {c.stage}. {JOURNEY_STAGES[c.stage].split(" ").slice(0, 2).join(" ")}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={cn("capitalize text-xs", statusColors[c.stageStatus])}>
                      {c.stageStatus.replace("-", " ")}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={cn("capitalize text-xs", priorityColors[c.priority])}>
                      {c.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className={cn("text-xs", slaAtRisk && "text-destructive font-medium")}>
                      {formatDistanceToNow(parseISO(c.slaDue), { addSuffix: true })}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm">{c.assignedTo}</TableCell>
                  <TableCell>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
