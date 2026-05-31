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
  const SwipeScreen({super.key});

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
      backgroundColor: const Color(0xFFF2FBF5), // Çok açık soft yeşil arka plan
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        centerTitle: true,
        title: const Text(
          'Kelime Tekrarı',
          style: TextStyle(
            color: Color(0xFF065F46), // Koyu yeşil
            fontWeight: FontWeight.w800,
            fontSize: 24,
            letterSpacing: 1.2,
          ),
        ),
        iconTheme: const IconThemeData(color: Color(0xFF065F46)),
      ),
      body: cardsAsyncValue.when(
        data: (cards) {
          if (cards.isEmpty) {
            return const Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.check_circle_outline, size: 80, color: Color(0xFF10B981)),
                  SizedBox(height: 16),
                  Text(
                    "Bugünlük harikasın!",
                    style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: Color(0xFF065F46)),
                  ),
                  SizedBox(height: 8),
                  Text(
                    "Çalışılacak kart kalmadı.",
                    style: TextStyle(fontSize: 16, color: Colors.grey),
                  ),
                ],
              ),
            );
          }

          return SafeArea(
            child: Column(
              children: [
                Expanded(
                  child: Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 10.0),
                    child: CardSwiper(
                      controller: controller,
                      cardsCount: cards.length,
                      onSwipe: (previousIndex, currentIndex, direction) {
                        return _onSwipe(previousIndex, currentIndex, direction, cards);
                      },
                      numberOfCardsDisplayed: 3,
                      backCardOffset: const Offset(0, 30),
                      padding: const EdgeInsets.all(0),
                      cardBuilder: (context, index, percentThresholdX, percentThresholdY) {
                        final card = cards[index];
                        return Container(
                          decoration: BoxDecoration(
                            gradient: const LinearGradient(
                              colors: [Color(0xFF34D399), Color(0xFF059669)], // Emerald 400 -> 600
                              begin: Alignment.topLeft,
                              end: Alignment.bottomRight,
                            ),
                            borderRadius: BorderRadius.circular(32),
                            boxShadow: [
                              BoxShadow(
                                color: const Color(0xFF059669).withOpacity(0.4),
                                blurRadius: 20,
                                offset: const Offset(0, 10),
                              )
                            ],
                          ),
                          child: Stack(
                            children: [
                              Positioned(
                                top: 24,
                                right: 24,
                                child: Icon(
                                  Icons.eco_rounded,
                                  color: Colors.white.withOpacity(0.2),
                                  size: 48,
                                ),
                              ),
                              Padding(
                                padding: const EdgeInsets.all(32.0),
                                child: Column(
                                  mainAxisAlignment: MainAxisAlignment.center,
                                  crossAxisAlignment: CrossAxisAlignment.stretch,
                                  children: [
                                    const Spacer(),
                                    Text(
                                      card.frontText,
                                      textAlign: TextAlign.center,
                                      style: const TextStyle(
                                        fontSize: 40,
                                        fontWeight: FontWeight.w900,
                                        color: Colors.white,
                                        letterSpacing: 1.5,
                                      ),
                                    ),
                                    const SizedBox(height: 32),
                                    Container(
                                      padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 24),
                                      decoration: BoxDecoration(
                                        color: Colors.black.withOpacity(0.15),
                                        borderRadius: BorderRadius.circular(20),
                                      ),
                                      child: Text(
                                        card.backText,
                                        textAlign: TextAlign.center,
                                        style: const TextStyle(
                                          fontSize: 22,
                                          fontWeight: FontWeight.w500,
                                          color: Colors.white,
                                          fontStyle: FontStyle.italic,
                                        ),
                                      ),
                                    ),
                                    const Spacer(),
                                    const Row(
                                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                      children: [
                                        Row(
                                          children: [
                                            Icon(Icons.keyboard_double_arrow_left, color: Colors.white70),
                                            Text(" Zor", style: TextStyle(color: Colors.white70, fontWeight: FontWeight.bold)),
                                          ],
                                        ),
                                        Row(
                                          children: [
                                            Text("Kolay ", style: TextStyle(color: Colors.white70, fontWeight: FontWeight.bold)),
                                            Icon(Icons.keyboard_double_arrow_right, color: Colors.white70),
                                          ],
                                        )
                                      ],
                                    )
                                  ],
                                ),
                              ),
                            ],
                          ),
                        );
                      },
                    ),
                  ),
                ),
                const SizedBox(height: 20),
              ],
            ),
          );
        },
        loading: () => const Center(child: CircularProgressIndicator(color: Color(0xFF10B981))),
        error: (err, stack) => Center(
          child: Text(
            "Bir hata oluştu:\n$err",
            textAlign: TextAlign.center,
            style: const TextStyle(color: Colors.redAccent),
          ),
        ),
      ),
    );
  }
}
