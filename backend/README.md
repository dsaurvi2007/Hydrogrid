# HYDROGRID Backend

This backend provides a persistent local-development API for the HYDROGRID demonstration.
It is isolated from production Firebase and does not store credentials or secrets.

## Run

```powershell
cd backend
npm install
npm start
```

The API listens on `http://127.0.0.1:4000`.

## Endpoints

- `GET /api/health`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/dashboard/:role`
- `PATCH /api/motors/:id`
- `POST /api/farmer-requests`
- `PATCH /api/farmer-requests/:id`

The JSON file in `data.json` is persisted locally. Motor and approval operations enforce role-based access at the API level.

## Future Firebase layer

The intended production backend remains Firebase-native:

- Firebase Authentication configuration
- Firestore collections and data access
- Firestore Security Rules
- Firebase indexes
- Emulator configuration
- Cloud Functions or privileged server operations
- Seed and migration scripts

No credentials or Firebase service-account keys should be stored in this folder or in the frontend workspace.
