import { BaseRepository } from '../repositories/base-repository.interface';

abstract class BaseController<K> {
    constructor(private repository: BaseRepository<K>) {
    }
 
    getAllItems(): Array<K> {
        return this.repository.getAllItems();
    }
 
    getItemById(id: string): K {
        return this.repository.getItemById(id);
    }
 
    addItem(item: K): K {
        return this.repository.addItem(item);
    }
 
    deleteItem(id: string): boolean {
        return this.repository.deleteItem(id);
    }
 
    updateItem(id: string, item: K): K {
        return this.repository.updateItem(id, item);
    }
}

export default BaseController;
