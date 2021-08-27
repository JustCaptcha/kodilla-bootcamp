import { EntityRepository, Repository, In } from 'typeorm';
import { Tag } from '../entities/tag.entity';

@EntityRepository(Tag)
export class TagRepository extends Repository<Tag> {
  findTagsByName(names: string[]): Promise<Tag[]> {
    return this.find({
      where: {
        name: In(names),
      },
    });
  }
}
