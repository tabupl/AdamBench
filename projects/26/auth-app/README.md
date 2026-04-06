# CoPaw Flash Authentication App

A React + TypeScript authentication application with protected routes.

## Features

- ✅ Login page with form validation
- ✅ Dashboard page (protected route)
- ✅ Fake authentication (simulated with mock users)
- ✅ Protected routes using React Router
- ✅ Clean project structure with TypeScript

## Project Structure

```
src/
├── components/      # Reusable UI components
│   ├── Button.tsx   # Button component
│   └── Layout.tsx   # Page layout component
├── context/         # React Context
│   └── AuthContext.tsx   # Authentication context
├── hooks/           # Custom hooks
│   └── useProtectedRoute.ts   # Protected route hook
├── pages/           # Page components
│   ├── DashboardPage.tsx
│   └── LoginPage.tsx
├── services/        # Business logic/services
│   └── auth.service.ts   # Authentication service
├── types/           # TypeScript types
│   └── index.ts
└── App.tsx          # Main app component
```

## Authentication Service

The `AuthService` class provides:

- `login(credentials)`: Simulates login with mock users
- `logout()`: Clears authentication state
- `checkAuth()`: Checks if user is authenticated
- `getCurrentUser()`: Returns current user

### Mock Users

```
Email: john@example.com
Password: password

Email: jane@example.com
Password: password
```

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Start development server:

```bash
npm start
```

3. Open http://localhost:3000

4. Login with demo credentials:
   - Email: `john@example.com`
   - Password: `password`

## Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm run build:clean` - Clean build
- `npm run test` - Run tests
- `npm run lint` - Run ESLint

## Tech Stack

- React 19
- TypeScript
- React Router v6
- Context API for state management
- Tailwind CSS (via CRA)

## Security Notes

This is a demo application with fake authentication. In a production app:

1. Replace mock authentication with a real backend API
2. Use HTTPS in production
3. Implement proper token expiration and refresh
4. Add rate limiting
5. Use environment variables for sensitive data