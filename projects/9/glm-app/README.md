# React + TypeScript Auth App

A modern authentication application built with React, TypeScript, and Tailwind CSS.

## Features

- ✅ Login page with form validation
- ✅ Dashboard with real-time clock
- ✅ Fake authentication with mock users
- ✅ Protected routes
- ✅ Responsive design
- ✅ TypeScript for type safety
- ✅ Tailwind CSS for styling

## Project Structure

```
glm-app/
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable UI components
│   ├── context/         # React Context for auth state
│   ├── hooks/           # Custom React hooks
│   ├── pages/           # Page components
│   ├── services/        # Business logic services
│   ├── test/            # Test setup files
│   ├── styles/          # Global styles
│   ├── types/           # TypeScript type definitions
│   ├── utils/           # Utility functions
│   ├── App.tsx          # Main app component
│   ├── main.tsx         # Entry point
│   └── index.css        # Global CSS
├── index.html           # HTML template
├── package.json         # Dependencies
├── tsconfig.json        # TypeScript config
├── vite.config.ts       # Vite config
├── vitest.config.ts     # Vitest config
└── tailwind.config.js   # Tailwind config
```

## Setup Instructions

1. **Install dependencies:**
   ```bash
   cd glm-app
   npm install
   ```

2. **Run the development server:**
   ```bash
   npm run dev
   ```

3. **Build for production:**
   ```bash
   npm run build
   ```

4. **Preview production build:**
   ```bash
   npm run preview
   ```

## Demo Credentials

- **Admin:** `admin@example.com` / `password123`
- **User:** `user@example.com` / `password123`

## Key Features Explained

### Authentication System
- Uses React Context API for global auth state
- Persist user session in localStorage
- Mock authentication with simulated API delay
- Logout functionality

### Protected Routes
- `ProtectedRoute` component wraps protected pages
- Redirects unauthenticated users to login
- Seamless navigation between routes

### Type Safety
- Full TypeScript implementation
- Type definitions for User, AuthContext, and forms
- Strict mode enabled for better type checking

## Technologies Used

- **React 18** - UI library
- **TypeScript** - Type safety
- **React Router DOM** - Routing
- **Tailwind CSS** - Styling
- **Vite** - Build tool
- **Vitest** - Testing framework

## Testing

The authentication logic has been refactored to be modular and testable:

### Services
- **`AuthService`** - Handles authentication logic and user validation
- **`StorageService`** - Manages localStorage operations

### Test Files
- **`auth.service.test.ts`** - Unit tests for authentication service
- **`storage.service.test.ts`** - Unit tests for storage service

### Running Tests

```bash
# Run all tests
npm test

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

### Benefits of Modular Design

1. **Separation of Concerns**: Business logic is separated from UI components
2. **Easy Testing**: Services can be tested in isolation without React
3. **Maintainability**: Changes to auth logic don't affect UI components
4. **Mocking**: Services can be easily mocked in integration tests

## License

MIT