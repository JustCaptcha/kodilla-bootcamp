import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';

export class CreateOrderDTO {
  @ValidateNested({ each: true })
  @Type(() => ProductListDTO)
  @IsNotEmpty()
  productList: Array<ProductListDTO>;

  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsUUID()
  @IsNotEmpty()
  userAddressId: string;

  @IsString()
  @MinLength(3)
  @MaxLength(25)
  @IsNotEmpty()
  description: string;
}

export class ProductListDTO {
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  quantity: number;
}
