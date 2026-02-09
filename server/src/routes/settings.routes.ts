import { Router } from 'express';
import { protect } from '../middleware/auth.middleware';

const router = Router();
router.use(protect);

router.get('/', (req, res) => res.json({ success: true, data: {} }));
router.put('/', (req, res) => res.json({ success: true, message: 'Updated' }));

export default router;
