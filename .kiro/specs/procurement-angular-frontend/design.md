# Design Document

## Overview

The procurement Angular frontend is a single-page application (SPA) that provides a modern interface for managing procurement tasks. The application integrates with Keycloak for authentication and displays three types of tasks (ready, in-progress, and own) using AG Grid for data visualization. The architecture follows Angular best practices with a modular structure, reactive programming using RxJS, and a clean separation of concerns.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Angular Application                   │
│  ┌────────────────────────────────────────────────────┐ │
│  │              Presentation Layer                     │ │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐         │ │
│  │  │  Ready   │  │In-Progress│  │   Own    │         │ │
│  │  │  Tasks   │  │  Tasks    │  │  Tasks   │         │ │
│  │  │Component │  │ Component │  │Component │         │ │
│  │  └──────────┘  └──────────┘  └──────────┘         │ │
│  └────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────┐ │
│  │              Service Layer                          │ │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐         │ │
│  │  │   Auth   │  │   Task   │  │   HTTP   │         │ │
│  │  │ Service  │  │ Service  │  │Interceptor│         │ │
│  │  └──────────┘  └──────────┘  └──────────┘         │ │
│  └────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                  Keycloak Server                         │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│              Backend REST API                            │
│  /api/bpa/task/ready                                     │
│  /api/bpa/task/in-progress                               │
│  /api/bpa/task/own                                       │
└─────────────────────────────────────────────────────────┘
```

### Technology Stack

- **Framework**: Angular 17+ (standalone components)
- **Authentication**: keycloak-angular library
- **Data Grid**: AG Grid Community Edition
- **UI Framework**: Angular Material
- **HTTP Client**: Angular HttpClient
- **State Management**: RxJS BehaviorSubjects
- **Routing**: Angular Router
- **Build Tool**: Angular CLI

## Components and Interfaces

### Core Module Structure

```
src/
├── app/
│   ├── core/
│   │   ├── guards/
│   │   │   └── auth.guard.ts
│   │   ├── interceptors/
│   │   │   └── auth.interceptor.ts
│   │   ├── services/
│   │   │   ├── auth.service.ts
│   │   │   └── task.service.ts
│   │   └── models/
│   │       └── task.model.ts
│   ├── features/
│   │   └── tasks/
│   │       ├── ready-tasks/
│   │       │   └── ready-tasks.component.ts
│   │       ├── in-progress-tasks/
│   │       │   └── in-progress-tasks.component.ts
│   │       ├── own-tasks/
│   │       │   └── own-tasks.component.ts
│   │       └── task-detail/
│   │           └── task-detail.component.ts
│   ├── shared/
│   │   ├── components/
│   │   │   ├── task-grid/
│   │   │   │   └── task-grid.component.ts
│   │   │   └── loading-spinner/
│   │   │       └── loading-spinner.component.ts
│   │   └── utils/
│   │       └── error-handler.ts
│   ├── app.component.ts
│   ├── app.config.ts
│   └── app.routes.ts
├── environments/
│   ├── environment.ts
│   └── environment.prod.ts
└── main.ts
```

### Component Details

#### 1. App Component
- Root component with navigation sidebar/header
- Displays router outlet for child components
- Shows user information and logout button

#### 2. Task Grid Component (Shared)
- Reusable AG Grid wrapper component
- Accepts column definitions and data source as inputs
- Handles pagination, sorting, and filtering
- Emits events for row clicks

#### 3. Ready Tasks Component
- Displays ready tasks using Task Grid Component
- Fetches data from TaskService
- Handles loading and error states

#### 4. In-Progress Tasks Component
- Displays in-progress tasks using Task Grid Component
- Similar structure to Ready Tasks Component

#### 5. Own Tasks Component
- Displays user's own tasks using Task Grid Component
- Includes navigation to task detail views

#### 6. Task Detail Component
- Displays task information with actions and history
- Fetches task actions and history on initialization
- Renders action buttons dynamically based on API response
- Shows task history timeline with remarks
- Handles workflow action execution
- Shows claim/release buttons based on task state
- Displays edit button if task is editable

## Data Models

### Task Interface

```typescript
export interface Task {
  id: string;
  module: string;
  code: string;
  ref: string;
  assignee: string;
  stepName: string;
  startedAt: string;
  name: string;
  initiator: string;
  claimTime: string;
  title: string;
  reference: string | null;
  startUserInitiator: string | null;
  viewUrl: string | null;
  meta: any | null;
  endTime: string | null;
}

export interface TaskResponse {
  rows: Task[];
  lastRow: number;
}

export interface TaskQueryParams {
  offset: number;
  limit: number;
}

export interface TaskAction {
  name: string;
  label: string;
  css: string;
  place: string;
}

export interface TaskActionsResponse {
  name: string;
  label: string;
  actions: TaskAction[];
  assignee: string;
  isEditable: string[];
  claimable: boolean;
  releasable: boolean;
}

export interface TaskHistory {
  processId: string;
  stepName: string;
  startAt: string;
  endAt: string | null;
  remarks: string | null;
  assignee: string;
  updateBy: string | null;
  actionName: string | null;
  actionLabel: string | null;
}

export interface WorkflowPerformRequest {
  action: string;
  key: string;
  ref: string;
}
```

### Authentication Configuration

```typescript
export interface KeycloakConfig {
  url: string;
  realm: string;
  clientId: string;
}
```

## Service Layer

### Auth Service
- Initializes Keycloak
- Manages authentication state
- Provides login/logout methods
- Exposes user information
- Handles token refresh

### Task Service
- Fetches ready tasks
- Fetches in-progress tasks
- Fetches own tasks
- Fetches task actions by module, key, and ref
- Fetches task history by module, key, and ref
- Performs workflow actions
- Manages pagination state
- Caches task data (optional)

### HTTP Interceptor
- Adds Authorization header with Bearer token
- Adds X-REALM header (value: "usis")
- Adds X-SOURCE header (value: "1")
- Handles 401 errors and redirects to login

## Routing Configuration

```typescript
export const routes: Routes = [
  {
    path: '',
    redirectTo: '/tasks/ready',
    pathMatch: 'full'
  },
  {
    path: 'tasks',
    canActivate: [AuthGuard],
    children: [
      {
        path: 'ready',
        component: ReadyTasksComponent
      },
      {
        path: 'in-progress',
        component: InProgressTasksComponent
      },
      {
        path: 'own',
        component: OwnTasksComponent
      },
      {
        path: 'detail/:module/:key/:ref',
        component: TaskDetailComponent
      }
    ]
  },
  {
    path: '**',
    redirectTo: '/tasks/ready'
  }
];
```

## Authentication Flow

### Keycloak Integration

1. **Application Initialization**
   - Configure Keycloak with realm, client ID, and server URL
   - Initialize Keycloak before Angular app bootstrap
   - Check if user is authenticated

2. **Login Flow**
   - User accesses protected route
   - AuthGuard checks authentication status
   - If not authenticated, redirect to Keycloak login
   - After successful login, redirect back to original route

3. **Token Management**
   - Store token in memory (handled by keycloak-angular)
   - Automatically refresh token before expiration
   - Include token in all API requests via interceptor

4. **Logout Flow**
   - Clear Keycloak session
   - Redirect to Keycloak logout endpoint
   - Clear application state

### Environment Configuration

```typescript
export const environment = {
  production: false,
  apiUrl: 'https://usis.bracits.net/api',
  keycloak: {
    url: 'https://bracusso.bracits.net',
    realm: 'usis',
    clientId: 'slm' // Replace with actual client ID
  }
};
```

## UI/UX Design

### Layout Structure

- **Header**: Application logo, title, user menu with logout
- **Sidebar/Navigation**: Links to Ready Tasks, In-Progress Tasks, Own Tasks
- **Main Content Area**: Task grid with search and filters
- **Footer**: Optional copyright and version information

### AG Grid Configuration

```typescript
export const defaultColDef = {
  sortable: true,
  filter: true,
  resizable: true,
  flex: 1
};

export const columnDefs = [
  { field: 'id', headerName: 'ID', width: 100 },
  { field: 'module', headerName: 'Module', width: 100 },
  { field: 'code', headerName: 'Code', width: 150 },
  { field: 'ref', headerName: 'Reference', width: 100 },
  { field: 'assignee', headerName: 'Assignee', width: 120 },
  { field: 'stepName', headerName: 'Step', width: 120 },
  { 
    field: 'startedAt', 
    headerName: 'Started At', 
    width: 180,
    valueFormatter: (params) => formatDate(params.value)
  },
  { field: 'name', headerName: 'Name', width: 200 },
  { field: 'initiator', headerName: 'Initiator', width: 120 },
  { 
    field: 'claimTime', 
    headerName: 'Claim Time', 
    width: 180,
    valueFormatter: (params) => formatDate(params.value)
  },
  { field: 'title', headerName: 'Title', width: 300 },
  {
    headerName: 'Actions',
    width: 120,
    cellRenderer: (params) => {
      return `<button class="btn btn-sm btn-primary">View</button>`;
    },
    onCellClicked: (params) => {
      // Navigate to task detail
      const task = params.data;
      router.navigate(['/tasks/detail', task.module, task.code, task.ref]);
    }
  }
];
```

### Responsive Design

- Desktop (>1024px): Full sidebar navigation, wide grid
- Tablet (768px-1024px): Collapsible sidebar, medium grid
- Mobile (<768px): Bottom navigation, stacked grid with horizontal scroll

### Theme

- Use Angular Material's default theme or customize
- Primary color: Blue (#1976d2)
- Accent color: Orange (#ff9800)
- Consistent spacing using Material Design guidelines

## Error Handling

### Error Types

1. **Authentication Errors**
   - Invalid credentials
   - Token expiration
   - Keycloak server unavailable

2. **API Errors**
   - Network errors (offline)
   - Server errors (5xx)
   - Client errors (4xx)
   - Timeout errors

3. **Application Errors**
   - Component initialization failures
   - Data parsing errors

### Error Handling Strategy

```typescript
export class ErrorHandlerService {
  handleError(error: any): void {
    if (error.status === 401) {
      // Redirect to login
      this.authService.login();
    } else if (error.status === 0) {
      // Network error
      this.showError('Network error. Please check your connection.');
    } else if (error.status >= 500) {
      // Server error
      this.showError('Server error. Please try again later.');
    } else {
      // Generic error
      this.showError('An error occurred. Please try again.');
    }
    
    // Log to console for debugging
    console.error('Error:', error);
  }
  
  private showError(message: string): void {
    // Use Angular Material Snackbar or similar
  }
}
```

## Testing Strategy

### Unit Tests

1. **Service Tests**
   - Test TaskService methods with mocked HttpClient
   - Test AuthService authentication flows
   - Test error handling in services

2. **Component Tests**
   - Test component initialization
   - Test data binding and display
   - Test user interactions (clicks, navigation)
   - Test loading and error states

3. **Guard Tests**
   - Test AuthGuard with authenticated user
   - Test AuthGuard with unauthenticated user
   - Test redirect behavior

4. **Interceptor Tests**
   - Test header injection
   - Test error handling
   - Test token refresh

### Integration Tests

1. **End-to-End Tests** (using Cypress or Playwright)
   - Test complete authentication flow
   - Test navigation between task views
   - Test grid interactions (sorting, filtering, pagination)
   - Test error scenarios

### Test Coverage Goals

- Minimum 80% code coverage
- 100% coverage for critical paths (authentication, data fetching)

## Performance Considerations

### Optimization Strategies

1. **Lazy Loading**
   - Load feature modules on demand
   - Lazy load AG Grid only when needed

2. **Virtual Scrolling**
   - Use AG Grid's infinite scroll for large datasets
   - Load data in chunks (30 items per page)

3. **Caching**
   - Cache task data for 5 minutes
   - Implement refresh button for manual updates

4. **Change Detection**
   - Use OnPush change detection strategy where possible
   - Minimize unnecessary re-renders

5. **Bundle Optimization**
   - Enable production build optimizations
   - Tree-shake unused code
   - Use lazy loading for routes

## Security Considerations

1. **Token Storage**
   - Never store tokens in localStorage (XSS vulnerability)
   - Use memory storage via keycloak-angular

2. **HTTPS**
   - Ensure all API calls use HTTPS
   - Configure Content Security Policy

3. **Input Validation**
   - Sanitize user inputs
   - Validate data from API responses

4. **CORS**
   - Ensure backend allows requests from frontend domain
   - Configure proper CORS headers

## Deployment

### Build Process

```bash
# Development build
ng build

# Production build
ng build --configuration production
```

### Environment Variables

- API URL
- Keycloak URL, realm, and client ID
- Feature flags (if needed)

### Hosting Options

- Static hosting (Nginx, Apache)
- Cloud platforms (AWS S3 + CloudFront, Azure Static Web Apps, Vercel)
- Container deployment (Docker + Kubernetes)

## Task Detail View Design

### Layout

The task detail view will consist of three main sections:

1. **Task Information Card**
   - Display task title, module, code, ref, assignee, step name
   - Show task status and timestamps

2. **Action Buttons Section**
   - Dynamically render buttons based on API response
   - Apply CSS classes from API (e.g., "btn btn-primary")
   - Show claim button if claimable is true
   - Show release button if releasable is true
   - Show edit button if isEditable contains "true"

3. **History Timeline**
   - Display task history in chronological order
   - Show step name, assignee, start/end times
   - Display remarks if available
   - Highlight action labels

### Workflow Action Execution

```typescript
performAction(action: TaskAction, task: Task): void {
  const request: WorkflowPerformRequest = {
    action: action.name,
    key: task.code,
    ref: task.ref
  };
  
  this.taskService.performWorkflowAction(task.module, request)
    .subscribe({
      next: () => {
        this.showSuccess(`Action "${action.label}" performed successfully`);
        this.refreshTaskDetails();
      },
      error: (error) => {
        this.handleError(error);
      }
    });
}
```

## Future Enhancements

1. **Advanced Filtering**
   - Custom filter UI for each column
   - Saved filter presets

2. **Task Actions**
   - Claim tasks directly from grid
   - Bulk operations

3. **Real-time Updates**
   - WebSocket integration for live task updates
   - Notifications for new tasks

4. **Offline Support**
   - Service worker for offline functionality
   - Local data caching

5. **Analytics**
   - Task completion metrics
   - User activity tracking

6. **Remarks Input**
   - Add remarks field when performing actions
   - Validate remarks based on action requirements
