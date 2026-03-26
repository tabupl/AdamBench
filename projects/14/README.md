# React + TypeScript Authentication App

A modern React application with TypeScript demonstrating authentication, protected routes, and a clean UI.

## Features

- 🔐 **Fake Authentication** - Simulated login with localStorage persistence
- 🛡️ **Protected Routes** - Secure route protection using React Router
- 🔐 **Fake Authentication** - Simulated login with localStorage persistence
- 🛡️ **Protected Routes** - Secure route protection using React Router
- ⚡ **TypeScript** - Full type safety throughout the application
- 🎨 **Modern UI** - Clean, responsive design with gradient aesthetics
- 📦 **Good Project Structure** - Well-organized components, services, and tests
- 🧪 **Comprehensive Testing** - Vitest with unit tests for services and hooks

## Project Structure

```
├── src/
│   ├── components/
│   │   └── ProtectedRoute.tsx      # Route guard component
│   ├── context/
│   │   └── AuthContext.tsx         # Authentication context provider
│   ├── hooks/
│   │   ├── useAuth.ts             # Auth hook
│   │   ├── useAuth.test.tsx       # Auth hook tests
│   │   └── useAuth.mock.ts        # Mock data for tests
│   ├── pages/
│   │   ├── HomePage.tsx            # Landing/home page
│   │   ├── LoginPage.tsx           # Login form page
│   │   └── DashboardPage.tsx       # Protected dashboard page
│   ├── services/
│   │   ├── auth.service.ts         # Auth service
│   │   ├── auth.service.test.ts    # Auth service tests
│   │   ├── auth.utils.ts           # Utility functions
│   │   ├── auth.utils.test.ts      # Utils tests
│   │   ├── storage.service.ts      # Storage service
│   │   └── utils/
│   │       └── auth.utils.ts       # Utility functions
│   ├── styles/
│   │   └── global.css              # Global styles
│   ├── types/
│   │   └── index.ts                # TypeScript type definitions
│   ├── App.tsx                     # Main app with routing
│   ├── setup.ts                    # Test setup
│   └── main.tsx                    # Entry point
├── public/
├── index.html
├── vite.config.ts
├── .vitest.config.ts
├── tsconfig.json
└── package.json
```

## Getting Started

### Prerequisites

- Node.js 16+ 
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

# Run tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with UI
npm run test:ui
```

## Demo Accounts

The app includes demo accounts for testing:

| User | Email | Password |
|------|-------|----------|
| Admin | admin@example.com | password |
| Regular | user@example.com | password |

## Key Components

### ProtectedRoute

A composable route guard that redirects to `/login` when authentication is required.

```tsx
<ProtectedRoute>
  <Route path="/dashboard" element={<DashboardPage />} />
</ProtectedRoute>
```

### AuthContext

Global authentication state management with login/logout functions.

```tsx
const { user, login, logout, isAuthenticated } = useAuth();
```

### Services

The refactored code separates concerns into modular services:

- **`auth.service.ts`** - Handles credential validation and user authentication
- **`storage.service.ts`** - Manages localStorage operations
- **`auth.utils.ts`** - Utility functions for dates, activities, and formatting

### Pages

- **HomePage** - Landing page with feature showcase
- **LoginPage** - Login form with validation
- **DashboardPage** - Protected dashboard with stats and actions

## Authentication Flow

1. User visits `/login` page
2. Enters email and password
3. Fake authentication (500ms delay)
4. Credentials validated against mock users
5. If valid, user stored in localStorage
6. Redirected to `/dashboard`

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **React Router v6** - Client-side routing
- **Vite** - Build tool and dev server
- **Vitest** - Testing framework
- **jsdom** - DOM environment for testing

## License

MIT
