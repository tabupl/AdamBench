# React TypeScript Authentication App

A modern React + TypeScript application with authentication, protected routes, and a clean project structure.

## Features

- ✅ Login page with form validation
- ✅ Dashboard page with user information
- ✅ Fake authentication system
- ✅ Protected routes using React Router
- ✅ TypeScript for type safety
- ✅ Responsive design with Tailwind CSS
- ✅ Clean project structure
- ✅ **Modular authentication architecture**
- ✅ **Dependency injection for testability**
- ✅ **Comprehensive unit test coverage**

## Project Structure

```
src/
├── components/
│   ├── ProtectedRoute.tsx    # Route protection component
│   ├── LoginForm.tsx         # Login form component
│   └── Dashboard.tsx         # Dashboard component
├── pages/
│   ├── LoginPage.tsx         # Login page wrapper
│   └── DashboardPage.tsx     # Dashboard page wrapper
├── contexts/
│   └── AuthContext.tsx       # Authentication context (with DI)
├── types/
│   └── index.ts              # TypeScript type definitions
├── utils/
│   ├── auth.ts               # Authentication service
│   ├── storage.ts            # Storage adapter implementations
│   └── session.ts            # Session management
├── App.tsx                   # Main app component
└── main.tsx                  # Entry point
```

## Modular Architecture

The authentication system is built with separation of concerns and testability in mind:

### Storage Adapters (`src/utils/storage.ts`)
- **`LocalStorageAdapter`**: Persists session data in browser localStorage
- **`MemoryStorageAdapter`**: In-memory storage for testing (no browser APIs required)
- **`createStorageAdapter()`**: Factory function for flexible storage backend selection

### Authentication Service (`src/utils/auth.ts`)
- **`AuthService`**: Core authentication logic with:
  - Fake user database
  - Login validation
  - Token generation/validation
  - Simulated network delay for realism

### Session Manager (`src/utils/session.ts`)
- **`SessionManager`**: Handles session persistence using storage adapters
- Manages user and token storage
- Provides `getCurrentUser()` for session restoration

### Dependency Injection in AuthContext
The `AuthContext` uses dependency injection to accept adapters and services:

```typescript
const storageAdapter = createStorageAdapter()
const sessionManager = createSessionManager(storageAdapter)
const authService = createAuthService()

<AuthProvider
  storageAdapter={storageAdapter}
  sessionManager={sessionManager}
  authService={authService}
>
  <App />
</AuthProvider>
```

## Authentication

The app uses a fake authentication system with the following demo credentials:

- **Email:** `user@example.com`
- **Password:** Any password with 4+ characters

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:5173`

## Testing

Run the test suite with coverage:

```bash
npm run test           # Run tests
npm run test:coverage  # Run tests with coverage report
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run test` - Run unit tests
- `npm run test:coverage` - Run tests with coverage report

## Tech Stack

- React 18
- TypeScript
- Vite
- React Router
- Tailwind CSS
- Vitest
- Testing Library

## Test Coverage

```
% Stmts | % Branch | % Funcs | % Lines
  88.33 |     92.1 |     100 |   87.93
```

All core authentication utilities are fully tested with isolated unit tests.
