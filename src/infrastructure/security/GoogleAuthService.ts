import { OAuth2Client } from 'google-auth-library';
import { IAuthService } from '../../application/interfaces/IAuthService';
import { GoogleUserDTO } from '../../application/dtos/GoogleUserDTO';

export class GoogleAuthService implements IAuthService {
  private client: OAuth2Client;
  private readonly clientId = process.env.GOOGLE_CLIENT_ID || '';

  constructor() {
    this.client = new OAuth2Client(this.clientId);
  }

  async verifyGoogleToken(idToken: string): Promise<GoogleUserDTO> {
    const ticket = await this.client.verifyIdToken({
      idToken,
      audience: this.clientId,
    });
    
    const payload = ticket.getPayload();
    if (!payload || !payload.email || !payload.sub) {
      throw new Error("Geçersiz Google Token");
    }

    return {
      email: payload.email,
      googleId: payload.sub
    };
  }
}
