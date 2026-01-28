import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Station } from "./Station";
import { Track } from "./Track";
import { Train } from "./Train";
import { Play, Pause, RotateCcw, Zap } from "lucide-react";

type StationStatus = "idle" | "processing" | "success" | "alert";

interface SystemState {
  inputA: StationStatus;
  processor: StationStatus;
  validator: StationStatus;
  outputB: StationStatus;
  alertSystem: StationStatus;
  logger: StationStatus;
}

const initialState: SystemState = {
  inputA: "idle",
  processor: "idle",
  validator: "idle",
  outputB: "idle",
  alertSystem: "idle",
  logger: "idle",
};

// SVG paths for tracks between stations
const tracks = {
  inputToProcessor: "M 150 200 Q 300 200 350 300",
  processorToValidator: "M 450 300 Q 500 300 550 250 Q 600 200 650 200",
  validatorToOutput: "M 750 200 Q 850 200 900 300",
  validatorToAlert: "M 700 250 Q 700 350 600 400",
  alertToLogger: "M 500 400 Q 400 400 350 450 Q 300 500 250 500",
  loggerToInput: "M 150 500 Q 100 500 100 400 Q 100 300 150 200",
  processorToLogger: "M 400 350 Q 350 400 300 500",
};

export function DataFlowVisualization() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [systemState, setSystemState] = useState<SystemState>(initialState);
  const [currentStep, setCurrentStep] = useState(0);
  const [showAlert, setShowAlert] = useState(false);

  // Simulation logic
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        const next = (prev + 1) % 12;
        
        // Update system states based on step
        switch (next) {
          case 0:
            setSystemState({ ...initialState, inputA: "processing" });
            break;
          case 1:
            setSystemState(s => ({ ...s, inputA: "success", processor: "processing" }));
            break;
          case 2:
            setSystemState(s => ({ ...s, processor: "success", validator: "processing" }));
            break;
          case 3:
            // Random chance of finding a flaw
            if (Math.random() > 0.5) {
              setShowAlert(true);
              setSystemState(s => ({ ...s, validator: "alert", alertSystem: "processing" }));
            } else {
              setSystemState(s => ({ ...s, validator: "success", outputB: "processing" }));
            }
            break;
          case 4:
            if (showAlert) {
              setSystemState(s => ({ ...s, alertSystem: "success", logger: "processing" }));
            } else {
              setSystemState(s => ({ ...s, outputB: "success", logger: "processing" }));
            }
            break;
          case 5:
            setSystemState(s => ({ ...s, logger: "success" }));
            break;
          case 6:
            setShowAlert(false);
            setSystemState(initialState);
            break;
          default:
            break;
        }
        
        return next;
      });
    }, 1500);

    return () => clearInterval(interval);
  }, [isPlaying, showAlert]);

  const handleReset = () => {
    setCurrentStep(0);
    setSystemState(initialState);
    setShowAlert(false);
  };

  const triggerAlert = () => {
    setShowAlert(true);
    setSystemState(s => ({ ...s, validator: "alert", alertSystem: "processing" }));
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-background">
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
        className="absolute top-0 left-0 right-0 z-10 p-6"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-primary animate-pulse" />
              Data Transit Network
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Real-time visualization of data flow between systems
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

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={triggerAlert}
              className="flex items-center gap-2 px-4 py-2 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive hover:bg-destructive/20 transition-colors"
            >
              <Zap size={18} />
              Trigger Alert
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Main visualization */}
      <svg 
        viewBox="0 0 1000 600" 
        className="w-full h-full"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Tracks */}
        <Track path={tracks.inputToProcessor} highlight={systemState.inputA === "success"} />
        <Track path={tracks.processorToValidator} highlight={systemState.processor === "success"} />
        <Track path={tracks.validatorToOutput} highlight={systemState.validator === "success" && !showAlert} />
        <Track path={tracks.validatorToAlert} highlight={showAlert} />
        <Track path={tracks.alertToLogger} highlight={showAlert && systemState.alertSystem === "success"} />
        <Track path={tracks.processorToLogger} animated={false} />
        <Track path={tracks.loggerToInput} animated={false} />

        {/* Trains */}
        <AnimatePresence>
          {systemState.inputA === "processing" && (
            <Train 
              path={tracks.inputToProcessor} 
              duration={1.5} 
              color="amber"
              dataLabel="payload"
            />
          )}
          {systemState.processor === "processing" && (
            <Train 
              path={tracks.processorToValidator} 
              duration={1.5} 
              color="teal"
              dataLabel="processed"
            />
          )}
          {systemState.outputB === "processing" && (
            <Train 
              path={tracks.validatorToOutput} 
              duration={1.5} 
              color="amber"
              dataLabel="validated"
            />
          )}
          {showAlert && systemState.alertSystem === "processing" && (
            <Train 
              path={tracks.validatorToAlert} 
              duration={1} 
              color="red"
              dataLabel="ALERT!"
            />
          )}
          {showAlert && systemState.logger === "processing" && (
            <Train 
              path={tracks.alertToLogger} 
              duration={1.5} 
              color="red"
              dataLabel="log"
            />
          )}
        </AnimatePresence>

        {/* Stations */}
        <Station 
          x={150} y={200} 
          name="Input A" 
          status={systemState.inputA}
          description="Data ingestion"
        />
        <Station 
          x={400} y={300} 
          name="Processor" 
          status={systemState.processor}
          description="Transform & enrich"
        />
        <Station 
          x={700} y={200} 
          name="Validator" 
          status={systemState.validator}
          description="Quality checks"
        />
        <Station 
          x={900} y={300} 
          name="Output B" 
          status={systemState.outputB}
          description="Final destination"
        />
        <Station 
          x={550} y={400} 
          name="Alert System" 
          status={systemState.alertSystem}
          description="Notifications"
          size={40}
        />
        <Station 
          x={250} y={500} 
          name="Logger" 
          status={systemState.logger}
          description="Audit trail"
          size={40}
        />
      </svg>

      {/* Legend */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="absolute bottom-6 left-6 bg-card/90 backdrop-blur-sm border border-border rounded-xl p-4"
      >
        <h3 className="text-sm font-semibold text-foreground mb-3">Status Legend</h3>
        <div className="flex flex-col gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-muted-foreground/50" />
            <span className="text-muted-foreground">Idle</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-secondary animate-pulse" />
            <span className="text-muted-foreground">Processing</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-success" />
            <span className="text-muted-foreground">Success</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-destructive animate-pulse" />
            <span className="text-muted-foreground">Alert</span>
          </div>
        </div>
      </motion.div>

      {/* Stats panel */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="absolute bottom-6 right-6 bg-card/90 backdrop-blur-sm border border-border rounded-xl p-4"
      >
        <h3 className="text-sm font-semibold text-foreground mb-3">Live Stats</h3>
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div>
            <p className="text-muted-foreground">Cycle</p>
            <p className="text-xl font-mono text-primary">{Math.floor(currentStep / 6) + 1}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Step</p>
            <p className="text-xl font-mono text-secondary">{(currentStep % 6) + 1}/6</p>
          </div>
          <div>
            <p className="text-muted-foreground">Status</p>
            <p className={`text-sm font-medium ${showAlert ? "text-destructive" : "text-success"}`}>
              {showAlert ? "Alert Active" : "Normal"}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Mode</p>
            <p className="text-sm font-medium text-foreground">
              {isPlaying ? "Running" : "Paused"}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
