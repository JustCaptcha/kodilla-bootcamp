import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import { OrdersDataService } from './orders-data.service';
import { CreateOrderDTO } from './dto/create-order.dto';
import { UpdateOrderDTO } from './dto/update-order.dto';
import { ExternalOrderDTO } from './dto/external-order.dto';
import { DeleteResult } from 'typeorm';
import { Order } from './entities/order.entity';
import { dateToArray } from 'src/shared/helpers/date.helper';
import { CreateOrderProductsDTO } from './dto/create-order-products.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly orderService: OrdersDataService) {}

  @Post()
  async addOrder(
    @Body() createOrderDTO: CreateOrderDTO,
  ): Promise<ExternalOrderDTO> {
    console.log('Add order');
    return this.mapOrderToExternal(
      await this.orderService.addOrder(createOrderDTO),
    );
  }

  @Get()
  async getAll(): Promise<ExternalOrderDTO[]> {
    const res = [];
    const orders = await this.orderService.getAllOrders();
    orders.forEach((order) => res.push(this.mapOrderToExternal(order)));
    return res;
  }

  @Get('id/:id')
  async getOrderById(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<ExternalOrderDTO> {
    return this.mapOrderToExternal(await this.orderService.getOrderById(id));
  }

  @Patch('id/:id')
  async updateOrder(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() updateOrderDTO: UpdateOrderDTO,
  ): Promise<ExternalOrderDTO> {
    return this.mapOrderToExternal(
      await this.orderService.updateOrder(id, updateOrderDTO),
    );
  }

  @Patch(':id/products')
  async addProductToOrder(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() createOrderProductsDTO: CreateOrderProductsDTO,
  ): Promise<ExternalOrderDTO> {
    return this.mapOrderToExternal(
      await this.orderService.addProductsToOrder(id, createOrderProductsDTO),
    );
  }

  @Patch(':orderId/:userAddressId')
  async updateOrderUserAddress(
    @Param('orderId', new ParseUUIDPipe({ version: '4' })) orderId: string,
    @Param('userAddressId', new ParseUUIDPipe({ version: '4' }))
    userAddressId: string,
  ): Promise<ExternalOrderDTO> {
    return this.mapOrderToExternal(
      await this.orderService.updateOrderUserAddress(orderId, userAddressId),
    );
  }
  // /api/orders/:orderId/:userAddressId

  @Delete('id/:id')
  async deleteOrder(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<DeleteResult> {
    return this.orderService.deleteOrder(id);
  }

  @Delete(':orderId/products/:idOrderProduct')
  async deleteOrderProduct(
    @Param('orderId', new ParseUUIDPipe({ version: '4' })) orderId: string,
    @Param('idOrderProduct', new ParseUUIDPipe({ version: '4' }))
    idOrderProduct: string,
  ): Promise<ExternalOrderDTO> {
    return this.mapOrderToExternal(
      await this.orderService.deleteOrderProduct(orderId, idOrderProduct),
    );
  }
  // /api/orders/:orderId/products/:idOrderProduct

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
