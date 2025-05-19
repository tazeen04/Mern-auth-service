import { NextFunction, Request, Response } from 'express';
import { AuthRequest } from '../types';
import createHttpError from 'http-errors';
import { error } from 'console';

export const canAccess = (roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const _req = req as AuthRequest;
        const rolesFromToken = _req.auth.role;

        if (!roles.includes(rolesFromToken)) {
            const error = createHttpError(
                403,
                'you dont have permission to access',
            );

            next(error);
            return;
        }
        next();
    };
};
