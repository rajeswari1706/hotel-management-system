# Hotel Management Full-Stack System (CRUD + Responsive UI)

A modern full-stack web application designed and developed strictly according to the **Namlatech India Private Limited** specifications.

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend** | **ReactJS (v18)**, **Redux Toolkit**, **React Router v6**, **React Helmet Async** (SEO), **Leaflet** & **OpenStreetMap**, **HTML5 Geolocation API**, Custom Responsive CSS |
| **Backend** | **Node.js**, **Express.js**, **Multer** (Local Server Image Storage), Custom Validation Middleware, CORS |
| **Database** | **PostgreSQL** using **Native SQL Queries** (Strictly no ORM), Parameterized Queries (`$1, $2, ...`) |
| **DevOps** | **Docker Compose** (PostgreSQL + pgAdmin) |

---

## 📁 Structured Project Layout

```text
hotel-management-system/
├── docker-compose.yml              # Instant PostgreSQL & pgAdmin services
├── README.md                       # Complete documentation & setup instructions
├── backend/
│   ├── .env.example                # Example backend environment variables
│   ├── .env                        # Local backend configuration
│   ├── package.json                # Express & pg dependencies
│   ├── server.js                   # Express server entrypoint & static upload routes
│   ├── config/
│   │   └── db.js                   # Native PostgreSQL Pool connection & query runner
│   ├── controllers/
│   │   └── hotelController.js      # CRUD controllers using Native SQL queries
│   ├── middleware/
│   │   ├── upload.js               # Multer disk storage for local image uploads
│   │   ├── validator.js            # Input validation middleware (create & update)
│   │   └── errorHandler.js         # Centralized error and 404 handlers
│   ├── routes/
│   │   └── hotelRoutes.js          # REST API route endpoints
│   ├── sql/
│   │   ├── schema.sql              # DDL schema definition & query performance indexes
│   │   ├── seed.sql                # Initial hotel demo records
│   │   └── initDb.js               # Automated script to apply schema & seed database
│   └── uploads/                    # Local storage directory for uploaded hotel images
└── frontend/
    ├── index.html                  # HTML entrypoint with Leaflet & font styles
    ├── package.json                # React, Redux Toolkit & frontend dependencies
    ├── vite.config.js              # Vite bundler config with backend reverse proxy
    └── src/
        ├── main.jsx                # App mount with Redux Provider & HelmetProvider
        ├── App.jsx                 # Single Page Application (SPA) routing
        ├── index.css               # Global theme variables, reset & utilities
        ├── assets/
        │   └── styles/
        │       ├── Navbar.css      # Header navigation styling
        │       ├── HotelList.css   # Responsive layout with sidebar & cards
        │       ├── HotelCard.css   # Horizontal card layout matching sample UI
        │       ├── HotelForm.css   # Reusable Add/Edit form & image preview styles
        │       ├── HotelDetail.css # Detail view & interactive map container
        │       ├── Pagination.css  # Reusable pagination bar
        │       └── Toast.css       # Success/error popups & modal dialog
        ├── components/
        │   ├── Navbar.jsx          # Brand header with search bar & navigation
        │   ├── HotelCard.jsx       # Reusable card component with SEO alt tags
        │   ├── HotelFilters.jsx    # Title search & Min/Max price filter controls
        │   ├── HotelForm.jsx       # Reusable single form for Add & Edit
        │   ├── Pagination.jsx      # Reusable pagination component
        │   ├── MapView.jsx         # Interactive Leaflet map + Geolocation API
        │   ├── DeleteModal.jsx     # Delete confirmation popup modal
        │   └── Toast.jsx           # Global success/error notification toasts
        ├── pages/
        │   ├── HomePage.jsx        # Hotel list page with pagination & filters
        │   ├── HotelDetailPage.jsx # Detail page with dynamic React Helmet SEO
        │   ├── AddHotelPage.jsx    # Add hotel page wrapping HotelForm
        │   └── EditHotelPage.jsx   # Edit hotel page wrapping HotelForm
        ├── redux/
        │   ├── store.js            # Redux Toolkit store setup
        │   ├── hotelSlice.js       # Hotel CRUD, filters & pagination async thunks
        │   └── uiSlice.js          # Modal & toast notification state
        └── services/
            └── api.js              # Axios HTTP client & image path resolver
```

---

## ✨ Features Implemented Against Requirements

### 1. Frontend Requirements
- **Add/Edit Form**:
  - Reused as a **single form component (`HotelForm.jsx`)** for both adding and editing records.
  - Image upload with **live client-side preview** before submission.
  - Validations for Title (min 3 chars), Description (min 10 chars), Price (non-negative numeric), Latitude (-90 to 90), and Longitude (-180 to 180).
  - Built-in **"Detect My Location"** button utilizing the browser's HTML5 Geolocation API to auto-populate coordinates.
- **List Page with Pagination**:
  - Horizontal card layout (matching the provided UI design on Page 3) rather than a plain table.
  - Each item card shows the hotel image, title, price, star rating, coordinates, and short description snippet.
  - **Search & Filters**: Instant search by hotel title and price range filtering (Min and Max with Apply button).
  - **Pagination**: Paginated navigation with offset and limit parameters.
  - **Edit & Delete Options**: Direct edit and delete triggers with a confirmation modal and **success popup notification upon deletion**.
- **Detail Page**:
  - Displays full hotel image hero, ratings, tags, pricing, and full description.
  - Interactive map integration displaying exact hotel latitude and longitude.
  - Live Geolocation calculation: measures and displays distance from user's current GPS location to the hotel in kilometers and miles.
- **SEO Optimization**:
  - **React Helmet** (`react-helmet-async`) on every page for dynamic page titles, descriptions, and OpenGraph meta tags.
  - All images include meaningful descriptive `alt` tags for search engine bots and screen-reader accessibility.
- **Single Page Application (SPA)**:
  - Zero-page-reloads powered by React Router v6 and Redux Toolkit.

### 2. Backend Requirements
- **Node.js with Express**:
  - RESTful architecture with structured routers, controllers, and middleware.
- **PostgreSQL Database with Native SQL**:
  - **Strictly Native SQL queries (`pg` pool)** — no ORM (Sequelize, Prisma, or TypeORM) used.
  - Parameterized queries (`$1, $2, ...`) for protection against SQL injection.
- **Server Storage for Images**:
  - Uploaded images stored locally on the server under the `backend/uploads/` directory using Multer.
  - Automatically served statically at `/uploads/`.
  - When a hotel record is deleted, the associated image is safely removed from the server filesystem.
- **API Endpoints**:
  - `POST /api/hotels`: Multipart form upload, input validation, native SQL insert.
  - `PUT /api/hotels/:id`: Updates existing hotel record, replaces old image if new one provided.
  - `DELETE /api/hotels/:id`: Deletes hotel record and deletes associated image from disk.
  - `GET /api/hotels`: Dynamic search filter by title, price range (`min_price`, `max_price`), and offset-limit pagination.
  - `GET /api/hotels/:id`: Returns full single hotel details.

---

## 🚀 Quick Start Guide

### Step 1: Start PostgreSQL Database

You can run PostgreSQL in one command using Docker:
```bash
docker compose up -d
```
*Alternatively, if you already have PostgreSQL installed locally, create a database named `hotel_db` and verify your credentials in `backend/.env`.*

### Step 2: Setup & Start the Backend

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Initialize database schema & seed initial records:
   ```bash
   npm run db:init
   ```
4. Start the backend development server:
   ```bash
   npm run dev
   ```
   *The server runs at `http://localhost:5000`.*

### Step 3: Setup & Start the Frontend

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to:
   ```text
   http://localhost:5173
   ```

---

## 📡 Backend API Reference

| Method | Endpoint | Description | Request Body / Query |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/hotels` | Fetch filtered & paginated hotels | Query: `title`, `min_price`, `max_price`, `limit`, `offset`, `sort` |
| `GET` | `/api/hotels/:id` | Fetch single hotel detail | Path param: `id` |
| `POST` | `/api/hotels` | Create new hotel record | Multipart Form: `image`, `title`, `description`, `price`, `latitude`, `longitude` |
| `PUT` | `/api/hotels/:id` | Update hotel by ID | Multipart Form: optional `image`, `title`, `description`, `price`, `latitude`, `longitude` |
| `DELETE`| `/api/hotels/:id` | Delete hotel & associated image | Path param: `id` |
| `GET` | `/api/health` | Health check endpoint | None |

---

## 🗄️ Native SQL Query Examples Used in Code

### 1. Paginated Search & Filter
```sql
SELECT id, title, description, price, latitude, longitude, image_url, created_at, updated_at
FROM hotels
WHERE LOWER(title) LIKE $1 AND price >= $2 AND price <= $3
ORDER BY created_at DESC
LIMIT $4 OFFSET $5;
```

### 2. Create Hotel Record
```sql
INSERT INTO hotels (title, description, price, latitude, longitude, image_url)
VALUES ($1, $2, $3, $4, $5, $6)
RETURNING *;
```

### 3. Update Hotel Record
```sql
UPDATE hotels
SET title = $1, description = $2, price = $3, latitude = $4, longitude = $5, image_url = $6, updated_at = CURRENT_TIMESTAMP
WHERE id = $7
RETURNING *;
```

### 4. Delete Hotel Record
```sql
DELETE FROM hotels WHERE id = $1 RETURNING *;
```
