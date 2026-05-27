import { Router } from 'express';
import { createFavorite, deleteFavorite, getMyFavorites } from '../controllers/favoriteController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.use(protect);
router.get('/', getMyFavorites);
router.post('/', createFavorite);
router.delete('/:hotelId', deleteFavorite);

export default router;

