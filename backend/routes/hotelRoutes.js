import { Router } from 'express';
import {
  addHotel,
  editHotel,
  getHotelDetails,
  getHotels,
  getMyHotels,
  getNearbyHotels,
  getPopularHotels,
  getRecommendedHotels,
  getRecentHotels,
  getTopRatedHotels,
  getTrendingHotels,
  removeHotel
} from '../controllers/hotelController.js';
import { optionalAuth, protect } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', optionalAuth, getHotels);
router.get('/mine', protect, getMyHotels);
router.get('/top-rated', getTopRatedHotels);
router.get('/trending', getTrendingHotels);
router.get('/recent', getRecentHotels);
router.get('/popular', getPopularHotels);
router.post('/', protect, addHotel);
router.get('/:id/nearby', optionalAuth, getNearbyHotels);
router.get('/:id/recommendations', optionalAuth, getRecommendedHotels);
router.get('/:id', optionalAuth, getHotelDetails);
router.put('/:id', protect, editHotel);
router.delete('/:id', protect, removeHotel);

export default router;
