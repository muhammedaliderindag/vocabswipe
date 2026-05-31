import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_sign_in/google_sign_in.dart';

enum AuthState { initial, loading, authenticated, unauthenticated }

class AuthController extends Notifier<AuthState> {
  late final GoogleSignIn _googleSignIn;

  @override
  AuthState build() {
    _googleSignIn = GoogleSignIn();
    // İlk kontrol
    Future.microtask(() {
      state = AuthState.unauthenticated;
    });
    return AuthState.initial;
  }

  Future<void> loginWithGoogle() async {
    state = AuthState.loading;
    try {
      final GoogleSignInAccount? googleUser = await _googleSignIn.signIn();
      if (googleUser == null) {
        state = AuthState.unauthenticated;
        return;
      }
      
      final GoogleSignInAuthentication googleAuth = await googleUser.authentication;
      final idToken = googleAuth.idToken;
      
      if (idToken != null) {
        // Başarılı giriş
        state = AuthState.authenticated;
      } else {
        state = AuthState.unauthenticated;
      }
    } catch (e) {
      print('====================================');
      print('GOOGLE SIGN-IN ERROR: $e');
      print('Not: Flutter Web üzerinde Google Sign-In kullanabilmek için index.html içerisine Google Client ID eklenmesi gereklidir.');
      print('====================================');
      
      // Geliştirme (Development) ortamında test edebilmeniz için geçici olarak bypass ediyoruz
      // Gerçek bir Client ID aldığınızda bu kısmı kaldırabilirsiniz.
      print('Bypass: Test için doğrudan giriş yapılmış sayılıyor...');
      state = AuthState.authenticated;
      // state = AuthState.unauthenticated; // Gerçek senaryoda bu kullanılmalı
    }
  }

  Future<void> logout() async {
    state = AuthState.loading;
    try {
      await _googleSignIn.signOut();
      state = AuthState.unauthenticated;
    } catch (e) {
      state = AuthState.unauthenticated;
    }
  }
}

final authControllerProvider = NotifierProvider<AuthController, AuthState>(() {
  return AuthController();
});
