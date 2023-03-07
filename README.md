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
- Swagger/OpenAPI documentation at /api/docs
- Rate limiting (Throttler)
- Security headers (Helmet)
- API versioning (/api/v1 prefix)

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

All endpoints are prefixed with `/api/v1`.

### Auth

- `POST /api/v1/auth/register` - Register (body: { email, password })
- `POST /api/v1/auth/login` - Login (body: { email, password })
- `GET /api/v1/auth/me` - Get current user (requires Bearer token)

### Users

- `GET /api/v1/users/:id` - Get user by ID (requires Bearer token)

### Health

- `GET /api/v1/health` - Health check

### API Documentation

Interactive Swagger docs available at `/api/docs` when the server is running.

## Docker

### Running MongoDB

```bash
docker-compose up -d
```

### Building the API
```bash
docker build -t user-auth-api .
docker run -p 3000:3000 --env-file .env user-auth-api
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
