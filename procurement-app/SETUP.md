# Procurement Angular Frontend - Setup Documentation

## Project Overview
This is an Angular 17+ application with standalone components for managing procurement tasks with Keycloak authentication.

## Dependencies Installed

### Core Dependencies
- **Angular 19.2.x** - Latest Angular framework with standalone components
- **keycloak-angular 20.0.0** - Keycloak integration for Angular
- **keycloak-js 26.2.1** - Keycloak JavaScript adapter
- **ag-grid-angular 34.3.1** - AG Grid for data tables
- **ag-grid-community 34.3.1** - AG Grid community edition
- **@angular/material 20.2.11** - Material Design components
- **@angular/cdk 20.2.11** - Component Dev Kit

### Configuration

#### TypeScript Configuration
- Strict mode enabled in `tsconfig.json`
- Additional strict compiler options:
  - `noImplicitOverride: true`
  - `noPropertyAccessFromIndexSignature: true`
  - `noImplicitReturns: true`
  - `noFallthroughCasesInSwitch: true`
- Angular strict templates enabled

#### Environment Files
Two environment configuration files have been created:

1. **Development** (`src/environments/environment.ts`):
   - API URL: https://usis.bracits.net/api
   - Keycloak URL: https://bracusso.bracits.net
   - Realm: usis
   - Client ID: slm

2. **Production** (`src/environments/environment.prod.ts`):
   - Same configuration as development
   - File replacement configured in angular.json for production builds

## Build Commands

```bash
# Development build
npm run build

# Production build
ng build --configuration production

# Development server
npm start

# Run tests
npm test
```

## Project Structure

```
procurement-app/
├── src/
│   ├── app/
│   │   ├── app.component.ts
│   │   ├── app.config.ts
│   │   └── app.routes.ts
│   ├── environments/
│   │   ├── environment.ts
│   │   └── environment.prod.ts
│   ├── main.ts
│   └── styles.scss
├── angular.json
├── package.json
└── tsconfig.json
```

## Notes

- SSR (Server-Side Rendering) has been disabled as it's not required for this application
- All dependencies installed with `--legacy-peer-deps` flag due to version compatibility between Angular 19 and some libraries expecting Angular 20
- The application uses standalone components (no NgModules)
- Routing is configured and ready for implementation

## Next Steps

1. Configure Keycloak authentication (Task 2)
2. Create core data models and interfaces (Task 3)
3. Implement TaskService for API communication (Task 4)
4. Build UI components (Tasks 5-7)
