import { findHotelById } from '../models/hotelModel.js';
import { addFavorite, findFavoritesByUserId, removeFavorite } from '../models/favoriteModel.js';

export const createFavorite = async (req, res, next) => {
  try {
    const hotelId = Number(req.body.hotel_id);

    if (!Number.isInteger(hotelId) || hotelId <= 0) {
      return res.status(400).json({ message: 'hotel_id must be a positive integer.' });
    }

    const hotel = await findHotelById(hotelId, req.user.id);

    if (!hotel) {
      return res.status(404).json({ message: 'Hotel or cafe not found.' });
    }

    const favorite = await addFavorite({ userId: req.user.id, hotelId });
    res.status(201).json({ data: favorite });
  } catch (error) {
    next(error);
  }
};

export const deleteFavorite = async (req, res, next) => {
  try {
    const hotelId = Number(req.params.hotelId);

    if (!Number.isInteger(hotelId) || hotelId <= 0) {
      return res.status(400).json({ message: 'Hotel id must be a positive integer.' });
    }

    await removeFavorite({ userId: req.user.id, hotelId });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const getMyFavorites = async (req, res, next) => {
  try {
    const favorites = await findFavoritesByUserId(req.user.id);
    res.status(200).json({ data: favorites });
  } catch (error) {
    next(error);
  }
};

