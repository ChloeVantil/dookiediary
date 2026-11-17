# Poop Calendar

This project now includes a small Node/Express backend for user authentication and saved bathroom entries.

## Quick local start

1. Install Node.js and npm if you do not already have them.
2. In the project folder, install dependencies:
   npm install
3. Copy `.env.example` to `.env` if you have not already created it.
4. Initialize the SQLite database the first time:
   npm run init-db
5. Start both the API and the frontend together:
   npm run app

This runs:
- API on http://localhost:3001
- Frontend on http://localhost:4173

If you want to start them separately:
- npm run api
- npm run frontend

## Toilet Tourist map

The Toilet Tourist tab uses Leaflet and OpenStreetMap tiles to show saved visits with map pins. Click a pin and follow the place link in its popup to open directions in Google Maps; visit addresses in the list are also links. Place suggestions appear as you type, using Photon and OpenStreetMap data. Selecting a suggestion saves its coordinates with the visit; if no suggestion is selected, the browser sends the place name or address to OpenStreetMap's Nominatim service when the visit is saved. The app does not access the device's location. Older visits can be added to the map by editing and saving their place again.

The map and place lookup need an internet connection. Typing a place sends the query to Photon; Nominatim's public service is used only for a one-time lookup when saving without a selected suggestion and is limited to one request per second in the current browser tab. A larger hosted deployment should choose geocoding providers suited to its traffic.

## Toilet Tourist community sharing

All Toilet Tourist visits saved to an account are visible to every signed-in user, including visits saved before this feature was added. The community map and review cards show each visit's place, date, ratings, optional note, and account username. Only the visit's owner can edit or delete it. Poo Calendar diary entries are not part of this community feed. Guest visits stay in that browser and are not shared.

Existing visits with no saved coordinates still appear in the review list but do not have a map pin. Edit and save the place again to look up and save coordinates. Sharing a signed-in visit also means its place, date, notes, ratings, and username are visible to other users of the app; do not enter details you do not want to share.

## Capture the moment photos

Choose an image when creating a diary log to add it to the private Capture the moment gallery. On supported mobile devices, the photo chooser can offer the camera. Images must be no larger than 8 MB and are stored as blobs in the browser's IndexedDB, scoped separately for each local account. Photos are never sent to the server or included in the shared Toilet Tourist feed, and are not synced to other devices. Removing a diary log also removes its associated photo; a photo can be removed separately from the gallery while keeping its diary log.

## Available endpoints

- POST /api/auth/signup
- POST /api/auth/login
- GET /api/auth/me
- POST /api/auth/logout
- GET /api/entries
- GET /api/entries/diary
- POST /api/entries/diary
- DELETE /api/entries/diary/:id
- GET /api/entries/tourist
- GET /api/entries/tourist/community
- POST /api/entries/tourist
- PUT /api/entries/tourist/:id
- DELETE /api/entries/tourist/:id

## Auth format

Use a Bearer token from `/api/auth/login` or `/api/auth/signup`:

Authorization: Bearer <token>

## App version

Once the website version is working, the same API can be reused by the Capacitor app with the same auth flow.
