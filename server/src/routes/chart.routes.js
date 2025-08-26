import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { saveChart, listCharts, removeChart } from '../controllers/chart.controller.js';

const router = Router();

router.get('/', protect, listCharts);
router.post('/', protect, saveChart);
router.delete('/:id', protect, removeChart);

export default router;
