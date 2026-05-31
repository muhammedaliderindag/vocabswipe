import { Review } from '../../domain/entities/Review';

export interface ISrsEngine {
  calculateNextReview(review: Review): void;
}
