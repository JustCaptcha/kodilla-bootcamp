import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { OrderStatus } from '../enums/order-status.enum';
import { ProductListDTO } from './create-order.dto';

export class UpdateOrderDTO {
  @ValidateNested({ each: true })
  @Type(() => ProductListDTO)
  @IsOptional()
  productList: Array<ProductListDTO>;

  @IsUUID()
  @IsOptional()
  userAddressId: string;

  @IsString()
  @MinLength(3)
  @MaxLength(25)
  @IsOptional()
  description: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @IsOptional()
  totalPrice?: number;

  @IsEnum(OrderStatus)
  @IsOptional()
  status?: OrderStatus;
}
