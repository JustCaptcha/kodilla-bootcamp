import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { dateToArray } from 'src/shared/helpers/date.helper';
import { CreateUserDTO } from './dto/create-user.dto';
import { ExternalUserDTO } from './dto/external-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { User } from './interfaces/user.interface';
import { UserValidatorService } from './user-validator.service';
import { UsersDataService } from './users-data.service';

@Controller('users')
export class UsersController {
  constructor(
    private usersDataService: UsersDataService,
    private userValidatorService: UserValidatorService,
  ) {}

  @Get('id/:id')
  getUserById(@Param('id') id: string): ExternalUserDTO {
    return this.mapUserToExternal(this.usersDataService.getUserById(id));
  }

  @Get()
  getAllUsers(): ExternalUserDTO[] {
    const res = [];
    const products = this.usersDataService.getAllUsers();
    products.forEach((user) => res.push(this.mapUserToExternal(user)));
    return res;
  }

  @Post()
  addUser(@Body() item: CreateUserDTO): ExternalUserDTO {
    this.userValidatorService.validateUniqueEmail(item.email);
    return this.mapUserToExternal(this.usersDataService.addUser(item));
  }

  @Put('id/:id')
  updateUser(
    @Param('id') id: string,
    @Body() item: UpdateUserDTO,
  ): ExternalUserDTO {
    return this.mapUserToExternal(this.usersDataService.updateUser(id, item));
  }

  @Delete('id/:id')
  deleteUser(@Param('id') id: string): boolean {
    return this.usersDataService.deleteUser(id);
  }

  mapUserToExternal(user: User): ExternalUserDTO {
    return {
      ...user,
      dateOfBirth: dateToArray(user.dateOfBirth),
    };
  }
}
