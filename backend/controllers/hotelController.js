import {
  createHotel,
  deleteHotelById,
  findHotelById,
  findHotels,
  findHotelsByCreator,
  findReviewsByHotelId,
  updateHotel
} from '../models/hotelModel.js';

const validateHotelPayload = (payload) => {
  const errors = [];
  const name = String(payload.name || '').trim();
  const category = String(payload.category || '').trim();
  const location = String(payload.location || '').trim();
  const description = String(payload.description || '').trim();
  const image_url = String(payload.image_url || '').trim();

  if (name.length < 2) errors.push('Name must be at least 2 characters.');
  if (!['Cafe', 'Hotel'].includes(category)) errors.push('Category must be Cafe or Hotel.');
  if (location.length < 2) errors.push('Location must be at least 2 characters.');
  if (description.length < 10) errors.push('Description must be at least 10 characters.');
  if (!image_url || !/^https?:\/\//i.test(image_url)) errors.push('Image URL must be a valid http or https URL.');

  return {
    errors,
    values: { name, category, location, description, image_url }
  };
};

export const getHotels = async (req, res, next) => {
  try {
    const { search = '', category = '' } = req.query;
    const hotels = await findHotels({
      search: String(search).trim(),
      category: String(category).trim(),
      userId: req.user?.id
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

    const hotel = await findHotelById(hotelId, req.user?.id);

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

export const addHotel = async (req, res, next) => {
  try {
    const { errors, values } = validateHotelPayload(req.body);

    if (errors.length) {
      return res.status(400).json({ message: 'Validation failed.', errors });
    }

    const hotel = await createHotel({ ...values, createdBy: req.user.id });
    res.status(201).json({ data: hotel });
  } catch (error) {
    next(error);
  }
};

export const editHotel = async (req, res, next) => {
  try {
    const hotelId = Number(req.params.id);

    if (!Number.isInteger(hotelId) || hotelId <= 0) {
      return res.status(400).json({ message: 'Hotel id must be a positive integer.' });
    }

    const hotel = await findHotelById(hotelId, req.user.id);

    if (!hotel) {
      return res.status(404).json({ message: 'Hotel or cafe not found.' });
    }

    if (hotel.created_by !== req.user.id) {
      return res.status(403).json({ message: 'Only the creator can edit this place.' });
    }

    const { errors, values } = validateHotelPayload(req.body);

    if (errors.length) {
      return res.status(400).json({ message: 'Validation failed.', errors });
    }

    const updated = await updateHotel({ id: hotelId, ...values });
    res.status(200).json({ data: updated });
  } catch (error) {
    next(error);
  }
};

export const removeHotel = async (req, res, next) => {
  try {
    const hotelId = Number(req.params.id);

    if (!Number.isInteger(hotelId) || hotelId <= 0) {
      return res.status(400).json({ message: 'Hotel id must be a positive integer.' });
    }

    const hotel = await findHotelById(hotelId, req.user.id);

    if (!hotel) {
      return res.status(404).json({ message: 'Hotel or cafe not found.' });
    }

    if (hotel.created_by !== req.user.id) {
      return res.status(403).json({ message: 'Only the creator can delete this place.' });
    }

    await deleteHotelById(hotelId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const getMyHotels = async (req, res, next) => {
  try {
    const hotels = await findHotelsByCreator(req.user.id);
    res.status(200).json({ data: hotels });
  } catch (error) {
    next(error);
  }
};
