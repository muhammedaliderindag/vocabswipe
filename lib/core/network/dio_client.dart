import 'package:dio/dio.dart';
import 'auth_interceptor.dart';
import '../security/secure_storage_service.dart';

class DioClient {
  late final Dio dio;

  DioClient(SecureStorageService secureStorageService) {
    dio = Dio(
      BaseOptions(
        baseUrl: 'http://localhost:3000', // Backend Next.js API
        connectTimeout: const Duration(seconds: 10),
        receiveTimeout: const Duration(seconds: 10),
      ),
    );

    dio.interceptors.add(AuthInterceptor(dio, secureStorageService));
  }
}
