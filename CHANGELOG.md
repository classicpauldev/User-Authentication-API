# Changelog

All notable changes to this project will be documented in this file.

## [0.2.0] - 2024-06-01

### Added
- Swagger/OpenAPI documentation at /api/docs
- API versioning with /api/v1 prefix
- Rate limiting with @nestjs/throttler
- Security headers with Helmet
- ConfigModule for environment variables
- ApiProperty and ApiOperation decorators for Swagger

### Changed
- All API endpoints now use /api/v1 prefix

## [0.1.0] - 2022-12-31

### Added
- Makefile for common tasks
- ValidationPipe in e2e tests
- Error handling in bootstrap
- Docker Compose for local MongoDB
- .dockerignore for builds
- Docker Compose for local MongoDB
- .dockerignore for builds

- User registration with email and password
- Login with JWT token issuance
- GET /auth/me for current user
- GET /users/:id for user by ID (protected)
- GET /health for health check
- Validation on DTOs
- Password hashing with bcrypt
