import { Module } from '@nestjs/common';
import { OrdersDataService } from './orders-data.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderRepository } from './repositories/order.repository';
import { OrderProductRepository } from './repositories/order-product.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderRepository, OrderProductRepository]),
  ],
  controllers: [OrdersController],
  providers: [OrdersDataService],
})
export class OrdersModule {}
