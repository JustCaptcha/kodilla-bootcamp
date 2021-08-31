import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductRepository } from 'src/products/repositories/product.repository';
import { UserAddress } from 'src/users/entities/user-address.entity';
import { User } from 'src/users/entities/user.entity';
import { UserAddressRepository } from 'src/users/repositories/user-address.repository';
import { Connection, DeleteResult, EntityManager } from 'typeorm';
import { CreateOrderProductsDTO } from './dto/create-order-products.dto';
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

  async addProductsToOrder(
    id: string,
    createOrderProductsDTO: CreateOrderProductsDTO,
  ) {
    return this.connection.transaction(
      async (manager: EntityManager): Promise<Order> => {
        const orderToSave = await this.getOrderById(id);
        orderToSave.productList = await this.addOrderProducts(
          manager,
          createOrderProductsDTO.productList,
          orderToSave,
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
    order?: Order,
  ) {
    const orderProducts = [];
    if (order && order.productList.length > 0) {
      for (const productListItem of productList) {
        for (const orderProductListItem of order.productList) {
          if (orderProductListItem.product.id === productListItem.id) {
            orderProductListItem.quantity += productListItem.quantity;
            manager
              .getCustomRepository(OrderProductRepository)
              .update({ id: orderProductListItem.id }, orderProductListItem);
          } else {
            orderProducts.push(
              await this.saveNewOrderProduct(manager, productListItem),
            );
          }
        }
      }
    } else {
      for (const productListItem of productList) {
        orderProducts.push(
          await this.saveNewOrderProduct(manager, productListItem),
        );
      }
    }

    if (order) return order.productList.concat(orderProducts);
    else return orderProducts;
  }

  private async saveNewOrderProduct(
    manager: EntityManager,
    productListItem: ProductListDTO,
  ): Promise<OrderProduct> {
    const product = await manager
      .getCustomRepository(ProductRepository)
      .findOne(productListItem.id);
    const orderProductToSave = new OrderProduct();
    orderProductToSave.price = product.price;
    orderProductToSave.quantity = productListItem.quantity;
    orderProductToSave.product = product;
    await manager
      .getCustomRepository(OrderProductRepository)
      .save(orderProductToSave);
    return orderProductToSave;
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

  async updateOrderUserAddress(
    orderId: string,
    userAddressId: string,
  ): Promise<Order> {
    return this.connection.transaction(
      async (manager: EntityManager): Promise<Order> => {
        const orderToSave = await manager
          .getCustomRepository(OrderRepository)
          .findOne(orderId);
        if (!orderToSave)
          throw new NotFoundException(
            `Order with id: ${orderId} does not found`,
          );
        const userAddress = await manager
          .getCustomRepository(UserAddressRepository)
          .findOne(userAddressId);
        if (!userAddressId)
          throw new NotFoundException(
            `UserAddress with id: ${userAddressId} does not found`,
          );
        orderToSave.userAddress = userAddress;
        await manager
          .getCustomRepository(OrderRepository)
          .update({ id: orderId }, { userAddress: { id: userAddressId } });

        return orderToSave;
      },
    );
  }

  async deleteOrder(id: string): Promise<DeleteResult> {
    return this.orderRepository.delete(id);
  }

  async deleteOrderProduct(
    orderId: string,
    idOrderProduct: string,
  ): Promise<Order> {
    return this.connection.transaction(
      async (manager: EntityManager): Promise<Order> => {
        const orderToSave = await manager
          .getCustomRepository(OrderRepository)
          .findOne(orderId);
        let isOrderProductFound = false;
        orderToSave.productList = orderToSave.productList.filter(
          (orderProduct) => {
            if (orderProduct.id !== idOrderProduct) return true;
            else isOrderProductFound = true;
          },
        );
        if (!isOrderProductFound)
          throw new NotFoundException(
            `OrderProduct with id ${idOrderProduct} is not found`,
          );
        orderToSave.totalPrice = orderToSave.productList.reduce(
          (acc, cur) => (acc += cur.price * cur.quantity),
          0,
        );
        await manager
          .getCustomRepository(OrderProductRepository)
          .delete(idOrderProduct);
        await manager.getCustomRepository(OrderRepository).save(orderToSave);
        return orderToSave;
      },
    );
  }
}
