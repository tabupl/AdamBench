# React + TypeScript Authentication App

A simple React application with authentication features including login, dashboard, and protected routes.

## Features

- Login page with form validation
- Dashboard page with user information
- Fake authentication (test credentials: user@example.com / password)
- Protected routes that require authentication
- Signup page (simulated)
- Responsive design
- Modular, testable authentication service

## Project Structure

```
src/
├── components/
│   └── ProtectedRoute.tsx
├── pages/
│   ├── LoginPage.tsx
│   ├── DashboardPage.tsx
│   └── SignupPage.tsx
├── services/
│   └── authService.tsx        # Refactored authentication service
├── styles/
│   ├── LoginPage.css
│   ├── DashboardPage.css
│   └── SignupPage.css
├── types/
│   └── index.ts
├── App.tsx
└── index.tsx
```

## Refactored Authentication Service

The authentication logic has been refactored for better modularity and testability:

1. **Separation of Concerns**:
   - `AuthService` class handles all authentication logic
   - `AuthProvider` component manages React context
   - Custom hooks (`useAuth`, `useAuthState`, `useAuthActions`) for easier component integration

2. **Improved Testability**:
   - All authentication logic is in a separate class that can be unit tested
   - Storage methods are easily mockable for testing
   - Async operations are properly handled with proper error states

3. **Better State Management**:
   - Clear separation of state (`AuthState`) and actions (`AuthActions`)
   - Loading and error states are properly managed
   - Consistent API for authentication operations

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

3. Open [http://localhost:3000](http://localhost:3000) to view the app

## Authentication

The app uses a fake authentication system for demonstration purposes. Use these credentials to log in:
- Email: user@example.com
- Password: password

## Technologies Used

- React (with TypeScript)
- React Router DOM
- CSS Modules for styling

## Available Scripts

In the project directory, you can run:

### `npm start`
Runs the app in the development mode.
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `npm run build`
Builds the app for production to the `build` folder.