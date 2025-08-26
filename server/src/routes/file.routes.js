import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { upload } from '../middleware/multer.js';
import { uploadAndParse, listFiles, removeFile } from '../controllers/file.controller.js';

const router = Router();

router.get('/', protect, listFiles);
router.post('/upload', protect, upload.single('file'), uploadAndParse);
router.delete('/:id', protect, removeFile);

export default router;
