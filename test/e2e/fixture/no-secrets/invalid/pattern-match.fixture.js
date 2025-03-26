// This file contains strings that should trigger the no-pattern-match rule

// Variable names that suggest sensitive information
const apiKey = 'api-key-12345';
const password = 'user_password';
const secretKey = 'my-app-secret';

// Object with properties that suggest sensitive information
const credentials = {
  token: 'user-token-123',
  accessToken: 'access-token-456',
  refreshToken: 'refresh-token-789',
};

// Environment-like variables that suggest secrets
const env = {
  API_SECRET: 'dev-api-secret',
  PRIVATE_KEY: 'private-key-content',
  PASSWORD: 'admin-password',
};

// Function that uses password-like variables
function login(username, pwd) {
  const secret = 'app-secret-key';
  return authenticateUser(username, pwd, secret);
}

// Function with token in the name
function generateAuthToken(userId) {
  return `token_${userId}_${Date.now()}`;
}

// Export everything
export {
  apiKey,
  password,
  secretKey,
  credentials,
  env,
  login,
  generateAuthToken,
};