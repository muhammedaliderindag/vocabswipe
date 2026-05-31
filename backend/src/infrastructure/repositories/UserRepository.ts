import { IUserRepository } from '../../application/interfaces/IUserRepository';
import { User } from '../../domain/entities/User';

export class UserRepository implements IUserRepository {
  async findByEmailOrGoogleId(email: string, googleId: string): Promise<User | null> {
    // TODO: Prisma kullanarak veritabanında arama yapılacak
    return null;
  }

  async create(user: User): Promise<User> {
    // TODO: Prisma kullanarak veritabanına yeni kullanıcı eklenecek
    // Mock user for now
    return new User("generated-uuid", user.email, user.googleId);
  }
}
