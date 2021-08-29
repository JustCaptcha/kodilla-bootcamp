import { Tag } from 'src/products/entities/tag.entity';
import { getRepository, MigrationInterface, QueryRunner } from 'typeorm';
import * as faker from 'faker';
import { User } from 'src/users/entities/user.entity';
import { UserAddress } from 'src/users/entities/user-address.entity';
import { Roles } from 'src/shared/enums/roles.enum';
import { Product } from 'src/products/entities/product.entity';
import { Tags } from 'src/products/enums/tags.enum';

export class InitData1630251999052 implements MigrationInterface {
  private getRandomInt = (max) => {
    return Math.floor(Math.random() * max);
  };

  private async saveTags(): Promise<Tag[]> {
    const tagsArr: Tag[] = [];
    const tags = [
      {
        name: 'NEW',
      },
      {
        name: 'PROMO',
      },
      {
        name: 'LAST_ITEMS',
      },
    ];

    for (const tag of tags) {
      const tagToSave = new Tag();
      tagToSave.name = tag.name;
      tagsArr.push(await getRepository('Tag').save(tagToSave));
    }

    console.log('Tags saved');

    return tagsArr;
  }

  private async saveProducts(): Promise<Product[]> {
    const productsArr: Product[] = Array.from({ length: 100 });
    productsArr.map(async () => {
      const productToSave = new Product();
      productToSave.name = faker.commerce.productName();
      productToSave.price = parseInt(faker.commerce.price());
      productToSave.description = faker.commerce.productDescription();
      productToSave.tags =
        Tags[
          faker.helpers.replaceSymbolWithNumber(
            faker.random.arrayElement(Object.getOwnPropertyNames(Tags)),
          )
        ];
      productToSave.count = this.getRandomInt(100);
      await getRepository('Product').save(productToSave);
    });

    console.log(`Inserted ${productsArr.length} products`);
    return productsArr;
  }

  private async saveUsers(): Promise<User[]> {
    const usersArr: User[] = Array.from({ length: 100 });

    usersArr.map(async () => {
      const userToSave = new User();
      userToSave.email = faker.internet.email();
      userToSave.firstName = faker.name.firstName();
      userToSave.lastName = faker.name.lastName();
      userToSave.dateOfBirth = faker.date.past();
      userToSave.address = await this.saveUsersAddresses(userToSave);
      if (userToSave.address.length === 0) userToSave.address = null;
      userToSave.role =
        Roles[
          faker.helpers.replaceSymbolWithNumber(
            faker.random.arrayElement(Object.getOwnPropertyNames(Roles)),
          )
        ];

      await getRepository('User').save(userToSave);
    });

    console.log(`Inserted ${usersArr.length} users`);
    return usersArr;
  }

  private async saveUsersAddresses(userToSave: User) {
    const result: UserAddress[] = [];

    const arr = Array.from({
      length: this.getRandomInt(4),
    });

    for (const _add of arr) {
      const addressToSave = new UserAddress();
      addressToSave.country = faker.address.countryCode();
      addressToSave.city = faker.address.cityName();
      addressToSave.street = faker.address.streetAddress();
      addressToSave.number = 2;
      await getRepository('UserAddress').save(addressToSave);
      result.push(addressToSave);
    }

    return result;
  }

  public async up(queryRunner: QueryRunner): Promise<void> {
    const tags = this.saveTags();
    await this.saveProducts();
    await this.saveUsers();
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('tags');
    await queryRunner.dropTable('products');
    await queryRunner.dropTable('users');
  }
}
