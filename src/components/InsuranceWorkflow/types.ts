export type StepStatus = "pending" | "active" | "complete" | "error" | "success";

export interface WorkflowStep {
  id: string;
  label: string;
  description: string;
  x: number;
  y: number;
  puppet?: "client" | "system" | "underwriter" | "document";
}

export interface Connection {
  from: string;
  to: string;
  path: string;
  label?: string;
}
