# Farmers & Workers Platform (MERN)

A full MERN web application connecting farmers with field workers.

## Features

- Farmers request workers with detailed form and WhatsApp continuation link
- Workers create profiles with admin approval workflow (`pending -> approved -> rejected`)
- Public worker directory with filters (location, skill, availability)
- FAQ page with admin edit capability
- Contact page with WhatsApp + contact form + request call option
- Admin dashboard:
  - Approve/reject worker profiles
  - View farmer requests
  - Update request statuses (`new -> matched -> closed`)
  - Export workers/requests to CSV and Excel
- Admin authentication with JWT
- MongoDB persistence with sample seed data

## Tech Stack

- Frontend: React + Vite + Context API + Axios
- Backend: Node.js + Express + Mongoose + JWT
- Database: MongoDB Atlas / MongoDB

## Project Structure

- `backend/` → API, models, controllers, routes, seed
- `frontend/` → React app with pages, components, services, context

## Environment Setup

### Backend

1. Go to backend:

```bash
cd backend
```

2. `.env` is already created. If needed, update values:

```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=change_me_super_secret
ADMIN_EMAIL=admin@farmworkers.com
ADMIN_PASSWORD=admin123
FRONTEND_URL=http://localhost:5173
```

### Frontend

1. Go to frontend:

```bash
cd frontend
```

2. Create `.env` from example:

```bash
cp .env.example .env
```

3. Ensure API URL is set:

```env
VITE_API_URL=http://localhost:5000/api
```

## Install Dependencies

From project root:

```bash
cd backend && npm install
cd ../frontend && npm install
```

## Seed Sample Data

From `backend/`:

```bash
npm run seed
```

This creates:
- Admin user from `.env` credentials
- Sample workers
- Sample farmer requests
- Sample FAQs

## Run the App

### Start backend

```bash
cd backend
npm run dev
```

### Start frontend (new terminal)

```bash
cd frontend
npm run dev
```

Open: `http://localhost:5173`

## Main Routes

### Frontend pages

- `/` Home
- `/request-worker` Farmers request form
- `/worker-profile` Worker profile form
- `/directory` Approved worker directory
- `/faq` FAQ page
- `/contact` Contact page
- `/admin/login` Admin login
- `/admin` Admin dashboard (protected)

### Backend API

- `POST /api/auth/login`
- `POST /api/workers`
- `GET /api/workers` (approved only)
- `GET /api/workers/pending` (admin)
- `PATCH /api/workers/:id/status` (admin)
- `POST /api/requests`
- `GET /api/requests` (admin)
- `PATCH /api/requests/:id/status` (admin)
- `GET /api/faqs`
- `POST /api/faqs` (admin)
- `PATCH /api/faqs/:id` (admin)
- `DELETE /api/faqs/:id` (admin)
- `POST /api/contact`
- `GET /api/export/csv/:type` (admin, `workers|requests`)
- `GET /api/export/excel/:type` (admin, `workers|requests`)

## Notes

- `.env` files are ignored by git through root `.gitignore`.
- Export endpoints require admin token in `Authorization: Bearer <token>` header.
- WhatsApp links are generated with prefilled text from submitted forms.
