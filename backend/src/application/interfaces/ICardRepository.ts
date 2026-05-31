import { Card } from '../../domain/entities/Card';
import { Review } from '../../domain/entities/Review';

export interface ICardRepository {
  getDueCards(userId: string): Promise<Card[]>;
  saveReview(review: Review): Promise<void>;
}
