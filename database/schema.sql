DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS favorites;
DROP TABLE IF EXISTS place_images;
DROP TABLE IF EXISTS hotels;
DROP TABLE IF EXISTS users;

CREATE TABLE hotels (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,
    location VARCHAR(255),
    description TEXT,
    image_url TEXT,
    created_by INT,
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    wifi BOOLEAN DEFAULT false,
    parking BOOLEAN DEFAULT false,
    outdoor_seating BOOLEAN DEFAULT false,
    pet_friendly BOOLEAN DEFAULT false,
    air_conditioning BOOLEAN DEFAULT false,
    live_music BOOLEAN DEFAULT false,
    family_friendly BOOLEAN DEFAULT false,
    price_range VARCHAR(20) CHECK (price_range IS NULL OR price_range IN ('Budget', 'Moderate', 'Premium', 'Luxury'))
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE hotels
ADD CONSTRAINT fk_hotels_created_by
FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL;

CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    hotel_id INT REFERENCES hotels(id) ON DELETE CASCADE,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    rating INT CHECK(rating >= 1 AND rating <= 5),
    review TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE favorites (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    hotel_id INT REFERENCES hotels(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, hotel_id)
);

CREATE TABLE place_images (
    id SERIAL PRIMARY KEY,
    hotel_id INT REFERENCES hotels(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_hotels_name ON hotels USING gin (to_tsvector('english', name));
CREATE INDEX idx_hotels_category ON hotels(category);
CREATE INDEX idx_reviews_hotel_id ON reviews(hotel_id);
CREATE INDEX idx_favorites_user_id ON favorites(user_id);
CREATE INDEX idx_favorites_hotel_id ON favorites(hotel_id);
CREATE INDEX idx_place_images_hotel_id ON place_images(hotel_id);
CREATE INDEX idx_hotels_coordinates ON hotels(latitude, longitude);
CREATE INDEX idx_hotels_location ON hotels(location);
CREATE INDEX idx_hotels_price_range ON hotels(price_range);
CREATE INDEX idx_reviews_rating ON reviews(rating);
CREATE INDEX idx_reviews_hotel_rating ON reviews(hotel_id, rating);
CREATE INDEX idx_reviews_created_at ON reviews(created_at);
CREATE INDEX idx_favorites_created_at ON favorites(created_at);
CREATE INDEX idx_hotels_amenities ON hotels(wifi, parking, outdoor_seating, pet_friendly, air_conditioning, live_music, family_friendly);
