import { Request, Response } from 'express';

export class AuthController {
    // method
    register(req: Request, res: Response) {
        res.status(201).json();
    }
}
