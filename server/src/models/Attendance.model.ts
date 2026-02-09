import { Schema, model } from 'mongoose';
import { IAttendance } from '../types';

const breakSchema = new Schema({
    startTime: { type: Date, required: true },
    endTime: Date,
    duration: Number,
    type: {
        type: String,
        enum: ['lunch', 'tea', 'other'],
        default: 'other',
    },
}, { _id: false });

const locationSchema = new Schema({
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    address: String,
}, { _id: false });

const attendanceSchema = new Schema<IAttendance>(
    {
        employee: {
            type: Schema.Types.ObjectId,
            ref: 'Employee',
            required: true,
        },
        date: {
            type: Date,
            required: true,
        },
        checkIn: Date,
        checkOut: Date,
        status: {
            type: String,
            enum: ['present', 'absent', 'half-day', 'late', 'on-leave', 'holiday', 'weekend'],
            required: true,
        },
        workHours: Number,
        overtimeHours: Number,
        breaks: [breakSchema],
        location: locationSchema,
        device: String,
        remarks: String,
        isRegularized: {
            type: Boolean,
            default: false,
        },
        regularizationReason: String,
        approvedBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
    },
    {
        timestamps: true,
    }
);

attendanceSchema.index({ employee: 1, date: 1 }, { unique: true });
attendanceSchema.index({ date: -1 });
attendanceSchema.index({ status: 1 });

export const Attendance = model<IAttendance>('Attendance', attendanceSchema);
