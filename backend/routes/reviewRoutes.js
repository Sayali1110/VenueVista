import { Router } from 'express';
import { addReview, removeReview } from '../controllers/reviewController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/', protect, addReview);
router.delete('/:id', protect, removeReview);

export default router;
