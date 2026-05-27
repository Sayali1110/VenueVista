ALTER TABLE users
ADD COLUMN IF NOT EXISTS password_hash TEXT;

UPDATE users
SET password_hash = '$2b$10$lwRahMAgtlz5kmgrtmvJZOUhoOQolbAIV6wB5bOrsE9On4jvDfKza'
WHERE password_hash IS NULL;

ALTER TABLE users
ALTER COLUMN name SET NOT NULL,
ALTER COLUMN email SET NOT NULL,
ALTER COLUMN password_hash SET NOT NULL;

ALTER TABLE users
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT NOW();

CREATE UNIQUE INDEX IF NOT EXISTS users_email_unique ON users(email);

ALTER TABLE hotels
ADD COLUMN IF NOT EXISTS created_by INT REFERENCES users(id) ON DELETE SET NULL;

UPDATE hotels
SET created_by = ((id - 1) % 3) + 1
WHERE created_by IS NULL
  AND EXISTS (SELECT 1 FROM users WHERE users.id = ((hotels.id - 1) % 3) + 1);

CREATE TABLE IF NOT EXISTS favorites (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    hotel_id INT REFERENCES hotels(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, hotel_id)
);

CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_hotel_id ON favorites(hotel_id);
