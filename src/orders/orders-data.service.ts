import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductRepository } from 'src/products/repositories/product.repository';
import { UserAddress } from 'src/users/entities/user-address.entity';
import { User } from 'src/users/entities/user.entity';
import { Connection, DeleteResult, EntityManager } from 'typeorm';
import { CreateOrderDTO, ProductListDTO } from './dto/create-order.dto';
import { UpdateOrderDTO } from './dto/update-order.dto';
import { OrderProduct } from './entities/order-product.entity';
import { Order } from './entities/order.entity';
import { OrderStatus } from './enums/order-status.enum';
import { OrderProductRepository } from './repositories/order-product.repository';
import { OrderRepository } from './repositories/order.repository';

@Injectable()
export class OrdersDataService {
  constructor(
    private orderRepository: OrderRepository,
    private orderProductRepository: OrderProductRepository,
    private connection: Connection,
  ) {}

  async addOrder(createOrderDTO: CreateOrderDTO) {
    return this.connection.transaction(
      async (manager: EntityManager): Promise<Order> => {
        const orderToSave = new Order();
        orderToSave.user = new User();
        orderToSave.user.id = createOrderDTO.userId;
        orderToSave.userAddress = new UserAddress();
        orderToSave.userAddress.id = createOrderDTO.userAddressId;
        orderToSave.description = createOrderDTO.description;
        orderToSave.status = OrderStatus.NEW;
        orderToSave.productList = await this.addOrderProducts(
          manager,
          createOrderDTO.productList,
        );
        orderToSave.totalPrice = orderToSave.productList.reduce(
          (acc, cur) => (acc += cur.price * cur.quantity),
          0,
        );

        return await manager
          .getCustomRepository(OrderRepository)
          .save(orderToSave);
      },
    );
  }

  async addOrderProducts(
    manager: EntityManager,
    productList: ProductListDTO[],
  ) {
    const orderProducts = [];
    console.log(productList);
    for (const productListItem of productList) {
      const product = await manager
        .getCustomRepository(ProductRepository)
        .findOne(productListItem.id);
      const orderProductToSave = new OrderProduct();
      orderProductToSave.price = product.price;
      orderProductToSave.quantity = productListItem.quantity;
      orderProductToSave.product = product;
      orderProducts.push(orderProductToSave);
      await manager
        .getCustomRepository(OrderProductRepository)
        .save(orderProductToSave);
    }

    return orderProducts;
  }

  async getAllOrders(): Promise<Order[]> {
    return this.orderRepository.find();
  }

  async getOrderById(id: string): Promise<Order> {
    const order = await this.orderRepository.findOne(id);
    if (!order)
      throw new NotFoundException(`Order with ID: ${id} does not found`);
    return order;
  }

  async updateOrder(
    id: string,
    updateOrderDTO: UpdateOrderDTO,
  ): Promise<Order> {
    return this.connection.transaction(
      async (manager: EntityManager): Promise<Order> => {
        const orderToSave = await this.getOrderById(id);

        if (updateOrderDTO.userAddressId) {
          orderToSave.userAddress = new UserAddress();
          orderToSave.userAddress.id = updateOrderDTO.userAddressId;
        }
        if (updateOrderDTO.description)
          orderToSave.description = updateOrderDTO.description;
        if (updateOrderDTO.status) orderToSave.status = updateOrderDTO.status;
        if (updateOrderDTO.productList) {
          orderToSave.productList = await this.addOrderProducts(
            manager,
            updateOrderDTO.productList,
          );
          orderToSave.totalPrice = orderToSave.productList.reduce(
            (acc, cur) => (acc += cur.price * cur.quantity),
            0,
          );
        }
        if (updateOrderDTO.totalPrice)
          orderToSave.totalPrice = updateOrderDTO.totalPrice;

        return await manager
          .getCustomRepository(OrderRepository)
          .save(orderToSave);
      },
    );
  }

  async deleteOrder(id: string): Promise<DeleteResult> {
    return this.orderRepository.delete(id);
  }
}
