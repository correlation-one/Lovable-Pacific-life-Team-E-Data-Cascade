import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Play, Pause, RotateCcw, Users, Cog, FormInput, Upload, FileSearch, LayoutDashboard } from "lucide-react";
import { ExecutiveView } from "./ExecutiveView";
import { DetailedView } from "./DetailedView";
import { ApplicationForm } from "./ApplicationForm";
import { DocumentUpload } from "./DocumentUpload";
import { DocumentReview } from "./DocumentReview";
import { HandoffDashboard } from "./HandoffDashboard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function InsuranceWorkflow() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [activeTab, setActiveTab] = useState("dashboard");

  const totalSteps = 13;

  useEffect(() => {
    if (!isPlaying) return;
    if (activeTab !== "executive" && activeTab !== "detailed") return;

    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % totalSteps);
    }, 2000);

    return () => clearInterval(interval);
  }, [isPlaying, activeTab]);

  const handleReset = () => {
    setCurrentStep(0);
  };

  const showControls = activeTab === "executive" || activeTab === "detailed";

  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-background">
      {/* Background grid pattern */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(hsl(var(--border)) 1px, transparent 1px),
            linear-gradient(90deg, hsl(var(--border)) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 p-6"
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-primary animate-pulse" />
                Insurance Underwriting Workflow
              </h1>
              <p className="text-muted-foreground text-sm mt-1">
                AI-enhanced gap resolution for Motor Vehicle Report retrieval
              </p>
            </div>

            {/* Controls - only show for visualization tabs */}
            {showControls && (
              <div className="flex items-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg text-foreground hover:bg-muted transition-colors"
                >
                  {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                  {isPlaying ? "Pause" : "Play"}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleReset}
                  className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg text-foreground hover:bg-muted transition-colors"
                >
                  <RotateCcw size={18} />
                  Reset
                </motion.button>
              </div>
            )}
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full max-w-4xl grid-cols-6 mb-4">
              <TabsTrigger value="dashboard" className="flex items-center gap-1 text-xs">
                <LayoutDashboard size={14} />
                <span className="hidden sm:inline">Dashboard</span>
              </TabsTrigger>
              <TabsTrigger value="executive" className="flex items-center gap-1 text-xs">
                <Users size={14} />
                <span className="hidden sm:inline">Executive</span>
              </TabsTrigger>
              <TabsTrigger value="detailed" className="flex items-center gap-1 text-xs">
                <Cog size={14} />
                <span className="hidden sm:inline">Detailed</span>
              </TabsTrigger>
              <TabsTrigger value="application" className="flex items-center gap-1 text-xs">
                <FormInput size={14} />
                <span className="hidden sm:inline">Application</span>
              </TabsTrigger>
              <TabsTrigger value="upload" className="flex items-center gap-1 text-xs">
                <Upload size={14} />
                <span className="hidden sm:inline">Upload</span>
              </TabsTrigger>
              <TabsTrigger value="review" className="flex items-center gap-1 text-xs">
                <FileSearch size={14} />
                <span className="hidden sm:inline">Review</span>
              </TabsTrigger>
            </TabsList>

            <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-4 min-h-[500px]">
              <TabsContent value="dashboard" className="mt-0">
                <HandoffDashboard />
              </TabsContent>

              <TabsContent value="executive" className="mt-0 h-full">
                <ExecutiveView currentStep={currentStep} />
              </TabsContent>

              <TabsContent value="detailed" className="mt-0 h-full">
                <DetailedView currentStep={currentStep} hasError={true} />
              </TabsContent>

              <TabsContent value="application" className="mt-0">
                <ApplicationForm />
              </TabsContent>

              <TabsContent value="upload" className="mt-0">
                <DocumentUpload />
              </TabsContent>

              <TabsContent value="review" className="mt-0">
                <DocumentReview />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </motion.div>

      {/* Info panel - only show for visualization tabs */}
      {showControls && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="relative z-10 max-w-7xl mx-auto px-6 pb-6"
        >
          <div className="bg-card/90 backdrop-blur-sm border border-border rounded-xl p-4">
            <h3 className="text-sm font-semibold text-foreground mb-2">Process Summary</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              When a client applies for a $500,000 life insurance policy, AI validates input in real-time
              catching errors like city-state mismatches before submission. The system then attempts to
              retrieve a Motor Vehicle Report (MVR). If errors remain, AI detects the gap, notifies the
              client, and uses OCR to extract and validate corrected documentation automatically.
            </p>
            <div className="flex flex-wrap gap-4 mt-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-primary" />
                <span className="text-muted-foreground">Client/Agent</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full" style={{ background: "hsl(280 100% 60%)" }} />
                <span className="text-muted-foreground">AI-Enabled</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-secondary" />
                <span className="text-muted-foreground">System</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-destructive" />
                <span className="text-muted-foreground">Error/Gap</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
