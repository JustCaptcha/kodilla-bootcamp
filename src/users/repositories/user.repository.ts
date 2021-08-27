import { EntityRepository, In, Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  findUserByEmail(email: string): Promise<User> {
    return this.findOne({
      where: {
        email: email,
      },
    });
  }
}
