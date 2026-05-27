# VenueVista Project Documentation

## Project Title

VenueVista - Cafe & Hotel Recommendation System

## Document Type

This file is a Markdown document (`.md`). Markdown is the best format for this project because it is easy to edit, readable in code editors, and works well on GitHub.

For submission, it can be converted into:

- PDF
- Word document (`.docx`)
- Project report
- README-style documentation

## Current Version

Version: `1.4`

Main modules:

- Cafe and hotel browsing
- Search and category filtering
- Details page
- Ratings and reviews
- JWT authentication
- Favorites
- User-owned place management
- Cloudinary image upload
- Multiple-image gallery
- Map and coordinate support
- Nearby places

## Project Overview

VenueVista is a full-stack web application that allows users to discover cafes and hotels, view ratings and reviews, save favorite places, and manage places they created.

The frontend is built with React, Vite, React Router, Axios, and Material UI. The backend is built with Node.js and Express.js. PostgreSQL is used for persistent data storage.

## Main Features

- Browse cafes and hotels
- Search places by name
- Filter by category: Cafe or Hotel
- View detailed place information
- View average rating and review count
- Register and login with JWT authentication
- Store JWT token in localStorage
- Access protected pages
- Save and remove favorite places
- View My Favorites page
- Add new cafes or hotels
- Edit places created by the logged-in user
- Delete places created by the logged-in user
- Upload multiple place images
- View image gallery on details page
- View place map using OpenStreetMap
- View nearby places within 5 km
- View top-rated, recent, and popular homepage sections
- View My Places page
- View user profile
- Submit authenticated reviews
- Responsive Material UI design
- REST API backend
- PostgreSQL database integration

## Technology Stack

### Frontend

- React 18
- Vite
- Material UI
- React Router
- Axios
- React Leaflet
- Leaflet

### Backend

- Node.js
- Express.js
- PostgreSQL client library: `pg`
- `bcryptjs` for password hashing
- `jsonwebtoken` for JWT authentication
- CORS
- Helmet
- Morgan
- Dotenv
- Cloudinary
- Multer

### Database

- PostgreSQL
- OpenStreetMap map tiles through Leaflet

## Project Folder Structure

```text
VenueVista/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── favoriteController.js
│   │   ├── hotelController.js
│   │   └── reviewController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── errorMiddleware.js
│   ├── models/
│   │   ├── favoriteModel.js
│   │   ├── hotelModel.js
│   │   ├── reviewModel.js
│   │   └── userModel.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── favoriteRoutes.js
│   │   ├── hotelRoutes.js
│   │   └── reviewRoutes.js
│   ├── app.js
│   ├── package.json
│   ├── .env
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   ├── auth.js
│   │   │   ├── client.js
│   │   │   ├── favorites.js
│   │   │   ├── hotels.js
│   │   │   └── reviews.js
│   │   ├── components/
│   │   │   ├── ErrorAlert.jsx
│   │   │   ├── HotelCard.jsx
│   │   │   ├── Layout.jsx
│   │   │   ├── LoadingState.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── ReviewForm.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── HomePage.jsx
│   │   │   ├── HotelDetailsPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── MyFavoritesPage.jsx
│   │   │   ├── MyPlacesPage.jsx
│   │   │   ├── NotFoundPage.jsx
│   │   │   ├── PlaceFormPage.jsx
│   │   │   ├── ProfilePage.jsx
│   │   │   └── RegisterPage.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── theme.js
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── .env.example
├── database/
│   ├── migrations/
│   │   └── 001_auth_favorites_places.sql
│   ├── schema.sql
│   └── seed.sql
├── README.md
└── PROJECT_DOCUMENTATION.md
```

## Database Design

The project uses four main tables:

### hotels

Stores cafe and hotel information.

Columns:

- `id`
- `name`
- `category`
- `location`
- `description`
- `image_url`
- `created_by`
- `latitude`
- `longitude`

### users

Stores registered user accounts.

Columns:

- `id`
- `name`
- `email`
- `password_hash`
- `created_at`

### reviews

Stores ratings and reviews submitted by users.

Columns:

- `id`
- `hotel_id`
- `user_id`
- `rating`
- `review`
- `created_at`

### favorites

Stores places saved by users.

Columns:

- `id`
- `user_id`
- `hotel_id`
- `created_at`

The `favorites` table has a unique constraint on `(user_id, hotel_id)` so the same user cannot save the same place twice.

### place_images

Stores multiple gallery images for each cafe or hotel.

Columns:

- `id`
- `hotel_id`
- `image_url`
- `created_at`

## Database Files

Schema:

```text
database/schema.sql
```

Seed data:

```text
database/seed.sql
```

Migration for existing databases:

```text
database/migrations/001_auth_favorites_places.sql
database/migrations/002_images_locations_nearby.sql
```

The seed file includes demo users and sample cafes/hotels.

Demo login:

```text
Email: aarav@example.com
Password: password123
```

## Backend Details

The backend is an Express.js REST API.

Main backend file:

```text
backend/app.js
```

Database connection:

```text
backend/config/db.js
```

Authentication middleware:

```text
backend/middleware/authMiddleware.js
```

The backend uses environment variables from:

```text
backend/.env
```

Example:

```env
PORT=5000
NODE_ENV=development
DATABASE_URL=postgres://postgres:your_password@localhost:5432/venuevista
FRONTEND_URL=http://localhost:5173
JWT_SECRET=replace_with_a_long_random_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_FOLDER=venuevista
```

## Image Upload

Image upload uses:

- `multer` for multipart upload handling
- `cloudinary` for hosted image storage
- 5MB max file size
- jpg, jpeg, png, and webp validation

The frontend uploads images before saving a place. The returned Cloudinary URLs are stored in the `place_images` table, and the first image is also stored in `hotels.image_url` for card previews.

## Authentication

Authentication uses:

- `bcryptjs` to hash passwords
- `jsonwebtoken` to create and verify JWT tokens
- `Authorization: Bearer <token>` header for protected API routes

Protected features:

- Current user profile
- Add review
- Add favorite
- Remove favorite
- My Favorites
- Add Place
- Edit Place
- Delete Place
- My Places

## API Endpoints

### Authentication

Register:

```http
POST /api/auth/register
```

Request:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

Login:

```http
POST /api/auth/login
```

Request:

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

Response:

```json
{
  "token": "...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

Current user:

```http
GET /api/auth/me
```

### Hotels and Cafes

Get all places:

```http
GET /api/hotels
```

Search by name:

```http
GET /api/hotels?search=coffee
```

Filter by category:

```http
GET /api/hotels?category=Cafe
```

Get details:

```http
GET /api/hotels/:id
```

Get nearby places:

```http
GET /api/hotels/:id/nearby
```

Optional radius:

```http
GET /api/hotels/:id/nearby?radius=10
```

Get top-rated places:

```http
GET /api/hotels/top-rated
```

Get recent places:

```http
GET /api/hotels/recent
```

Get popular places:

```http
GET /api/hotels/popular
```

Create place:

```http
POST /api/hotels
```

Request:

```json
{
  "name": "Cafe Aroma",
  "category": "Cafe",
  "location": "Pune",
  "latitude": 18.5204,
  "longitude": 73.8567,
  "description": "Best coffee in town",
  "images": [
    "https://res.cloudinary.com/demo/image/upload/example.jpg"
  ]
}
```

Get my places:

```http
GET /api/hotels/mine
```

Update place:

```http
PUT /api/hotels/:id
```

Delete place:

```http
DELETE /api/hotels/:id
```

Only the creator of a place can edit or delete it.

### Favorites

Get my favorites:

```http
GET /api/favorites
```

Add favorite:

```http
POST /api/favorites
```

Request:

```json
{
  "hotel_id": 1
}
```

Remove favorite:

```http
DELETE /api/favorites/:hotelId
```

### Upload

Upload place image:

```http
POST /api/upload
```

Request type:

```text
multipart/form-data
```

Field:

```text
image
```

Response:

```json
{
  "imageUrl": "https://res.cloudinary.com/..."
}
```

### Reviews

Add review:

```http
POST /api/reviews
```

Request:

```json
{
  "hotel_id": 1,
  "rating": 5,
  "review": "Amazing coffee"
}
```

Delete review:

```http
DELETE /api/reviews/:id
```

Reviews are submitted by the logged-in user.

## Frontend Details

The frontend is built with React and Vite.

Main frontend file:

```text
frontend/src/App.jsx
```

Authentication state is managed by:

```text
frontend/src/context/AuthContext.jsx
```

Protected route logic is handled by:

```text
frontend/src/components/ProtectedRoute.jsx
```

The Axios API client stores the JWT token in request headers:

```text
frontend/src/api/client.js
```

## Frontend Routes

- `/` - Home page
- `/login` - Login page
- `/register` - Register page
- `/hotels/:id` - Place details page
- `/favorites` - My Favorites page
- `/my-places` - My Places page
- `/places/new` - Add Place page
- `/places/:id/edit` - Edit Place page
- `/profile` - Profile page

Protected routes:

- `/favorites`
- `/my-places`
- `/places/new`
- `/places/:id/edit`
- `/profile`

## Frontend Pages

### Home Page

Displays:

- Search input
- Category filter
- Top Rated Places section
- Recent Places section
- Popular Places section
- Cafe and hotel cards
- Average rating
- Favorite heart icon
- Loading and error states

### Details Page

Displays:

- Image
- Name
- Category
- Location
- Description
- Image gallery
- Map
- Nearby places
- Average rating
- Reviews
- Review form button

### Login Page

Allows users to log in with email and password.

### Register Page

Allows users to create a new account.

### My Favorites Page

Displays all places saved by the logged-in user.

### My Places Page

Displays all places created by the logged-in user.

Actions:

- Edit
- Delete

### Add Place Page

Allows logged-in users to create a new cafe or hotel.

Fields:

- Name
- Category
- Location
- Latitude
- Longitude
- Description
- Images

### Edit Place Page

Pre-fills existing place data and allows the creator to update it.

### Profile Page

Displays the logged-in user's name and email.

## UI Design

The UI uses Material UI components:

- AppBar
- Drawer
- Avatar
- Container
- Grid
- Card
- CardMedia
- CardContent
- Dialog
- Snackbar
- Skeleton
- CircularProgress
- Typography
- Rating
- TextField
- Select
- Button

The design is modern, clean, and responsive.

## Current Local URLs

Frontend:

```text
http://127.0.0.1:5174
```

Backend:

```text
http://127.0.0.1:5000
```

Backend health check:

```text
http://127.0.0.1:5000/health
```

## Setup Instructions

### 1. Install Backend Dependencies

```bash
cd backend
npm install
```

### 2. Install Frontend Dependencies

```bash
cd frontend
npm install
```

### 3. Create PostgreSQL Database

```bash
createdb venuevista
```

### 4. Run Database Schema

```bash
psql -d venuevista -f database/schema.sql
```

### 5. Run Seed Data

```bash
psql -d venuevista -f database/seed.sql
```

### 6. Apply Migration For Existing Database

```bash
psql -d venuevista -f database/migrations/001_auth_favorites_places.sql
psql -d venuevista -f database/migrations/002_images_locations_nearby.sql
```

### 7. Configure Backend Environment

Create:

```text
backend/.env
```

Add:

```env
PORT=5000
NODE_ENV=development
DATABASE_URL=postgres://postgres:your_password@localhost:5432/venuevista
FRONTEND_URL=http://localhost:5173
JWT_SECRET=replace_with_a_long_random_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_FOLDER=venuevista
```

### 8. Start Backend

```bash
cd backend
npm run dev
```

### 9. Start Frontend

```bash
cd frontend
npm run dev
```

## Troubleshooting

### CORS Error

If the browser shows a CORS error, make sure the backend allows the frontend origin.

The backend currently supports:

- `http://localhost:5173`
- `http://127.0.0.1:5173`
- `http://localhost:5174`
- `http://127.0.0.1:5174`

### Database Connection Error

If this message appears:

```json
{
  "message": "Database connection is not configured. Set DATABASE_URL in backend/.env and restart the API."
}
```

Check:

- `backend/.env` exists
- `DATABASE_URL` is correct
- PostgreSQL service is running
- The `venuevista` database exists
- Schema and seed files were executed
- Backend was restarted after changing `.env`

### Authentication Error

If login fails:

- Check email and password
- Confirm `JWT_SECRET` exists in `backend/.env`
- Confirm the users table has `password_hash`
- Restart the backend after `.env` changes

### Protected Page Redirects To Login

This means the user is not logged in or the JWT token is invalid. Log in again.

### Blank React Page

If the page is blank, check that `frontend/vite.config.js` exists and includes the React plugin.

### Cloudinary Upload Error

If image upload fails, check:

- Cloudinary env variables exist in `backend/.env`
- Backend was restarted after changing `.env`
- File type is jpg, jpeg, png, or webp
- File size is 5MB or smaller

### Map Does Not Load

If the map does not load:

- Check internet access for OpenStreetMap tiles
- Confirm the place has valid latitude and longitude
- Confirm `leaflet` CSS is imported in `frontend/src/main.jsx`

## Future Enhancements

Possible improvements:

- Admin dashboard
- Role-based access control
- Sort by rating
- Filter by location
- Pagination
- Review moderation
- User profile editing
- Password reset
- Better image validation
- Map integration

## Conclusion

VenueVista is now a complete full-stack recommendation system with browsing, reviews, authentication, favorites, and creator-owned place management. It demonstrates frontend development with React and Material UI, backend API development with Express.js, JWT authentication, and PostgreSQL database integration.
