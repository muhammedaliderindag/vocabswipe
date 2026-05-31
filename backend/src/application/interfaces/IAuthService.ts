import { GoogleUserDTO } from '../dtos/GoogleUserDTO';

export interface IAuthService {
  verifyGoogleToken(idToken: string): Promise<GoogleUserDTO>;
}
