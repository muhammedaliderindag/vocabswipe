import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. İstek loglama
  console.log(`[Middleware] Gelen İstek: ${request.method} ${pathname}`);

  // 2. CORS Ayarları (Taslak)
  const response = NextResponse.next();
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Preflight (OPTIONS) isteklerine hızlı yanıt
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, { status: 204, headers: response.headers });
  }

  // 3. Auth Endpoints Harici Kontroller
  // Herkese açık rotalar (Örn: /api/auth)
  if (pathname.startsWith('/api/auth/') || pathname.startsWith('/api/health')) {
    return response;
  }

  // 4. Rate Limiting veya Global Token Kontrolü Yapılacak Alan
  // const token = request.headers.get('Authorization');
  // if (!token) {
  //   return new NextResponse(
  //     JSON.stringify({ 
  //       success: false, 
  //       statusCode: 401, 
  //       error: "Yetkisiz Erişim (Unauthorized)", 
  //       data: null 
  //     }),
  //     { status: 401, headers: { 'content-type': 'application/json' } }
  //   );
  // }

  return response;
}

// Sadece /api/ ile başlayan rotalarda middleware'i çalıştır
export const config = {
  matcher: '/api/:path*',
};
