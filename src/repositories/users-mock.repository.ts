import { User } from '../interfaces/user.interface';
import { UsersRepository } from './users-repository.interface';
import { Roles } from '../enums/roles.enum';
import shortid from 'shortid';

export class UsersMockRepository implements UsersRepository {
    private users: Array<User> = [];

    findUserByFirstName(firstName: string): User {
        return this.users.find(user => user.firstName === firstName);
    }

    deleteItem(id: string): boolean {
        const item = this.users.findIndex(user => user.id === id);
        if(item !== -1) this.users.splice(item, 1);
        return (item !== -1) ? true : false;
    }

    getItemById(id: string): User {
        return this.users.find(user => user.id === id);
    }

    getAllItems(): User[] {
        return this.users;
    }

    addItem(item: User): User {
        item.id = shortid.generate();
        (item.firstName) ? {} : item.firstName = 'Jan';
        (item.lastName) ? {} : item.lastName = 'Kowalski';
        (item.email) ? {} : item.email = 'brak';
        (item.role) ? {} : item.role = Roles.CUSTOMER;
        (item.dateOfBirth) ? {} : item.dateOfBirth = new Date();
        (item.address) ? {} : item.address = ['New York'];
        this.users.push(item);
        return item;
    }
 
    updateItem(id: string, item: User): User {
        this.users = this.users.map(i => {
            if (i.id === id) {
                return {
                    ...item,
                    id: i.id,
                };
            }
 
            return i;
        });
 
        return this.getItemById(id);
    }
}

