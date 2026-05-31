import 'package:dio/dio.dart';

// Örnek Kart Modeli
class FlashCard {
  final String id;
  final String frontText;
  final String backText;

  FlashCard({required this.id, required this.frontText, required this.backText});

  factory FlashCard.fromJson(Map<String, dynamic> json) {
    return FlashCard(
      id: json['id'],
      frontText: json['frontText'],
      backText: json['backText'],
    );
  }
}

class CardRepository {
  final Dio dio;

  CardRepository(this.dio);

  Future<List<FlashCard>> getDueCards() async {
    final response = await dio.get('/api/cards/due');
    // Backend standart ApiResponseDTO formatında dönüyor: { success: true, data: [...] }
    final data = response.data['data'] as List;
    return data.map((json) => FlashCard.fromJson(json)).toList();
  }

  Future<void> submitReview(String cardId, int grade) async {
    await dio.post('/api/reviews', data: {
      'cardId': cardId,
      'grade': grade,
    });
  }
}
