# SoundWave React JS Basic Codebase

This is a clean, modular React frontend starter template for your Concert Booking application. It is pre-styled with the same premium dark slate theme, neon accents, and glassmorphism styling as the static frontend.

## Structure

```
react-frontend/
├── package.json         # Node packages & scripts
├── README.md            # Setup guidelines (This file)
├── public/              # React public assets
└── src/
    ├── index.js         # Entry point (bootstraps React app)
    ├── index.css        # Premium global dark styling
    ├── App.jsx          # Main application component & state machine
    ├── api.js           # Fetch API service layers
    └── components/      # Modular layout components
        ├── Navbar.jsx   # Auth status check & header
        ├── ConcertCard.jsx # Info card with admin or booking controls
        └── Modals.jsx   # Login, signup, booking, & add/edit forms
```

## Running the Frontend

### 1. Prerequisite: Run Backend Server
Ensure that your MongoDB server is running and start your backend application from the `Concert-project/` folder:
```bash
npm start
```
By default, this server listens on port `3000` (`http://localhost:3000`).

### 2. Install React Dependencies
Navigate to the `react-frontend` directory and run:
```bash
cd react-frontend
npm install
```

### 3. Run the Development Server
Once packages are installed, start the development server:
```bash
npm start
```
This runs the app in development mode and opens it on `http://localhost:3001` (or prompts to run on another port if `3000` is taken by the backend).

## Key Components

1. **State Machine (`src/App.jsx`)**: Coordinates the active token and logged-in user profile, handles updates to the concert lists, and orchestrates visibility for the multiple modals.
2. **Modular Request Handlers (`src/api.js`)**: Wraps endpoints with clean JS promises. Secured endpoints automatically pass the signed JWT token in their header.
3. **Admin and User Context**: Render components display contextual buttons dynamically depending on whether `user.Admin === true`.
