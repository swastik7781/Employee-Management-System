import { Request, Response } from 'express';
import { User } from '../models/User.model';
import { Employee } from '../models/Employee.model';
import { AuthRequest, ApiResponse } from '../types';
import { AppError, asyncHandler } from '../middleware/error.middleware';
import { logger } from '../utils/logger';

/**
 * @desc    Register new user
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = asyncHandler(
    async (req: Request, res: Response) => {
        const { employeeId, email, password, firstName, lastName, role } = req.body;

        // Check if user exists
        const userExists = await User.findOne({ $or: [{ email }, { employeeId }] });

        if (userExists) {
            throw new AppError('User already exists', 400);
        }

        // Create user
        const user = await User.create({
            employeeId,
            email,
            password,
            firstName,
            lastName,
            role,
        });

        // Generate token
        const token = user.generateAuthToken();
        const refreshToken = user.generateRefreshToken();

        // Save refresh token
        user.refreshToken = refreshToken;
        await user.save();

        logger.info(`New user registered: ${user.email}`);

        const response: ApiResponse = {
            success: true,
            message: 'User registered successfully',
            data: {
                user: {
                    id: user._id,
                    employeeId: user.employeeId,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    role: user.role,
                },
                token,
                refreshToken,
            },
        };

        res.status(201).json(response);
    }
);

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = asyncHandler(
    async (req: Request, res: Response) => {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            throw new AppError('Please provide email and password', 400);
        }

        // Check for user
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            throw new AppError('Invalid credentials', 401);
        }

        // Check if user is active
        if (!user.isActive) {
            throw new AppError('Your account has been deactivated', 403);
        }

        // Check password
        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            throw new AppError('Invalid credentials', 401);
        }

        // Update last login
        user.lastLogin = new Date();
        await user.save();

        // Generate tokens
        const token = user.generateAuthToken();
        const refreshToken = user.generateRefreshToken();

        // Save refresh token
        user.refreshToken = refreshToken;
        await user.save();

        logger.info(`User logged in: ${user.email}`);

        const response: ApiResponse = {
            success: true,
            message: 'Login successful',
            data: {
                user: {
                    id: user._id,
                    employeeId: user.employeeId,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    role: user.role,
                    avatar: user.avatar,
                    lastLogin: user.lastLogin,
                },
                token,
                refreshToken,
            },
        };

        res.status(200).json(response);
    }
);

/**
 * @desc    Get current user
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getMe = asyncHandler(
    async (req: AuthRequest, res: Response) => {
        const user = await User.findById(req.user?._id);

        if (!user) {
            throw new AppError('User not found', 404);
        }

        // Get employee details
        const employee = await Employee.findOne({ userId: user._id })
            .populate('professionalInfo.department')
            .populate('professionalInfo.reportingManager');

        const response: ApiResponse = {
            success: true,
            data: {
                user,
                employee,
            },
        };

        res.status(200).json(response);
    }
);

/**
 * @desc    Refresh token
 * @route   POST /api/auth/refresh
 * @access  Public
 */
export const refreshToken = asyncHandler(
    async (req: Request, res: Response) => {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            throw new AppError('Refresh token is required', 400);
        }

        // Verify refresh token
        const decoded: any = jwt.verify(
            refreshToken,
            process.env.JWT_REFRESH_SECRET || 'default-refresh-secret'
        );

        // Find user
        const user = await User.findById(decoded.id).select('+refreshToken');

        if (!user || user.refreshToken !== refreshToken) {
            throw new AppError('Invalid refresh token', 401);
        }

        // Generate new tokens
        const newToken = user.generateAuthToken();
        const newRefreshToken = user.generateRefreshToken();

        // Save new refresh token
        user.refreshToken = newRefreshToken;
        await user.save();

        const response: ApiResponse = {
            success: true,
            data: {
                token: newToken,
                refreshToken: newRefreshToken,
            },
        };

        res.status(200).json(response);
    }
);

/**
 * @desc    Logout user
 * @route   POST /api/auth/logout
 * @access  Private
 */
export const logout = asyncHandler(
    async (req: AuthRequest, res: Response) => {
        const user = await User.findById(req.user?._id);

        if (user) {
            user.refreshToken = undefined;
            await user.save();
        }

        const response: ApiResponse = {
            success: true,
            message: 'Logged out successfully',
        };

        res.status(200).json(response);
    }
);

/**
 * @desc    Change password
 * @route   PUT /api/auth/change-password
 * @access  Private
 */
export const changePassword = asyncHandler(
    async (req: AuthRequest, res: Response) => {
        const { currentPassword, newPassword } = req.body;

        const user = await User.findById(req.user?._id).select('+password');

        if (!user) {
            throw new AppError('User not found', 404);
        }

        // Verify current password
        const isMatch = await user.comparePassword(currentPassword);

        if (!isMatch) {
            throw new AppError('Current password is incorrect', 401);
        }

        // Update password
        user.password = newPassword;
        await user.save();

        logger.info(`Password changed for user: ${user.email}`);

        const response: ApiResponse = {
            success: true,
            message: 'Password changed successfully',
        };

        res.status(200).json(response);
    }
);

import jwt from 'jsonwebtoken';
