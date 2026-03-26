# React TypeScript Auth App

A minimal React + TypeScript application demonstrating a simple authentication flow with protected routes.

## Features
- **Login page** – User can enter any credentials (fake authentication).
- **Dashboard** – Protected route that displays the logged‑in user.
- **Fake authentication** – Uses in‑memory state, no backend.
- **Protected routes** – `react-router-dom` v6 and a custom `ProtectedRoute` wrapper.
- **Good project structure** – Separate folders for pages, routes, context, and utilities.

## Project structure
```
react-ts-auth-app/
├─ public/
│   └─ index.html
├─ src/
│   ├─ context/          # Auth context
│   ├─ pages/            # Page components
│   ├─ routes/           # Route wrappers
│   └─ index.tsx
├─ package.json
├─ tsconfig.json
└─ .gitignore
```

## Setup
```bash
# Install dependencies
npm install

# Start development server
npm start
```

## Build for production
```bash
npm run build
```

## License
MIT
