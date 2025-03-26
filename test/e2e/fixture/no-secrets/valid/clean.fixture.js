// This is a valid file with no secrets

// Normal strings with low entropy
const welcomeMessage = 'Welcome to our application!';
const appVersion = 'v1.2.3';
const userGreeting = 'Hello, user!';

// Configuration with safe values
const config = {
  maxRetries: 3,
  timeout: 5000,
  enableCache: true,
  apiEndpoint: 'https://api.example.com/v1',
};

// Function with normal parameters
function processUserData(userData) {
  console.log('Processing user data');
  return {
    ...userData,
    lastProcessed: new Date().toISOString(),
  };
}

// Array of safe values
const allowedRoles = [
  'user',
  'editor',
  'admin',
  'guest',
];

// Export everything
export {
  welcomeMessage,
  appVersion,
  userGreeting,
  config,
  processUserData,
  allowedRoles,
};