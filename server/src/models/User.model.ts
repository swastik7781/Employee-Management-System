import { Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { IUser, UserRole } from '../types';

const userSchema = new Schema<IUser>(
    {
        employeeId: {
            type: String,
            required: [true, 'Employee ID is required'],
            unique: true,
            trim: true,
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: [6, 'Password must be at least 6 characters'],
            select: false,
        },
        role: {
            type: String,
            enum: Object.values(UserRole),
            default: UserRole.EMPLOYEE,
            required: true,
        },
        firstName: {
            type: String,
            required: [true, 'First name is required'],
            trim: true,
        },
        lastName: {
            type: String,
            required: [true, 'Last name is required'],
            trim: true,
        },
        avatar: {
            type: String,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        isEmailVerified: {
            type: Boolean,
            default: false,
        },
        lastLogin: {
            type: Date,
        },
        refreshToken: {
            type: String,
            select: false,
        },
        resetPasswordToken: {
            type: String,
            select: false,
        },
        resetPasswordExpire: {
            type: Date,
            select: false,
        },
        preferences: {
            theme: {
                type: String,
                enum: ['light', 'dark', 'system'],
                default: 'system',
            },
            sidebarExpanded: {
                type: Boolean,
                default: true,
            },
            notifications: {
                email: { type: Boolean, default: true },
                inApp: { type: Boolean, default: true },
                leaves: { type: Boolean, default: true },
                payroll: { type: Boolean, default: true },
                attendance: { type: Boolean, default: false },
                performance: { type: Boolean, default: true },
                announcements: { type: Boolean, default: true },
            },
        },
    },
    {
        timestamps: true,
        toJSON: {
            transform: function (doc, ret) {
                delete ret.password;
                delete ret.refreshToken;
                delete ret.resetPasswordToken;
                delete ret.resetPasswordExpire;
                return ret;
            },
        },
    }
);

// Index for faster queries
userSchema.index({ email: 1 });
userSchema.index({ employeeId: 1 });
userSchema.index({ role: 1 });

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Compare password method
userSchema.methods.comparePassword = async function (
    enteredPassword: string
): Promise<boolean> {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Generate JWT token
userSchema.methods.generateAuthToken = function (): string {
    return jwt.sign(
        {
            id: this._id,
            email: this.email,
            role: this.role,
        },
        process.env.JWT_SECRET || 'default-secret',
        {
            expiresIn: (process.env.JWT_EXPIRE || '7d') as any,
        }
    );
};

// Generate refresh token
userSchema.methods.generateRefreshToken = function (): string {
    return jwt.sign(
        {
            id: this._id,
        },
        process.env.JWT_REFRESH_SECRET || 'default-refresh-secret',
        {
            expiresIn: (process.env.JWT_REFRESH_EXPIRE || '30d') as any,
        }
    );
};

export const User = model<IUser>('User', userSchema);
