import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Play, Pause, RotateCcw, Users, Cog } from "lucide-react";
import { ExecutiveView } from "./ExecutiveView";
import { DetailedView } from "./DetailedView";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function InsuranceWorkflow() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [activeTab, setActiveTab] = useState("executive");

  const totalSteps = 13;

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % totalSteps);
    }, 2000);

    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleReset = () => {
    setCurrentStep(0);
  };

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
                Gap resolution process for Motor Vehicle Report retrieval
              </p>
            </div>

            {/* Controls */}
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
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2 mb-4">
              <TabsTrigger value="executive" className="flex items-center gap-2">
                <Users size={16} />
                Executive View
              </TabsTrigger>
              <TabsTrigger value="detailed" className="flex items-center gap-2">
                <Cog size={16} />
                Detailed View
              </TabsTrigger>
            </TabsList>

            <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-4 min-h-[500px]">
              <TabsContent value="executive" className="mt-0 h-full">
                <ExecutiveView currentStep={currentStep} />
              </TabsContent>

              <TabsContent value="detailed" className="mt-0 h-full">
                <DetailedView currentStep={currentStep} hasError={true} />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </motion.div>

      {/* Info panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="relative z-10 max-w-7xl mx-auto px-6 pb-6"
      >
        <div className="bg-card/90 backdrop-blur-sm border border-border rounded-xl p-4">
          <h3 className="text-sm font-semibold text-foreground mb-2">Process Summary</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            When a client applies for a $500,000 life insurance policy, the underwriting system
            attempts to retrieve a Motor Vehicle Report (MVR). If the driver's license information
            contains errors, the system detects this gap and notifies the client to provide
            corrected documentation. Once reviewed and validated, the MVR request is reissued
            and underwriting continues smoothly.
          </p>
          <div className="flex flex-wrap gap-4 mt-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-primary" />
              <span className="text-muted-foreground">Client Actions</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-secondary" />
              <span className="text-muted-foreground">System Actions</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-accent" />
              <span className="text-muted-foreground">Underwriter Actions</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-destructive" />
              <span className="text-muted-foreground">Error/Gap Detected</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
