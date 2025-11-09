# Development Guide

## Running the Application

### Development Server
```bash
npm start
# or
ng serve
```

The app will be available at `http://localhost:4200`

### Important Notes

1. **Proxy Configuration**: The app uses a proxy to avoid CORS issues during development
   - API requests to `/api/*` are proxied to `https://usis.bracits.net/api/*`
   - This is configured in `proxy.conf.json`

2. **Environment Files**:
   - `environment.ts` - Development (uses `/api` for proxy)
   - `environment.prod.ts` - Production (uses full URL `https://usis.bracits.net/api`)

3. **Authentication**: 
   - Keycloak will redirect you to login at `https://bracusso.bracits.net`
   - After login, y