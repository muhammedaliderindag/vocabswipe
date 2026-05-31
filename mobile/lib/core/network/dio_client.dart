import 'package:dio/dio.dart';
import 'auth_interceptor.dart';
import '../security/secure_storage_service.dart';

class DioClient {
  late final Dio dio;

  DioClient(SecureStorageService secureStorageService) {
    dio = Dio(
      BaseOptions(
        baseUrl: 'http://localhost', // Backend Next.js API via Nginx
        connectTimeout: const Duration(seconds: 10),
        receiveTimeout: const Duration(seconds: 10),
      ),
    );

    dio.interceptors.add(AuthInterceptor(dio, secureStorageService));
  }
}
