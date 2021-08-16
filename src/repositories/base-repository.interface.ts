export interface BaseRepository<K> {
    addItem(item: K): K;
    deleteItem(id: string): boolean;
    updateItem(id: string, item: K): K;
    getItemById(id: string): K;
    getAllItems(): Array<K>;
}
