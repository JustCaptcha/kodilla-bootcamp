import { Injectable } from '@nestjs/common';
import { UserRequireUniqueEmailException } from './exception/user-require-unique-email-exception';
import { UserRepository } from './repositories/user.repository';

@Injectable()
export class UserValidatorService {
  constructor(private userRepository: UserRepository) {}
  async validateUniqueEmail(email: string): Promise<void> {
    if (await this.userRepository.findUserByEmail(email))
      throw new UserRequireUniqueEmailException();
  }
}
