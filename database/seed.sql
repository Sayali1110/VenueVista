INSERT INTO users (name, email, password_hash) VALUES
('Aarav Mehta', 'aarav@example.com', '$2b$10$lwRahMAgtlz5kmgrtmvJZOUhoOQolbAIV6wB5bOrsE9On4jvDfKza'),
('Maya Rao', 'maya@example.com', '$2b$10$lwRahMAgtlz5kmgrtmvJZOUhoOQolbAIV6wB5bOrsE9On4jvDfKza'),
('Kabir Singh', 'kabir@example.com', '$2b$10$lwRahMAgtlz5kmgrtmvJZOUhoOQolbAIV6wB5bOrsE9On4jvDfKza');

INSERT INTO hotels (name, category, location, description, image_url, created_by) VALUES
('The Morning Mug', 'Cafe', 'Bandra, Mumbai', 'A warm neighborhood cafe known for single-origin coffee, flaky croissants, and quiet reading corners.', 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=80', 1),
('Harbor View Grand', 'Hotel', 'Colaba, Mumbai', 'A premium hotel with sea-facing rooms, rooftop dining, spa services, and easy access to heritage landmarks.', 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80', 2),
('Bean & Bloom', 'Cafe', 'Indiranagar, Bengaluru', 'A cheerful plant-filled cafe serving espresso classics, brunch plates, and handmade desserts.', 'https://images.unsplash.com/photo-1445116572660-236099ec97a0?auto=format&fit=crop&w=1200&q=80', 1),
('The Courtyard Stay', 'Hotel', 'Koregaon Park, Pune', 'A boutique hotel with airy rooms, garden seating, business amenities, and a relaxed central location.', 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1200&q=80', 2),
('Roast Republic', 'Cafe', 'Connaught Place, New Delhi', 'A modern coffee bar with bold roasts, quick bites, and a lively work-friendly atmosphere.', 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80', 3),
('Lakefront Palace', 'Hotel', 'Udaipur, Rajasthan', 'A scenic luxury hotel with lake views, fine dining, curated local experiences, and elegant rooms.', 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80', 3);

INSERT INTO reviews (hotel_id, user_id, rating, review) VALUES
(1, 1, 5, 'Amazing coffee and a calm vibe. Perfect for a slow morning.'),
(1, 2, 4, 'Great pastries and friendly staff. Seating fills up quickly.'),
(2, 3, 5, 'Beautiful view and excellent service throughout our stay.'),
(3, 1, 4, 'Lovely interiors and strong cappuccino. Brunch was fresh.'),
(4, 2, 4, 'Comfortable rooms and a peaceful courtyard.'),
(5, 3, 3, 'Good coffee, but it can get noisy during peak hours.'),
(6, 1, 5, 'Memorable stay with gorgeous lake views.');
