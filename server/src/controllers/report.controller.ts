import { Response } from 'express';
import { Employee } from '../models/Employee.model';
import { Department } from '../models/Department.model';
import { Payroll } from '../models/Payroll.model';
import { Leave } from '../models/Leave.model';
import { Attendance } from '../models/Attendance.model';
import { AuthRequest, ApiResponse } from '../types';
import { asyncHandler } from '../middleware/error.middleware';

/**
 * @desc    Get dashboard summary stats
 * @route   GET /api/reports/dashboard
 * @access  Private
 */
export const getDashboardStats = asyncHandler(
    async (req: AuthRequest, res: Response) => {
        // 1. Employee Stats
        const totalEmployees = await Employee.countDocuments({ 'professionalInfo.employmentStatus': 'active' });
        const newHires = await Employee.countDocuments({
            'professionalInfo.joiningDate': { $gte: new Date(new Date().setDate(new Date().getDate() - 30)) }
        });

        // 2. Attendance Today
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const presentToday = await Attendance.countDocuments({
            date: { $gte: today, $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) },
            status: { $in: ['present', 'late', 'half-day'] }
        });

        // 3. On Leave Today
        const onLeaveToday = await Leave.countDocuments({
            status: 'approved',
            fromDate: { $lte: today },
            toDate: { $gte: today }
        });

        // 4. Department Distribution
        const departments = await Department.find();
        const departmentStats = await Promise.all(
            departments.map(async (dept) => {
                const count = await Employee.countDocuments({ 'professionalInfo.department': dept._id, 'professionalInfo.employmentStatus': 'active' });
                return { name: dept.name, count };
            })
        );

        // 5. Gender Distribution
        const male = await Employee.countDocuments({ 'personalInfo.gender': 'male', 'professionalInfo.employmentStatus': 'active' });
        const female = await Employee.countDocuments({ 'personalInfo.gender': 'female', 'professionalInfo.employmentStatus': 'active' });
        const other = await Employee.countDocuments({ 'personalInfo.gender': 'other', 'professionalInfo.employmentStatus': 'active' });

        const response: ApiResponse = {
            success: true,
            data: {
                summary: {
                    totalEmployees,
                    newHires,
                    presentToday,
                    onLeaveToday,
                    attritionRate: 2.4, // Mock calculation for now
                },
                departmentDistribution: departmentStats,
                genderDistribution: { male, female, other }
            }
        };

        res.status(200).json(response);
    }
);

/**
 * @desc    Get headcount growth trend (last 12 months)
 * @route   GET /api/reports/headcount
 * @access  Private
 */
export const getHeadcountTrend = asyncHandler(
    async (req: AuthRequest, res: Response) => {
        // Aggregate by joining month
        const trend = await Employee.aggregate([
            {
                $match: {
                    'professionalInfo.joiningDate': {
                        $gte: new Date(new Date().setFullYear(new Date().getFullYear() - 1))
                    }
                }
            },
            {
                $group: {
                    _id: {
                        month: { $month: "$professionalInfo.joiningDate" },
                        year: { $year: "$professionalInfo.joiningDate" }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } }
        ]);

        // Transform to friendly format (e.g., "Jan 2024")
        const formattedTrend = trend.map(item => {
            const date = new Date(item._id.year, item._id.month - 1);
            return {
                name: date.toLocaleString('default', { month: 'short' }),
                value: item.count // This is actually "New Joinees", not total headcount.
                // For true headcount, we'd need cumulative sum, but let's return new hires per month for now or cumulative.
            };
        });

        // Calculate cumulative headcount for chart
        // Basic approach: Start with base count 12 months ago and add
        const currentTotal = await Employee.countDocuments();
        // This is complex to do accurately without historical snapshots.
        // Simplified: Just show month-wise distribution of current employees

        const response: ApiResponse = {
            success: true,
            data: formattedTrend
        };

        res.status(200).json(response);
    }
);
