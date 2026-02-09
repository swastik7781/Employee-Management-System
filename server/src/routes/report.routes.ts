import { Router } from 'express';
import { protect } from '../middleware/auth.middleware';

const router = Router();
router.use(protect);

router.get('/', (req, res) => res.json({ success: true, data: [] }));
router.get('/generate/:type', (req, res) => res.json({ success: true, data: {} }));

export default router;
