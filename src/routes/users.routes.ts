import express from 'express';
import UsersController from '../controllers/users.controller';
import { UsersMockRepository } from '../repositories/users-mock.repository';

const repository = new UsersMockRepository();
const controller = new UsersController(repository);

const router = express.Router();

router.post('', (req, res) => {
    try {
        return res.json(controller.addItem(req.body));
    } catch (error) {
        res.status(500).json(error);
    }
});

router.get('', (req, res) => {
    try {
        if (req.query.id) return res.json(controller.getItemById(req.query.id.toString()));
        if (req.query.firstName) {
            const product = controller.findUserByFirstName(req.query.firstName.toString());
            product ? res.json(product) : res.sendStatus(404);
        }
        else return res.json(controller.getAllItems());
    } catch (error) {
        res.status(500).json(error);
    }
});

router.patch('', (req, res) => {
    try {
        if(req.query.id) {
            const result = controller.updateItem(req.query.id.toString(), req.body);
            return (result) ? res.status(200).json(result) : res.sendStatus(404);
        } else res.sendStatus(400);
    } catch (error) {
        res.status(500).json(error);
    }
});

router.delete('', (req, res) => {
    try {
        if(req.query.id) {
            const result = controller.deleteItem(req.query.id.toString());
            console.log(result);
            return (result) ? res.status(200).json(result) : res.sendStatus(404);
        } else res.status(400);
    } catch (error) {
        res.status(500).json(error);
    }
});

export default router;