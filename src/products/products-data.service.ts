import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDTO } from './dto/create-product.dto';
import { Product } from './entities/product.entity';
import { ProductRepository } from './repositories/product.repository';
import { TagRepository } from './repositories/tag.repository';
import { Tag } from './entities/tag.entity';
import { UpdateProductDTO } from './dto/update-product.dto';
import { Connection, DeleteResult, EntityManager } from 'typeorm';
import { ProductsQuery } from './queries/products.query';

@Injectable()
export class ProductsDataService {
  constructor(
    private productRepository: ProductRepository,
    private tagRepository: TagRepository,
    private connection: Connection,
  ) {}

  async getProductById(id: string): Promise<Product> {
    const product = await this.productRepository.findOne(id);
    if (!product)
      throw new NotFoundException(`Product with ID: ${id} does not found`);
    return product;
  }

  async getAllProducts(_query_: ProductsQuery): Promise<Product[]> {
    return this.productRepository.findAll(_query_);
  }

  async deleteProduct(id: string): Promise<DeleteResult> {
    return await this.productRepository.delete(id);
  }

  async updateProduct(id: string, item: UpdateProductDTO): Promise<Product> {
    const tags: Tag[] = await this.tagRepository.findTagsByName(item.tags);
    const productToUpdate = await this.getProductById(id);
    if (!productToUpdate)
      throw new NotFoundException(`Product with ${id} does not found`);
    return this.connection.transaction(async (entity: EntityManager) => {
      productToUpdate.name = item.name;
      productToUpdate.price = item.price;
      productToUpdate.count = item.count;
      productToUpdate.tags = tags;
      return await entity
        .getCustomRepository(ProductRepository)
        .save(productToUpdate);
    });
  }

  async addProduct(item: CreateProductDTO): Promise<Product> {
    const tags: Tag[] = await this.tagRepository.findTagsByName(item.tags);
    return this.connection.transaction(async (manager: EntityManager) => {
      const productToSave = new Product();
      productToSave.name = item.name;
      productToSave.price = item.price;
      productToSave.count = item.count;
      productToSave.tags = tags;
      return await manager
        .getCustomRepository(ProductRepository)
        .save(productToSave);
    });
  }
}
