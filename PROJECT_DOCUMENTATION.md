# VenueVista Project Documentation

## Project Title

VenueVista - Cafe & Hotel Recommendation System

## Document Type

This is a Markdown documentation file (`.md`). Markdown is recommended for software projects because it is easy to read, easy to edit, and works well on GitHub and in code editors.

If required for college or submission, this file can later be converted into:

- PDF
- Word document (`.docx`)
- Project report
- README file

## Project Overview

VenueVista is a full-stack web application that allows users to browse cafes and hotels, search by name, filter by category, view detailed information, submit ratings, and write reviews.

The application is built using React for the frontend, Express.js for the backend, and PostgreSQL for database storage.

## Main Features

- Browse cafes and hotels
- Search places by name
- Filter by category: Cafe or Hotel
- View place details
- View average rating
- Read user reviews
- Submit new reviews
- Rate places from 1 to 5 stars
- Responsive UI for desktop and mobile
- Backend REST API
- PostgreSQL database integration

## Technology Stack

### Frontend

- React 18
- Vite
- Material UI
- React Router
- Axios

### Backend

- Node.js
- Express.js
- PostgreSQL client library: `pg`
- CORS
- Helmet
- Morgan
- Dotenv

### Database

- PostgreSQL

## Project Folder Structure

```text
VenueVista/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── hotelController.js
│   │   └── reviewController.js
│   ├── middleware/
│   │   └── errorMiddleware.js
│   ├── models/
│   │   ├── hotelModel.js
│   │   └── reviewModel.js
│   ├── routes/
│   │   ├── hotelRoutes.js
│   │   └── reviewRoutes.js
│   ├── app.js
│   ├── package.json
│   ├── .env
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   ├── client.js
│   │   │   ├── hotels.js
│   │   │   └── reviews.js
│   │   ├── components/
│   │   │   ├── ErrorAlert.jsx
│   │   │   ├── HotelCard.jsx
│   │   │   ├── Layout.jsx
│   │   │   ├── LoadingState.jsx
│   │   │   └── ReviewForm.jsx
│   │   ├── pages/
│   │   │   ├── HomePage.jsx
│   │   │   ├── HotelDetailsPage.jsx
│   │   │   └── NotFoundPage.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── theme.js
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── .env.example
├── database/
│   ├── schema.sql
│   └── seed.sql
├── README.md
└── PROJECT_DOCUMENTATION.md
```

## Database Design

The project uses three main tables:

### hotels

Stores cafe and hotel information.

Columns:

- `id`
- `name`
- `category`
- `location`
- `description`
- `image_url`

### users

Stores user information.

Columns:

- `id`
- `name`
- `email`

### reviews

Stores ratings and reviews submitted by users.

Columns:

- `id`
- `hotel_id`
- `user_id`
- `rating`
- `review`
- `created_at`

## Database Schema

The schema is stored in:

```text
database/schema.sql
```

The sample data is stored in:

```text
database/seed.sql
```

Currently, the seed file contains 6 sample places:

- 3 cafes
- 3 hotels

More hotels and cafes can be added by inserting more rows into the `hotels` table.

## Backend Details

The backend is an Express.js API server.

Main backend file:

```text
backend/app.js
```

Database connection file:

```text
backend/config/db.js
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
```

## API Endpoints

### Get All Hotels and Cafes

```http
GET /api/hotels
```

Returns all hotels and cafes with average rating and review count.

### Search by Name

```http
GET /api/hotels?search=coffee
```

Returns places whose names match the search text.

### Filter by Category

```http
GET /api/hotels?category=Cafe
```

Returns places from the selected category.

### Get Place Details

```http
GET /api/hotels/:id
```

Returns details of one hotel or cafe, including reviews and average rating.

### Add Review

```http
POST /api/reviews
```

Request body:

```json
{
  "hotel_id": 1,
  "user_id": 1,
  "rating": 5,
  "review": "Amazing coffee"
}
```

### Delete Review

```http
DELETE /api/reviews/:id
```

Deletes a review by ID.

## Frontend Details

The frontend is built with React and Vite.

Main frontend file:

```text
frontend/src/App.jsx
```

The app uses React Router for navigation.

Routes:

- `/` - Home page
- `/hotels/:id` - Details page

## Frontend Pages

### Home Page

The Home Page displays:

- Search input
- Category filter
- Hotel and cafe cards
- Average rating
- Location
- Image
- Loading state
- Error message

### Details Page

The Details Page displays:

- Image
- Name
- Category
- Location
- Description
- Average rating
- Review list
- Review form button

### Review Form

The Review Form allows the user to:

- Select rating from 1 to 5 stars
- Enter review text
- Submit the review

After submission, the reviews are refreshed automatically.

## UI Design

The UI uses Material UI components:

- AppBar
- Container
- Grid
- Card
- CardMedia
- CardContent
- Typography
- Rating
- TextField
- Select
- Button
- Dialog

The design is clean, modern, and responsive.

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

### 6. Configure Backend Environment

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
```

### 7. Start Backend

```bash
cd backend
npm run dev
```

### 8. Start Frontend

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

### Blank React Page

If the page is blank, check that `frontend/vite.config.js` exists and includes the React plugin.

## Future Enhancements

Possible improvements:

- User authentication
- Admin dashboard
- Add hotel/cafe form
- Edit hotel/cafe details
- Delete hotel/cafe records
- Upload local images
- Sort by rating
- Filter by location
- Pagination
- User profile page
- Better review moderation

## Conclusion

VenueVista is a complete full-stack recommendation system for cafes and hotels. It demonstrates frontend development with React and Material UI, backend API development with Express.js, and database integration using PostgreSQL.

