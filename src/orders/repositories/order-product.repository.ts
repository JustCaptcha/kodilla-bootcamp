import { EntityRepository, Repository } from 'typeorm';
import { OrderProduct } from '../entities/order-product.entity';

@EntityRepository(OrderProduct)
export class OrderProductRepository extends Repository<OrderProduct> {}
