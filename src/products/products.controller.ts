import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CreateProductDTO } from './dto/create-product.dto';
import { ExternalProductDTO } from './dto/external-product.dto';
import { ProductsDataService } from './products-data.service';
import { Product } from './entities/product.entity';
import { dateToArray } from 'src/shared/helpers/date.helper';
import { RoleGuard } from 'src/shared/guards/role.guard';
import { UpdateProductDTO } from './dto/update-product.dto';
import { DeleteResult } from 'typeorm';

@Controller('products')
export class ProductsController {
  constructor(private productService: ProductsDataService) {}

  @Get('id/:id')
  async getProductById(@Param('id') id: string): Promise<ExternalProductDTO> {
    return this.mapProductToExternal(
      await this.productService.getProductById(id),
    );
  }

  @Get()
  async getAllProducts(): Promise<ExternalProductDTO[]> {
    const res = [];
    const products = await this.productService.getAllProducts();
    products.forEach((product) => res.push(this.mapProductToExternal(product)));
    return res;
  }

  @UseGuards(RoleGuard)
  @Post()
  async addProduct(
    @Body() item: CreateProductDTO,
  ): Promise<ExternalProductDTO> {
    return this.mapProductToExternal(
      await this.productService.addProduct(item),
    );
  }

  @UseGuards(RoleGuard)
  @Put('id/:id')
  async updateProduct(
    @Body() item: UpdateProductDTO,
    @Param('id') id: string,
  ): Promise<ExternalProductDTO> {
    return this.mapProductToExternal(
      await this.productService.updateProduct(id, item),
    );
  }

  @Delete('id/:id')
  async deleteUser(@Param('id') id: string): Promise<DeleteResult> {
    return await this.productService.deleteProduct(id);
  }

  mapProductToExternal(product: Product): ExternalProductDTO {
    return {
      ...product,
      createdAt: dateToArray(product.createdAt),
      updatedAt: dateToArray(product.updatedAt),
      tags: product.tags?.map((i) => i.name),
    };
  }
}
