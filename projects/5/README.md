# React + TypeScript Authentication App

A React + TypeScript application with authentication, login pages, dashboard, and protected routes.

## Features

- **Login Page**: Clean, responsive login form with fake authentication
- **Dashboard Page**: Protected dashboard with user information and navigation
- **Protected Routes**: Route protection using HOC pattern
- **Fake Authentication**: In-memory authentication service for development
- **TypeScript**: Full TypeScript support with proper type definitions
- **React Router**: Client-side routing with protected route handling

## Project Structure

```
src/
├── components/
│   └── ProtectedRoute.tsx      # Higher-order component for route protection
├── hooks/
│   └── useAuth.ts              # Custom hook and context for authentication
├── pages/
│   ├── LoginPage.tsx           # Login page component
│   └── DashboardPage.tsx       # Dashboard page component
├── services/
│   └── authService.ts          # Fake authentication service
├── types/
│   └── auth.ts                 # TypeScript interfaces for authentication
├── App.tsx                     # Main app component with routing
└── main.tsx                    # Entry point
```

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Open http://localhost:5173/ in your browser

## Test Credentials

You can use the following test credentials to log in:

**User Account:**
- Email: `user@example.com`
- Password: `password`

**Admin Account:**
- Email: `admin@example.com`
- Password: `admin123`

## Authentication Flow

1. User visits protected route (e.g., `/` or `/dashboard`)
2. If not authenticated, user is redirected to `/login`
3. User enters valid credentials
4. Authentication service validates credentials
5. User data is stored in localStorage
6. User is redirected to the originally requested page
7. Protected routes allow access only to authenticated users

## Key Components

### AuthProvider
Provides authentication context to the entire application.

### useAuth
Custom hook for accessing authentication state and methods.

### ProtectedRoute
Higher-order component that protects routes and redirects unauthenticated users.

### authService
Service layer for authentication operations (login, logout, user management).

## Development

- Built with Vite for fast development and hot module replacement
- TypeScript for type safety
- React Router for client-side routing
- CSS-in-JS styling with Tailwind-like utility classes

## Future Enhancements

- Real API integration
- Password reset functionality
- User registration
- Role-based access control
- Persistent session management
- Form validation improvements