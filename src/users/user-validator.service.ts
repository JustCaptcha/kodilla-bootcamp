import { Injectable } from '@nestjs/common';
import { UserRequireUniqueEmailException } from './exception/user-require-unique-email-exception';
import { UsersDataService } from './users-data.service';

@Injectable()
export class UserValidatorService {
  constructor(private usersDataService: UsersDataService) {}
  validateUniqueEmail(email: string): void {
    if (this.usersDataService.getUserByEmail(email))
      throw new UserRequireUniqueEmailException();
  }
}
