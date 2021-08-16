import BaseController from './base-controller';
import { Product } from '../interfaces/product.interface';
import { ProductsRepository } from '../repositories/products-repository.interface';

class ProductsController extends BaseController<Product> {
    constructor(private productsRepository: ProductsRepository) {
        super(productsRepository);
    }
 
    findProductByName(name: string): Product {
        return this.productsRepository.findProductByName(name);
    }
}

export default ProductsController;
