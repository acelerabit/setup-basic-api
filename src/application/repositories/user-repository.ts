import { PaginationParams } from '@/@shared/pagination-interface';
import { User } from '../entities/user';

export abstract class UsersRepository {
  abstract create(user: User): Promise<void>;
  abstract findAll(pagination: PaginationParams): Promise<User[]>;
  abstract findByEmail(email: string): Promise<User | null>;
  abstract findById(id: string): Promise<User | null>;
  abstract update(user: User): Promise<void>;
}
