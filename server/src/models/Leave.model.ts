import { Schema, model } from 'mongoose';
import { ILeave, ILeaveType, ILeaveBalance } from '../types';

const approvalStepSchema = new Schema({
    approver: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    level: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending',
    },
    actionDate: Date,
    comments: String,
}, { _id: false });

const leaveSchema = new Schema<ILeave>(
    {
        employee: {
            type: Schema.Types.ObjectId,
            ref: 'Employee',
            required: true,
        },
        leaveType: {
            type: Schema.Types.ObjectId,
            ref: 'LeaveType',
            required: true,
        },
        fromDate: {
            type: Date,
            required: true,
        },
        toDate: {
            type: Date,
            required: true,
        },
        numberOfDays: {
            type: Number,
            required: true,
        },
        isHalfDay: {
            type: Boolean,
            default: false,
        },
        halfDayPeriod: {
            type: String,
            enum: ['first-half', 'second-half'],
        },
        reason: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected', 'cancelled'],
            default: 'pending',
        },
        appliedDate: {
            type: Date,
            default: Date.now,
        },
        approvalWorkflow: [approvalStepSchema],
        attachments: [String],
        remarks: String,
    },
    {
        timestamps: true,
    }
);

leaveSchema.index({ employee: 1, fromDate: -1 });
leaveSchema.index({ status: 1 });

const leaveTypeSchema = new Schema<ILeaveType>(
    {
        name: {
            type: String,
            required: true,
            unique: true,
        },
        code: {
            type: String,
            required: true,
            unique: true,
            uppercase: true,
        },
        description: String,
        maxDaysPerYear: {
            type: Number,
            required: true,
        },
        isCarryForward: {
            type: Boolean,
            default: false,
        },
        maxCarryForwardDays: Number,
        isEncashable: {
            type: Boolean,
            default: false,
        },
        isPaid: {
            type: Boolean,
            default: true,
        },
        applicableGender: {
            type: String,
            enum: ['male', 'female', 'all'],
            default: 'all',
        },
        minServiceMonths: {
            type: Number,
            default: 0,
        },
        requiresApproval: {
            type: Boolean,
            default: true,
        },
        approvalLevels: {
            type: Number,
            default: 1,
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

const leaveBalanceSchema = new Schema<ILeaveBalance>(
    {
        employee: {
            type: Schema.Types.ObjectId,
            ref: 'Employee',
            required: true,
        },
        leaveType: {
            type: Schema.Types.ObjectId,
            ref: 'LeaveType',
            required: true,
        },
        year: {
            type: Number,
            required: true,
        },
        allocated: {
            type: Number,
            required: true,
        },
        used: {
            type: Number,
            default: 0,
        },
        balance: {
            type: Number,
            required: true,
        },
        carriedForward: {
            type: Number,
            default: 0,
        },
        encashed: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

leaveBalanceSchema.index({ employee: 1, leaveType: 1, year: 1 }, { unique: true });

export const Leave = model<ILeave>('Leave', leaveSchema);
export const LeaveType = model<ILeaveType>('LeaveType', leaveTypeSchema);
export const LeaveBalance = model<ILeaveBalance>('LeaveBalance', leaveBalanceSchema);
