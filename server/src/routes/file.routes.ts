import { Router } from 'express';
import { protect } from '../middleware/auth.middleware';

const router = Router();
router.use(protect);

router.post('/upload', (req, res) => res.json({ success: true, data: { url: '' } }));

export default router;
