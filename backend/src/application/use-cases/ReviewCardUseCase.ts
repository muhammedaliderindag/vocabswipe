import { SrsAlgorithm } from '../../domain/services/SrsAlgorithm';
import { SrsData } from '../../domain/value-objects/SrsData';
import { PrismaClient } from '@prisma/client';
import { AppError } from '../../domain/exceptions/AppError';

export class ReviewCardUseCase {
  constructor(private readonly prisma: PrismaClient) {}

  async execute(userId: string, cardId: string, grade: number) {
    // Kartın ve kullanıcının varlığını kontrol et
    const card = await this.prisma.card.findUnique({ where: { id: cardId } });
    if (!card) {
      throw new AppError("Card not found", 404);
    }

    // 1. Mevcut review durumunu çek veya yoksa default oluştur
    let review = await this.prisma.review.findUnique({
      where: {
        userId_cardId: { userId, cardId }
      }
    });

    const currentSrsData = review 
      ? new SrsData(review.easeFactor, review.interval, review.repetitions)
      : new SrsData();

    // 2. Domain servisini kullanarak yeni SRS durumunu hesapla (SM-2)
    const nextSrsData = SrsAlgorithm.calculateNextSrsData(currentSrsData, grade);

    // 3. Bir sonraki tekrar tarihini hesapla
    const nextReviewDate = new Date();
    nextReviewDate.setDate(nextReviewDate.getDate() + nextSrsData.interval);

    // 4. Veritabanına kaydet (Varsa güncelle, yoksa oluştur - upsert)
    const savedReview = await this.prisma.review.upsert({
      where: {
        userId_cardId: { userId, cardId }
      },
      update: {
        easeFactor: nextSrsData.easeFactor,
        interval: nextSrsData.interval,
        repetitions: nextSrsData.repetitions,
        nextReviewDate,
        lastReviewedAt: new Date()
      },
      create: {
        userId,
        cardId,
        easeFactor: nextSrsData.easeFactor,
        interval: nextSrsData.interval,
        repetitions: nextSrsData.repetitions,
        nextReviewDate,
        lastReviewedAt: new Date()
      }
    });

    return savedReview;
  }
}
