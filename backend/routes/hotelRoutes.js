import { Router } from 'express';
import {
  addHotel,
  editHotel,
  getHotelDetails,
  getHotels,
  getMyHotels,
  removeHotel
} from '../controllers/hotelController.js';
import { optionalAuth, protect } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', optionalAuth, getHotels);
router.get('/mine', protect, getMyHotels);
router.post('/', protect, addHotel);
router.get('/:id', optionalAuth, getHotelDetails);
router.put('/:id', protect, editHotel);
router.delete('/:id', protect, removeHotel);

export default router;
