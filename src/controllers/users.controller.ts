import BaseController from './base-controller';
import { User } from '../interfaces/user.interface';
import { UsersRepository } from '../repositories/users-repository.interface';

class UsersController extends BaseController<User> {
    constructor(private usersRepository: UsersRepository) {
        super(usersRepository);
    }
 
    findUserByFirstName(name: string): User {
        return this.usersRepository.findUserByFirstName(name);
    }
}

export default UsersController;
