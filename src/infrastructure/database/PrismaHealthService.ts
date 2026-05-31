import { PrismaClient } from '@prisma/client';
import { IDatabaseHealth } from '../../application/interfaces/IDatabaseHealth';

const prisma = new PrismaClient();

export class PrismaHealthService implements IDatabaseHealth {
  async checkConnection(): Promise<boolean> {
    try {
      // Çok hafif olan SELECT 1 sorgusunu çalıştırarak veritabanının ayakta olup olmadığını test eder
      await prisma.$queryRaw`SELECT 1`;
      return true;
    } catch (error) {
      console.error("Veritabanı sağlık kontrolü başarısız:", error);
      return false;
    }
  }
}
