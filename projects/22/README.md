# React + TypeScript Auth App

A simple React application with authentication and a snake game.

## Project Structure

```
src/
├── components/          # Reusable UI components
│   └── ProtectedRoute.tsx
├── contexts/            # React Context providers
│   └── AuthContext.tsx  # Auth state + logic
├── pages/               # Page components
│   ├── LoginPage.tsx
│   ├── DashboardPage.tsx
│   ├── ProfilePage.tsx
│   └── SnakeGamePage.tsx
├── types.ts             # TypeScript types
├── App.tsx              # Main app with routing
├── main.tsx             # Entry point
└── index.css            # Global styles
```

## Features

- **Login Page** - Fake authentication with demo accounts
- **Dashboard** - Protected page showing user stats
- **Profile** - Editable name and email
- **Snake Game** - Public game (no login required)

## Demo Credentials

| Email | Password |
|-------|----------|
| user@example.com | password123 |
| admin@example.com | admin123 |

## Routes

| Route | Auth Required |
|-------|---------------|
| `/login` | No |
| `/snake-game` | No |
| `/dashboard` | Yes |
| `/profile` | Yes |

## Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## Architecture

- **AuthContext** - Contains all authentication logic and state
- **ProtectedRoute** - Wrapper component for protected pages
- **localStorage** - Persists user session
- **Fake Users** - In-memory user database for demo
