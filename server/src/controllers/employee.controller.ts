import { Response } from 'express';
import { Employee } from '../models/Employee.model';
import { User } from '../models/User.model';
import { AuthRequest, ApiResponse, UserRole } from '../types';
import { AppError, asyncHandler } from '../middleware/error.middleware';
import { logger } from '../utils/logger';
import QRCode from 'qrcode';

/**
 * @desc    Get all employees
 * @route   GET /api/employees
 * @access  Private
 */
export const getEmployees = asyncHandler(
    async (req: AuthRequest, res: Response) => {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;

        // Build filter
        const filter: any = {};

        if (req.query.search) {
            filter.$or = [
                { employeeNumber: { $regex: req.query.search, $options: 'i' } },
                { 'personalInfo.firstName': { $regex: req.query.search, $options: 'i' } },
                { 'personalInfo.lastName': { $regex: req.query.search, $options: 'i' } },
                { 'contactInfo.email': { $regex: req.query.search, $options: 'i' } },
            ];
        }

        if (req.query.department) {
            filter['professionalInfo.department'] = req.query.department;
        }

        if (req.query.status) {
            filter['professionalInfo.employmentStatus'] = req.query.status;
        }

        if (req.query.employeeType) {
            filter['professionalInfo.employeeType'] = req.query.employeeType;
        }

        if (req.query.isActive !== undefined) {
            filter.isActive = req.query.isActive === 'true';
        }

        const employees = await Employee.find(filter)
            .populate('userId', 'email role isActive')
            .populate('professionalInfo.department', 'name code')
            .populate('professionalInfo.reportingManager', 'personalInfo.firstName personalInfo.lastName employeeNumber')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Employee.countDocuments(filter);

        const response: ApiResponse = {
            success: true,
            data: employees,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        };

        res.status(200).json(response);
    }
);

/**
 * @desc    Get employee by ID
 * @route   GET /api/employees/:id
 * @access  Private
 */
export const getEmployeeById = asyncHandler(
    async (req: AuthRequest, res: Response) => {
        const employee = await Employee.findById(req.params.id)
            .populate('userId')
            .populate('professionalInfo.department')
            .populate('professionalInfo.team')
            .populate('professionalInfo.reportingManager')
            .populate('professionalInfo.shift');

        if (!employee) {
            throw new AppError('Employee not found', 404);
        }

        const response: ApiResponse = {
            success: true,
            data: employee,
        };

        res.status(200).json(response);
    }
);

/**
 * @desc    Create new employee
 * @route   POST /api/employees
 * @access  Private (HR/Admin)
 */
export const createEmployee = asyncHandler(
    async (req: AuthRequest, res: Response) => {
        const { userData, employeeData } = req.body;

        // Check if user already exists
        const userExists = await User.findOne({ email: userData.email });
        if (userExists) {
            throw new AppError('User with this email already exists', 400);
        }

        // Create user account
        const user = await User.create({
            employeeId: userData.employeeId,
            email: userData.email,
            password: userData.password || 'Welcome@123',
            firstName: userData.firstName,
            lastName: userData.lastName,
            role: userData.role || UserRole.EMPLOYEE,
        });

        // Generate QR Code
        const qrCode = await QRCode.toDataURL(user.employeeId);

        // Create employee
        const employee = await Employee.create({
            ...employeeData,
            userId: user._id,
            qrCode,
            createdBy: req.user?._id,
            updatedBy: req.user?._id,
        });

        logger.info(`New employee created: ${employee.employeeNumber}`);

        const response: ApiResponse = {
            success: true,
            message: 'Employee created successfully',
            data: employee,
        };

        res.status(201).json(response);
    }
);

/**
 * @desc    Update employee
 * @route   PUT /api/employees/:id
 * @access  Private (HR/Admin)
 */
export const updateEmployee = asyncHandler(
    async (req: AuthRequest, res: Response) => {
        const employee = await Employee.findById(req.params.id);

        if (!employee) {
            throw new AppError('Employee not found', 404);
        }

        // Update employee
        Object.assign(employee, req.body);
        employee.updatedBy = req.user?._id!;
        await employee.save();

        logger.info(`Employee updated: ${employee.employeeNumber}`);

        const response: ApiResponse = {
            success: true,
            message: 'Employee updated successfully',
            data: employee,
        };

        res.status(200).json(response);
    }
);

/**
 * @desc    Delete employee
 * @route   DELETE /api/employees/:id
 * @access  Private (Admin)
 */
export const deleteEmployee = asyncHandler(
    async (req: AuthRequest, res: Response) => {
        const employee = await Employee.findById(req.params.id);

        if (!employee) {
            throw new AppError('Employee not found', 404);
        }

        // Soft delete
        employee.isActive = false;
        employee.professionalInfo.employmentStatus = 'terminated';
        employee.exitDate = new Date();
        await employee.save();

        // Deactivate user account
        await User.findByIdAndUpdate(employee.userId, { isActive: false });

        logger.info(`Employee deleted: ${employee.employeeNumber}`);

        const response: ApiResponse = {
            success: true,
            message: 'Employee deleted successfully',
        };

        res.status(200).json(response);
    }
);

/**
 * @desc    Bulk import employees
 * @route   POST /api/employees/bulk-import
 * @access  Private (HR/Admin)
 */
export const bulkImportEmployees = asyncHandler(
    async (req: AuthRequest, res: Response) => {
        const { employees } = req.body;

        if (!Array.isArray(employees) || employees.length === 0) {
            throw new AppError('Please provide an array of employees', 400);
        }

        const results = {
            success: [],
            failed: [],
        };

        for (const empData of employees) {
            try {
                // Create user
                const user = await User.create({
                    employeeId: empData.employeeId,
                    email: empData.email,
                    password: empData.password || 'Welcome@123',
                    firstName: empData.firstName,
                    lastName: empData.lastName,
                    role: empData.role || UserRole.EMPLOYEE,
                });

                // Generate QR Code
                const qrCode = await QRCode.toDataURL(user.employeeId);

                // Create employee
                const employee = await Employee.create({
                    ...empData,
                    userId: user._id,
                    qrCode,
                    createdBy: req.user?._id,
                    updatedBy: req.user?._id,
                });

                results.success.push({
                    employeeNumber: employee.employeeNumber,
                    email: empData.email,
                });
            } catch (error: any) {
                results.failed.push({
                    email: empData.email,
                    error: error.message,
                });
            }
        }

        logger.info(`Bulk import completed: ${results.success.length} success, ${results.failed.length} failed`);

        const response: ApiResponse = {
            success: true,
            message: 'Bulk import completed',
            data: results,
        };

        res.status(200).json(response);
    }
);

/**
 * @desc    Get employee statistics
 * @route   GET /api/employees/stats
 * @access  Private
 */
export const getEmployeeStats = asyncHandler(
    async (req: AuthRequest, res: Response) => {
        const stats = await Employee.aggregate([
            {
                $facet: {
                    total: [{ $count: 'count' }],
                    byStatus: [
                        {
                            $group: {
                                _id: '$professionalInfo.employmentStatus',
                                count: { $sum: 1 },
                            },
                        },
                    ],
                    byType: [
                        {
                            $group: {
                                _id: '$professionalInfo.employeeType',
                                count: { $sum: 1 },
                            },
                        },
                    ],
                    byGender: [
                        {
                            $group: {
                                _id: '$personalInfo.gender',
                                count: { $sum: 1 },
                            },
                        },
                    ],
                    byDepartment: [
                        {
                            $group: {
                                _id: '$professionalInfo.department',
                                count: { $sum: 1 },
                            },
                        },
                        {
                            $lookup: {
                                from: 'departments',
                                localField: '_id',
                                foreignField: '_id',
                                as: 'department',
                            },
                        },
                        {
                            $unwind: '$department',
                        },
                        {
                            $project: {
                                name: '$department.name',
                                count: 1,
                            },
                        },
                    ],
                },
            },
        ]);

        const response: ApiResponse = {
            success: true,
            data: stats[0],
        };

        res.status(200).json(response);
    }
);
