import { NextResponse } from 'next/server';
import { apiHandler } from '../../../infrastructure/utils/apiHandler';
import { PrismaClient } from '@prisma/client';
import { ReviewCardUseCase } from '../../../application/use-cases/ReviewCardUseCase';
import { AppError } from '../../../domain/exceptions/AppError';

// Ensure route is fully dynamic
export const dynamic = 'force-dynamic';

const prisma = new PrismaClient();

export const POST = apiHandler(async (request: Request) => {
  const body = await request.json();
  const { cardId, grade } = body;

  if (!cardId || grade === undefined) {
    throw new AppError("Missing cardId or grade in request body", 400);
  }

  // TODO: Gerçek auth eklendiğinde middleware'den veya request context'ten alınacak
  // Şimdilik geliştirme/test için ilk kullanıcıyı buluyoruz
  const user = await prisma.user.findFirst();
  if (!user) {
    throw new AppError("No user found in database. Please run /api/seed first.", 404);
  }

  const useCase = new ReviewCardUseCase(prisma);
  const review = await useCase.execute(user.id, cardId, grade);

  return { message: "Review saved successfully", review };
});
