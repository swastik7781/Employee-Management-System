import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../models/User.model';
import { Employee } from '../models/Employee.model';
import { Department } from '../models/Department.model';
import { Shift } from '../models/Others.model';
import { UserRole } from '../types';
import QRCode from 'qrcode';

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/worksphere');
        console.log('MongoDB Connected');
    } catch (error: any) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

const addEmployees = async () => {
    try {
        console.log('🌱 Adding Swastik Bhardwaj and Arnab Sahoo...');

        // Get a department and shift
        const department = await Department.findOne({ code: 'ENG' });
        const shift = await Shift.findOne({ code: 'GEN' });

        if (!department || !shift) {
            throw new Error('Department or Shift not found. Please run seed script first.');
        }

        // Get admin user for createdBy field
        const adminUser = await User.findOne({ email: 'admin@swastikindustries.com' });

        // Employee 1: Swastik Bhardwaj
        console.log('\n1. Creating Swastik Bhardwaj...');

        const swastikUser = await User.create({
            employeeId: 'EMP000102',
            email: 'swastik.bhardwaj@swastikindustries.com',
            password: 'Swastik@123',
            firstName: 'Swastik',
            lastName: 'Bhardwaj',
            role: UserRole.EMPLOYEE,
            isActive: true,
            isEmailVerified: true,
        });

        const swastikQrCode = await QRCode.toDataURL(swastikUser.employeeId);

        await Employee.create({
            employeeNumber: 'EMP000102',
            userId: swastikUser._id,
            personalInfo: {
                firstName: 'Swastik',
                lastName: 'Bhardwaj',
                dateOfBirth: new Date('2000-01-15'),
                gender: 'male',
                maritalStatus: 'single',
                bloodGroup: 'O+',
                nationality: 'Indian',
            },
            contactInfo: {
                email: 'swastik.bhardwaj@swastikindustries.com',
                phone: '+91-9876543210',
                currentAddress: {
                    street: '123 Tech Street',
                    city: 'Mumbai',
                    state: 'Maharashtra',
                    country: 'India',
                    zipCode: '400001',
                },
                permanentAddress: {
                    street: '123 Tech Street',
                    city: 'Mumbai',
                    state: 'Maharashtra',
                    country: 'India',
                    zipCode: '400001',
                },
            },
            professionalInfo: {
                designation: 'Software Engineer',
                department: department._id,
                employeeType: 'full-time',
                employmentStatus: 'active',
                joiningDate: new Date('2024-01-15'),
                isProbation: false,
                workLocation: 'Mumbai',
                shift: shift._id,
                workMode: 'hybrid',
            },
            salaryInfo: {
                currentSalary: 800000,
                currency: 'INR',
                paymentMode: 'bank-transfer',
                bankDetails: {
                    accountNumber: '1234567890123',
                    accountHolderName: 'Swastik Bhardwaj',
                    bankName: 'HDFC Bank',
                    branchName: 'Mumbai Main',
                    ifscCode: 'HDFC0000001',
                },
            },
            emergencyContacts: [{
                name: 'Emergency Contact',
                relationship: 'Parent',
                phone: '+91-9876543211',
            }],
            skills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'MongoDB'],
            qrCode: swastikQrCode,
            isActive: true,
            createdBy: adminUser?._id,
            updatedBy: adminUser?._id,
        });

        console.log('✅ Swastik Bhardwaj created successfully!');

        // Employee 2: Arnab Sahoo
        console.log('\n2. Creating Arnab Sahoo...');

        const arnabUser = await User.create({
            employeeId: 'EMP000103',
            email: 'arnab.sahoo@swastikindustries.com',
            password: 'Arnab@123',
            firstName: 'Arnab',
            lastName: 'Sahoo',
            role: UserRole.EMPLOYEE,
            isActive: true,
            isEmailVerified: true,
        });

        const arnabQrCode = await QRCode.toDataURL(arnabUser.employeeId);

        await Employee.create({
            employeeNumber: 'EMP000103',
            userId: arnabUser._id,
            personalInfo: {
                firstName: 'Arnab',
                lastName: 'Sahoo',
                dateOfBirth: new Date('1999-05-20'),
                gender: 'male',
                maritalStatus: 'single',
                bloodGroup: 'A+',
                nationality: 'Indian',
            },
            contactInfo: {
                email: 'arnab.sahoo@swastikindustries.com',
                phone: '+91-9876543212',
                currentAddress: {
                    street: '456 Developer Lane',
                    city: 'Mumbai',
                    state: 'Maharashtra',
                    country: 'India',
                    zipCode: '400002',
                },
                permanentAddress: {
                    street: '456 Developer Lane',
                    city: 'Mumbai',
                    state: 'Maharashtra',
                    country: 'India',
                    zipCode: '400002',
                },
            },
            professionalInfo: {
                designation: 'Senior Software Engineer',
                department: department._id,
                employeeType: 'full-time',
                employmentStatus: 'active',
                joiningDate: new Date('2023-06-01'),
                isProbation: false,
                workLocation: 'Mumbai',
                shift: shift._id,
                workMode: 'office',
            },
            salaryInfo: {
                currentSalary: 1200000,
                currency: 'INR',
                paymentMode: 'bank-transfer',
                bankDetails: {
                    accountNumber: '9876543210123',
                    accountHolderName: 'Arnab Sahoo',
                    bankName: 'ICICI Bank',
                    branchName: 'Mumbai Branch',
                    ifscCode: 'ICIC0000001',
                },
            },
            emergencyContacts: [{
                name: 'Emergency Contact',
                relationship: 'Parent',
                phone: '+91-9876543213',
            }],
            skills: ['Python', 'Java', 'React', 'AWS', 'Docker'],
            qrCode: arnabQrCode,
            isActive: true,
            createdBy: adminUser?._id,
            updatedBy: adminUser?._id,
        });

        console.log('✅ Arnab Sahoo created successfully!');

        console.log('\n🎉 Both employees added successfully!');
        console.log('\n📝 Login Credentials:');
        console.log('\n1. Swastik Bhardwaj:');
        console.log('   Email: swastik.bhardwaj@swastikindustries.com');
        console.log('   Password: Swastik@123');
        console.log('\n2. Arnab Sahoo:');
        console.log('   Email: arnab.sahoo@swastikindustries.com');
        console.log('   Password: Arnab@123');

        process.exit(0);
    } catch (error: any) {
        console.error('❌ Error adding employees:', error.message);
        process.exit(1);
    }
};

connectDB().then(addEmployees);
