# React + TypeScript Authentication App

A simplified React application with TypeScript featuring authentication, login, dashboard, and a fun snake game.

## Features

- 🔐 **Fake Authentication** - Simulated login system with demo credentials
- 🛡️ **Protected Routes** - Route guards that require authentication
- 📱 **Responsive Design** - Works on desktop and mobile devices
- 💾 **Session Persistence** - Maintains login state across page refreshes
- 🎨 **Modern UI** - Clean and professional interface
- 👤 **User Profile** - Editable profile page with name and email management
- 🐍 **Snake Game** - Fun mini-game accessible without authentication

## Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@example.com | admin123 |
| User | user@example.com | user123 |

## Project Structure

```
src/
├── components/           # Reusable components
│   └── ProtectedRoute.tsx
├── context/              # Auth context
│   └── AuthContext.tsx
├── data/                 # Mock data
│   └── users.ts
├── pages/                # Page components
│   ├── LoginPage.tsx
│   ├── LoginPage.css
│   ├── DashboardPage.tsx
│   ├── DashboardPage.css
│   ├── ProfilePage.tsx
│   ├── ProfilePage.css
│   ├── SnakeGamePage.tsx
│   └── SnakeGamePage.css
├── routes/               # Route configuration
│   └── AppRoutes.tsx
├── types/                # TypeScript types
│   └── auth.types.ts
├── App.tsx
├── main.tsx
└── index.css
```

## Routes

| Route | Access | Description |
|-------|--------|-------------|
| `/` | Public | Redirects to `/dashboard` (authenticated) or `/snake` (unauthenticated) |
| `/snake` | Public | Snake game mini-game |
| `/login` | Public | Login page |
| `/dashboard` | Protected | Main dashboard page |
| `/profile` | Protected | User profile management |

## Getting Started

### Install Dependencies

```bash
npm install
```

### Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **React Router v7** - Client-side routing
- **Vite** - Build tool
- **Context API** - State management

## Authentication Flow

1. User visits `/login` or is redirected from protected routes
2. User enters email and password
3. Credentials are validated against fake user database
4. On success, user is stored in localStorage
5. User is redirected to `/dashboard`
6. Protected routes check authentication before rendering
7. Logout clears user data and redirects to login

## Snake Game

A fun mini-game accessible to all users (no authentication required).

### Features
- Classic snake game mechanics
- Arrow keys or WASD controls
- Score tracking with high score display
- Progressive speed increase
- Clean, dark-themed UI

### How to Play
1. Navigate to `/snake` or visit the root URL while unauthenticated
2. Click "Start Game" to begin
3. Use Arrow Keys or WASD to control the snake
4. Eat the red food to grow and score points
5. Avoid hitting walls or your own body

### Controls
- **Arrow Keys** or **WASD**: Move the snake
- **Start Game**: Begin a new game
- **Reset Game**: Restart the current game

## Customization

### Adding New Users

Edit `src/data/users.ts` and add users to the `FAKE_USERS` array:

```typescript
export const FAKE_USERS: UserWithPassword[] = [
  { id: '3', email: 'new@example.com', password: 'pass123', name: 'New User', role: 'user' },
  // ... existing users
];
```

### Adding New Protected Routes

Add routes in `src/routes/AppRoutes.tsx` wrapped with `ProtectedRoute`:

```tsx
<Route
  path="/settings"
  element={
    <ProtectedRoute>
      <SettingsPage />
    </ProtectedRoute>
  }
/>
```

## License

MIT
