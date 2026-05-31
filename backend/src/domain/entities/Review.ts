import { SrsData } from '../value-objects/SrsData';

export class Review {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly cardId: string,
    public srsData: SrsData,
    public nextReviewDate: Date,
    public lastReviewedAt: Date
  ) {}
}
