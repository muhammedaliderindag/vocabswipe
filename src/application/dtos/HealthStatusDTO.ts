export interface HealthStatusDTO {
  status: "UP" | "DOWN" | "DEGRADED";
  database: "CONNECTED" | "DISCONNECTED";
  uptime: number; // seconds
  memoryUsage: {
    heapUsed: number; // MB
    heapTotal: number; // MB
  };
  timestamp: string;
}
