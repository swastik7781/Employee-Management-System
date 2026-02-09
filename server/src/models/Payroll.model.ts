import { Schema, model } from 'mongoose';
import { IPayroll } from '../types';

const payrollComponentSchema = new Schema({
    name: { type: String, required: true },
    type: { type: String, required: true },
    amount: { type: Number, required: true },
    isTaxable: { type: Boolean, default: false },
    isStatutory: { type: Boolean, default: false },
}, { _id: false });

const taxDetailsSchema = new Schema({
    taxableIncome: { type: Number, default: 0 },
    incomeTax: { type: Number, default: 0 },
    professionalTax: { type: Number, default: 0 },
    tds: { type: Number, default: 0 },
    totalTax: { type: Number, default: 0 },
}, { _id: false });

const payrollSchema = new Schema<IPayroll>(
    {
        employee: {
            type: Schema.Types.ObjectId,
            ref: 'Employee',
            required: true,
        },
        month: {
            type: Number,
            required: true,
            min: 1,
            max: 12,
        },
        year: {
            type: Number,
            required: true,
        },
        payPeriodStart: {
            type: Date,
            required: true,
        },
        payPeriodEnd: {
            type: Date,
            required: true,
        },
        payDate: {
            type: Date,
            required: true,
        },
        earnings: [payrollComponentSchema],
        deductions: [payrollComponentSchema],
        grossSalary: {
            type: Number,
            required: true,
        },
        totalDeductions: {
            type: Number,
            required: true,
        },
        netSalary: {
            type: Number,
            required: true,
        },
        taxDetails: taxDetailsSchema,
        status: {
            type: String,
            enum: ['draft', 'processed', 'paid', 'cancelled'],
            default: 'draft',
        },
        paymentMethod: {
            type: String,
            enum: ['bank-transfer', 'cash', 'cheque'],
            default: 'bank-transfer',
        },
        transactionId: String,
        remarks: String,
        processedBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        approvedBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
    },
    {
        timestamps: true,
    }
);

payrollSchema.index({ employee: 1, month: 1, year: 1 }, { unique: true });
payrollSchema.index({ status: 1 });

export const Payroll = model<IPayroll>('Payroll', payrollSchema);
