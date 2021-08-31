import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserAddressDTO, CreateUserDTO } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { UpdateUserAddressDTO, UpdateUserDTO } from './dto/update-user.dto';
import { UserRepository } from './repositories/user.repository';
import { UserAddressRepository } from './repositories/user-address.repository';
import { UserAddress } from './entities/user-address.entity';
import { Connection, DeleteResult, EntityManager } from 'typeorm';
import { UsersQuery } from './queries/users.query';

@Injectable()
export class UsersDataService {
  constructor(
    private userRepository: UserRepository,
    private userAddressRepository: UserAddressRepository,
    private connection: Connection,
  ) {}

  async getAllUsers(_query_: UsersQuery): Promise<User[]> {
    return this.userRepository.findAll(_query_);
  }

  async getUserById(id: string): Promise<User> {
    const user = await this.userRepository.findOne(id);
    if (!user) throw new NotFoundException('user is not found.');
    return user;
  }

  async addUser(item: CreateUserDTO): Promise<User> {
    const userWithSameEmail = await this.userRepository.findOne({
      where: { email: item.email },
    });
    if (userWithSameEmail)
      throw new NotAcceptableException(
        `User with email: ${item.email} is already exists`,
      );

    return this.connection.transaction(async (manager: EntityManager) => {
      const userToSave = new User();

      userToSave.address = await this.prepareUserAddressesToSave(
        item.address,
        manager.getCustomRepository(UserAddressRepository),
      );

      userToSave.dateOfBirth = item.dateOfBirth;
      userToSave.email = item.email;
      userToSave.firstName = item.firstName;
      userToSave.lastName = item.lastName;
      userToSave.role = item.role;

      return await manager.getCustomRepository(UserRepository).save(userToSave);
    });
  }

  async updateUser(id: string, item: UpdateUserDTO): Promise<User> {
    const userToSave = await this.userRepository.findOne(id);
    if (!userToSave)
      throw new NotFoundException(`User with ID: ${id} is not found.`);
    return this.connection.transaction(async (manager: EntityManager) => {
      this.userAddressRepository.deleteUserAddressesByUserId(id);
      userToSave.address = await this.prepareUserAddressesToSave(
        item.address,
        manager.getCustomRepository(UserAddressRepository),
      );
      userToSave.dateOfBirth = item.dateOfBirth;
      userToSave.email = item.email;
      userToSave.firstName = item.firstName;
      userToSave.lastName = item.lastName;
      userToSave.role = item.role;
      return await manager.getCustomRepository(UserRepository).save(userToSave);
    });
  }

  async deleteUser(id: string): Promise<DeleteResult> {
    return await this.userRepository.delete(id);
  }

  async prepareUserAddressesToSave(
    address: CreateUserAddressDTO[] | UpdateUserAddressDTO[],
    userAddressRepository: UserAddressRepository,
  ): Promise<UserAddress[]> {
    const addresses: UserAddress[] = [];
    for (const add of address) {
      const addressToSave = new UserAddress();

      addressToSave.country = add.country;
      addressToSave.city = add.city;
      addressToSave.street = add.street;
      addressToSave.number = add.number;

      addresses.push(await userAddressRepository.save(addressToSave));
    }

    return addresses;
  }
}
