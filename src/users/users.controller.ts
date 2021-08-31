import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { dateToArray } from 'src/shared/helpers/date.helper';
import { DeleteResult } from 'typeorm';
import { CreateUserDTO } from './dto/create-user.dto';
import { ExternalUserDTO } from './dto/external-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UsersQuery } from './queries/users.query';
import { UserValidatorService } from './user-validator.service';
import { UsersDataService } from './users-data.service';

@Controller('users')
export class UsersController {
  constructor(
    private usersDataService: UsersDataService,
    private userValidatorService: UserValidatorService,
  ) {}

  @Get('id/:id')
  async getUserById(@Param('id') id: string): Promise<ExternalUserDTO> {
    return this.mapUserToExternal(await this.usersDataService.getUserById(id));
  }

  @Get()
  async getAllUsers(@Query() query: UsersQuery): Promise<ExternalUserDTO[]> {
    return (await this.usersDataService.getAllUsers(query)).map((i) =>
      this.mapUserToExternal(i),
    );
  }

  @Post()
  async addUser(@Body() item: CreateUserDTO): Promise<ExternalUserDTO> {
    this.userValidatorService.validateUniqueEmail(item.email);
    return this.mapUserToExternal(await this.usersDataService.addUser(item));
  }

  @Put('id/:id')
  async updateUser(
    @Param('id') id: string,
    @Body() item: UpdateUserDTO,
  ): Promise<ExternalUserDTO> {
    return this.mapUserToExternal(
      await this.usersDataService.updateUser(id, item),
    );
  }

  @Delete('id/:id')
  async deleteUser(@Param('id') id: string): Promise<DeleteResult> {
    return this.usersDataService.deleteUser(id);
  }

  mapUserToExternal(user: User): ExternalUserDTO {
    return {
      ...user,
      dateOfBirth: dateToArray(user.dateOfBirth),
    };
  }
}
