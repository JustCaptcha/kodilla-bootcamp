import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsDataService } from './products-data.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TagRepository } from './repositories/tag.repository';
import { ProductRepository } from './repositories/product.repository';

@Module({
  imports: [TypeOrmModule.forFeature([TagRepository, ProductRepository])],
  controllers: [ProductsController],
  providers: [ProductsDataService],
})
export class ProductsModule {}
