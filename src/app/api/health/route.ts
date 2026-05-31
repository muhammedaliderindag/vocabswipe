import { NextResponse } from 'next/server';
import { CheckSystemHealthUseCase } from '../../../application/use-cases/CheckSystemHealthUseCase';
import { PrismaHealthService } from '../../../infrastructure/database/PrismaHealthService';

export async function GET() {
  try {
    // Dependency Injection
    const databaseHealthService = new PrismaHealthService();
    const checkSystemHealthUseCase = new CheckSystemHealthUseCase(databaseHealthService);

    const healthStatus = await checkSystemHealthUseCase.execute();

    // Eğer veritabanı DISCONNECTED ise Nginx'in veya izleme sistemlerinin alarm üretebilmesi için 503 dön
    if (healthStatus.database === "DISCONNECTED" || healthStatus.status === "DOWN") {
      return NextResponse.json(healthStatus, { status: 503 });
    }

    // Sistem sağlıklıysa 200 OK dön
    return NextResponse.json(healthStatus, { status: 200 });

  } catch (error) {
    return NextResponse.json({
      status: "DOWN",
      database: "DISCONNECTED",
      error: "Health check process failed"
    }, { status: 503 });
  }
}
