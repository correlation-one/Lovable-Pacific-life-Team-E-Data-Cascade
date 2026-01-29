import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Play,
  AlertTriangle,
  CheckCircle,
  Send,
  FileText,
  ChevronRight,
  Zap,
  Sparkles,
  RotateCcw,
} from "lucide-react";
import { useState } from "react";

interface DemoControlsProps {
  caseId: string;
  demoCompleted?: boolean;
  onToggleMissingDemographics: (missing: boolean) => void;
  onVerifyDemographics: () => void;
  onOrderEvidence: () => void;
  onToggleEvidenceFailure: (failed: boolean) => void;
  onReceiveEvidence: () => void;
  onCloseGap: () => void;
  onAdvanceStage: () => void;
  onSendNotification: (type: string) => void;
  onShowAIReconciliation?: () => void;
  onResetDemo?: () => void;
}

export function DemoControls({
  caseId,
  demoCompleted,
  onToggleMissingDemographics,
  onVerifyDemographics,
  onOrderEvidence,
  onToggleEvidenceFailure,
  onReceiveEvidence,
  onCloseGap,
  onAdvanceStage,
  onSendNotification,
  onShowAIReconciliation,
  onResetDemo,
}: DemoControlsProps) {
  const [missingDemo, setMissingDemo] = useState(false);
  const [evidenceFailed, setEvidenceFailed] = useState(false);

  return (
    <Card className="border-dashed border-2 border-primary/30 bg-primary/5">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Zap className="w-4 h-4 text-primary" />
          Demo Controls
          <Badge variant="outline" className="ml-auto text-[10px]">
            For Stakeholder Demos
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Reset Button - Always visible at top */}
        {onResetDemo && (
          <Button
            onClick={() => {
              setMissingDemo(false);
              setEvidenceFailed(false);
              onResetDemo();
            }}
            variant="outline"
            className="w-full border-amber-500 text-amber-600 hover:bg-amber-50"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset Demo
          </Button>
        )}

        {/* Success State */}
        {demoCompleted && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 text-center">
            <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
            <p className="text-sm font-medium text-emerald-700">Demo Complete!</p>
            <p className="text-xs text-emerald-600 mt-1">All components are now green</p>
          </div>
        )}

        {!demoCompleted && (
          <>
            {/* Featured Demo Button */}
            {onShowAIReconciliation && (
              <Button
                onClick={onShowAIReconciliation}
                className="w-full bg-gradient-to-r from-purple-600 to-primary hover:from-purple-700 hover:to-primary/90"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                AI Document Reconciliation Demo
              </Button>
            )}

            <Separator />

            {/* Toggle Controls */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="missing-demo" className="text-xs">
                  Missing Demographic Info
                </Label>
                <Switch
                  id="missing-demo"
                  checked={missingDemo}
                  onCheckedChange={(checked) => {
                    setMissingDemo(checked);
                    onToggleMissingDemographics(checked);
                  }}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="evidence-fail" className="text-xs">
                  Evidence Order Failure
                </Label>
                <Switch
                  id="evidence-fail"
                  checked={evidenceFailed}
                  onCheckedChange={(checked) => {
                    setEvidenceFailed(checked);
                    onToggleEvidenceFailure(checked);
                  }}
                />
              </div>
            </div>

            <Separator />

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <Button size="sm" variant="outline" className="text-xs h-8" onClick={onVerifyDemographics}>
                <CheckCircle className="w-3 h-3 mr-1" />
                Verify Demo
              </Button>
              <Button size="sm" variant="outline" className="text-xs h-8" onClick={onOrderEvidence}>
                <Play className="w-3 h-3 mr-1" />
                Order Evidence
              </Button>
              <Button size="sm" variant="outline" className="text-xs h-8" onClick={onReceiveEvidence}>
                <FileText className="w-3 h-3 mr-1" />
                Receive Evidence
              </Button>
              <Button size="sm" variant="outline" className="text-xs h-8" onClick={onCloseGap}>
                <CheckCircle className="w-3 h-3 mr-1" />
                Close Gap
              </Button>
            </div>

            <Separator />

            {/* Notifications */}
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground">Send Notifications</p>
              <Button size="sm" variant="ghost" className="w-full justify-start text-xs h-7" onClick={() => onSendNotification("missing-info-for-evidence")}>
                <Send className="w-3 h-3 mr-2" />
                Missing info for evidence ordering
              </Button>
              <Button size="sm" variant="ghost" className="w-full justify-start text-xs h-7" onClick={() => onSendNotification("evidence-order-failure")}>
                <AlertTriangle className="w-3 h-3 mr-2" />
                Evidence order failure
              </Button>
            </div>

            <Separator />

            <Button size="sm" className="w-full" onClick={onAdvanceStage}>
              <ChevronRight className="w-3 h-3 mr-1" />
              Advance Stage
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
