import express from 'express';
import authenticate from '../middleswares/authenticate';
import { canAccess } from '../middleswares/canAccess';
import { Roles } from '../constants';
import { UserController } from '../controllers/UserController';
import { UserService } from '../services/UserService';
import { AppDataSource } from '../config/data-source';
import { User } from '../entity/User';

const router = express.Router();

const userRepository = AppDataSource.getRepository(User);
const userService = new UserService(userRepository);

const userController = new UserController(userService);

router.post(
    '/',
    authenticate,
    canAccess([Roles.ADMIN]),
    async (req, res, next) => {
        await userController.create(req, res, next);
    },
);

export default router;
