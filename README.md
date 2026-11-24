# HYDROGRID

HYDROGRID is a demonstration of an intelligent, role-based water resource management platform for irrigation networks. The project includes a responsive React interface, a local Express API, role-specific dashboards, motor controls, and clearly labeled simulated AI, IoT, digital-twin, and weather modules.

> This repository is a local demonstration. It is not connected to production Firebase or real irrigation hardware.

## Project structure

```text
HYDROGRID/
├── frontend/           React + TypeScript + Vite application
├── backend/            Express API and local JSON data store
├── netlify.toml        Netlify build and SPA routing configuration
└── README.md
```

## Features

- Responsive HYDROGRID branding and navigation
- Split-screen demonstration login
- Admin, Tubewell Owner, and Farmer workspaces
- Role-based motor-control permissions
- Water-request and activity views
- Persistent local motor and request data
- AI distribution recommendations
- Demand uncertainty demonstration
- Operational anomaly flags
- Virtual digital-twin scenarios
- Simulated IoT sensor readings
- Predictive-maintenance recommendations
- Simulated weather and irrigation guidance
- Clearly separated demonstration and live-credential states

## Demo accounts

| Role | Email | Password |
|---|---|---|
| Administrator | `admin@hydrogrid.local` | `Admin123!` |
| Tubewell Owner | `owner@hydrogrid.local` | `Owner123!` |
| Farmer | `farmer@hydrogrid.local` | `Farmer123!` |

The login page includes role buttons that fill these credentials automatically.

## Requirements

- Windows PowerShell
- Node.js 20 or later
- npm

## Run the project locally

Open two terminals.

### Terminal 1: backend

```powershell
cd C:\HYDROGRID\backend
npm install
npm start
```

The API runs at `http://127.0.0.1:4000`.

### Terminal 2: frontend

```powershell
cd C:\HYDROGRID\frontend
npm install
npm run dev -- --host 127.0.0.1
```

Open `http://127.0.0.1:5173`.

### Main routes

| Route | Purpose |
|---|---|
| `/` | HYDROGRID overview |
| `/login` | Demonstration authentication |
| `/roles` | Role selection |
| `/admin` | Admin dashboard |
| `/owner` | Tubewell Owner dashboard |
| `/farmer` | Farmer dashboard |
| `/modules` | AI, digital twin, IoT, maintenance, and weather demonstrations |

## Frontend validation

```powershell
cd C:\HYDROGRID\frontend
npm run lint
npm run build
npm run preview
```

## Backend endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/api/health` | API health check |
| `POST` | `/api/auth/login` | Create a local demo session |
| `POST` | `/api/auth/logout` | Revoke a local demo session |
| `GET` | `/api/dashboard/:role` | Read role dashboard data |
| `PATCH` | `/api/motors/:id` | Change motor state |
| `POST` | `/api/farmer-requests` | Create a farmer request |
| `PATCH` | `/api/farmer-requests/:id` | Approve, reject, or schedule a request |
| `GET` | `/api/modules` | Read advanced demonstration data |
| `POST` | `/api/ai/optimize` | Generate a deterministic allocation demonstration |

Backend data is persisted in `backend/data.json`.

## Simulated data policy

The digital-twin, weather, sensor, demand, and anomaly values are demonstrations. They must not be interpreted as real measurements or diagnoses.

- IoT readings are identified as simulated.
- Weather readings are identified as simulated.
- AI outputs are explanations or demonstrations, not confirmed crop or mechanical diagnoses.
- No claim is made that water is safe for drinking.
- Motor operations only control demonstration data.

## Production integrations not completed

The following require credentials and a separate implementation/security review:

- Firebase Authentication
- Firestore persistence
- Firebase security rules
- Firebase Cloud Functions
- Real map provider credentials
- Live weather provider credentials
- External AI/image-analysis credentials
- ESP32 or Arduino hardware
- Real water-quality and sensor hardware

Public Firebase web configuration may be used in the frontend, but private service-account credentials must never be stored or committed.

## Deployment

The root `netlify.toml` configures the frontend with:

- Base directory: `frontend`
- Build command: `npm run build`
- Publish directory: `dist`
- SPA fallback redirect to `/index.html`
