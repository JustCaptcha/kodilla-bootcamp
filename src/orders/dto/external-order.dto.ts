import { Product } from 'src/products/entities/product.entity';
import { UserAddress } from 'src/users/entities/user-address.entity';
import { User } from 'src/users/entities/user.entity';
import { OrderStatus } from '../enums/order-status.enum';

export interface ExternalOrderDTO {
  id: string;
  productList: Array<ExternalProductListDTO>;
  user: ExternalUserDTO;
  createdAt: Array<number>;
  totalPrice: number;
  status: OrderStatus;
}

export interface ExternalUserDTO {
  firstName: string;
  lastName: string;
  email: string;
  address: UserAddress;
}

export interface ExternalProductListDTO {
  orderProductId: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
}
