import { UserAddress } from 'src/users/entities/user-address.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OrderStatus } from '../enums/order-status.enum';
import { OrderProduct } from './order-product.entity';

@Entity({ name: 'orders' })
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToMany((type) => OrderProduct, (orderProduct) => orderProduct.order, {
    eager: true,
  })
  productList: OrderProduct[];

  @ManyToOne((type) => User, (user) => user.id, {
    eager: true,
  })
  user: User;

  @ManyToOne((type) => UserAddress, {
    eager: true,
  })
  userAddress: UserAddress;

  @Column('text')
  description: string;

  @Column('enum', {
    enum: OrderStatus,
  })
  status: OrderStatus;

  @Column('float')
  totalPrice: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
