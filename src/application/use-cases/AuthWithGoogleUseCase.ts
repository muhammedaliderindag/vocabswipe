import { IAuthService } from '../interfaces/IAuthService';
import { ITokenService } from '../interfaces/ITokenService';
import { IUserRepository } from '../interfaces/IUserRepository';
import { AuthResponseDTO } from '../dtos/AuthResponseDTO';
import { User } from '../../domain/entities/User';

export class AuthWithGoogleUseCase {
  constructor(
    private readonly authService: IAuthService,
    private readonly tokenService: ITokenService,
    private readonly userRepository: IUserRepository
  ) {}

  async execute(idToken: string): Promise<AuthResponseDTO> {
    // 1. Google Service ile token'ı doğrula
    const googleUser = await this.authService.verifyGoogleToken(idToken);

    // 2. Repository'den email veya googleId ile kullanıcıyı ara
    let user = await this.userRepository.findByEmailOrGoogleId(googleUser.email, googleUser.googleId);
    
    // Yoksa yeni kullanıcı oluştur
    if (!user) {
      // UUID'yi veritabanı veya ORM katmanı oluşturacağı için boş geçiyoruz veya generate edebiliriz
      // Temiz mimari gereği entity'yi oluşturup repository'e veriyoruz
      const newUser = new User("", googleUser.email, googleUser.googleId);
      user = await this.userRepository.create(newUser);
    }

    // 3. Token Service ile Access ve Refresh token'ları üret
    const accessToken = this.tokenService.generateAccessToken(user.id);
    const refreshToken = this.tokenService.generateRefreshToken(user.id);

    // 4. Token'ları ve temel kullanıcı bilgilerini DTO olarak geri dön
    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email
      }
    };
  }
}
