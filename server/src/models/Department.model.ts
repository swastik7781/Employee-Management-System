import { Schema, model } from 'mongoose';
import { IDepartment } from '../types';

const departmentSchema = new Schema<IDepartment>(
    {
        name: {
            type: String,
            required: [true, 'Department name is required'],
            trim: true,
            unique: true,
        },
        code: {
            type: String,
            required: [true, 'Department code is required'],
            unique: true,
            uppercase: true,
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        head: {
            type: Schema.Types.ObjectId,
            ref: 'Employee',
        },
        parentDepartment: {
            type: Schema.Types.ObjectId,
            ref: 'Department',
        },
        location: {
            type: String,
            required: true,
        },
        budget: {
            type: Number,
            default: 0,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

departmentSchema.index({ code: 1 });
departmentSchema.index({ isActive: 1 });

export const Department = model<IDepartment>('Department', departmentSchema);
