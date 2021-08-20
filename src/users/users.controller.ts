import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { dateToArray } from 'src/shared/helpers/date.helper';
import { CreateUserDTO } from './dto/create-user.dto';
import { ExternalUserDTO } from './dto/external-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { User } from './interfaces/user.interface';
import { UsersDataService } from './users-data.service';

@Controller('users')
export class UsersController {
  constructor(private userRepository: UsersDataService) {}

  @Get('id/:id')
  getUserById(@Param('id') id: string): ExternalUserDTO {
    return this.mapUserToExternal(this.userRepository.getUserById(id));
  }

  @Get()
  getAllUsers(): ExternalUserDTO[] {
    const res = [];
    const products = this.userRepository.getAllUsers();
    products.forEach((user) => res.push(this.mapUserToExternal(user)));
    return res;
  }

  @Post()
  addUser(@Body() item: CreateUserDTO): ExternalUserDTO {
    return this.mapUserToExternal(this.userRepository.addUser(item));
  }

  @Put('id/:id')
  updateUser(
    @Param('id') id: string,
    @Body() item: UpdateUserDTO,
  ): ExternalUserDTO {
    return this.mapUserToExternal(this.userRepository.updateUser(id, item));
  }

  @Delete('id/:id')
  deleteUser(@Param('id') id: string): boolean {
    return this.userRepository.deleteUser(id);
  }

  mapUserToExternal(user: User): ExternalUserDTO {
    return {
      ...user,
      dateOfBirth: dateToArray(user.dateOfBirth),
    };
  }
}
