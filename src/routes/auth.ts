import express from 'express';
import { AuthController } from '../controllers/AuthController';
import { UserService } from '../services/UserService';
import { AppDataSource } from '../config/data-source';
import { User } from '../entity/User';

// these are dependencies
// for larger file we can use library like inversify
const router = express.Router();
const userRepository = AppDataSource.getRepository(User);
// instanace for userService
const userService = new UserService(userRepository);
// instance of AuthController
const authController = new AuthController(userService);

router.post('/register', (req, res) => authController.register(req, res));

export default router;
