import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_card_swiper/flutter_card_swiper.dart';
import '../data/card_repository.dart';

// Riverpod Provider Örneği - Gerçek uygulamada core provider'lardan çekilir
final cardRepositoryProvider = Provider<CardRepository>((ref) {
  throw UnimplementedError('Initialize card repo properly in main.dart');
});

final dueCardsProvider = FutureProvider<List<FlashCard>>((ref) async {
  final repo = ref.watch(cardRepositoryProvider);
  return repo.getDueCards();
});

class SwipeScreen extends ConsumerStatefulWidget {
  const SwipeScreen({Key? key}) : super(key: key);

  @override
  ConsumerState<SwipeScreen> createState() => _SwipeScreenState();
}

class _SwipeScreenState extends ConsumerState<SwipeScreen> {
  final CardSwiperController controller = CardSwiperController();

  bool _onSwipe(
    int previousIndex,
    int? currentIndex,
    CardSwiperDirection direction,
    List<FlashCard> cards,
  ) {
    final cardId = cards[previousIndex].id;
    int grade;

    // Sağa kaydırma (Kolay/İyi) -> grade = 4
    // Sola kaydırma (Zor/Tekrar) -> grade = 1
    if (direction == CardSwiperDirection.right) {
      grade = 4;
    } else if (direction == CardSwiperDirection.left) {
      grade = 1;
    } else {
      grade = 2; // Diğer durumlar (örneğin yukarı) için varsayılan
    }

    // Backend'e sonucu ilet
    ref.read(cardRepositoryProvider).submitReview(cardId, grade);
    
    return true; // Swiper'ın kartı atmasına izin ver
  }

  @override
  Widget build(BuildContext context) {
    final cardsAsyncValue = ref.watch(dueCardsProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Kelime Tekrarı'),
      ),
      body: cardsAsyncValue.when(
        data: (cards) {
          if (cards.isEmpty) {
            return const Center(child: Text("Bugün için çalışılacak kart kalmadı!"));
          }

          return SafeArea(
            child: CardSwiper(
              controller: controller,
              cardsCount: cards.length,
              onSwipe: (previousIndex, currentIndex, direction) {
                return _onSwipe(previousIndex, currentIndex, direction, cards);
              },
              numberOfCardsDisplayed: 3,
              backCardOffset: const Offset(0, 40),
              cardBuilder: (context, index, percentThresholdX, percentThresholdY) {
                final card = cards[index];
                return Container(
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(16),
                    boxShadow: const [
                      BoxShadow(
                        color: Colors.black12,
                        blurRadius: 8,
                        offset: Offset(0, 4),
                      )
                    ],
                  ),
                  alignment: Alignment.center,
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(
                        card.frontText,
                        style: const TextStyle(fontSize: 32, fontWeight: FontWeight.bold),
                      ),
                      const SizedBox(height: 20),
                      Text(
                        card.backText,
                        style: const TextStyle(fontSize: 24, color: Colors.grey),
                      ),
                    ],
                  ),
                );
              },
            ),
          );
        },
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (err, stack) => Center(child: Text("Bir hata oluştu: $err")),
      ),
    );
  }
}
