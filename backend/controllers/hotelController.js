import {
  createHotel,
  deleteHotelById,
  findHotelById,
  findHotels,
  findHotelsByCreator,
  findNearbyHotels,
  findPopularHotels,
  findReviewsByHotelId,
  findRecentHotels,
  findTopRatedHotels,
  updateHotel
} from '../models/hotelModel.js';

const validateHotelPayload = (payload) => {
  const errors = [];
  const name = String(payload.name || '').trim();
  const category = String(payload.category || '').trim();
  const location = String(payload.location || '').trim();
  const description = String(payload.description || '').trim();
  const images = Array.isArray(payload.images)
    ? payload.images.map((image) => String(image || '').trim()).filter(Boolean)
    : [];
  const latitude = Number(payload.latitude);
  const longitude = Number(payload.longitude);

  if (name.length < 2) errors.push('Name must be at least 2 characters.');
  if (!['Cafe', 'Hotel'].includes(category)) errors.push('Category must be Cafe or Hotel.');
  if (location.length < 2) errors.push('Location must be at least 2 characters.');
  if (description.length < 10) errors.push('Description must be at least 10 characters.');
  if (!images.length) errors.push('At least one image is required.');
  if (images.some((imageUrl) => !/^https?:\/\//i.test(imageUrl))) {
    errors.push('Every image must be a valid http or https URL.');
  }
  if (!Number.isFinite(latitude) || latitude < -90 || latitude > 90) {
    errors.push('Latitude must be a valid number between -90 and 90.');
  }
  if (!Number.isFinite(longitude) || longitude < -180 || longitude > 180) {
    errors.push('Longitude must be a valid number between -180 and 180.');
  }

  return {
    errors,
    values: { name, category, location, description, images, latitude, longitude }
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

export const getNearbyHotels = async (req, res, next) => {
  try {
    const hotelId = Number(req.params.id);
    const radiusKm = Number(req.query.radius || 5);

    if (!Number.isInteger(hotelId) || hotelId <= 0) {
      return res.status(400).json({ message: 'Hotel id must be a positive integer.' });
    }

    if (!Number.isFinite(radiusKm) || radiusKm <= 0 || radiusKm > 100) {
      return res.status(400).json({ message: 'Radius must be a number between 0 and 100 kilometers.' });
    }

    const hotel = await findHotelById(hotelId, req.user?.id);

    if (!hotel) {
      return res.status(404).json({ message: 'Hotel or cafe not found.' });
    }

    const nearby = await findNearbyHotels({ hotelId, radiusKm });
    res.status(200).json({ data: nearby });
  } catch (error) {
    next(error);
  }
};

export const getTopRatedHotels = async (_req, res, next) => {
  try {
    res.status(200).json({ data: await findTopRatedHotels() });
  } catch (error) {
    next(error);
  }
};

export const getRecentHotels = async (_req, res, next) => {
  try {
    res.status(200).json({ data: await findRecentHotels() });
  } catch (error) {
    next(error);
  }
};

export const getPopularHotels = async (_req, res, next) => {
  try {
    res.status(200).json({ data: await findPopularHotels() });
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
