import { EntityRepository, Repository } from 'typeorm';
import { UserAddress } from '../entities/user-address.entity';

@EntityRepository(UserAddress)
export class UserAddressRepository extends Repository<UserAddress> {
  async deleteUserAddressesByUserId(userId: string): Promise<void> {
    const usersAddresses = await this.find({
      where: {
        userId,
      },
    });
    this.remove(usersAddresses);
  }
}
