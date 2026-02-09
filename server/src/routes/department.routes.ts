import { Router } from 'express';
import { protect } from '../middleware/auth.middleware';

const router = Router();
router.use(protect);

// Placeholder routes - to be implemented
router.get('/', (req, res) => res.json({ success: true, data: [] }));
router.post('/', (req, res) => res.json({ success: true, message: 'Created' }));
router.get('/:id', (req, res) => res.json({ success: true, data: {} }));
router.put('/:id', (req, res) => res.json({ success: true, message: 'Updated' }));
router.delete('/:id', (req, res) => res.json({ success: true, message: 'Deleted' }));

export default router;
