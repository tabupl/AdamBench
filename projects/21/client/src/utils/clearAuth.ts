/**
 * Utility to clear authentication state
 */

export const clearAuth = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth_user');
    localStorage.removeItem('targetRoute');
    console.log('Auth cleared successfully');
  }
};

export default clearAuth;
