import { Router } from 'express';
import { protect, requireAdmin } from '../middleware/auth.js';
import { listUsers, analytics, updateUserRole, deleteUser } from '../controllers/admin.controller.js';

const router = Router();

router.use(protect, requireAdmin);

router.get('/users', listUsers);
router.put('/users/:userId/role', updateUserRole);
router.delete('/users/:userId', deleteUser);
router.get('/analytics', analytics);

export default router;
