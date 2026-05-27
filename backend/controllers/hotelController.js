import {
  createHotel,
  deleteHotelById,
  findHotelById,
  findHotels,
  findHotelsByCreator,
  findNearbyHotels,
  findPopularHotels,
  findRecommendedHotels,
  findReviewsByHotelId,
  findRecentHotels,
  findTopRatedHotels,
  findTrendingHotels,
  updateHotel
} from '../models/hotelModel.js';

const priceRanges = ['Budget', 'Moderate', 'Premium', 'Luxury'];
const amenityFields = [
  'wifi',
  'parking',
  'outdoor_seating',
  'pet_friendly',
  'air_conditioning',
  'live_music',
  'family_friendly'
];

const coerceBoolean = (value) => value === true || String(value).toLowerCase() === 'true';

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
  const priceRange = payload.priceRange || payload.price_range || null;

  if (priceRange && !priceRanges.includes(priceRange)) {
    errors.push('Price range must be Budget, Moderate, Premium, or Luxury.');
  }

  return {
    errors,
    values: {
      name,
      category,
      location,
      description,
      images,
      latitude,
      longitude,
      wifi: coerceBoolean(payload.wifi),
      parking: coerceBoolean(payload.parking),
      outdoorSeating: coerceBoolean(payload.outdoorSeating ?? payload.outdoor_seating),
      petFriendly: coerceBoolean(payload.petFriendly ?? payload.pet_friendly),
      airConditioning: coerceBoolean(payload.airConditioning ?? payload.air_conditioning),
      liveMusic: coerceBoolean(payload.liveMusic ?? payload.live_music),
      familyFriendly: coerceBoolean(payload.familyFriendly ?? payload.family_friendly),
      priceRange
    }
  };
};

export const getHotels = async (req, res, next) => {
  try {
    const { search = '', category = '', price_range = '', min_rating = '' } = req.query;
    const rating = min_rating ? Number(min_rating) : null;

    if (rating !== null && (!Number.isFinite(rating) || rating < 0 || rating > 5)) {
      return res.status(400).json({ message: 'Minimum rating must be between 0 and 5.' });
    }

    if (price_range && !priceRanges.includes(price_range)) {
      return res.status(400).json({ message: 'Invalid price range filter.' });
    }

    const hotels = await findHotels({
      search: String(search).trim(),
      category: String(category).trim(),
      priceRange: String(price_range).trim(),
      minRating: rating,
      amenities: amenityFields.reduce(
        (filters, field) => ({ ...filters, [field]: req.query[field] }),
        {}
      ),
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

export const getTopRatedHotels = async (req, res, next) => {
  try {
    const limit = Number(req.query.limit || 10);
    res.status(200).json({
      data: await findTopRatedHotels({
        category: String(req.query.category || '').trim(),
        limit: Number.isInteger(limit) && limit > 0 && limit <= 30 ? limit : 10
      })
    });
  } catch (error) {
    next(error);
  }
};

export const getTrendingHotels = async (req, res, next) => {
  try {
    const limit = Number(req.query.limit || 10);
    res.status(200).json({
      data: await findTrendingHotels({
        limit: Number.isInteger(limit) && limit > 0 && limit <= 30 ? limit : 10
      })
    });
  } catch (error) {
    next(error);
  }
};

export const getRecommendedHotels = async (req, res, next) => {
  try {
    const hotelId = Number(req.params.id);

    if (!Number.isInteger(hotelId) || hotelId <= 0) {
      return res.status(400).json({ message: 'Hotel id must be a positive integer.' });
    }

    const hotel = await findHotelById(hotelId, req.user?.id);

    if (!hotel) {
      return res.status(404).json({ message: 'Hotel or cafe not found.' });
    }

    res.status(200).json({ data: await findRecommendedHotels({ hotelId }) });
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
