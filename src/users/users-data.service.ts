import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { User } from './interfaces/user.interface';
import { uuid } from 'uuidv4';
import { UpdateUserDTO } from './dto/update-user.dto';

@Injectable()
export class UsersDataService {
  private users: Array<User> = [];

  getAllUsers(): User[] {
    return this.users;
  }

  getUserById(id: string): User {
    const user = this.users.find((user) => user.id === id);
    if (!user) throw new NotFoundException('user is not found.');
    return user;
  }

  getUserByEmail(email: string): User {
    const user = this.users.find((user) => user.email === email);
    return user;
  }

  addUser(item: CreateUserDTO): User {
    const date = new Date();
    const newItem: User = {
      id: uuid(),
      ...item,
      dateOfBirth: date,
    };
    this.users = [...this.users, newItem];
    return newItem;
  }

  updateUser(id: string, item: UpdateUserDTO): User {
    this.users = this.users.map((i) => {
      if (i.id === id) {
        return {
          ...i,
          ...item,
          id: id,
        };
      }

      return i;
    });

    return this.getUserById(id);
  }

  deleteUser(id: string): boolean {
    const item = this.users.findIndex((user) => user.id === id);
    if (item === -1) return false;
    this.users.splice(item, 1);
    return true;
  }
}
