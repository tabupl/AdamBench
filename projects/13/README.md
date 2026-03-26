# OmniCoder

A React + TypeScript authentication demo application with a modular, testable architecture.

## Features

- ✅ User authentication with fake credentials
- ✅ Protected routes
- ✅ Session persistence with localStorage
- ✅ Modular service layer for authentication
- ✅ Comprehensive test coverage
- ✅ Clean separation of concerns
- ✅ **Snake Game**: Fun, interactive game page accessible to all users

## Project Structure

```
src/
├── components/       # Reusable UI components (Navigation, ProtectedRoute)
├── context/          # React Context providers (AuthContext)
├── hooks/            # Custom React hooks (useAuth)
├── pages/            # Page components (Login, Dashboard, Profile, SnakeGame)
├── services/         # Business logic layer (AuthService)
├── test/             # Test setup files
├── types/            # TypeScript type definitions
├── App.tsx           # Main application component
├── index.css         # Global styles
└── main.tsx          # Entry point
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view the application.

### Build

```bash
npm run build
```

### Test

```bash
npm run test           # Watch mode
npm run test:run       # Run once
npm run test:coverage  # Run with coverage
```

## Demo Credentials

| Email              | Password    |
|--------------------|-------------|
| admin@omnicoder.com| password123 |
| user@omnicoder.com | password123 |
| test@example.com   | test123     |

## Architecture

### Service Layer (`src/services/AuthService.ts`)

The authentication service contains all business logic for user authentication. It is:
- Pure and testable
- Separated from UI concerns
- Configurable with mock delays for testing
- Includes error handling and session management

```typescript
interface AuthServiceInterface {
  login(credentials: LoginCredentials): Promise<User | null>;
  logout(): void;
  getCurrentUser(): User | null;
  clearSession(): void;
  loadUserFromStorage(): Promise<User | null>;
}
```

### Custom Hook (`src/hooks/useAuth.ts`)

The `useAuth` hook wraps the service and provides React hooks:
- `user`: Current authenticated user
- `isAuthenticated`: Boolean flag
- `login()`: Login function
- `logout()`: Logout function
- `clearSession()`: Clear all session data

```typescript
const { user, login, logout, isAuthenticated } = useAuth();
```

### Context (`src/context/AuthContext.tsx`)

The `AuthProvider` wraps the application to provide authentication context. It's a thin wrapper around the `useAuth` hook for compatibility.

### Pages

- **Login**: User login form with validation
- **Dashboard**: Protected route showing user stats and activity
- **Profile**: Protected route for user profile management
- **Snake Game**: Fun, interactive snake game accessible to all users (at `/snake`)

### Components

- **Navigation**: Site-wide navigation bar with links to all pages
- **ProtectedRoute**: Route wrapper that requires authentication

## Testing

The application includes comprehensive tests:

- **AuthService tests**: Test all authentication logic in isolation
- **Integration tests**: Test the complete login flow
- **Mocking**: Services can be mocked for unit testing

### Running Tests

```bash
npm run test:run       # Run tests once
npm run test:coverage  # Run with coverage report
```

## Configuration

### TypeScript

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### Vite

```typescript
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

## License

MIT
