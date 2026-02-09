import { Schema, model } from 'mongoose';
import { IAsset, ITraining, INotification, IAuditLog, IHoliday, IShift } from '../types';

// Asset Model
const maintenanceRecordSchema = new Schema({
    date: { type: Date, required: true },
    type: {
        type: String,
        enum: ['repair', 'service', 'upgrade'],
        required: true,
    },
    description: { type: String, required: true },
    cost: Number,
    performedBy: String,
}, { _id: false });

const assetSchema = new Schema<IAsset>(
    {
        assetNumber: {
            type: String,
            required: true,
            unique: true,
        },
        name: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            required: true,
        },
        brand: String,
        model: String,
        serialNumber: String,
        purchaseDate: {
            type: Date,
            required: true,
        },
        purchasePrice: {
            type: Number,
            required: true,
        },
        currentValue: {
            type: Number,
            required: true,
        },
        depreciationRate: Number,
        warrantyExpiry: Date,
        assignedTo: {
            type: Schema.Types.ObjectId,
            ref: 'Employee',
        },
        assignmentDate: Date,
        returnDate: Date,
        status: {
            type: String,
            enum: ['available', 'assigned', 'under-maintenance', 'retired', 'lost'],
            default: 'available',
        },
        condition: {
            type: String,
            enum: ['excellent', 'good', 'fair', 'poor'],
            default: 'excellent',
        },
        location: {
            type: String,
            required: true,
        },
        qrCode: String,
        maintenanceHistory: [maintenanceRecordSchema],
        remarks: String,
    },
    {
        timestamps: true,
    }
);

assetSchema.index({ assetNumber: 1 });
assetSchema.index({ status: 1 });

// Training Model
const trainingParticipantSchema = new Schema({
    employee: {
        type: Schema.Types.ObjectId,
        ref: 'Employee',
        required: true,
    },
    enrollmentDate: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: String,
        enum: ['enrolled', 'completed', 'dropped', 'failed'],
        default: 'enrolled',
    },
    attendance: Number,
    score: Number,
    feedback: String,
    certificateUrl: String,
}, { _id: false });

const trainingSchema = new Schema<ITraining>(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            enum: ['internal', 'external', 'online', 'workshop', 'seminar'],
            required: true,
        },
        trainer: String,
        trainerType: {
            type: String,
            enum: ['internal', 'external'],
            default: 'internal',
        },
        startDate: {
            type: Date,
            required: true,
        },
        endDate: {
            type: Date,
            required: true,
        },
        duration: {
            type: Number,
            required: true,
        },
        location: String,
        mode: {
            type: String,
            enum: ['online', 'offline', 'hybrid'],
            default: 'offline',
        },
        maxParticipants: Number,
        participants: [trainingParticipantSchema],
        budget: Number,
        actualCost: Number,
        materials: [String],
        status: {
            type: String,
            enum: ['scheduled', 'ongoing', 'completed', 'cancelled'],
            default: 'scheduled',
        },
    },
    {
        timestamps: true,
    }
);

// Notification Model
const notificationSchema = new Schema<INotification>(
    {
        recipient: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        type: {
            type: String,
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        message: {
            type: String,
            required: true,
        },
        data: Schema.Types.Mixed,
        isRead: {
            type: Boolean,
            default: false,
        },
        readAt: Date,
        priority: {
            type: String,
            enum: ['low', 'medium', 'high', 'urgent'],
            default: 'medium',
        },
        actionUrl: String,
    },
    {
        timestamps: true,
    }
);

notificationSchema.index({ recipient: 1, isRead: 1 });
notificationSchema.index({ createdAt: -1 });

// Audit Log Model
const auditLogSchema = new Schema<IAuditLog>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        action: {
            type: String,
            required: true,
        },
        resource: {
            type: String,
            required: true,
        },
        resourceId: String,
        changes: Schema.Types.Mixed,
        ipAddress: String,
        userAgent: String,
        timestamp: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: false,
    }
);

auditLogSchema.index({ user: 1, timestamp: -1 });
auditLogSchema.index({ resource: 1, timestamp: -1 });

// Holiday Model
const holidaySchema = new Schema<IHoliday>(
    {
        name: {
            type: String,
            required: true,
        },
        date: {
            type: Date,
            required: true,
        },
        type: {
            type: String,
            enum: ['national', 'regional', 'company'],
            required: true,
        },
        isOptional: {
            type: Boolean,
            default: false,
        },
        applicableLocations: [String],
        description: String,
    },
    {
        timestamps: true,
    }
);

holidaySchema.index({ date: 1 });

// Shift Model
const shiftSchema = new Schema<IShift>(
    {
        name: {
            type: String,
            required: true,
        },
        code: {
            type: String,
            required: true,
            unique: true,
            uppercase: true,
        },
        startTime: {
            type: String,
            required: true,
        },
        endTime: {
            type: String,
            required: true,
        },
        graceTime: {
            type: Number,
            default: 15,
        },
        minimumHours: {
            type: Number,
            required: true,
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

export const Asset = model<IAsset>('Asset', assetSchema);
export const Training = model<ITraining>('Training', trainingSchema);
export const Notification = model<INotification>('Notification', notificationSchema);
export const AuditLog = model<IAuditLog>('AuditLog', auditLogSchema);
export const Holiday = model<IHoliday>('Holiday', holidaySchema);
export const Shift = model<IShift>('Shift', shiftSchema);
