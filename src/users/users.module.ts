import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersDataService } from './users-data.service';

@Module({
  controllers: [UsersController],
  providers: [UsersDataService],
})
export class UsersModule {}
