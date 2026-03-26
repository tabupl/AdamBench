# React Authentication Demo App

A React + TypeScript application demonstrating authentication with protected routes.

## Features

- **Login Page**: Email/password based authentication UI
- **Register Page**: User registration functionality
- **Dashboard Page**: Protected route with user-specific content
- **Fake Authentication**: Simulates login/logout without a backend
- **Protected Routes**: Route guards to prevent unauthorized access
- **Persistent Sessions**: Uses localStorage to maintain login state

## Project Structure

```
├── public/
│   ├── index.html          # HTML template
│   └── manifest.json       # PWA manifest
├── src/
│   ├── components/
│   │   └── ProtectedRoute.tsx   # Route guard component
│   ├── context/
│   │   └── AuthContext.tsx      # Authentication context
│   ├── pages/
│   │   ├── LoginPage.tsx        # Login and registration page
│   │   └── DashboardPage.tsx    # Protected dashboard page
│   ├── types/
│   │   └── auth.ts              # TypeScript type definitions
│   ├── App.tsx                  # Main app with routing
│   ├── index.tsx                # Entry point
│   └── index.css                # Global styles
├── package.json
├── tsconfig.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

The app will open at `http://localhost:3000`

### Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from create-react-app

## Authentication

This demo uses **fake authentication** for demonstration purposes:

- Any email address will work for login
- Password is accepted but not validated
- Sessions persist via localStorage
- For production, replace the auth logic with real API calls

## Protected Routes

The app uses a custom `ProtectedRoute` component that:
- Redirects unauthenticated users to `/login`
- Shows a loading state while checking auth status
- Stores the intended destination to redirect after login

## Styling

- Uses CSS variables for theming
- Dark mode color scheme
- Responsive design
- No external CSS framework required

## Technologies

- React 18
- TypeScript 5
- React Router v6
- CSS3 (no frameworks)
