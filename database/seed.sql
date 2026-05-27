INSERT INTO users (name, email, password_hash) VALUES
('Aarav Mehta', 'aarav@example.com', '$2b$10$lwRahMAgtlz5kmgrtmvJZOUhoOQolbAIV6wB5bOrsE9On4jvDfKza'),
('Maya Rao', 'maya@example.com', '$2b$10$lwRahMAgtlz5kmgrtmvJZOUhoOQolbAIV6wB5bOrsE9On4jvDfKza'),
('Kabir Singh', 'kabir@example.com', '$2b$10$lwRahMAgtlz5kmgrtmvJZOUhoOQolbAIV6wB5bOrsE9On4jvDfKza');

INSERT INTO hotels (name, category, location, description, image_url, created_by, latitude, longitude, wifi, parking, outdoor_seating, pet_friendly, air_conditioning, live_music, family_friendly, price_range) VALUES
('The Morning Mug', 'Cafe', 'Bandra, Mumbai', 'A warm neighborhood cafe known for single-origin coffee, flaky croissants, and quiet reading corners.', 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=80', 1, 19.05960000, 72.82950000, true, false, true, false, true, false, true, 'Moderate'),
('Harbor View Grand', 'Hotel', 'Colaba, Mumbai', 'A premium hotel with sea-facing rooms, rooftop dining, spa services, and easy access to heritage landmarks.', 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80', 2, 18.92170000, 72.83310000, true, true, true, false, true, true, true, 'Premium'),
('Bean & Bloom', 'Cafe', 'Indiranagar, Bengaluru', 'A cheerful plant-filled cafe serving espresso classics, brunch plates, and handmade desserts.', 'https://images.unsplash.com/photo-1445116572660-236099ec97a0?auto=format&fit=crop&w=1200&q=80', 1, 12.97840000, 77.64080000, true, false, true, true, true, false, true, 'Budget'),
('The Courtyard Stay', 'Hotel', 'Koregaon Park, Pune', 'A boutique hotel with airy rooms, garden seating, business amenities, and a relaxed central location.', 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1200&q=80', 2, 18.53620000, 73.89580000, true, true, true, true, true, false, true, 'Moderate'),
('Roast Republic', 'Cafe', 'Connaught Place, New Delhi', 'A modern coffee bar with bold roasts, quick bites, and a lively work-friendly atmosphere.', 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80', 3, 28.63150000, 77.21670000, true, true, false, false, true, true, false, 'Budget'),
('Lakefront Palace', 'Hotel', 'Udaipur, Rajasthan', 'A scenic luxury hotel with lake views, fine dining, curated local experiences, and elegant rooms.', 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80', 3, 24.57640000, 73.68350000, true, true, true, false, true, true, true, 'Luxury');

INSERT INTO place_images (hotel_id, image_url)
SELECT id, image_url FROM hotels WHERE image_url IS NOT NULL;

INSERT INTO reviews (hotel_id, user_id, rating, review) VALUES
(1, 1, 5, 'Amazing coffee and a calm vibe. Perfect for a slow morning.'),
(1, 2, 4, 'Great pastries and friendly staff. Seating fills up quickly.'),
(2, 3, 5, 'Beautiful view and excellent service throughout our stay.'),
(3, 1, 4, 'Lovely interiors and strong cappuccino. Brunch was fresh.'),
(4, 2, 4, 'Comfortable rooms and a peaceful courtyard.'),
(5, 3, 3, 'Good coffee, but it can get noisy during peak hours.'),
(6, 1, 5, 'Memorable stay with gorgeous lake views.');
