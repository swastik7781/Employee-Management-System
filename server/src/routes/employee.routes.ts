import { Router } from 'express';
import {
    getEmployees,
    getEmployeeById,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    bulkImportEmployees,
    getEmployeeStats,
} from '../controllers/employee.controller';
import { protect, authorize } from '../middleware/auth.middleware';
import { UserRole } from '../types';

const router = Router();

router.use(protect);

router.get('/stats', getEmployeeStats);
router.post('/bulk-import', authorize(UserRole.SUPER_ADMIN, UserRole.HR_ADMIN), bulkImportEmployees);

router
    .route('/')
    .get(getEmployees)
    .post(authorize(UserRole.SUPER_ADMIN, UserRole.HR_ADMIN), createEmployee);

router
    .route('/:id')
    .get(getEmployeeById)
    .put(authorize(UserRole.SUPER_ADMIN, UserRole.HR_ADMIN), updateEmployee)
    .delete(authorize(UserRole.SUPER_ADMIN), deleteEmployee);

export default router;
