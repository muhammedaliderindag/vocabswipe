import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../features/auth/application/auth_controller.dart';
import '../../features/auth/presentation/login_screen.dart';
import '../../features/cards/presentation/swipe_screen.dart';

// Riverpod state değişimlerini dinleyip GoRouter'ı tetiklemek için Listenable sınıfı
class RouterNotifier extends ChangeNotifier {
  final Ref _ref;
  ProviderSubscription? _subscription;

  RouterNotifier(this._ref) {
    _subscription = _ref.listen<AuthState>(
      authControllerProvider,
      (_, __) => notifyListeners(),
    );
  }

  @override
  void dispose() {
    _subscription?.close();
    super.dispose();
  }
}

final routerProvider = Provider<GoRouter>((ref) {
  final notifier = RouterNotifier(ref);

  return GoRouter(
    initialLocation: '/swipe',
    refreshListenable: notifier,
    redirect: (context, state) {
      final authState = ref.read(authControllerProvider);
      
      // authState yükleniyorken herhangi bir yönlendirme yapma (Splash eklenebilir)
      if (authState == AuthState.initial || authState == AuthState.loading) {
        return null;
      }

      final isAuth = authState == AuthState.authenticated;
      final isGoingToLogin = state.uri.path == '/login';

      // Kullanıcı giriş yapmamışsa ve login sayfasında değilse login'e yönlendir
      if (!isAuth && !isGoingToLogin) {
        return '/login';
      }
      
      // Kullanıcı giriş yapmışsa ve login sayfasına gitmeye çalışıyorsa swipe'a (ana ekrana) yönlendir
      if (isAuth && isGoingToLogin) {
        return '/swipe';
      }

      return null;
    },
    routes: [
      GoRoute(
        path: '/login',
        builder: (context, state) => const LoginScreen(),
      ),
      GoRoute(
        path: '/swipe',
        builder: (context, state) => const SwipeScreen(),
      ),
    ],
  );
});
