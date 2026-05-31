import { ICardRepository } from '../interfaces/ICardRepository';
import { ISrsEngine } from '../interfaces/ISrsEngine';
import { ReviewCardRequestDTO } from '../dtos/ReviewCardRequestDTO';
import { Review } from '../../domain/entities/Review';

export class ReviewCardUseCase {
  constructor(
    private readonly cardRepository: ICardRepository,
    private readonly srsEngine: ISrsEngine
  ) {}

  async execute(dto: ReviewCardRequestDTO): Promise<void> {
    // 1. DTO'dan Domain Entity'sine (Review) dönüştürme
    const review = new Review(dto.cardId, dto.userId, dto.performanceRating);

    // 2. İş Mantığı: SRS Motorunu çalıştırarak yeni aralıkları (interval, ease factor vb.) hesaplama
    this.srsEngine.calculateNextReview(review);

    // 3. Altyapı İşlemi: Repository aracılığıyla veritabanına kaydetme
    await this.cardRepository.saveReview(review);
  }
}
