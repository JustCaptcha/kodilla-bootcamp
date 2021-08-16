import { Product } from '../interfaces/product.interface';
import { ProductsRepository } from './products-repository.interface';
import shortid from 'shortid';
import { Tags } from '../enums/tags.enum';

export class ProductsMockRepository implements ProductsRepository {
    private products: Array<Product> = [];

    findProductByName(name: string): Product {
        try {
            return this.products.find(product => product.name === name);
        } catch (error) {
            throw(Error(error));
        }
    }

    deleteItem(id: string): boolean {
        const item = this.products.findIndex(product => product.id === id);
        if(item !== -1) this.products.splice(item, 1);
        return (item !== -1) ? true : false;
    }

    getItemById(id: string): Product {
        return this.products.find(product => product.id === id);
    }

    getAllItems(): Product[] {
        return this.products;
    }

    addItem(item: Product): Product {
        item.id = shortid.generate();
        item.createdAt = new Date();
        item.updatedAt = new Date();
        (item.name) ? {} : item.name = 'Apple';
        (item.price) ? {} : item.price = 10;
        (item.count) ? {} : item.count = 1;
        (item.tags) ? {} : item.tags = [Tags.NEW];
        this.products.push(item);
        return item;
    }
 
    updateItem(id: string, item: Product): Product {
        this.products = this.products.map(i => {
            if (i.id === id) {
                return {
                    ...item,
                    id: i.id,
                    createdAt: i.createdAt,
                    updatedAt: new Date()
                };
            }
 
            return i;
        });
 
        return this.getItemById(id);
    }
}
