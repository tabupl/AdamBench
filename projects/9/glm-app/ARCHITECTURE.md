# Authentication Architecture

## Overview

The authentication system has been refactored into modular, testable services following clean architecture principles.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                          UI Layer                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │ LoginPage    │  │ DashboardPage│  │    ProtectedRoute     │  │
│  └──────┬───────┘  └──────┬───────┘  └──────────┬───────────┘  │
│         │                 │                     │               │
│         └─────────────────┼─────────────────────┘               │
│                           │                                     │
│                    ┌──────▼──────┐                              │
│                    │ AuthContext │                              │
│                    │ (State Mgmt)│                              │
│                    └──────┬──────┘                              │
└───────────────────────────┼─────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
┌───────▼────────┐  ┌──────▼────────┐  ┌───────▼────────┐
│ AuthService    │  │ StorageService│  │   React Hook   │
│ (Business      │  │  (Data Layer) │  │     useAuth    │
│  Logic)        │  │               │  │                │
└────────────────┘  └───────────────┘  └────────────────┘
        │                   │
        └───────────────────┘
                    │
            ┌───────▼───────┐
            │   localStorage│
            └───────────────┘
```

## Modular Components

### 1. Types (types/auth.ts)
- Defines TypeScript interfaces for auth-related data
- Ensures type safety across the application

### 2. Storage Service (services/storage.service.ts)
**Responsibilities:**
- Handle localStorage operations
- Persist and retrieve user data
- Clean up on logout

**Key Methods:**
- `setUser(user)`: Store user in localStorage
- `getUser()`: Retrieve user from localStorage
- `clearUser()`: Remove user from localStorage
- `isAuthenticated()`: Check if user is logged in

### 3. Auth Service (services/auth.service.ts)
**Responsibilities:**
- Authenticate users with credentials
- Validate user data
- Manage authentication state logic

**Key Methods:**
- `authenticate(credentials)`: Verify user credentials
- `getCurrentUser()`: Get current authenticated user
- `logout()`: Perform logout
- `isAuthenticated()`: Check auth status

### 4. Auth Context (context/AuthContext.tsx)
**Responsibilities:**
- Provide auth state to UI components
- Handle UI-specific state (loading)
- Expose auth methods to UI

**Key Methods:**
- `login(email, password)`: Trigger login
- `logout()`: Trigger logout

### 5. Protected Route Component
**Responsibilities:**
- Guard routes requiring authentication
- Handle redirects for unauthenticated users

## Design Benefits

### 1. Testability
- Services can be tested independently without React
- Easy to mock dependencies
- Unit tests cover business logic thoroughly

### 2. Maintainability
- Clear separation of concerns
- Changes to one layer don't affect others
- Easy to add new features (e.g., JWT tokens)

### 3. Reusability
- Services can be reused in other parts of the app
- Easy to swap implementations (e.g., API calls instead of mock)

### 4. Extensibility
- Easy to add new auth methods (SSO, social login)
- Simple to add more storage providers (IndexedDB, SessionStorage)

## Testing Strategy

### Unit Tests
Test services in isolation:
```typescript
// No React needed
const result = await AuthService.authenticate(credentials)
expect(result.success).toBe(true)
```

### Integration Tests
Test components with mocked services:
```typescript
// Mock the service
vi.mock('./services/auth.service')
```

### End-to-End Tests
Test complete user flows:
```typescript
// Test login -> dashboard flow
```

## Future Enhancements

1. **JWT Support**: Add token-based authentication
2. **API Integration**: Connect to real backend API
3. **Multiple Providers**: Support different storage backends
4. **Session Management**: Handle session expiration
5. **Refresh Tokens**: Implement token refresh logic