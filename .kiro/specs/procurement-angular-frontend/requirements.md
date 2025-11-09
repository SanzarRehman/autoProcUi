# Requirements Document

## Introduction

This document outlines the requirements for a procurement Angular frontend application with Keycloak authentication integration and task management grid views. The system will display three types of tasks (ready, in-progress, and own tasks) fetched from existing REST APIs, with a modern and responsive user interface.

## Glossary

- **Procurement System**: The Angular-based web application for managing procurement tasks
- **Keycloak**: The authentication and authorization service used for user identity management
- **Task Grid**: A data grid component displaying task information with sorting, filtering, and pagination capabilities
- **Ready Task**: A task that is available to be claimed by users
- **In-Progress Task**: A task that is currently being worked on
- **Own Task**: A task that is assigned to the current user
- **AG Grid**: The data grid library used for displaying task information

## Requirements

### Requirement 1

**User Story:** As a procurement user, I want to authenticate using Keycloak, so that I can securely access the procurement system

#### Acceptance Criteria

1. WHEN the Procurement System loads, THE Procurement System SHALL redirect unauthenticated users to the Keycloak login page
2. WHEN a user successfully authenticates with Keycloak, THE Procurement System SHALL store the authentication token securely
3. WHEN a user's token expires, THE Procurement System SHALL redirect the user to the Keycloak login page
4. WHEN a user logs out, THE Procurement System SHALL clear the authentication token and redirect to the Keycloak login page

### Requirement 2

**User Story:** As a procurement user, I want to view ready tasks in a grid, so that I can see which tasks are available to claim

#### Acceptance Criteria

1. WHEN the user navigates to the ready tasks view, THE Procurement System SHALL fetch tasks from the endpoint "https://usis.bracits.net/api/bpa/task/ready" with pagination parameters
2. WHEN the ready tasks are loaded, THE Procurement System SHALL display the tasks in AG Grid with columns for id, module, code, ref, assignee, stepName, startedAt, name, initiator, claimTime, title, and viewUrl
3. WHEN the user interacts with the grid, THE Procurement System SHALL support sorting by any column
4. WHEN the user scrolls to the end of the grid, THE Procurement System SHALL load the next page of tasks automatically

### Requirement 3

**User Story:** As a procurement user, I want to view in-progress tasks in a grid, so that I can see which tasks are currently being worked on

#### Acceptance Criteria

1. WHEN the user navigates to the in-progress tasks view, THE Procurement System SHALL fetch tasks from the endpoint "https://usis.bracits.net/api/bpa/task/in-progress" with pagination parameters
2. WHEN the in-progress tasks are loaded, THE Procurement System SHALL display the tasks in AG Grid with the same column structure as ready tasks
3. WHEN the user interacts with the grid, THE Procurement System SHALL support filtering by any column
4. WHEN the API request includes headers, THE Procurement System SHALL include Authorization, X-REALM, and X-SOURCE headers

### Requirement 4

**User Story:** As a procurement user, I want to view my own tasks in a grid, so that I can manage tasks assigned to me

#### Acceptance Criteria

1. WHEN the user navigates to the own tasks view, THE Procurement System SHALL fetch tasks from the endpoint "https://usis.bracits.net/api/bpa/task/own" with pagination parameters
2. WHEN the own tasks are loaded, THE Procurement System SHALL display the tasks in AG Grid with all available columns from the API response
3. WHEN the user clicks on a task row, THE Procurement System SHALL navigate to the viewUrl if available
4. WHEN the API returns a lastRow value, THE Procurement System SHALL use it to determine the total number of rows for pagination

### Requirement 7

**User Story:** As a procurement user, I want to view task details with actions and history, so that I can perform actions and track task progress

#### Acceptance Criteria

1. WHEN the user clicks the view button on a task, THE Procurement System SHALL fetch task actions from "https://usis.bracits.net/api/bpa/actions" with module, key, and ref parameters
2. WHEN the user views task details, THE Procurement System SHALL fetch task history from "https://usis.bracits.net/api/bpa/history" with module, key, and ref parameters
3. WHEN the task actions are loaded, THE Procurement System SHALL display action buttons with labels and CSS classes from the API response
4. WHEN the task history is loaded, THE Procurement System SHALL display a timeline showing stepName, startAt, endAt, remarks, assignee, and actionLabel
5. WHEN the user clicks an action button, THE Procurement System SHALL send a POST request to "https://usis.bracits.net/api/{module}/v1/workflow/perform" with action, key, and ref parameters
6. WHEN an action is successfully performed, THE Procurement System SHALL refresh the task details and show a success message
7. WHEN the task is editable, THE Procurement System SHALL enable the edit functionality based on the isEditable flag
8. WHEN the task is claimable, THE Procurement System SHALL display a claim button
9. WHEN the task is releasable, THE Procurement System SHALL display a release button

### Requirement 5

**User Story:** As a procurement user, I want a modern and responsive UI, so that I can use the application on different devices

#### Acceptance Criteria

1. THE Procurement System SHALL use Angular Material or similar UI framework for consistent styling
2. THE Procurement System SHALL display a navigation menu with links to ready tasks, in-progress tasks, and own tasks views
3. WHEN the viewport width is less than 768 pixels, THE Procurement System SHALL adapt the layout for mobile devices
4. THE Procurement System SHALL display loading indicators when fetching data from APIs

### Requirement 6

**User Story:** As a procurement user, I want to see error messages when something goes wrong, so that I understand what happened

#### Acceptance Criteria

1. WHEN an API request fails, THE Procurement System SHALL display an error message to the user
2. WHEN the authentication fails, THE Procurement System SHALL display a clear error message
3. WHEN the network is unavailable, THE Procurement System SHALL display a network error message
4. THE Procurement System SHALL log errors to the browser console for debugging purposes
