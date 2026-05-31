import { IReviewRepository } from '../interfaces/IReviewRepository';
import { SrsAlgorithm } from '../../domain/services/SrsAlgorithm';
import { SrsData } from '../../domain/value-objects/SrsData';
import { Review } from '../../domain/entities/Review';

export class ReviewCardUseCase {
  constructor(private readonly reviewRepository: IReviewRepository) {}

  async execute(userId: string, cardId: string, grade: number): Promise<void> {
    // 1. Repository'den mevcut Review kaydını getir
    let review = await this.reviewRepository.getReview(userId, cardId);

    let currentSrs: SrsData;

    if (review) {
      currentSrs = review.srsData;
    } else {
      // 2. Yoksa varsayılan değerlerle yeni bir SrsData ve Review oluştur
      currentSrs = new SrsData();
      // ID veritabanı seviyesinde veya entity factory üzerinden verilebilir
      review = new Review("", userId, cardId, currentSrs, new Date(), new Date());
    }

    // 3. SrsAlgorithm servisine mevcut durumu ve gelen grade değerini verip yeni durumu al
    const newSrs = SrsAlgorithm.calculate(currentSrs, grade);

    // 4. Yeni duruma göre nextReviewDate hesapla (Date.now() + interval * 24h)
    const nextReviewDate = new Date(Date.now() + newSrs.interval * 24 * 60 * 60 * 1000);

    // 5. Güncellenmiş nesneyi repository üzerinden kaydet
    review.srsData = newSrs;
    review.nextReviewDate = nextReviewDate;
    review.lastReviewedAt = new Date();

    await this.reviewRepository.upsertReview(review);
  }
}
