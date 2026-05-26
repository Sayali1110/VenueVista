import { Router } from 'express';
import { addReview, removeReview } from '../controllers/reviewController.js';

const router = Router();

router.post('/', addReview);
router.delete('/:id', removeReview);

export default router;

