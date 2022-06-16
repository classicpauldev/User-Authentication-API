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

- `POST /auth/register` - Register (body: { email, password })
- `POST /auth/login` - Login (body: { email, password })
- `GET /auth/me` - Get current user (requires Bearer token)

### Users

- `GET /users/:id` - Get user by ID (requires Bearer token)

### Health

- `GET /health` - Health check

## Docker

Start MongoDB with docker-compose:

```bash
docker-compose up -d
```

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

## Troubleshooting

- Ensure MongoDB is running before starting the app
- Check that PORT and MONGODB_URI are set correctly in .env

## License

UNLICENSED

## Security

Never commit .env or expose JWT_SECRET. Use strong passwords in production.

## Contributing

See CONTRIBUTING.md for guidelines.

## Changelog

See CHANGELOG.md for version history.
<!-- commit 1 -->
<!-- commit 2 -->
<!-- commit 3 -->
<!-- commit 4 -->
<!-- commit 5 -->
<!-- commit 6 -->
<!-- commit 7 -->
<!-- commit 8 -->
<!-- commit 9 -->
<!-- commit 10 -->
<!-- commit 11 -->
<!-- commit 12 -->
<!-- commit 13 -->
<!-- commit 14 -->
<!-- commit 15 -->
<!-- commit 16 -->
<!-- commit 17 -->
<!-- commit 18 -->
<!-- commit 19 -->
<!-- commit 20 -->
<!-- commit 21 -->
<!-- commit 22 -->
<!-- commit 23 -->
<!-- commit 24 -->
<!-- commit 25 -->
<!-- commit 26 -->
<!-- commit 27 -->
<!-- commit 28 -->
<!-- commit 29 -->
<!-- commit 30 -->
<!-- commit 31 -->
<!-- commit 32 -->
<!-- commit 33 -->
<!-- commit 34 -->
<!-- commit 35 -->
<!-- commit 36 -->
<!-- commit 37 -->
<!-- commit 38 -->
<!-- commit 39 -->
<!-- commit 40 -->
<!-- commit 41 -->
<!-- commit 42 -->
<!-- commit 43 -->
