export type StepStatus = "pending" | "active" | "complete" | "error" | "success";

export interface WorkflowStep {
  id: string;
  label: string;
  description: string;
  x: number;
  y: number;
  puppet?: "client" | "system" | "underwriter" | "document" | "ai";
  aiEnabled?: boolean;
  aiCapability?: string;
}

export interface Connection {
  from: string;
  to: string;
  path: string;
  label?: string;
}
