ALTER TABLE hotels
ADD COLUMN IF NOT EXISTS latitude DECIMAL(10,8),
ADD COLUMN IF NOT EXISTS longitude DECIMAL(11,8);

CREATE TABLE IF NOT EXISTS place_images (
    id SERIAL PRIMARY KEY,
    hotel_id INT REFERENCES hotels(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_place_images_hotel_id ON place_images(hotel_id);
CREATE INDEX IF NOT EXISTS idx_hotels_coordinates ON hotels(latitude, longitude);

UPDATE hotels SET latitude = 19.05960000, longitude = 72.82950000 WHERE name = 'The Morning Mug' AND latitude IS NULL;
UPDATE hotels SET latitude = 18.92170000, longitude = 72.83310000 WHERE name = 'Harbor View Grand' AND latitude IS NULL;
UPDATE hotels SET latitude = 12.97840000, longitude = 77.64080000 WHERE name = 'Bean & Bloom' AND latitude IS NULL;
UPDATE hotels SET latitude = 18.53620000, longitude = 73.89580000 WHERE name = 'The Courtyard Stay' AND latitude IS NULL;
UPDATE hotels SET latitude = 28.63150000, longitude = 77.21670000 WHERE name = 'Roast Republic' AND latitude IS NULL;
UPDATE hotels SET latitude = 24.57640000, longitude = 73.68350000 WHERE name = 'Lakefront Palace' AND latitude IS NULL;

INSERT INTO place_images (hotel_id, image_url)
SELECT h.id, h.image_url
FROM hotels h
WHERE h.image_url IS NOT NULL
  AND h.image_url <> ''
  AND NOT EXISTS (
    SELECT 1 FROM place_images pi
    WHERE pi.hotel_id = h.id AND pi.image_url = h.image_url
  );
