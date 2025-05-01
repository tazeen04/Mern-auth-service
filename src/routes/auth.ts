import express, { Request, Response, NextFunction } from 'express';
import { AuthController } from '../controllers/AuthController';
import { UserService } from '../services/UserService';
import { AppDataSource } from '../config/data-source';
import { User } from '../entity/User';
import logger from '../config/logger';
import resgisterValidator from '../validators/resgister-validator';

// these are dependencies
// for larger file we can use library like inversify
const router = express.Router();
const userRepository = AppDataSource.getRepository(User);
// instanace for userService
const userService = new UserService(userRepository);
// instance of AuthController
const authController = new AuthController(userService, logger);

router.post(
    '/register',
    resgisterValidator,
    (req: Request, res: Response, next: NextFunction) =>
        authController.register(req, res, next),
);

export default router;
