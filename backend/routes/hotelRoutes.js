import { Router } from 'express';
import { getHotelDetails, getHotels } from '../controllers/hotelController.js';

const router = Router();

router.get('/', getHotels);
router.get('/:id', getHotelDetails);

export default router;

