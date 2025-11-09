# Manual Testing Guide - Procurement Angular Frontend

## Prerequisites

1. Ensure you have valid Keycloak credentials for the `usis` realm
2. Ensure the backend API is accessible at `https://usis.bracits.net/api`
3. Node.js and npm installed

## Starting the Development Server

```bash
cd procurement-app
npm start
```

The application will be available at: http://localhost:4200

## Test Scenarios

### 1. Authentication Flow Testing

#### Test 1.1: Initial Login
1. Open http://localhost:4200 in your browser
2. **Expected**: You should be redirected to Keycloak login page
3. Enter valid credentials
4. **Expected**: After successful login, you should be redirected back to the application
5. **Expected**: You should see the Ready Tasks view
6. **Expected**: Your username should appear in the top-right corner

#### Test 1.2: Token Expiration
1. Wait for token to expire (or manually clear token in browser dev tools)
2. Try to navigate to a different view
3. **Expected**: You should be redirected to Keycloak login page

#### Test 1.3: Logout
1. Click on the user menu in the top-right corner
2. Click "Logout"
3. **Expected**: You should be logged out and redirected to Keycloak

### 2. Ready Tasks View Testing

#### Test 2.1: Task List Display
1. Navigate to Ready Tasks (should be default view)
2. **Expected**: Tasks should load and display in the grid
3. **Expected**: Loading spinner should appear while loading
4. **Expected**: Grid should show columns: ID, Module, Code, Reference, Assignee, Step, Started At, Name, Initiator, Claim Time, Title, Actions

#### Test 2.2: Sorting
1. Click on any column header
2. **Expected**: Tasks should sort by that column (ascending)
3. Click again
4. **Expected**: Tasks should sort in descending order

#### Test 2.3: Filtering
1. Hover over a column header and click the filter icon
2. Enter a filter value
3. **Expected**: Grid should filter to show only matching rows

#### Test 2.4: Pagination
1. Scroll to the bottom of the grid
2. **Expected**: More tasks should load automatically (infinite scroll)
3. **Expected**: Loading indicator should appear while loading

#### Test 2.5: View Task Detail
1. Click the "View" button on any task row
2. **Expected**: You should navigate to the task detail view

### 3. In-Progress Tasks View Testing

#### Test 3.1: Navigation
1. Click "In-Progress Tasks" in the sidebar
2. **Expected**: You should navigate to the in-progress tasks view
3. **Expected**: Tasks should load and display

#### Test 3.2: Grid Functionality
1. Test sorting, filtering, and pagination (same as Ready Tasks)
2. **Expected**: All grid features should work correctly

### 4. Own Tasks View Testing

#### Test 4.1: Navigation
1. Click "Own Tasks" in the sidebar
2. **Expected**: You should navigate to the own tasks view
3. **Expected**: Only tasks assigned to you should display

#### Test 4.2: Task Navigation
1. Click the "View" button on any task
2. **Expected**: You should navigate to the task detail view

### 5. Task Detail View Testing

#### Test 5.1: Task Information Display
1. Navigate to a task detail view
2. **Expected**: Task information should display correctly
3. **Expected**: Task title, module, code, reference should be visible

#### Test 5.2: Action Buttons
1. Verify action buttons are displayed
2. **Expected**: Buttons should have labels from the API
3. **Expected**: Buttons should have correct CSS classes (colors)
4. **Expected**: If task is claimable, "Claim" button should appear
5. **Expected**: If task is releasable, "Release" button should appear
6. **Expected**: If task is editable, "Edit" button should appear

#### Test 5.3: Task History
1. Scroll down to the history section
2. **Expected**: Task history should display in chronological order
3. **Expected**: Each history entry should show:
   - Step name
   - Assignee
   - Start time
   - End time (if available)
   - Remarks (if available)
   - Action label (if available)

#### Test 5.4: Workflow Action Execution
1. Click on any action button
2. **Expected**: A success message should appear
3. **Expected**: Task details should refresh
4. **Expected**: History should update with the new action

### 6. Responsive Design Testing

#### Test 6.1: Desktop View (>1024px)
1. Open application on desktop browser
2. **Expected**: Sidebar should be permanently visible on the left
3. **Expected**: Grid should display all columns comfortably

#### Test 6.2: Tablet View (768px-1024px)
1. Resize browser window to tablet size
2. **Expected**: Sidebar should collapse
3. **Expected**: Hamburger menu icon should appear
4. **Expected**: Clicking hamburger should open sidebar as overlay
5. **Expected**: Clicking a menu item should close sidebar

#### Test 6.3: Mobile View (<768px)
1. Resize browser window to mobile size (or use mobile device)
2. **Expected**: Sidebar should be hidden by default
3. **Expected**: Hamburger menu should open sidebar as overlay
4. **Expected**: Grid should have horizontal scroll for columns
5. **Expected**: All functionality should work on mobile

### 7. Error Handling Testing

#### Test 7.1: Network Error
1. Disconnect from network (or use browser dev tools to simulate offline)
2. Try to load tasks
3. **Expected**: Error message should appear: "Network error. Please check your connection."
4. **Expected**: Error should be logged to console

#### Test 7.2: Authentication Error
1. Manually invalidate your token (clear in dev tools)
2. Try to perform an action
3. **Expected**: You should be redirected to login

#### Test 7.3: API Error
1. If possible, simulate a server error (500)
2. **Expected**: Error message should appear: "Server error. Please try again later."

### 8. Performance Testing

#### Test 8.1: Initial Load Time
1. Clear browser cache
2. Open application
3. **Expected**: Application should load within 2-3 seconds on good connection

#### Test 8.2: Navigation Speed
1. Navigate between different views
2. **Expected**: Navigation should be instant (no page reload)

#### Test 8.3: Grid Performance
1. Load a view with many tasks
2. Scroll through the grid
3. **Expected**: Scrolling should be smooth
4. **Expected**: Infinite scroll should load more data seamlessly

## Browser Compatibility Testing

Test the application on the following browsers:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

## Accessibility Testing

1. Test keyboard navigation (Tab, Enter, Escape)
2. Test with screen reader (if available)
3. Verify color contrast meets WCAG standards

## Security Testing

1. Verify all API requests include Authorization header
2. Verify X-REALM and X-SOURCE headers are present
3. Verify token is not stored in localStorage
4. Verify HTTPS is used for all requests

## Test Results Checklist

After completing all tests, verify:
- [ ] Authentication flow works correctly
- [ ] All three task views load and display data
- [ ] Grid sorting, filtering, and pagination work
- [ ] Task detail view displays correctly
- [ ] Action buttons work and execute workflow actions
- [ ] Task history displays correctly
- [ ] Responsive design works on all screen sizes
- [ ] Error handling displays appropriate messages
- [ ] Performance is acceptable
- [ ] No console errors (except expected ones)

## Reporting Issues

If you encounter any issues during testing:
1. Note the exact steps to reproduce
2. Capture screenshots or screen recordings
3. Check browser console for errors
4. Note the browser and version
5. Note the screen size (for responsive issues)

## Production Build Testing

To test the production build:

```bash
cd procurement-app
npm run build
```

Then serve the `dist/procurement-app/browser` directory using a static file server:

```bash
npx http-server dist/procurement-app/browser -p 8080
```

Open http://localhost:8080 and repeat the test scenarios above.
