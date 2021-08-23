import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersDataService } from './users-data.service';
import { UserValidatorService } from './user-validator.service';

@Module({
  controllers: [UsersController],
  providers: [UsersDataService, UserValidatorService],
})
export class UsersModule {}
