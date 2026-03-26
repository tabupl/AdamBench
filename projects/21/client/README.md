# React TypeScript Authentication App

A modular React + TypeScript authentication application demonstrating clean architecture and testable code.

## Features

- ✅ **Login Page** - User authentication interface
- ✅ **Dashboard Page** - Main user dashboard with user info
- ✅ **Admin Dashboard** - Admin-only panel with role-based access
- ✅ **Fake Authentication** - In-memory user store with mock API
- ✅ **Protected Routes** - Route protection with redirect logic
- ✅ **Role-Based Access Control** - Different views for admin and regular users
- ✅ **Persistent Sessions** - localStorage-based session management
- ✅ **Testable Code** - Modular architecture with unit tests

## Project Structure

```
client/
├── src/
│   ├── components/
│   │   ├── MainLayout.tsx          # Navigation header + layout wrapper
│   │   └── ProtectedRoute.tsx      # Route protection with role checks
│   ├── context/
│   │   └── AuthContext.tsx         # Authentication context provider
│   ├── pages/
│   │   ├── LoginPage.tsx           # Login form component
│   │   ├── DashboardPage.tsx       # User dashboard
│   │   └── AdminDashboardPage.tsx  # Admin-only dashboard
│   ├── routes/
│   │   └── AppRoutes.tsx           # Route configuration
│   ├── styles/
│   │   └── globals.css             # Global styles
│   ├── types/
│   │   └── auth.ts                 # TypeScript type definitions
│   ├── utils/
│   │   ├── authStorage.ts          # Storage layer (localStorage)
│   │   ├── authService.ts          # Business logic layer
│   │   └── authService.test.ts     # Unit tests
│   ├── main.tsx                    # Application entry point
│   └── App.tsx                     # Main App component
├── index.html
├── vite.config.ts
├── tsconfig.json
└── README.md
```

## Architecture

### Layered Architecture

```
┌─────────────────────────────────────┐
│         UI Components               │
│  (Pages, Layouts, ProtectedRoutes)  │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│         Context Layer               │
│         (AuthContext)               │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│        Service Layer                │
│         (AuthService)               │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│       Storage Layer                 │
│    (AuthStorage - localStorage)     │
└─────────────────────────────────────┘
```

### Benefits of This Architecture

1. **Testability**: Each layer can be tested in isolation
2. **Mockability**: Easy to swap storage or API implementations
3. **Separation of Concerns**: Clear boundaries between layers
4. **Maintainability**: Changes in one layer don't affect others
5. **Reusability**: Components can be reused across different storage backends

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
cd client
npm install
```

### Development

```bash
# Start development server
npm run dev

# Run tests
npm test

# Run tests in watch mode
npm run test
```

### Build

```bash
npm run build
npm run preview
```

## Demo Credentials

| Email | Password | Role |
|-------|----------|------|
| admin@example.com | admin@example.com | Admin |
| user@example.com | user@example.com | User |

## Module Details

### Auth Storage (`authStorage.ts`)

Handles all localStorage operations:
- `getStoredUser()`: Retrieve current user
- `setStoredUser()`: Save user to storage
- `removeStoredUser()`: Clear storage
- `getStoredUsers()`: Access user database
- `setStoredUsers()`: Save user database

**For Testing**: Can be replaced with a mock storage implementation.

### Auth Service (`authService.ts`)

Handles business logic:
- `login()`: Authenticate user
- `logout()`: Clear session
- `isAuthenticated()`: Check auth status
- `getCurrentUser()`: Get current user data
- `setMockApi()`: Override API for testing

**For Testing**: Use `setMockApi()` to inject mock API implementations.

### Auth Context (`AuthContext.tsx`)

Provides auth state to components:
- `user`: Current user object
- `isAuthenticated`: Auth status
- `isLoading`: Loading state
- `login()`: Login function
- `logout()`: Logout function

## Testing

Run tests with:
```bash
npm run test:run
```

The test file demonstrates:
- Mocking dependencies
- Testing async operations
- Error handling
- State management

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **React Router DOM v6** - Client-side routing
- **Vite** - Build tool & dev server
- **CSS** - Modern styling with CSS variables

## API

### AuthContext API

```typescript
const { user, isAuthenticated, isLoading, login, logout } = useAuth();

// Login
await login({ email: 'user@example.com', password: 'password' });

// Logout
logout();
```

### Protected Routes

```typescript
// Require authentication
<Route element={<ProtectedRoute />}>
  <Route path="/dashboard" element={<Dashboard />} />
</Route>

// Require specific role
<Route element={<ProtectedRoute />}>
  <Route element={<RequireAdmin />}>
    <Route path="/admin" element={<AdminPanel />} />
  </Route>
</Route>
```

## License

MIT
