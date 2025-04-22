# ProfitPouch

ProfitPouch is a Stock Tracker application tailored for the Pakistan Stock Market. It helps you sign up, log in, track real-time stock prices, record buy and sell transactions, and visualize your portfolio's performance over time.

## Features

- User authentication and data storage with Firebase
- Real-time price tracking for Pakistani stocks
- Record and manage buy/sell transactions
- Portfolio summary with current holdings
- Responsive, modern UI built with Material UI
- Containerized deployment with Docker

## Tech Stack

- React 19
- Material UI 7
- Firebase v11 (Authentication & Firestore)
- React Router v7
- Create React App (react-scripts)
- Docker & Docker Compose

## Getting Started

You can run this application either locally or using Docker.

### Prerequisites

- Node.js (v16 or higher) and npm (v8 or higher) for local development
- Docker and Docker Compose for containerized deployment

### Local Installation

```bash
# Clone the repository
git clone https://github.com/Arqam7159/profitpouch.git
cd profitpouch

# Install dependencies
npm install
```

### Docker Deployment

You can quickly run the application using Docker:

```bash
# Build and start the container
docker-compose up -d

# Stop the container
docker-compose down
```

The application will be available at http://localhost:3001

### Firebase Configuration

This project uses Firebase for authentication and data storage. By default, the config is in `src/firebase/config.js`. To use your own Firebase project:

1. Create a `.env.local` file in the root directory.
2. Add the following variables (replace with your credentials):
   ```env
   REACT_APP_FIREBASE_API_KEY=your-api-key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your-auth-domain
   REACT_APP_FIREBASE_PROJECT_ID=your-project-id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your-storage-bucket
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
   REACT_APP_FIREBASE_APP_ID=your-app-id
   REACT_APP_FIREBASE_MEASUREMENT_ID=your-measurement-id
   ```
3. Update `src/firebase/config.js` to use `process.env.REACT_APP_FIREBASE_*` instead of hardcoded values.

### Available Scripts

In the project directory, you can run:

- `npm start`
  - Runs the app in development mode at [http://localhost:3000](http://localhost:3000)
- `npm run build`
  - Builds the app for production to the `build/` folder
- `npm test`
  - Launches the test runner in interactive watch mode
- `npm run eject`
  - Removes the single build dependency and copies configuration files (one-way operation)

### Deployment

#### Traditional Deployment
After building, you can deploy the contents of the `build/` folder to any static hosting service (Netlify, Vercel, GitHub Pages, etc.).

#### Docker Deployment
For production deployment with Docker:

```bash
# Build the production image
docker-compose build

# Run in production mode
docker-compose up -d
```

## Folder Structure

```text
src/
├── components/      # Reusable UI components
├── context/        # React Context for auth and trades
├── firebase/       # Firebase initialization and config
├── hooks/          # Custom React hooks
├── pages/          # Route-level pages (Login, Signup, Portfolio, etc.)
├── assets/         # Static assets (SVGs, images)
└── index.js        # Entry point
```

## Docker Configuration Files

```text
├── Dockerfile           # Multi-stage build configuration
├── docker-compose.yml   # Container orchestration config
└── .dockerignore       # Files excluded from Docker context
```

---

Made with ❤️ by the ProfitPouch Team 