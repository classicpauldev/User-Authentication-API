# User Authentication API

A NestJS-based REST API for user registration, login, and JWT authentication.

## Features

- User registration with email and password
- Login with JWT token issuance
- Protected routes via JWT authentication
- Password hashing with bcrypt
- MongoDB storage with Mongoose
- Request validation with class-validator
- Health check endpoint

## Prerequisites

- Node.js 18+
- MongoDB (local or remote)

## Installation

```bash
npm install
```

## Configuration

## Environment Variables

- `PORT` - Server port (default: 3000)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret for JWT signing

Copy `.env.example` to `.env` and configure:

- `PORT` - Server port (default: 3000)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret for JWT signing (change in production)

## Running the App

```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod
```

## API Endpoints

### Auth

- `POST /auth/register` - Register a new user (email, password)
- `POST /auth/login` - Login and receive JWT token
- `GET /auth/me` - Get current user (requires Bearer token)

### Users

- `GET /users/:id` - Get user by ID (requires Bearer token)

### Health

- `GET /health` - Health check

## Testing

```bash
npm test
```

## Project Structure

- `src/auth/` - Authentication module (register, login, JWT)
- `src/users/` - Users module
- `src/health/` - Health check
- `src/common/` - Shared constants

## Scripts

- `npm run start:dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run start:prod` - Run production build
- `npm run test` - Run unit tests
- `npm run test:e2e` - Run end-to-end tests
- `npm run lint` - Run ESLint

## License

UNLICENSED
