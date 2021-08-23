import { Injectable } from '@nestjs/common';
import { CreateProductDTO } from './dto/create-product.dto';
import { Product } from './interfaces/product.interface';
import { uuid } from 'uuidv4';

@Injectable()
export class ProductsDataService {
  private products: Array<Product> = [];

  getAllProducts(): Product[] {
    return this.products;
  }

  getProductById(id: string): Product {
    return this.products.find((product) => product.id === id);
  }

  addProduct(item: CreateProductDTO): Product {
    console.log(item);
    const date = new Date();
    const newItem: Product = {
      id: uuid(),
      ...item,
      createdAt: date,
      updatedAt: date,
    };
    this.products = [...this.products, newItem];
    return newItem;
  }
}
