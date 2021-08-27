import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersDataService } from './users-data.service';
import { UserValidatorService } from './user-validator.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './repositories/user.repository';
import { UserAddressRepository } from './repositories/user-address.repository';

@Module({
  imports: [TypeOrmModule.forFeature([UserRepository, UserAddressRepository])],
  controllers: [UsersController],
  providers: [UsersDataService, UserValidatorService],
})
export class UsersModule {}
