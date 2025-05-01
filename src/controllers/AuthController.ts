import { NextFunction, Response } from 'express';
import { RegisterUserRequest } from '../types/index';
import { UserService } from '../services/UserService';
import { Logger } from 'winston';
import createHttpError from 'http-errors';

export class AuthController {
    // dependency injection
    // constructor(private userService: UserService) {}
    constructor(
        private userService: UserService,
        private logger: Logger,
    ) {}
    // method
    async register(
        req: RegisterUserRequest,
        res: Response,
        next: NextFunction,
    ) {
        const { firstName, lastName, email, password } = req.body;
        if (!email) {
            const err = createHttpError(400, 'Email is required');
            next(err);
            return;
        }
        // debug
        this.logger.debug('New request to register auser:', {
            firstName,
            lastName,
            email,
            password: '****',
        });
        try {
            const user = await this.userService.create({
                firstName,
                lastName,
                email,
                password,
            });
            this.logger.info('User has been registered', { id: user.id });
            res.status(201).json({ id: user.id });
        } catch (err) {
            next(err);
            return;
        }
    }
}
