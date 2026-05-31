import { User } from '../../domain/entities/User';

export interface IUserRepository {
  findByEmailOrGoogleId(email: string, googleId: string): Promise<User | null>;
  create(user: User): Promise<User>;
}
