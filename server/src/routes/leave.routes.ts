import { Router } from 'express';
import { protect } from '../middleware/auth.middleware';

const router = Router();
router.use(protect);

router.get('/', (req, res) => res.json({ success: true, data: [] }));
router.post('/', (req, res) => res.json({ success: true, message: 'Leave applied' }));
router.get('/balance', (req, res) => res.json({ success: true, data: {} }));
router.get('/types', (req, res) => res.json({ success: true, data: [] }));
router.put('/:id/approve', (req, res) => res.json({ success: true, message: 'Approved' }));
router.put('/:id/reject', (req, res) => res.json({ success: true, message: 'Rejected' }));

export default router;
