# React + TypeScript Auth App

A modern, modular React application with TypeScript featuring authentication, protected routes, and comprehensive testing.

## Features

- **Login Page**: User authentication with form validation and error handling
- **Dashboard Page**: Protected content accessible only to authenticated users
- **Fake Authentication**: Simulated login system with local storage persistence
- **Protected Routes**: Route guards that redirect unauthenticated users
- **Modular Architecture**: Separated concerns for better testability and maintainability
- **TypeScript**: Full type safety throughout the application

## Tech Stack

- React 19
- TypeScript
- Vite (build tool)
- React Router DOM (routing)
- Vitest (testing)
- React Testing Library (component testing)
- CSS (custom styling)

## Project Structure

```
src/
├── components/
│   ├── ProtectedRoute.tsx      # Route guard component
│   └── index.ts                # Component exports
├── context/
│   ├── AuthContext.tsx         # Auth state management
│   └── index.ts                # Context exports
├── hooks/
│   ├── useAuthRedirect.ts      # Authentication redirect hook
│   └── index.ts                # Hook exports
├── pages/
│   ├── Login.tsx               # Login page
│   └── Dashboard.tsx           # Protected dashboard page
├── services/
│   ├── authService.ts          # Authentication service
│   └── index.ts                # Service exports
├── test/
│   └── setup.ts                # Test configuration
├── types/
│   ├── auth.ts                 # Auth TypeScript interfaces
│   ├── error.ts                # Error types
│   └── index.ts                # Type exports
├── App.tsx                     # Main app with routing
├── App.css                     # Main styles
├── main.tsx                    # Entry point
└── index.css                   # Global styles
```

## Architecture

### Service Layer (`services/`)
- **`authService.ts`**: Implements the `AuthService` interface with login, logout, and session management
- Designed for easy swapping with real API implementations
- Supports dependency injection for testing

### Context Layer (`context/`)
- **`AuthContext.tsx`**: React Context for auth state management
- Provides `useAuth()`, `useAuthStatus()`, and `useCurrentUser()` hooks
- Handles loading states and error management

### Hooks (`hooks/`)
- **`useAuthRedirect.ts`**: Custom hook for handling authentication-based redirects
- Encapsulates redirect logic for reusable authentication flows

### Types (`types/`)
- **`auth.ts`**: User and auth state interfaces
- **`error.ts`**: Error types and factory functions

## Demo Credentials

### User Account
- Email: `user@example.com`
- Password: `password123`

### Admin Account
- Email: `admin@example.com`
- Password: `admin123`

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Testing

```bash
# Run tests in watch mode
npm run test

# Run tests once
npm run test:run

# Run tests with coverage
npm run test:coverage
```

### Test Coverage
- Auth Service: Login, logout, session management
- Error Types: Error creation and type checking

## Usage

1. Start the development server
2. You'll be redirected to the login page
3. Enter demo credentials (see above)
4. Click "Sign In" to access the dashboard
5. Click "Logout" to return to the login page

## Key Components

### AuthContext
Manages authentication state and provides `login()` and `logout()` functions.
```tsx
const { user, isAuthenticated, isLoading, login, logout } = useAuth();
```

### ProtectedRoute
A wrapper component that checks authentication status and redirects unauthenticated users to the login page.
```tsx
<ProtectedRoute>
  <Dashboard />
</ProtectedRoute>
```

### useAuthRedirect
Custom hook for handling authentication redirects in pages.
```tsx
// In Login page - redirect if already authenticated
useAuthRedirect({ authenticatedRedirectTo: '/dashboard' });
```

## Swapping Auth Implementation

The auth service is designed to be easily swapped with a real API:

```tsx
// Create your custom auth service
class ApiAuthService implements AuthService {
  async login(email: string, password: string): Promise<User> {
    const response = await fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    return response.json();
  }
  // ... implement other methods
}

// Use in your app
<AuthProvider authService={new ApiAuthService()}>
  <App />
</AuthProvider>
```
