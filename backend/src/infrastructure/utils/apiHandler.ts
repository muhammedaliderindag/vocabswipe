import { NextResponse } from 'next/server';
import { ApiResponseDTO } from '../../application/dtos/ApiResponseDTO';
import { AppError } from '../../domain/exceptions/AppError';

type ApiHandlerFn = (req: Request, ...args: any[]) => Promise<any>;

/**
 * API Route'larını sarmalayan Higher-Order Function (Wrapper).
 * Try-catch bloklarını merkezi olarak yönetir ve dönüş formatını standartlaştırır.
 * 
 * Örnek Kullanım (route.ts):
 * 
 * import { apiHandler } from '../../../infrastructure/utils/apiHandler';
 * import { AppError } from '../../../domain/exceptions/AppError';
 * 
 * export const GET = apiHandler(async (request: Request) => {
 *   // Herhangi bir hata fırlatıldığında apiHandler onu yakalayacaktır.
 *   // throw new AppError("Kayıt bulunamadı", 404);
 *   return { id: 1, name: "Test Verisi" }; // Başarılı data dönüşü
 * });
 */
export function apiHandler(handler: ApiHandlerFn) {
  return async (request: Request, ...args: any[]) => {
    try {
      // Orijinal fonksiyonu çalıştır
      const data = await handler(request, ...args);
      
      // Başarılı sonucu standartlaştır
      const response = ApiResponseDTO.success(data, 200);
      return NextResponse.json(response, { status: 200 });
      
    } catch (error: any) {
      // Yapılandırılmış loglama (PM2/Winston veya basit konsol)
      console.error("[API_ERROR]", error);

      // Beklenen ve bizim ürettiğimiz uygulama hatasıysa
      if (error instanceof AppError) {
        const response = ApiResponseDTO.error(error.message, error.statusCode);
        return NextResponse.json(response, { status: error.statusCode });
      }

      // Beklenmeyen Sunucu Hataları
      const statusCode = 500;
      const message = error.message || "Internal Server Error";
      const response = ApiResponseDTO.error(message, statusCode);
      return NextResponse.json(response, { status: statusCode });
    }
  };
}
