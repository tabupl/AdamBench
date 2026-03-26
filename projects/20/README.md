# React + TypeScript Authentication Demo

A demo application showcasing fake authentication, protected routes, and a modern dashboard using React, TypeScript, and React Router.

## Features

- **Fake Authentication**: Simulated login with localStorage (no backend required)
- **Protected Routes**: Automatic redirect to login for unauthenticated users
- **Modern Dashboard**: Sample dashboard with user info and stats
- **TypeScript**: Full type safety throughout the application
- **Responsive Design**: Works on mobile and desktop screens
- **Clean Project Structure**: Organized folders for components, pages, context, routes, and utils

## Project Structure

```
src/
├── context/            # React context (AuthContext)
├── pages/              # Page components (Home, Login, Dashboard, Profile, SnakeGame)
├── routes/             # Route components (ProtectedRoute)
├── utils.ts            # Utility functions
├── App.tsx             # Main app component with routing
└── main.tsx            # Application entry point
```

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

### Running the Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` folder.

## Usage

1. **Home Page**: Overview of the application features with navigation links
2. **Login Page**: Enter any non-empty email and password to authenticate
3. **Dashboard**: Protected page showing user information and sample data
4. **Profile Page**: Edit your name and email with real-time validation
5. **Snake Game**: Public game page accessible without authentication
6. **Logout**: Click the logout button to clear authentication

## Authentication Details

- The fake authentication accepts any non-empty email and password
- User data is stored in localStorage (survives page refresh)
- Protected routes automatically redirect unauthenticated users to login
- Authentication state is managed via React Context

### Simple & Maintainable
- **Minimal Code**: Authentication logic kept in AuthContext (167 lines)
- **No Complex Layers**: Direct localStorage usage without unnecessary abstraction
- **Easy to Understand**: Straightforward implementation without over-engineering
- **Still Testable**: Components can be tested with mocked localStorage

## Profile Editing Feature

- **Editable User Profile**: Update name and email with form validation
- **Real-time Validation**: Email format validation and required field checks
- **Persistence**: Updated user data persists in localStorage
- **Error Handling**: User-friendly error messages for failed updates
- **Loading States**: Visual feedback during update operations

## Snake Game Feature

- **Public Access**: No authentication required - accessible to all users
- **Classic Gameplay**: Traditional snake game mechanics
- **Keyboard Controls**: Arrow keys for movement, Space/Enter for pause/start
- **Visual Feedback**: Color-coded grid with snake, food, and head distinction
- **Score Tracking**: Current score and high score persistence
- **Responsive Design**: Works on desktop and mobile devices
- **Game Rules**: Clear instructions and controls displayed on the page

## Technologies Used

- **React**: UI library
- **TypeScript**: Type safety
- **React Router**: Client-side routing
- **Vite**: Build tool and development server
- **CSS**: Custom utility classes (no external CSS framework)

## License

MIT