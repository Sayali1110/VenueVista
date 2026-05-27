ALTER TABLE hotels
ADD COLUMN IF NOT EXISTS wifi BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS parking BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS outdoor_seating BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS pet_friendly BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS air_conditioning BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS live_music BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS family_friendly BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS price_range VARCHAR(20);

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'hotels_price_range_check'
    ) THEN
        ALTER TABLE hotels
        ADD CONSTRAINT hotels_price_range_check
        CHECK (price_range IS NULL OR price_range IN ('Budget', 'Moderate', 'Premium', 'Luxury'))
        NOT VALID;
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_hotels_category ON hotels(category);
CREATE INDEX IF NOT EXISTS idx_hotels_location ON hotels(location);
CREATE INDEX IF NOT EXISTS idx_hotels_price_range ON hotels(price_range);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);
CREATE INDEX IF NOT EXISTS idx_reviews_hotel_rating ON reviews(hotel_id, rating);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON reviews(created_at);
CREATE INDEX IF NOT EXISTS idx_favorites_created_at ON favorites(created_at);
CREATE INDEX IF NOT EXISTS idx_hotels_amenities
ON hotels(wifi, parking, outdoor_seating, pet_friendly, air_conditioning, live_music, family_friendly);

UPDATE hotels
SET wifi = true,
    outdoor_seating = true,
    air_conditioning = true,
    family_friendly = true,
    price_range = 'Moderate'
WHERE name = 'The Morning Mug'
  AND price_range IS NULL;

UPDATE hotels
SET wifi = true,
    parking = true,
    outdoor_seating = true,
    air_conditioning = true,
    live_music = true,
    family_friendly = true,
    price_range = 'Premium'
WHERE name = 'Harbor View Grand'
  AND price_range IS NULL;

UPDATE hotels
SET wifi = true,
    outdoor_seating = true,
    pet_friendly = true,
    air_conditioning = true,
    family_friendly = true,
    price_range = 'Budget'
WHERE name = 'Bean & Bloom'
  AND price_range IS NULL;

UPDATE hotels
SET wifi = true,
    parking = true,
    outdoor_seating = true,
    pet_friendly = true,
    air_conditioning = true,
    family_friendly = true,
    price_range = 'Moderate'
WHERE name = 'The Courtyard Stay'
  AND price_range IS NULL;

UPDATE hotels
SET wifi = true,
    parking = true,
    air_conditioning = true,
    live_music = true,
    price_range = 'Budget'
WHERE name = 'Roast Republic'
  AND price_range IS NULL;

UPDATE hotels
SET wifi = true,
    parking = true,
    outdoor_seating = true,
    air_conditioning = true,
    live_music = true,
    family_friendly = true,
    price_range = 'Luxury'
WHERE name = 'Lakefront Palace'
  AND price_range IS NULL;
