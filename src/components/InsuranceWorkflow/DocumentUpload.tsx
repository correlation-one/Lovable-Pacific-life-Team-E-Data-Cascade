import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Camera, FileImage, CheckCircle, AlertCircle, X, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UploadedFile {
  id: string;
  name: string;
  type: "front" | "back";
  status: "uploading" | "processing" | "complete" | "error";
  preview?: string;
  extractedData?: Record<string, string>;
}

export function DocumentUpload() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [dragOver, setDragOver] = useState<"front" | "back" | null>(null);

  const simulateUpload = (type: "front" | "back") => {
    const newFile: UploadedFile = {
      id: `${type}-${Date.now()}`,
      name: `drivers_license_${type}.jpg`,
      type,
      status: "uploading",
    };

    setFiles(prev => [...prev.filter(f => f.type !== type), newFile]);

    // Simulate upload progress
    setTimeout(() => {
      setFiles(prev => prev.map(f => 
        f.id === newFile.id ? { ...f, status: "processing" } : f
      ));

      // Simulate OCR processing
      setTimeout(() => {
        const extractedData = type === "front" 
          ? {
              "Full Name": "JOHN MICHAEL SMITH",
              "License Number": "S123-456-78-901",
              "Date of Birth": "01/15/1985",
              "Address": "123 MAIN STREET",
              "City": "MIAMI",
              "State": "FL",
              "Expiration": "01/15/2028",
            }
          : {
              "Class": "E",
              "Restrictions": "NONE",
              "Endorsements": "NONE",
              "Issue Date": "01/15/2020",
              "Organ Donor": "YES",
            };

        setFiles(prev => prev.map(f => 
          f.id === newFile.id 
            ? { ...f, status: "complete", extractedData } 
            : f
        ));
      }, 2000);
    }, 1500);
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const getFrontFile = () => files.find(f => f.type === "front");
  const getBackFile = () => files.find(f => f.type === "back");

  const allComplete = getFrontFile()?.status === "complete" && getBackFile()?.status === "complete";

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          <FileImage className="h-5 w-5 text-primary" />
          Upload Driver's License
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Please upload clear images of the front and back of your driver's license
        </p>
      </div>

      {/* AI Processing Banner */}
      <motion.div
        className="mb-6 p-3 rounded-lg border flex items-center gap-3"
        style={{
          background: "hsl(280 100% 60% / 0.1)",
          borderColor: "hsl(280 100% 60% / 0.3)",
        }}
      >
        <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "hsl(280 100% 60%)" }}>
          <span className="text-white text-xs font-bold">AI</span>
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-foreground">Automatic Data Extraction</p>
          <p className="text-xs text-muted-foreground">
            Our AI will automatically read and extract information from your license using OCR + LLM
          </p>
        </div>
      </motion.div>

      {/* Upload Areas */}
      <div className="grid gap-6 md:grid-cols-2 mb-6">
        {/* Front Upload */}
        <div>
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">1</span>
            Front of License
          </h3>
          
          {getFrontFile() ? (
            <FileCard file={getFrontFile()!} onRemove={() => removeFile(getFrontFile()!.id)} />
          ) : (
            <UploadZone
              type="front"
              isDragOver={dragOver === "front"}
              onDragOver={() => setDragOver("front")}
              onDragLeave={() => setDragOver(null)}
              onUpload={() => simulateUpload("front")}
            />
          )}
        </div>

        {/* Back Upload */}
        <div>
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">2</span>
            Back of License
          </h3>
          
          {getBackFile() ? (
            <FileCard file={getBackFile()!} onRemove={() => removeFile(getBackFile()!.id)} />
          ) : (
            <UploadZone
              type="back"
              isDragOver={dragOver === "back"}
              onDragOver={() => setDragOver("back")}
              onDragLeave={() => setDragOver(null)}
              onUpload={() => simulateUpload("back")}
            />
          )}
        </div>
      </div>

      {/* Extracted Data Preview */}
      <AnimatePresence>
        {allComplete && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-lg border bg-card"
          >
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-4">
              <CheckCircle className="h-4 w-4 text-green-500" />
              Extracted Information (AI-Processed)
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h4 className="text-xs font-medium text-muted-foreground mb-2">From Front</h4>
                <div className="space-y-1">
                  {getFrontFile()?.extractedData && Object.entries(getFrontFile()!.extractedData!).map(([key, value]) => (
                    <div key={key} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{key}:</span>
                      <span className="font-mono">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-xs font-medium text-muted-foreground mb-2">From Back</h4>
                <div className="space-y-1">
                  {getBackFile()?.extractedData && Object.entries(getBackFile()!.extractedData!).map(([key, value]) => (
                    <div key={key} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{key}:</span>
                      <span className="font-mono">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Actions */}
      <div className="flex justify-end gap-3 mt-6">
        <Button variant="outline" onClick={() => setFiles([])}>
          <RotateCcw className="h-4 w-4 mr-2" />
          Start Over
        </Button>
        <Button disabled={!allComplete}>
          {allComplete ? "Submit Documents" : "Upload Both Sides to Continue"}
        </Button>
      </div>
    </div>
  );
}

function UploadZone({ 
  type, 
  isDragOver, 
  onDragOver, 
  onDragLeave, 
  onUpload 
}: { 
  type: "front" | "back";
  isDragOver: boolean;
  onDragOver: () => void;
  onDragLeave: () => void;
  onUpload: () => void;
}) {
  return (
    <motion.div
      className={`
        relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
        transition-colors duration-200
        ${isDragOver ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}
      `}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onDragOver={(e) => { e.preventDefault(); onDragOver(); }}
      onDragLeave={onDragLeave}
      onDrop={(e) => { e.preventDefault(); onDragLeave(); onUpload(); }}
      onClick={onUpload}
    >
      <div className="flex flex-col items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
          <Upload className="h-6 w-6 text-muted-foreground" />
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">
            Drop {type} image here
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            or click to browse
          </p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); onUpload(); }}>
            <Camera className="h-4 w-4 mr-1" />
            Camera
          </Button>
          <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); onUpload(); }}>
            <FileImage className="h-4 w-4 mr-1" />
            Gallery
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

function FileCard({ file, onRemove }: { file: UploadedFile; onRemove: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative border rounded-lg p-4 bg-card"
    >
      <button
        onClick={onRemove}
        className="absolute top-2 right-2 w-6 h-6 rounded-full bg-muted hover:bg-destructive hover:text-white flex items-center justify-center transition-colors"
      >
        <X className="h-4 w-4" />
      </button>

      <div className="flex items-start gap-3">
        {/* Placeholder image */}
        <div className="w-20 h-14 rounded bg-muted flex items-center justify-center">
          <FileImage className="h-8 w-8 text-muted-foreground" />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{file.name}</p>
          <div className="flex items-center gap-2 mt-1">
            {file.status === "uploading" && (
              <>
                <motion.div
                  className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                <span className="text-xs text-muted-foreground">Uploading...</span>
              </>
            )}
            {file.status === "processing" && (
              <>
                <motion.div
                  className="w-4 h-4 rounded-full"
                  style={{ background: "hsl(280 100% 60%)" }}
                  animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
                <span className="text-xs" style={{ color: "hsl(280 100% 60%)" }}>AI processing...</span>
              </>
            )}
            {file.status === "complete" && (
              <>
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-xs text-green-600">Data extracted</span>
              </>
            )}
            {file.status === "error" && (
              <>
                <AlertCircle className="h-4 w-4 text-destructive" />
                <span className="text-xs text-destructive">Upload failed</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Progress bar for uploading/processing */}
      {(file.status === "uploading" || file.status === "processing") && (
        <div className="mt-3 h-1 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ 
              background: file.status === "processing" 
                ? "hsl(280 100% 60%)" 
                : "hsl(var(--primary))" 
            }}
            initial={{ width: "0%" }}
            animate={{ width: file.status === "uploading" ? "60%" : "100%" }}
            transition={{ duration: file.status === "uploading" ? 1.5 : 2 }}
          />
        </div>
      )}
    </motion.div>
  );
}
