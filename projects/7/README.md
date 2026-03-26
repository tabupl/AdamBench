# Pi - Authentication Dashboard

A React + TypeScript authentication dashboard with protected routes and fake authentication.

## Features

- **Login Page**: Simple form for user login with email/username and password
- **Register Page**: Account creation form
- **Protected Routes**: Dashboard accessible only after authentication
- **Fake Authentication**: Simulated authentication with JWT-like token storage
- **Role Management**: Admin vs User role switching
- **Logout**: Secure logout functionality

## Project Structure

```
pi/
├── src/
│   ├── components/          # Reusable components
│   ├── pages/              # Page components
│   ├── services/           # API and service layer
│   ├── context/            # React contexts
│   ├── store/              # State management
│   ├── types/              # TypeScript type definitions
│   ├── styles/             # CSS styles
│   └── utils/              # Utility functions
├── public/                 # Static assets
├── .env                    # Environment variables
├── .env.example            # Example environment file
├── package.json            # Dependencies
├── tsconfig.json           # TypeScript configuration
└── vite.config.ts          # Vite configuration
```

## Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn

### Installation

```bash
cd /path/to/pi
npm install
```

### Running the Application

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Authentication

- **Login**: Uses `/api/auth/login` endpoint
- **Registration**: Uses `/api/auth/register` endpoint
- **Protected Routes**: Protected by JWT-like token validation
- **Logout**: Clears authentication state

## API Endpoints

```bash
POST   /api/auth/login
POST   /api/auth/register
GET    /api/auth/logout
GET    /api/auth/check
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| VITE_API_URL | Base API URL | http://localhost:3000/api |

## License

MIT
