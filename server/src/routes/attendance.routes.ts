import { Router } from 'express';
import { protect } from '../middleware/auth.middleware';

const router = Router();
router.use(protect);

router.get('/', (req, res) => res.json({ success: true, data: [] }));
router.post('/', (req, res) => res.json({ success: true, message: 'Created' }));
router.get('/my-attendance', (req, res) => res.json({ success: true, data: [] }));
router.post('/check-in', (req, res) => res.json({ success: true, message: 'Checked in' }));
router.post('/check-out', (req, res) => res.json({ success: true, message: 'Checked out' }));
router.get('/:id', (req, res) => res.json({ success: true, data: {} }));

export default router;
