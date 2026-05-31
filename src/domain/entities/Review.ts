export class Review {
  constructor(
    public readonly cardId: string,
    public readonly userId: string,
    public readonly performanceRating: number
  ) {}
}
