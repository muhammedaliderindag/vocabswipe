import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'core/router/app_router.dart';
import 'features/cards/presentation/swipe_screen.dart';
import 'core/security/secure_storage_service.dart';
import 'core/network/dio_client.dart';
import 'features/cards/data/card_repository.dart';

// Riverpod Provider'larını burada gerçek nesnelerle başlatıyoruz
final secureStorageProvider = Provider<SecureStorageService>((ref) {
  return SecureStorageService();
});

final dioClientProvider = Provider<DioClient>((ref) {
  final storage = ref.watch(secureStorageProvider);
  return DioClient(storage);
});

final initializedCardRepositoryProvider = Provider<CardRepository>((ref) {
  final dioClient = ref.watch(dioClientProvider);
  return CardRepository(dioClient.dio);
});

void main() {
  runApp(
    ProviderScope(
      overrides: [
        cardRepositoryProvider.overrideWith((ref) => ref.watch(initializedCardRepositoryProvider)),
      ],
      child: const MyApp(),
    ),
  );
}

class MyApp extends ConsumerWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final router = ref.watch(routerProvider);

    return MaterialApp.router(
      title: 'VocabSwipe',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF4A00E0),
          brightness: Brightness.light,
        ),
        useMaterial3: true,
      ),
      routerConfig: router,
    );
  }
}
