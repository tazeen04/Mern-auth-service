import { Response } from 'express';
import { RegisterUserRequest } from '../types/index';
import { UserService } from '../services/UserService';

export class AuthController {
    // dependency injection
    // constructor(private userService: UserService) {}
    constructor(private userService: UserService) {}
    // method
    async register(req: RegisterUserRequest, res: Response) {
        const { firstName, lastName, email, password } = req.body;
        await this.userService.create({ firstName, lastName, email, password });
        res.status(201).json();
    }
}
