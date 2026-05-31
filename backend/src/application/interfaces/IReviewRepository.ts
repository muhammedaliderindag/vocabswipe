import { Review } from '../../domain/entities/Review';

export interface IReviewRepository {
  getReview(userId: string, cardId: string): Promise<Review | null>;
  upsertReview(review: Review): Promise<void>;
}
