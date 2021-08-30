import { Product } from 'src/products/entities/product.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Order } from './order.entity';

@Entity({ name: 'orders_product' })
export class OrderProduct {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne((type) => Order, (order) => order.productList, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  order: Order;

  @ManyToOne((type) => Product, {
    eager: true,
  })
  product: Product;

  @Column('int')
  quantity: number;

  @Column('float')
  price: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
