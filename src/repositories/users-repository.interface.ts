import { BaseRepository } from './base-repository.interface';
import { User } from '../interfaces/user.interface';

export interface UsersRepository extends BaseRepository<User> {
   findUserByFirstName(name: string): User;
}
