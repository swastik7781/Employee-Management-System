import { Router } from 'express';
import { protect } from '../middleware/auth.middleware';

const router = Router();
router.use(protect);

router.get('/stats', (req, res) => res.json({ success: true, data: {} }));
router.get('/analytics', (req, res) => res.json({ success: true, data: {} }));

export default router;
