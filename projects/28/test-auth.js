const { validateCredentials, authenticateUser } = require('./src/services/authService');

console.log('Testing validateCredentials...');
const result = validateCredentials({ email: 'test@example.com', password: 'pass123' });
console.log('Result:', result);

if (result.success) {
  console.log('✓ Authentication works!');
} else {
  console.log('✗ Authentication failed:', result.error);
}
