# Delta Coder - React + TypeScript Authentication App

A modern React + TypeScript application with modular authentication, protected routes, and a clean project structure.

## ✨ Features

- ✅ Login page with form validation
- ✅ Dashboard page protected by authentication
- ✅ Modular authentication architecture
- ✅ Protected routes that redirect unauthenticated users
- ✅ Persistent session using localStorage
- ✅ TypeScript for type safety
- ✅ Vite for fast development and builds
- ✅ Easy to test and mock authentication
- ✅ Dark theme UI

## 🏗️ Architecture

### Modular Design

The authentication logic is separated into three distinct layers:

```
src/
├── services/
│   └── authService.ts          # Pure business logic (testable)
├── hooks/
│   └── useAuth.ts              # Custom hook (components use this)
├── context/
│   └── AuthContext.tsx         # State management (React)
├── components/
│   └── ProtectedRoute.tsx      # Route protection
├── pages/
│   ├── LoginPage.tsx           # Login UI
│   └── DashboardPage.tsx       # Dashboard UI
└── utils/
    └── testUtils.ts            # Test helpers
```

## 📂 Project Structure

```
DeltaCoder/
├── src/
│   ├── components/
│   │   └── ProtectedRoute.tsx    # Route protection wrapper
│   ├── context/
│   │   └── AuthContext.tsx       # Authentication state context
│   ├── hooks/
│   │   └── useAuth.ts            # Custom auth hook
│   ├── pages/
│   │   ├── LoginPage.tsx         # Login page component
│   │   └── DashboardPage.tsx     # Dashboard page component
│   ├── services/
│   │   └── authService.ts        # Pure auth logic (no React)
│   ├── types/
│   │   └── auth.ts               # TypeScript type definitions
│   ├── utils/
│   │   └── testUtils.ts          # Testing utilities
│   ├── App.tsx                   # Main app with routing
│   ├── main.tsx                  # Entry point
│   └── index.css                 # Global styles
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Usage

1. Open `http://localhost:5173` in your browser
2. Enter any email and password to login
3. Access the protected dashboard

## 🔐 Authentication

### Fake Authentication (Demo)

This app uses fake authentication for demonstration:
- Any email/password combination works
- User data is stored in localStorage
- Session persists across page reloads

### Real Authentication Implementation

To integrate with a real backend:

1. **Update `authService.ts`** - Replace `authenticateUser` with API call:

```typescript
export const authenticateUser = async (
  credentials: LoginCredentials
): Promise<AuthResult> => {
  const result = validateCredentials(credentials);
  
  if (!result.success) {
    return result;
  }

  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();
    
    if (data.user) {
      saveUser(data.user);
      return { success: true, user: data.user };
    }
    return { success: false, error: data.error };
  } catch (error) {
    return { success: false, error: 'Network error' };
  }
};
```

2. **Use custom validation** in components:

```typescript
const { login } = useAuth({
  validate: async (credentials) => {
    // Your custom validation logic
  }
});
```

## 🧪 Testing

### Service Testing

The authentication service is pure and can be easily tested:

```typescript
// tests/authService.test.ts
import { validateCredentials, authenticateUser } from '../src/services/authService';

describe('validateCredentials', () => {
  it('should validate valid credentials', () => {
    const result = validateCredentials({
      email: 'test@example.com',
      password: 'password123',
    });
    expect(result.success).toBe(true);
  });

  it('should reject missing email', () => {
    const result = validateCredentials({
      email: '',
      password: 'password123',
    });
    expect(result.success).toBe(false);
  });
});
```

### Mock Storage for Testing

```typescript
// tests/LoginPage.test.tsx
import { mockLocalStorage, clearLocalStorage } from '../src/utils/testUtils';

describe('LoginPage', () => {
  beforeEach(() => {
    mockLocalStorage({
      user: JSON.stringify({ id: '1', email: 'test@example.com', name: 'Test' }),
    });
  });

  afterEach(() => {
    clearLocalStorage();
  });
});
```

## 📝 Type Definitions

```typescript
// src/types/auth.ts
export interface User {
  id: string;
  email: string;
  name: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

export type LoginCredentials = {
  email: string;
  password: string;
};
```

## 🎨 Technology Stack

- **React 18** - UI library
- **TypeScript 5** - Type safety
- **React Router v6** - Routing and protected routes
- **Vite 5** - Build tool and dev server
- **Custom CSS** - Dark theme styling

## 🔄 Architecture Benefits

1. **Separation of Concerns** - Business logic is separate from UI
2. **Testability** - Services can be tested without React
3. **Mockability** - Easy to mock for testing
4. **Flexibility** - Can swap storage or auth methods easily
5. **Maintainability** - Clear boundaries between layers
