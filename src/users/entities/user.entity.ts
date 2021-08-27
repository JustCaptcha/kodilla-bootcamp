import { Roles } from 'src/shared/enums/roles.enum';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserAddress } from './user-address.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50 })
  firstName: string;

  @Column({ length: 50 })
  lastName: string;

  @Column({ length: 50, unique: true })
  email: string;

  @Column('enum', {
    enum: Roles,
  })
  role: Roles;

  @Column('timestamp')
  dateOfBirth: Date;

  @OneToMany(() => UserAddress, (address) => address.user)
  address?: UserAddress[];
}
