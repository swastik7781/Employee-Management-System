import { Router } from 'express';
import { protect } from '../middleware/auth.middleware';

const router = Router();
router.use(protect);

router.get('/', (req, res) => res.json({ success: true, data: [] }));
router.post('/generate', (req, res) => res.json({ success: true, message: 'Payroll generated' }));
router.get('/payslip/:id', (req, res) => res.json({ success: true, data: {} }));
router.post('/process', (req, res) => res.json({ success: true, message: 'Processed' }));

export default router;
