import { findHotelById, findHotels, findReviewsByHotelId } from '../models/hotelModel.js';

export const getHotels = async (req, res, next) => {
  try {
    const { search = '', category = '' } = req.query;
    const hotels = await findHotels({
      search: String(search).trim(),
      category: String(category).trim()
    });

    res.status(200).json({ data: hotels });
  } catch (error) {
    next(error);
  }
};

export const getHotelDetails = async (req, res, next) => {
  try {
    const hotelId = Number(req.params.id);

    if (!Number.isInteger(hotelId) || hotelId <= 0) {
      return res.status(400).json({ message: 'Hotel id must be a positive integer.' });
    }

    const hotel = await findHotelById(hotelId);

    if (!hotel) {
      return res.status(404).json({ message: 'Hotel or cafe not found.' });
    }

    const reviews = await findReviewsByHotelId(hotelId);

    res.status(200).json({
      data: {
        ...hotel,
        reviews
      }
    });
  } catch (error) {
    next(error);
  }
};

