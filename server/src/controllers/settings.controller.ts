import { Response } from 'express';
import { User } from '../models/User.model';
import { AuthRequest, ApiResponse } from '../types';
import { AppError, asyncHandler } from '../middleware/error.middleware';

/**
 * @desc    Get user settings
 * @route   GET /api/settings
 * @access  Private
 */
export const getSettings = asyncHandler(
    async (req: AuthRequest, res: Response) => {
        const user = await User.findById(req.user?._id);

        if (!user) {
            throw new AppError('User not found', 404);
        }

        const response: ApiResponse = {
            success: true,
            data: user.preferences || {},
        };

        res.status(200).json(response);
    }
);

/**
 * @desc    Update user settings
 * @route   PUT /api/settings
 * @access  Private
 */
export const updateSettings = asyncHandler(
    async (req: AuthRequest, res: Response) => {
        const user = await User.findById(req.user?._id);

        if (!user) {
            throw new AppError('User not found', 404);
        }

        const { theme, sidebarExpanded, notifications } = req.body;

        user.preferences = {
            ...user.preferences,
            theme: theme || user.preferences?.theme,
            sidebarExpanded: sidebarExpanded !== undefined ? sidebarExpanded : user.preferences?.sidebarExpanded,
            notifications: {
                ...user.preferences?.notifications,
                ...notifications,
            },
        };

        await user.save();

        const response: ApiResponse = {
            success: true,
            message: 'Settings updated successfully',
            data: user.preferences,
        };

        res.status(200).json(response);
    }
);
