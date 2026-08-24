# BlueMind Admin

This is the admin-only React frontend for the BlueMind activity tracking platform. It provides the admin dashboard for reviewing activities, managing verifiers/contributors/citizens/organizations, and viewing the global impact map.

## Features

- **Direct Login**: No signup flow — admins sign in directly.
- **Admin Dashboard**: Overview, all activities, verifier/contributor/citizen lists, organizations, and the interactive impact map.
- **Premium Design**: Same BlueMind glassmorphism aesthetic and light/dark theme as the main frontend.

## Tech Stack

- React
- React Router DOM
- Vite
- Custom CSS (BlueMind light and dark theme)

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:3003`.

## Environment Variables

Ensure `VITE_API_BASE_URL` in `.env` points to the backend service.
