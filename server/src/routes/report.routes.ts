import { Router } from 'express';
import { protect } from '../middleware/auth.middleware';
import { getDashboardStats, getHeadcountTrend } from '../controllers/report.controller';

const router = Router();
router.use(protect);

router.get('/dashboard', getDashboardStats);
router.get('/headcount', getHeadcountTrend);

export default router;
