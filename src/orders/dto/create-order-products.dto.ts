import { Type } from 'class-transformer';
import { IsNotEmpty, ValidateNested } from 'class-validator';
import { ProductListDTO } from './create-order.dto';

export class CreateOrderProductsDTO {
  @ValidateNested({ each: true })
  @Type(() => ProductListDTO)
  @IsNotEmpty()
  productList: Array<ProductListDTO>;
}
