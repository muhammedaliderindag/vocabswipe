import 'package:dio/dio.dart';
import '../security/secure_storage_service.dart';
import 'dart:async';

class AuthInterceptor extends Interceptor {
  final Dio dio;
  final SecureStorageService secureStorageService;
  
  bool _isRefreshing = false;
  final List<Map<String, dynamic>> _failedRequestsQueue = [];

  AuthInterceptor(this.dio, this.secureStorageService);

  @override
  Future<void> onRequest(RequestOptions options, RequestInterceptorHandler handler) async {
    final accessToken = await secureStorageService.getAccessToken();
    
    if (accessToken != null) {
      options.headers['Authorization'] = 'Bearer $accessToken';
    }
    
    return handler.next(options);
  }

  @override
  Future<void> onError(DioException err, ErrorInterceptorHandler handler) async {
    if (err.response?.statusCode == 401) {
      final RequestOptions options = err.requestOptions;

      if (_isRefreshing) {
        // Zaten yenileniyorsa, isteği kuyruğa ekle
        final completer = Completer<Response>();
        _failedRequestsQueue.add({'options': options, 'completer': completer});
        
        try {
          final response = await completer.future;
          return handler.resolve(response);
        } on DioException catch (e) {
          return handler.reject(e);
        }
      }

      _isRefreshing = true;

      try {
        final refreshToken = await secureStorageService.getRefreshToken();
        if (refreshToken == null) {
          throw Exception("Refresh token bulunamadı");
        }

        // Token yenileme isteği
        final refreshDio = Dio(BaseOptions(baseUrl: dio.options.baseUrl));
        final response = await refreshDio.post('/api/auth/refresh', data: {
          'refreshToken': refreshToken,
        });

        final newAccessToken = response.data['accessToken'];
        final newRefreshToken = response.data['refreshToken'];

        // Yeni tokenları kaydet
        await secureStorageService.saveTokens(
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
        );

        // Kilit mekanizmasını serbest bırak
        _isRefreshing = false;
        options.headers['Authorization'] = 'Bearer $newAccessToken';
        
        // Kuyruktaki bekleyen istekleri yeni token ile tekrarla
        for (var request in _failedRequestsQueue) {
          final reqOptions = request['options'] as RequestOptions;
          reqOptions.headers['Authorization'] = 'Bearer $newAccessToken';
          
          dio.fetch(reqOptions).then((res) {
            (request['completer'] as Completer<Response>).complete(res);
          }).catchError((e) {
            (request['completer'] as Completer<Response>).completeError(e);
          });
        }
        _failedRequestsQueue.clear();

        // Orijinal hatayı fırlatan isteği yeni token ile tekrarla
        final retryResponse = await dio.fetch(options);
        return handler.resolve(retryResponse);

      } catch (e) {
        // Refresh token da geçersiz olduysa kuyruğu temizle ve kullanıcıyı login'e at
        _isRefreshing = false;
        for (var request in _failedRequestsQueue) {
          (request['completer'] as Completer<Response>).completeError(err);
        }
        _failedRequestsQueue.clear();
        await secureStorageService.clearTokens();
        
        // NOT: Burada Router/Navigation paketi kullanılarak Login ekranına yönlendirme yapılabilir.
        return handler.next(err);
      }
    }
    
    return handler.next(err);
  }
}
