# Karsis B2B E-shop

A B2B e-commerce platform for flooring products built with AdonisJS (backend) and Quasar.js (frontend).

## 🚀 Quick Start

### Backend (AdonisJS v6)

```bash
cd backend
npm install
node ace migration:run
node ace db:seed
npm run dev
```

Server runs at: http://localhost:3333

### Frontend (Coming Soon)

Quasar.js frontend will be added in Phase 2.

## 📋 Prerequisites

- Node.js v18+
- npm or yarn
- SQLite3 (or PostgreSQL for production)

## 🗄️ Database

Currently using SQLite for development. To switch to PostgreSQL:

1. Update `backend/.env`:
```env
DB_CONNECTION=postgres
DB_HOST=127.0.0.1
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_DATABASE=karsis_b2b_eshop
```

2. Install PostgreSQL driver:
```bash
cd backend
npm install pg
```

3. Re-run migrations:
```bash
node ace migration:fresh --seed
```

## 🔑 Test Accounts

### Admin
- Email: `admin@karsis.cz`
- Password: `password123`

### B2B Customers
- Email: `jan.novak@podlahy-pro.cz`
- Password: `password123`

- Email: `petra.svobodova@stav-mat.cz`
- Password: `password123`

## 📚 API Documentation

### Public Endpoints

- `GET /api/v1/products` - List all products (with filtering)
- `GET /api/v1/products/:id` - Get single product
- `GET /api/v1/products/filter-options` - Get filter options
- `GET /api/v1/categories` - List all categories
- `POST /api/v1/register` - Register new B2B account
- `POST /api/v1/login` - Login

### Protected Endpoints (Requires Authentication)

- `GET /api/v1/me` - Get current user
- `POST /api/v1/logout` - Logout
- `GET /api/v1/orders` - List user's orders
- `GET /api/v1/orders/:id` - Get single order
- `POST /api/v1/orders` - Create new order/reservation

### Product Filtering

Query parameters:
- `search` - Full-text search in name, description, SKU
- `category_id` - Filter by category
- `in_stock` - Show only in-stock items (true/false)
- `material` - Filter by material (e.g., "Vinyl", "Laminate", "Wood")
- `finish` - Filter by finish (e.g., "Matte", "Glossy")
- `wear_layer` - Filter by wear layer (e.g., "0.5mm", "0.7mm")
- `min_price` - Minimum price
- `max_price` - Maximum price
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20)

Example:
```
GET /api/v1/products?search=oak&material=Vinyl&in_stock=true&page=1&limit=10
```

## 🏗️ Project Structure

```
b2b-eshop/
├── backend/
│   ├── app/
│   │   ├── controllers/    # API endpoints
│   │   └── models/         # Database models
│   ├── database/
│   │   ├── migrations/     # Database schema
│   │   └── seeders/        # Sample data
│   ├── start/
│   │   └── routes.ts       # API routes
│   └── .env                # Environment config
├── frontend/               # (Coming in Phase 2)
└── docs/
    ├── PRD-Karsis-B2B-e-shop-MVP.md
    └── TechDesign-Karsis-B2B-e-shop-MVP.md
```

## ✨ Features

### Phase 1 (Completed)
- ✅ B2B account management with approval workflow
- ✅ Product catalog with categories
- ✅ Advanced filtering (material, finish, wear layer, etc.)
- ✅ Full-text search
- ✅ Dual-path checkout (Purchase/Reservation)
- ✅ Order history
- ✅ RESTful API

### Phase 2 (Planned)
- 🔄 Quasar.js frontend
- 🔄 Shopping cart
- 🔄 Saved shopping lists
- 🔄 Quick re-order
- 🔄 Admin panel

### Phase 3 (Planned)
- 🔄 ERP integration (BullMQ)
- 🔄 Payment gateway (Stripe)
- 🔄 Real-time inventory sync
- 🔄 Email notifications

## 📊 Database Schema

### Core Tables
- **companies** - B2B company accounts
- **users** - User authentication and roles
- **categories** - Product categories
- **products** - Flooring products with attributes
- **orders** - Purchase orders and reservations
- **order_items** - Order line items

## 🛠️ Tech Stack

- **Backend**: AdonisJS v6 (Node.js)
- **Database**: SQLite (dev) / PostgreSQL (prod)
- **ORM**: Lucid ORM
- **Authentication**: AdonisJS Auth (Session-based)
- **Frontend**: Quasar.js (Vue 3) - Coming soon

## 📝 License

Proprietary - Karsis s.r.o.

## 👨‍💻 Development

Created for Karsis B2B flooring e-shop MVP.
