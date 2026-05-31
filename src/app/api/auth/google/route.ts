import { NextResponse } from 'next/server';
import { AuthWithGoogleUseCase } from '../../../../application/use-cases/AuthWithGoogleUseCase';
import { GoogleAuthService } from '../../../../infrastructure/security/GoogleAuthService';
import { JwtService } from '../../../../infrastructure/security/JwtService';
import { UserRepository } from '../../../../infrastructure/repositories/UserRepository';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { idToken } = body;

    if (!idToken) {
      return NextResponse.json({ error: "idToken gerekli" }, { status: 400 });
    }

    // Dependency Injection (Uygulama ölçeklendiğinde InversifyJS / TSyringe kullanılabilir)
    const authService = new GoogleAuthService();
    const tokenService = new JwtService();
    const userRepository = new UserRepository();

    const useCase = new AuthWithGoogleUseCase(authService, tokenService, userRepository);

    // Tüm iş mantığı UseCase içinde çalıştırılır
    const result = await useCase.execute(idToken);

    return NextResponse.json(result, { status: 200 });

  } catch (error: any) {
    // Hataları güvenli bir şekilde döneriz
    return NextResponse.json({ error: error.message || "Kimlik doğrulama başarısız oldu" }, { status: 401 });
  }
}
