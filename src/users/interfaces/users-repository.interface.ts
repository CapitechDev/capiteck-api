import { User, Prisma } from '@prisma/client';
import { SafeUser } from '../users.repository';

export interface IUsersRepository {
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<SafeUser | null>;
  findAll(): Promise<SafeUser[]>;
  create(data: Prisma.UserCreateInput): Promise<SafeUser>;
  update(id: string, data: Prisma.UserUpdateInput): Promise<SafeUser>;
  delete(id: string): Promise<SafeUser>;
  existsByEmail(email: string): Promise<boolean>;
  existsById(id: string): Promise<boolean>;
  findByResetToken(token: string): Promise<User | null>;
}
