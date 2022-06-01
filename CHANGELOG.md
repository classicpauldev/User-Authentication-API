# Changelog

All notable changes to this project will be documented in this file.

## [0.1.0] - 2022-12-31

### Added
- Docker Compose for local MongoDB
- .dockerignore for builds

- User registration with email and password
- Login with JWT token issuance
- GET /auth/me for current user
- GET /users/:id for user by ID (protected)
- GET /health for health check
- Validation on DTOs
- Password hashing with bcrypt
