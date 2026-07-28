AI proxy server for yuzukmedic

Files added:
- server.js (Express proxy that calls Google Generative Language API)
- package.json
- .env.example
- .gitignore

Quick start (local):
1. Copy .env.example to .env and set GOOGLE_API_KEY to your server-side key (do NOT commit the .env file).
2. npm install
3. npm start
4. Open a browser and point your frontend (index.html) to use the API at http://localhost:3000/api/generate

Deployment suggestions:
- Google Cloud Run: build a container or use a simple Node runtime and set the environment variable GOOGLE_API_KEY in the Cloud Run service settings.
- Render / Heroku: set environment variables in the service dashboard.

Security notes:
- Revoke the previously exposed API key in Google Cloud Console immediately.
- Never put API keys into client-side files.
