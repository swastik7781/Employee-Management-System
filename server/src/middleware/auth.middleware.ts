import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.model';
import { AuthRequest, UserRole } from '../types';
import { AppError } from './error.middleware';
import { asyncHandler } from './error.middleware';

export const protect = asyncHandler(
    async (req: AuthRequest, res: Response, next: NextFunction) => {
        let token: string | undefined;

        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')
        ) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            throw new AppError('Not authorized to access this route', 401);
        }

        try {
            const decoded: any = jwt.verify(
                token,
                process.env.JWT_SECRET || 'default-secret'
            );

            const user = await User.findById(decoded.id);

            if (!user) {
                throw new AppError('User not found', 404);
            }

            if (!user.isActive) {
                throw new AppError('User account is deactivated', 403);
            }

            req.user = user;
            next();
        } catch (error) {
            throw new AppError('Not authorized to access this route', 401);
        }
    }
);

export const authorize = (...roles: UserRole[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user) {
            throw new AppError('Not authorized', 401);
        }

        if (!roles.includes(req.user.role)) {
            throw new AppError(
                `User role '${req.user.role}' is not authorized to access this route`,
                403
            );
        }

        next();
    };
};
