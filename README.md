# VenueVista - Cafe & Hotel Recommendation System

Full-stack recommendation app for browsing cafes and hotels, searching by name, filtering by category, viewing details, and managing reviews.

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

## Backend Setup

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

Update `backend/.env` if your PostgreSQL credentials differ.

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

- `GET /api/hotels` - list all hotels and cafes with average rating
- `GET /api/hotels?search=coffee` - search by name
- `GET /api/hotels?category=Cafe` - filter by category
- `GET /api/hotels/:id` - get place details, reviews, and average rating
- `POST /api/reviews` - create a review
- `DELETE /api/reviews/:id` - delete a review

## Review Payload

```json
{
  "hotel_id": 1,
  "user_id": 1,
  "rating": 5,
  "review": "Amazing coffee"
}
```

