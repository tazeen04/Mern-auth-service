import express from 'express';
import { AuthController } from '../controllers/AuthController';
import { UserService } from '../services/UserService';

const router = express.Router();
// instanace for userService
const userService = new UserService();
// instance of AuthController
const authController = new AuthController(userService);

router.post('/register', (req, res) => authController.register(req, res));

export default router;
