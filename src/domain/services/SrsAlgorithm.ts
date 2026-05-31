import { SrsData } from '../value-objects/SrsData';

export class SrsAlgorithm {
  /**
   * SM-2 algoritmasını kullanarak kartın yeni tekrar aralığını hesaplar.
   * Hiçbir framework (Next.js, DB) bağımlılığı taşımaz (Saf Mantık).
   * 
   * @param currentSrs Kartın şu anki tekrar durumu
   * @param grade Kullanıcı değerlendirmesi (1=Tekrar, 2=Zor, 3=İyi, 4=Kolay)
   */
  static calculate(currentSrs: SrsData, grade: number): SrsData {
    let { easeFactor, interval, repetitions } = currentSrs;

    if (grade < 3) {
      // Eğer kullanıcı kartı bilemediyse (Tekrar veya Zor)
      repetitions = 0;
      interval = 1;
    } else {
      // Eğer bildiyse
      repetitions += 1;
      
      if (repetitions === 1) {
        interval = 1;
      } else if (repetitions === 2) {
        interval = 6;
      } else {
        interval = Math.round(interval * easeFactor);
      }
    }

    // easeFactor güncellenmesi
    easeFactor = easeFactor + (0.1 - (4 - grade) * (0.08 + (4 - grade) * 0.02));

    // easeFactor asla 1.3'ün altına düşemez (SM-2 kuralı)
    if (easeFactor < 1.3) {
      easeFactor = 1.3;
    }

    return new SrsData(easeFactor, interval, repetitions);
  }
}
