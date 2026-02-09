import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../models/User.model';
import { Employee } from '../models/Employee.model';
import { Department } from '../models/Department.model';
import { LeaveType } from '../models/Leave.model';
import { Shift, Holiday } from '../models/Others.model';
import { UserRole } from '../types';
import QRCode from 'qrcode';

dotenv.config();

const departments = [
    { name: 'Engineering', code: 'ENG', location: 'Mumbai', budget: 5000000 },
    { name: 'Human Resources', code: 'HR', location: 'Mumbai', budget: 2000000 },
    { name: 'Finance', code: 'FIN', location: 'Mumbai', budget: 3000000 },
    { name: 'Marketing', code: 'MKT', location: 'Mumbai', budget: 2500000 },
    { name: 'Sales', code: 'SAL', location: 'Mumbai', budget: 4000000 },
    { name: 'Operations', code: 'OPS', location: 'Mumbai', budget: 3500000 },
    { name: 'IT Support', code: 'IT', location: 'Mumbai', budget: 1500000 },
    { name: 'Quality Assurance', code: 'QA', location: 'Mumbai', budget: 1800000 },
    { name: 'Research & Development', code: 'RND', location: 'Mumbai', budget: 6000000 },
    { name: 'Customer Service', code: 'CS', location: 'Mumbai', budget: 1200000 },
];

const leaveTypes = [
    { name: 'Annual Leave', code: 'AL', maxDaysPerYear: 21, isCarryForward: true, maxCarryForwardDays: 5, isEncashable: true, isPaid: true },
    { name: 'Sick Leave', code: 'SL', maxDaysPerYear: 12, isCarryForward: false, isEncashable: false, isPaid: true },
    { name: 'Casual Leave', code: 'CL', maxDaysPerYear: 7, isCarryForward: false, isEncashable: false, isPaid: true },
    { name: 'Maternity Leave', code: 'ML', maxDaysPerYear: 180, applicableGender: 'female' as const, isPaid: true },
    { name: 'Paternity Leave', code: 'PL', maxDaysPerYear: 15, applicableGender: 'male' as const, isPaid: true },
    { name: 'Comp Off', code: 'CO', maxDaysPerYear: 12, isCarryForward: false, isPaid: true },
    { name: 'Loss of Pay', code: 'LOP', maxDaysPerYear: 365, isPaid: false, requiresApproval: false },
    { name: 'Work From Home', code: 'WFH', maxDaysPerYear: 50, isPaid: true },
];

const shifts = [
    { name: 'General Shift', code: 'GEN', startTime: '09:00', endTime: '18:00', graceTime: 15, minimumHours: 8 },
    { name: 'Morning Shift', code: 'MOR', startTime: '06:00', endTime: '15:00', graceTime: 10, minimumHours: 8 },
    { name: 'Evening Shift', code: 'EVE', startTime: '14:00', endTime: '23:00', graceTime: 10, minimumHours: 8 },
    { name: 'Night Shift', code: 'NGT', startTime: '22:00', endTime: '07:00', graceTime: 10, minimumHours: 8 },
];

const holidays = [
    { name: 'Republic Day', date: new Date('2024-01-26'), type: 'national' as const },
    { name: 'Holi', date: new Date('2024-03-25'), type: 'national' as const },
    { name: 'Independence Day', date: new Date('2024-08-15'), type: 'national' as const },
    { name: 'Gandhi Jayanti', date: new Date('2024-10-02'), type: 'national' as const },
    { name: 'Diwali', date: new Date('2024-11-01'), type: 'national' as const },
    { name: 'Christmas', date: new Date('2024-12-25'), type: 'national' as const },
];

const firstNames = ['Rajesh', 'Priya', 'Amit', 'Sneha', 'Vikram', 'Anjali', 'Rahul', 'Pooja', 'Arjun', 'Kavita', 'Sanjay', 'Neha', 'Karan', 'Divya', 'Rohan', 'Swati', 'Aditya', 'Meera', 'Nikhil', 'Ritu'];
const lastNames = ['Sharma', 'Patel', 'Kumar', 'Singh', 'Gupta', 'Reddy', 'Verma', 'Joshi', 'Desai', 'Mehta', 'Shah', 'Nair', 'Iyer', 'Rao', 'Chopra', 'Malhotra', 'Agarwal', 'Bansal', 'Kapoor', 'Saxena'];
const designations = ['Software Engineer', 'Senior Engineer', 'Team Lead', 'Manager', 'Senior Manager', 'HR Executive', 'Finance Analyst', 'Marketing Executive', 'Sales Executive', 'Operations Manager'];
const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Pune', 'Hyderabad', 'Chennai', 'Kolkata', 'Ahmedabad'];
const states = ['Maharashtra', 'Delhi', 'Karnataka', 'Maharashtra', 'Telangana', 'Tamil Nadu', 'West Bengal', 'Gujarat'];

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/worksphere');
        console.log('MongoDB Connected');
    } catch (error: any) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

const seedDatabase = async () => {
    try {
        console.log('🌱 Starting database seeding...');

        // Clear existing data
        console.log('Clearing existing data...');
        await User.deleteMany({});
        await Employee.deleteMany({});
        await Department.deleteMany({});
        await LeaveType.deleteMany({});
        await Shift.deleteMany({});
        await Holiday.deleteMany({});

        // Create departments
        console.log('Creating departments...');
        const createdDepartments = await Department.insertMany(departments);
        console.log(`✅ Created ${createdDepartments.length} departments`);

        // Create leave types
        console.log('Creating leave types...');
        const createdLeaveTypes = await LeaveType.insertMany(leaveTypes);
        console.log(`✅ Created ${createdLeaveTypes.length} leave types`);

        // Create shifts
        console.log('Creating shifts...');
        const createdShifts = await Shift.insertMany(shifts);
        console.log(`✅ Created ${createdShifts.length} shifts`);

        // Create holidays
        console.log('Creating holidays...');
        await Holiday.insertMany(holidays);
        console.log(`✅ Created ${holidays.length} holidays`);

        // Create admin user
        console.log('Creating admin user...');
        const adminUser = await User.create({
            employeeId: 'EMP000001',
            email: 'admin@swastikindustries.com',
            password: 'Admin@123',
            firstName: 'Admin',
            lastName: 'User',
            role: UserRole.SUPER_ADMIN,
            isActive: true,
            isEmailVerified: true,
        });

        const adminQrCode = await QRCode.toDataURL(adminUser.employeeId);

        await Employee.create({
            employeeNumber: 'EMP000001',
            userId: adminUser._id,
            personalInfo: {
                firstName: 'Admin',
                lastName: 'User',
                dateOfBirth: new Date('1985-01-01'),
                gender: 'male',
                maritalStatus: 'married',
                bloodGroup: 'O+',
                nationality: 'Indian',
            },
            contactInfo: {
                email: 'admin@swastikindustries.com',
                phone: '+91-9876543210',
                currentAddress: {
                    street: '123 Admin Street',
                    city: 'Mumbai',
                    state: 'Maharashtra',
                    country: 'India',
                    zipCode: '400001',
                },
                permanentAddress: {
                    street: '123 Admin Street',
                    city: 'Mumbai',
                    state: 'Maharashtra',
                    country: 'India',
                    zipCode: '400001',
                },
            },
            professionalInfo: {
                designation: 'Chief Executive Officer',
                department: createdDepartments[0]._id,
                employeeType: 'full-time',
                employmentStatus: 'active',
                joiningDate: new Date('2020-01-01'),
                isProbation: false,
                workLocation: 'Mumbai',
                shift: createdShifts[0]._id,
                workMode: 'office',
            },
            salaryInfo: {
                currentSalary: 2000000,
                currency: 'INR',
                paymentMode: 'bank-transfer',
                bankDetails: {
                    accountNumber: '1234567890',
                    accountHolderName: 'Admin User',
                    bankName: 'HDFC Bank',
                    branchName: 'Mumbai Main',
                    ifscCode: 'HDFC0000001',
                },
            },
            emergencyContacts: [{
                name: 'Emergency Contact',
                relationship: 'Spouse',
                phone: '+91-9876543211',
            }],
            skills: ['Leadership', 'Management', 'Strategy'],
            qrCode: adminQrCode,
            isActive: true,
            createdBy: adminUser._id,
            updatedBy: adminUser._id,
        });

        console.log('✅ Created admin user');

        // Create 100 sample employees
        console.log('Creating 100 sample employees...');

        for (let i = 2; i <= 101; i++) {
            const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
            const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
            const empId = `EMP${String(i).padStart(6, '0')}`;
            const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@swastikindustries.com`;
            const gender = Math.random() > 0.5 ? 'male' : 'female';
            const department = createdDepartments[Math.floor(Math.random() * createdDepartments.length)];
            const shift = createdShifts[Math.floor(Math.random() * createdShifts.length)];
            const cityIndex = Math.floor(Math.random() * cities.length);

            const roles = [UserRole.EMPLOYEE, UserRole.EMPLOYEE, UserRole.EMPLOYEE, UserRole.MANAGER, UserRole.TEAM_LEAD];
            const role = roles[Math.floor(Math.random() * roles.length)];

            const user = await User.create({
                employeeId: empId,
                email,
                password: 'Employee@123',
                firstName,
                lastName,
                role,
                isActive: true,
                isEmailVerified: true,
            });

            const qrCode = await QRCode.toDataURL(user.employeeId);

            await Employee.create({
                employeeNumber: empId,
                userId: user._id,
                personalInfo: {
                    firstName,
                    lastName,
                    dateOfBirth: new Date(1980 + Math.floor(Math.random() * 25), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
                    gender,
                    maritalStatus: Math.random() > 0.5 ? 'married' : 'single',
                    bloodGroup: ['A+', 'B+', 'O+', 'AB+', 'A-', 'B-', 'O-', 'AB-'][Math.floor(Math.random() * 8)],
                    nationality: 'Indian',
                },
                contactInfo: {
                    email,
                    phone: `+91-${Math.floor(Math.random() * 9000000000) + 1000000000}`,
                    currentAddress: {
                        street: `${Math.floor(Math.random() * 999) + 1} Street`,
                        city: cities[cityIndex],
                        state: states[cityIndex],
                        country: 'India',
                        zipCode: `${Math.floor(Math.random() * 900000) + 100000}`,
                    },
                    permanentAddress: {
                        street: `${Math.floor(Math.random() * 999) + 1} Street`,
                        city: cities[cityIndex],
                        state: states[cityIndex],
                        country: 'India',
                        zipCode: `${Math.floor(Math.random() * 900000) + 100000}`,
                    },
                },
                professionalInfo: {
                    designation: designations[Math.floor(Math.random() * designations.length)],
                    department: department._id,
                    employeeType: ['full-time', 'full-time', 'full-time', 'contract', 'intern'][Math.floor(Math.random() * 5)],
                    employmentStatus: 'active',
                    joiningDate: new Date(2020 + Math.floor(Math.random() * 4), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
                    isProbation: Math.random() > 0.8,
                    workLocation: cities[cityIndex],
                    shift: shift._id,
                    workMode: ['office', 'remote', 'hybrid'][Math.floor(Math.random() * 3)],
                },
                salaryInfo: {
                    currentSalary: Math.floor(Math.random() * 1500000) + 300000,
                    currency: 'INR',
                    paymentMode: 'bank-transfer',
                    bankDetails: {
                        accountNumber: `${Math.floor(Math.random() * 9000000000) + 1000000000}`,
                        accountHolderName: `${firstName} ${lastName}`,
                        bankName: ['HDFC Bank', 'ICICI Bank', 'SBI', 'Axis Bank'][Math.floor(Math.random() * 4)],
                        branchName: `${cities[cityIndex]} Branch`,
                        ifscCode: `HDFC000${Math.floor(Math.random() * 9000) + 1000}`,
                    },
                },
                emergencyContacts: [{
                    name: `${firstName} Emergency`,
                    relationship: ['Spouse', 'Parent', 'Sibling'][Math.floor(Math.random() * 3)],
                    phone: `+91-${Math.floor(Math.random() * 9000000000) + 1000000000}`,
                }],
                skills: ['Communication', 'Teamwork', 'Problem Solving', 'Time Management'].slice(0, Math.floor(Math.random() * 4) + 1),
                qrCode,
                isActive: true,
                createdBy: adminUser._id,
                updatedBy: adminUser._id,
            });

            if (i % 10 === 0) {
                console.log(`Created ${i - 1} employees...`);
            }
        }

        console.log('✅ Created 100 sample employees');
        console.log('\n🎉 Database seeding completed successfully!');
        console.log('\n📝 Login Credentials:');
        console.log('Admin: admin@swastikindustries.com / Admin@123');
        console.log('Employee: [any employee email] / Employee@123');

        process.exit(0);
    } catch (error: any) {
        console.error('❌ Error seeding database:', error.message);
        process.exit(1);
    }
};

connectDB().then(seedDatabase);
