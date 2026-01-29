import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Lightbulb,
  AlertTriangle,
  Users,
  StickyNote,
  ChevronRight,
  Clock,
} from "lucide-react";
import { NextBestAction, Blocker, Priority, UserRole } from "@/types/case";
import { cn } from "@/lib/utils";
import { format, parseISO } from "date-fns";

interface RightRailProps {
  nextBestActions: NextBestAction[];
  blockers: Blocker[];
  watchers: string[];
  notes: string[];
  onActionClick?: (action: NextBestAction) => void;
  onBlockerClick?: (blocker: Blocker) => void;
}

const priorityColors: Record<Priority, string> = {
  low: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  medium: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  high: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
  urgent: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
};

const roleLabels: Record<UserRole, string> = {
  "case-manager": "CM",
  "evidence-team": "EV",
  underwriter: "UW",
  admin: "Admin",
};

export function RightRail({
  nextBestActions,
  blockers,
  watchers,
  notes,
  onActionClick,
  onBlockerClick,
}: RightRailProps) {
  return (
    <div className="space-y-4">
      {/* Next Best Actions */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-amber-500" />
            Next Best Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {nextBestActions.length === 0 ? (
            <p className="text-xs text-muted-foreground">
              No actions required at this time.
            </p>
          ) : (
            nextBestActions.map((action) => (
              <Button
                key={action.id}
                variant="ghost"
                className="w-full justify-between h-auto py-2 px-3 text-left"
                onClick={() => onActionClick?.(action)}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">{action.action}</p>
                  {action.dueDate && (
                    <p className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3" />
                      Due: {action.dueDate}
                    </p>
                  )}
                </div>
                <Badge className={cn("ml-2 text-[10px]", priorityColors[action.priority])}>
                  {action.priority}
                </Badge>
              </Button>
            ))
          )}
        </CardContent>
      </Card>

      {/* Blockers */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-destructive" />
            Blockers
            {blockers.length > 0 && (
              <Badge variant="destructive" className="text-[10px] ml-auto">
                {blockers.length}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {blockers.length === 0 ? (
            <p className="text-xs text-muted-foreground">No active blockers.</p>
          ) : (
            <ScrollArea className="max-h-[200px]">
              <div className="space-y-2">
                {blockers.map((blocker) => (
                  <div
                    key={blocker.id}
                    className="p-2 rounded-lg bg-destructive/5 border border-destructive/20 cursor-pointer hover:bg-destructive/10 transition-colors"
                    onClick={() => onBlockerClick?.(blocker)}
                  >
                    <p className="text-xs font-medium text-foreground">
                      {blocker.description}
                    </p>
                    <div className="flex items-center justify-between mt-1.5">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-[10px] h-5">
                          {roleLabels[blocker.ownerTeam]}
                        </Badge>
                        <span className="text-[10px] text-muted-foreground">
                          {blocker.owner}
                        </span>
                      </div>
                      <span className="text-[10px] text-muted-foreground">
                        Due: {format(parseISO(blocker.dueDate), "MMM d")}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      {/* Watchers/Stakeholders */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Users className="w-4 h-4 text-muted-foreground" />
            Watchers
          </CardTitle>
        </CardHeader>
        <CardContent>
          {watchers.length === 0 ? (
            <p className="text-xs text-muted-foreground">No watchers added.</p>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {watchers.map((watcher, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {watcher}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Internal Notes */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <StickyNote className="w-4 h-4 text-muted-foreground" />
            Notes
          </CardTitle>
        </CardHeader>
        <CardContent>
          {notes.length === 0 ? (
            <p className="text-xs text-muted-foreground">No internal notes.</p>
          ) : (
            <ScrollArea className="max-h-[150px]">
              <div className="space-y-2">
                {notes.map((note, index) => (
                  <div
                    key={index}
                    className="p-2 rounded bg-muted text-xs text-foreground"
                  >
                    {note}
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
          <Button variant="ghost" size="sm" className="w-full mt-2 text-xs">
            Add Note
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
