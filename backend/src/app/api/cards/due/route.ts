export const dynamic = 'force-dynamic';
import { apiHandler } from '../../../../infrastructure/utils/apiHandler';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const GET = apiHandler(async (request: Request) => {
  // Şimdilik sadece test amaçlı ilk 10 kartı veritabanından çekiyoruz.
  // İleride Auth eklendiğinde kullanıcının SRS Review verilerine göre due kartlar hesaplanacak.
  const cards = await prisma.card.findMany({
    take: 10,
    select: {
      id: true,
      frontText: true,
      backText: true,
    }
  });
  return cards;
});
