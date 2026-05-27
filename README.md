# VenueVista - Cafe & Hotel Recommendation System

Full-stack recommendation app for browsing cafes and hotels, searching by name, filtering by category, viewing details, managing reviews, saving favorites, and creating user-owned places.

## Tech Stack

- Frontend: React 18, Vite, Material UI, React Router, Axios
- Backend: Node.js, Express.js
- Database: PostgreSQL

## Folder Structure

```text
VenueVista/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── app.js
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── theme.js
│   ├── index.html
│   ├── package.json
│   └── .env.example
├── database/
│   ├── schema.sql
│   └── seed.sql
└── README.md
```

## Database Setup

Create a PostgreSQL database:

```bash
createdb venuevista
```

Run schema and seed data:

```bash
psql -d venuevista -f database/schema.sql
psql -d venuevista -f database/seed.sql
```

For an existing VenueVista database, apply the v1.1/v1.2 migration:

```bash
psql -d venuevista -f database/migrations/001_auth_favorites_places.sql
```

## Backend Setup

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

Update `backend/.env` if your PostgreSQL credentials differ.

Set a strong `JWT_SECRET` in `backend/.env`.

Default backend URL:

```text
http://localhost:5000
```

## Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Default frontend URL:

```text
http://localhost:5173
```

## API Endpoints

- `POST /api/auth/register` - create account
- `POST /api/auth/login` - log in and receive JWT
- `GET /api/auth/me` - get current authenticated user
- `GET /api/hotels` - list all hotels and cafes with average rating
- `GET /api/hotels?search=coffee` - search by name
- `GET /api/hotels?category=Cafe` - filter by category
- `GET /api/hotels/:id` - get place details, reviews, and average rating
- `GET /api/hotels/:id/nearby` - get nearby places within 5 km by default
- `GET /api/hotels/top-rated` - get top-rated places
- `GET /api/hotels/recent` - get recently added places
- `GET /api/hotels/popular` - get popular places by review count
- `POST /api/hotels` - create authenticated user's place
- `GET /api/hotels/mine` - list authenticated user's places
- `PUT /api/hotels/:id` - update own place
- `DELETE /api/hotels/:id` - delete own place
- `POST /api/upload` - upload an authenticated image to Cloudinary
- `GET /api/favorites` - list authenticated user's favorites
- `POST /api/favorites` - save a favorite
- `DELETE /api/favorites/:hotelId` - remove a favorite
- `POST /api/reviews` - create an authenticated review
- `DELETE /api/reviews/:id` - delete a review

Seeded demo users use this password:

```text
password123
```

## Cloudinary Setup

Image upload requires Cloudinary credentials in `backend/.env`:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_FOLDER=venuevista
```

Uploads accept jpg, jpeg, png, and webp files up to 5MB.

## Review Payload

```json
{
  "hotel_id": 1,
  "rating": 5,
  "review": "Amazing coffee"
}
```
