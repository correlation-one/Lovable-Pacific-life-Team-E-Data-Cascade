import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileText, ExternalLink, X } from "lucide-react";

interface HealthHistoryViewerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HealthHistoryViewer({ isOpen, onClose }: HealthHistoryViewerProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl h-[85vh] flex flex-col p-0">
        <DialogHeader className="px-6 py-4 border-b flex-shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Health History Questionnaire
            </DialogTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open("/documents/health-history-form.pdf", "_blank")}
              >
                <ExternalLink className="w-4 h-4 mr-1" />
                Open in New Tab
              </Button>
            </div>
          </div>
        </DialogHeader>
        <div className="flex-1 overflow-hidden">
          <iframe
            src="/documents/health-history-form.pdf"
            className="w-full h-full border-0"
            title="Health History Form"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
