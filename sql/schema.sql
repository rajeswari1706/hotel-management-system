-- Hotel Management System Database Schema
-- Using Native SQL without ORM

CREATE TABLE IF NOT EXISTS hotels (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    latitude NUMERIC(10, 7) NOT NULL CHECK (latitude >= -90 AND latitude <= 90),
    longitude NUMERIC(10, 7) NOT NULL CHECK (longitude >= -180 AND longitude <= 180),
    image_url VARCHAR(500) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for searching hotels by title
CREATE INDEX IF NOT EXISTS idx_hotels_title ON hotels (LOWER(title));

-- Index for filtering hotels by price range
CREATE INDEX IF NOT EXISTS idx_hotels_price ON hotels (price);

-- Index for ordering by creation date
CREATE INDEX IF NOT EXISTS idx_hotels_created_at ON hotels (created_at DESC);
