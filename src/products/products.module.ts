import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsDataService } from './products-data.service';

@Module({
  controllers: [ProductsController],
  providers: [ProductsDataService],
})
export class ProductsModule {}
