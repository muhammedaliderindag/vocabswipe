import { IDatabaseHealth } from '../interfaces/IDatabaseHealth';
import { HealthStatusDTO } from '../dtos/HealthStatusDTO';

export class CheckSystemHealthUseCase {
  constructor(private readonly databaseHealth: IDatabaseHealth) {}

  async execute(): Promise<HealthStatusDTO> {
    // 1. Veritabanı durumunu kontrol et
    const isDbConnected = await this.databaseHealth.checkConnection();
    
    // 2. process.memoryUsage() ile bellek durumunu MB cinsinden hesapla
    const memUsage = process.memoryUsage();
    const heapUsedMB = Math.round((memUsage.heapUsed / 1024 / 1024) * 100) / 100;
    const heapTotalMB = Math.round((memUsage.heapTotal / 1024 / 1024) * 100) / 100;

    let status: "UP" | "DOWN" | "DEGRADED" = "UP";
    let databaseStatus: "CONNECTED" | "DISCONNECTED" = isDbConnected ? "CONNECTED" : "DISCONNECTED";

    // Eşik değerleri (örneğin 500MB üzeri) kontrol edip risk varsa status: "DEGRADED" yap
    if (!isDbConnected) {
      status = "DOWN";
    } else if (heapUsedMB > 500) {
      status = "DEGRADED";
    }

    // 3. Sistem çalışma süresini (process.uptime()) al
    const uptimeSeconds = process.uptime();

    // 4. Tüm bu verileri HealthStatusDTO formatında geri dön
    return {
      status,
      database: databaseStatus,
      uptime: uptimeSeconds,
      memoryUsage: {
        heapUsed: heapUsedMB,
        heapTotal: heapTotalMB
      },
      timestamp: new Date().toISOString()
    };
  }
}
