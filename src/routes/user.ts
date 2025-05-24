import express from 'express';
import authenticate from '../middleswares/authenticate';
import { canAccess } from '../middleswares/canAccess';
import { Roles } from '../constants';
import { UserController } from '../controllers/UserController';
import { UserService } from '../services/UserService';
import { AppDataSource } from '../config/data-source';
import { User } from '../entity/User';
import logger from '../config/logger';

const router = express.Router();

const userRepository = AppDataSource.getRepository(User);
const userService = new UserService(userRepository);

const userController = new UserController(userService, logger);

router.post(
    '/',
    authenticate,
    canAccess([Roles.ADMIN]),
    async (req, res, next) => {
        await userController.create(req, res, next);
    },
);

router.patch('/:id', authenticate, canAccess([Roles.ADMIN]), (req, res, next) =>
    userController.update(req, res, next),
);

router.get('/', authenticate, canAccess([Roles.ADMIN]), (req, res, next) =>
    userController.getAll(req, res, next),
);

router.get('/:id', authenticate, canAccess([Roles.ADMIN]), (req, res, next) =>
    userController.getOne(req, res, next),
);

export default router;
