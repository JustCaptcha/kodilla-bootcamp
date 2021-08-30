import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { OrdersDataService } from './orders-data.service';
import { CreateOrderDTO } from './dto/create-order.dto';
import { UpdateOrderDTO } from './dto/update-order.dto';
import { ExternalOrderDTO } from './dto/external-order.dto';
import { DeleteResult } from 'typeorm';
import { Order } from './entities/order.entity';
import { dateToArray } from 'src/shared/helpers/date.helper';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersDataService) {}

  @Post()
  async addOrder(
    @Body() createOrderDTO: CreateOrderDTO,
  ): Promise<ExternalOrderDTO> {
    console.log('Add order');
    return this.mapOrderToExternal(
      await this.ordersService.addOrder(createOrderDTO),
    );
  }

  @Get()
  async getAll(): Promise<ExternalOrderDTO[]> {
    const res = [];
    const orders = await this.ordersService.getAllOrders();
    orders.forEach((order) => res.push(this.mapOrderToExternal(order)));
    return res;
  }

  @Get('id/:id')
  async getOrderById(@Param('id') id: string): Promise<ExternalOrderDTO> {
    return this.mapOrderToExternal(await this.ordersService.getOrderById(id));
  }

  @Patch('id/:id')
  async updateOrder(
    @Param('id') id: string,
    @Body() updateOrderDTO: UpdateOrderDTO,
  ): Promise<ExternalOrderDTO> {
    return this.mapOrderToExternal(
      await this.ordersService.updateOrder(id, updateOrderDTO),
    );
  }

  @Delete('id/:id')
  async deleteOrder(@Param('id') id: string): Promise<DeleteResult> {
    return this.ordersService.deleteOrder(id);
  }

  mapOrderToExternal(order: Order): ExternalOrderDTO {
    console.log(order);
    return {
      id: order.id,
      productList: order.productList.map((item) => {
        return {
          orderProductId: item.id,
          productId: item.product.id,
          name: item.product.name,
          price: item.price,
          quantity: item.quantity,
        };
      }),
      user: {
        ...order.user,
        address: order.userAddress,
      },
      totalPrice: order.totalPrice,
      createdAt: dateToArray(order.createdAt),
      status: order.status,
    };
  }
}
