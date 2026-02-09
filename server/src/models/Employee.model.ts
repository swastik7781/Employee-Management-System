import { Schema, model } from 'mongoose';
import { IEmployee } from '../types';

const addressSchema = new Schema({
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    zipCode: { type: String, required: true },
}, { _id: false });

const bankDetailsSchema = new Schema({
    accountNumber: { type: String, required: true },
    accountHolderName: { type: String, required: true },
    bankName: { type: String, required: true },
    branchName: { type: String, required: true },
    ifscCode: { type: String, required: true },
    swiftCode: String,
}, { _id: false });

const emergencyContactSchema = new Schema({
    name: { type: String, required: true },
    relationship: { type: String, required: true },
    phone: { type: String, required: true },
    alternatePhone: String,
    address: String,
}, { _id: false });

const familyMemberSchema = new Schema({
    name: { type: String, required: true },
    relationship: { type: String, required: true },
    dateOfBirth: Date,
    occupation: String,
    phone: String,
    isDependent: { type: Boolean, default: false },
}, { _id: false });

const educationSchema = new Schema({
    degree: { type: String, required: true },
    institution: { type: String, required: true },
    university: { type: String, required: true },
    yearOfPassing: { type: Number, required: true },
    percentage: Number,
    grade: String,
}, { _id: false });

const workExperienceSchema = new Schema({
    company: { type: String, required: true },
    designation: { type: String, required: true },
    from: { type: Date, required: true },
    to: Date,
    isCurrent: { type: Boolean, default: false },
    description: String,
}, { _id: false });

const certificationSchema = new Schema({
    name: { type: String, required: true },
    issuingOrganization: { type: String, required: true },
    issueDate: { type: Date, required: true },
    expiryDate: Date,
    credentialId: String,
    credentialUrl: String,
}, { _id: false });

const documentSchema = new Schema({
    type: { type: String, required: true },
    name: { type: String, required: true },
    url: { type: String, required: true },
    uploadDate: { type: Date, default: Date.now },
    expiryDate: Date,
    verificationStatus: {
        type: String,
        enum: ['pending', 'verified', 'rejected'],
        default: 'pending',
    },
}, { _id: false });

const employeeSchema = new Schema<IEmployee>(
    {
        employeeNumber: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },

        personalInfo: {
            firstName: { type: String, required: true, trim: true },
            middleName: { type: String, trim: true },
            lastName: { type: String, required: true, trim: true },
            dateOfBirth: { type: Date, required: true },
            gender: {
                type: String,
                enum: ['male', 'female', 'other'],
                required: true,
            },
            maritalStatus: {
                type: String,
                enum: ['single', 'married', 'divorced', 'widowed'],
                default: 'single',
            },
            bloodGroup: String,
            nationality: { type: String, required: true },
            religion: String,
            photo: String,
        },

        contactInfo: {
            email: { type: String, required: true },
            personalEmail: String,
            phone: { type: String, required: true },
            alternatePhone: String,
            currentAddress: { type: addressSchema, required: true },
            permanentAddress: { type: addressSchema, required: true },
        },

        professionalInfo: {
            designation: { type: String, required: true },
            department: {
                type: Schema.Types.ObjectId,
                ref: 'Department',
                required: true,
            },
            team: {
                type: Schema.Types.ObjectId,
                ref: 'Team',
            },
            employeeType: {
                type: String,
                enum: ['full-time', 'part-time', 'contract', 'intern'],
                required: true,
            },
            employmentStatus: {
                type: String,
                enum: ['active', 'inactive', 'terminated', 'resigned', 'on-leave'],
                default: 'active',
            },
            joiningDate: { type: Date, required: true },
            confirmationDate: Date,
            probationPeriod: { type: Number, default: 6 },
            isProbation: { type: Boolean, default: true },
            reportingManager: {
                type: Schema.Types.ObjectId,
                ref: 'Employee',
            },
            workLocation: { type: String, required: true },
            shift: {
                type: Schema.Types.ObjectId,
                ref: 'Shift',
            },
            workMode: {
                type: String,
                enum: ['office', 'remote', 'hybrid'],
                default: 'office',
            },
        },

        salaryInfo: {
            currentSalary: { type: Number, required: true },
            currency: { type: String, default: 'INR' },
            paymentMode: {
                type: String,
                enum: ['bank-transfer', 'cash', 'cheque'],
                default: 'bank-transfer',
            },
            bankDetails: bankDetailsSchema,
        },

        emergencyContacts: [emergencyContactSchema],
        familyMembers: [familyMemberSchema],
        education: [educationSchema],
        workExperience: [workExperienceSchema],
        skills: [String],
        certifications: [certificationSchema],
        documents: [documentSchema],

        qrCode: String,
        biometricId: String,
        rfidCard: String,

        isActive: { type: Boolean, default: true },
        exitDate: Date,
        exitReason: String,

        createdBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        updatedBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

// Indexes for better query performance
employeeSchema.index({ employeeNumber: 1 });
employeeSchema.index({ 'contactInfo.email': 1 });
employeeSchema.index({ 'professionalInfo.department': 1 });
employeeSchema.index({ 'professionalInfo.employmentStatus': 1 });
employeeSchema.index({ isActive: 1 });
employeeSchema.index({ createdAt: -1 });

// Auto-generate employee number
employeeSchema.pre('save', async function (next) {
    if (!this.employeeNumber) {
        const count = await model('Employee').countDocuments();
        this.employeeNumber = `EMP${String(count + 1).padStart(6, '0')}`;
    }
    next();
});

export const Employee = model<IEmployee>('Employee', employeeSchema);
