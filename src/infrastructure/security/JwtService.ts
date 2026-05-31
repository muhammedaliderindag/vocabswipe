import jwt from 'jsonwebtoken';
import { ITokenService } from '../../application/interfaces/ITokenService';

export class JwtService implements ITokenService {
  private readonly jwtSecret = process.env.JWT_SECRET || 'super_secret_key';
  private readonly jwtRefreshSecret = process.env.JWT_REFRESH_SECRET || 'super_refresh_secret';

  generateAccessToken(userId: string): string {
    return jwt.sign({ userId }, this.jwtSecret, { expiresIn: '15m' });
  }

  generateRefreshToken(userId: string): string {
    return jwt.sign({ userId }, this.jwtRefreshSecret, { expiresIn: '7d' });
  }
}
