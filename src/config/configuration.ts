/** Application configuration from environment. */
export default () => ({
  port: parseInt(process.env.PORT || '3000', 10),
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/user-auth-api',
  jwtSecret: process.env.JWT_SECRET || 'default-secret-change-in-production',
  jwtExpiry: process.env.JWT_EXPIRY || '1d',
});
