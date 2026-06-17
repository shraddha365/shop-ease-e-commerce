# ShopEase

ShopEase is a complete MERN e-commerce starter with a modern React storefront, JWT authentication, cart and checkout flows, wishlist, reviews, coupons, admin management, MongoDB models, Express REST APIs, Stripe payment intent support, and deployment-ready configuration.

## Tech Stack

- Frontend: React.js, Vite, Tailwind CSS v4
- Backend: Node.js, Express.js
- Database: MongoDB with Mongoose
- Authentication: JWT with bcrypt password hashing
- Payment: Stripe payment intent endpoint
- State management: React Context-style local state and localStorage persistence in the frontend demo
- Deployment targets: Vercel for frontend, Render for backend, MongoDB Atlas for database

## Folder Structure

```text
ShopEase/
├── src/
│   ├── App.tsx              # Complete responsive storefront and admin UI
│   ├── main.tsx
│   ├── index.css            # Tailwind import and motion styles
│   └── utils/
├── backend/
│   ├── server.js            # API entry point for Render
│   ├── .env.example
│   └── src/
│       ├── app.js
│       ├── config/db.js
│       ├── controllers/
│       ├── data/products.js
│       ├── middleware/
│       ├── models/
│       ├── routes/
│       ├── seed.js
│       └── utils/generateToken.js
├── .env.example
├── README.md
├── package.json
└── vite.config.ts
```

## Features

- Responsive homepage with navbar, full-bleed hero, featured products, categories, best sellers, newsletter, and footer
- Product listing with search, category filtering, price filtering, and latest or price sorting
- Product detail page with image gallery, price, description, rating, reviews, stock state, and badges
- User registration and login flow with demo JWT-ready users
- User profile update form and order history
- Cart with add, remove, quantity updates, and total calculation
- Checkout with shipping address, payment method selection, coupon discounts, order summary, and place order flow
- Admin dashboard for revenue, products, users, and orders
- Admin product create, edit, delete operations
- Admin user management and order status updates
- Wishlist, product reviews, coupon codes, newsletter subscription, contact page, and about page
- Backend MVC structure with models, controllers, routes, middleware, validation, and centralized error handling
- MongoDB schemas for User, Product, Cart, Order, ContactMessage, and NewsletterSubscriber
- Stripe payment intent API endpoint

## Demo Accounts

- Admin: `admin@shopease.com` / `Admin123!`
- Customer: `user@shopease.com` / `User123!`

The Vite frontend includes a localStorage-powered demo experience so the full shopping flow works immediately after the frontend starts. The backend is ready for wiring into the UI through `VITE_API_URL`.

## MongoDB Schema Overview

- User: name, email, hashed password, role, phone, address, wishlist
- Product: name, slug, description, category, brand, price, originalPrice, images, rating, numReviews, stock, badge, sold, reviews
- Cart: user, items with product and quantity
- Order: user, orderItems, shippingAddress, paymentMethod, paymentResult, couponCode, prices, paid status, fulfillment status
- ContactMessage: name, email, phone, subject, message, status
- NewsletterSubscriber: email, source, active status

## API Routes

Base URL: `/api`

| Method | Route | Access | Description |
| --- | --- | --- | --- |
| GET | `/health` | Public | API health check |
| POST | `/users/register` | Public | Register a user |
| POST | `/users/login` | Public | Login and receive JWT |
| GET | `/users/profile` | User | Get profile |
| PUT | `/users/profile` | User | Update profile |
| POST | `/users/wishlist/:productId` | User | Toggle wishlist product |
| GET | `/products` | Public | List products with search, category, price, sort, pagination |
| GET | `/products/:id` | Public | Get product details |
| POST | `/products` | Admin | Create product |
| PUT | `/products/:id` | Admin | Update product |
| DELETE | `/products/:id` | Admin | Delete product |
| POST | `/products/:id/reviews` | User | Add product review |
| GET | `/cart` | User | Get cart |
| POST | `/cart/items` | User | Add item to cart |
| PUT | `/cart/items/:productId` | User | Update cart quantity |
| DELETE | `/cart/items/:productId` | User | Remove cart item |
| DELETE | `/cart` | User | Clear cart |
| POST | `/orders` | User | Place order |
| GET | `/orders/myorders` | User | View own orders |
| GET | `/orders/:id` | User/Admin | View order detail |
| PATCH | `/orders/:id/pay` | User | Mark paid after payment result |
| PATCH | `/orders/:id/status` | Admin | Update order status |
| GET | `/admin/dashboard` | Admin | Dashboard metrics |
| GET | `/admin/users` | Admin | Manage users |
| PATCH | `/admin/users/:id/role` | Admin | Update user role |
| DELETE | `/admin/users/:id` | Admin | Delete user |
| GET | `/admin/orders` | Admin | Manage orders |
| PATCH | `/admin/orders/:id/status` | Admin | Update order status |
| POST | `/payments/stripe/create-payment-intent` | User | Create Stripe payment intent |
| POST | `/contact` | Public | Save contact form message to MongoDB |
| GET | `/contact` | Admin | View contact messages |
| PATCH | `/contact/:id/status` | Admin | Update contact message status |
| DELETE | `/contact/:id` | Admin | Delete contact message |
| POST | `/newsletter/subscribe` | Public | Save newsletter subscriber to MongoDB |
| GET | `/newsletter/subscribers` | Admin | View newsletter subscribers |
| PATCH | `/newsletter/unsubscribe/:email` | Public | Disable newsletter subscription |

## Installation

1. Install dependencies:

```bash
npm install
```

2. Create environment files:

```bash
cp .env.example .env
cp backend/.env.example backend/.env
```

3. Update MongoDB and Stripe values in `.env` or `backend/.env`.

4. Seed sample data after setting `MONGO_URI`:

```bash
node backend/src/seed.js
```

5. Start the frontend:

```bash
npm run dev
```

6. Start the backend in another terminal:

```bash
node backend/server.js
```

The frontend runs on `http://localhost:5173` and the API runs on `http://localhost:5000`.

## Environment Variables

```env
VITE_API_URL=http://localhost:5000/api
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
MONGO_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/shopease
JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRES_IN=30d
STRIPE_SECRET_KEY=sk_test_replace_me
```

## Screenshots

Add screenshots after deployment:

- Homepage full-bleed hero
- Product listing filters
- Product detail gallery
- Cart and checkout
- User profile order history
- Admin dashboard

## Live Demo

- Frontend: Add your Vercel URL here
- Backend API: Add your Render URL here

## Deploy Frontend on Vercel

1. Push the repository to GitHub.
2. Import the repository in Vercel.
3. Set Framework Preset to `Vite`.
4. Set Build Command to `npm run build`.
5. Set Output Directory to `dist`.
6. Add `VITE_API_URL=https://your-render-api.onrender.com/api`.
7. Deploy.

## Deploy Backend on Render

1. Create a new Web Service from the same GitHub repository.
2. Use `Node` runtime.
3. Set Build Command to `npm install`.
4. Set Start Command to `node backend/server.js`.
5. Add environment variables from `backend/.env.example`.
6. Add your Vercel domain to `CLIENT_URL`.
7. Deploy and test `/api/health`.

## Production Notes

- Use MongoDB Atlas for production database hosting.
- Use a long random `JWT_SECRET`.
- Replace demo Stripe keys with live keys only after testing webhooks and order confirmation.
- Add rate limiting and request logging before high-traffic launch.
- Connect the frontend API calls to the backend endpoints through `VITE_API_URL` when moving beyond the localStorage demo.