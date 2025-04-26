# Arin Marketplace Backend

This is the backend for the Arin Marketplace application, providing authentication and user management functionality.

## Features

- User registration with validation
- User login with JWT authentication
- Protected routes for authenticated users
- MongoDB database integration

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory with the following variables:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/arin-marketplace
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

3. Start the server:
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
  - Body: `{ "username": "string", "email": "string", "password": "string" }`

- `POST /api/auth/login` - Login user
  - Body: `{ "email": "string", "password": "string" }`

- `GET /api/auth/me` - Get current user (protected route)
  - Headers: `Authorization: Bearer <token>`

## Error Handling

The API returns appropriate HTTP status codes and error messages:

- 400: Bad Request (validation errors)
- 401: Unauthorized (invalid credentials or missing token)
- 500: Server Error

## Security

- Passwords are hashed using bcrypt
- JWT tokens are used for authentication
- Input validation using express-validator
- CORS enabled for frontend integration 