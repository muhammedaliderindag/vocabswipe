import { SrsData } from '../value-objects/SrsData';

export class SrsAlgorithm {
  /**
   * Calculates the next SRS state using the SuperMemo-2 (SM-2) algorithm.
   * 
   * Grade scale:
   * 0-2: Incorrect response (e.g. 1 for Left Swipe)
   * 3-5: Correct response (e.g. 4 for Right Swipe)
   */
  static calculateNextSrsData(current: SrsData, grade: number): SrsData {
    let repetitions = current.repetitions;
    let interval = current.interval;
    let easeFactor = current.easeFactor;

    if (grade >= 3) {
      if (repetitions === 0) {
        interval = 1;
      } else if (repetitions === 1) {
        interval = 6;
      } else {
        interval = Math.round(interval * easeFactor);
      }
      repetitions += 1;
    } else {
      repetitions = 0;
      interval = 1;
    }

    easeFactor = easeFactor + (0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02));
    if (easeFactor < 1.3) {
      easeFactor = 1.3;
    }

    return new SrsData(easeFactor, interval, repetitions);
  }
}
