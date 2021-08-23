import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CreateProductDTO } from './dto/create-product.dto';
import { ExternalProductDTO } from './dto/external-product.dto';
import { ProductsDataService } from './products-data.service';
import { Product } from './interfaces/product.interface';
import { dateToArray } from 'src/shared/helpers/date.helper';
import { RoleGuard } from 'src/shared/guards/role.guard';

@Controller('products')
export class ProductsController {
  constructor(private productRepository: ProductsDataService) {}

  @Get()
  getAllProducts(): ExternalProductDTO[] {
    const res = [];
    const products = this.productRepository.getAllProducts();
    products.forEach((product) => res.push(this.mapProductToExternal(product)));
    return res;
  }

  @Get(':id')
  getProductById(@Param('id') id: string): ExternalProductDTO {
    return this.mapProductToExternal(this.productRepository.getProductById(id));
  }

  @Post()
  @UseGuards(RoleGuard)
  addProduct(@Body() item: CreateProductDTO): ExternalProductDTO {
    return this.mapProductToExternal(this.productRepository.addProduct(item));
  }

  mapProductToExternal(product: Product): ExternalProductDTO {
    return {
      ...product,
      createdAt: dateToArray(product.createdAt),
      updatedAt: dateToArray(product.updatedAt),
    };
  }
}
