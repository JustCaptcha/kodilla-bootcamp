import { TextFilterType } from 'src/shared/enums/text-filter-type.enum';
import {
  Between,
  EntityRepository,
  Equal,
  FindConditions,
  FindManyOptions,
  In,
  LessThan,
  Like,
  MoreThan,
  Repository,
} from 'typeorm';
import { User } from '../entities/user.entity';
import { UsersQuery } from '../queries/users.query';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  findUserByEmail(email: string): Promise<User> {
    return this.findOne({
      where: {
        email: email,
      },
    });
  }

  private buildPredicate(query: UsersQuery): FindManyOptions<User> {
    const predicate: FindConditions<User> = {};

    const findManyOptions: FindManyOptions<User> = {
      where: predicate,
    };

    if (query.firstName && query.nameFilterType === TextFilterType.CONTAINS) {
      predicate.firstName = Like(`%${query.firstName}%`);
    } else if (query.firstName) {
      predicate.firstName = Equal(query.firstName);
    }

    if (query.lastName && query.nameFilterType === TextFilterType.CONTAINS) {
      predicate.lastName = Like(`%${query.lastName}%`);
    } else if (query.lastName) {
      predicate.lastName = Equal(query.lastName);
    }

    if (query.dateMax && query.dateMin) {
      predicate.dateOfBirth = Between(
        new Date(query.dateMin),
        new Date(query.dateMax),
      );
    } else if (query.dateMin) {
      predicate.dateOfBirth = MoreThan(new Date(query.dateMin));
    } else if (query.dateMax) {
      predicate.dateOfBirth = LessThan(new Date(query.dateMax));
    }

    findManyOptions.order = {
      [query.sortField || 'firstName']: query.orderDirection || 'ASC',
    };

    console.log(query);
    return findManyOptions;
  }

  findAll(_query_: UsersQuery): Promise<User[]> {
    return this.find(this.buildPredicate(_query_));
  }
}
