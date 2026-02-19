import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../models/User.model';
import bcrypt from 'bcryptjs';

console.log('Script started...');

dotenv.config();
console.log('ENV loaded.');

const verifyCredentials = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/worksphere');
        console.log('Connected to MongoDB.');

        // Find one employee
        console.log('Finding user...');
        const user = await User.findOne({ role: { $ne: 'super-admin' } });

        if (!user) {
            console.log('❌ No non-admin user found!');
            process.exit(1);
        }

        console.log(`Found User: ${user.email} (Role: ${user.role})`);

        // Check password
        console.log('Checking password...');
        const isMatch = await bcrypt.compare('Employee@123', user.password);

        if (isMatch) {
            console.log('✅ Password "Employee@123" is CORRECT.');
            console.log(`\n--- LOGIN WITH ---\nEmail: ${user.email}\nPassword: Employee@123\n------------------`);
        } else {
            console.log('❌ Password "Employee@123" is INCORRECT.');
            console.log('Attempting to reset password to "Employee@123"...');

            user.password = 'Employee@123';
            await user.save();
            console.log('✅ Password reset successful. Try login now.');
            console.log(`\n--- LOGIN WITH ---\nEmail: ${user.email}\nPassword: Employee@123\n------------------`);
        }

        process.exit(0);
    } catch (error: any) {
        console.error('❌ Error in script:', error.message || error);
        process.exit(1);
    }
};

verifyCredentials();
