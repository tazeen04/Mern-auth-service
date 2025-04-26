import express from 'express';
import { AuthController } from '../controllers/AuthController';

const router = express.Router();
// instance of AuthController
const authController = new AuthController();
router.post('/register', (req, res) => authController.register(req, res));

export default router;
