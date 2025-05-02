# Fitness Group Captain Dashboard - Implementation Plan & Prompts

## Project Specification

```markdown
# Fitness Group Captain Dashboard - Technical Specification

## Core Application
- **Framework**: Next.js with React and TypeScript
- **Hosting**: Vercel
- **Authentication**: Auth.js with Google authentication
- **Session Management**: 30-day authentication period
- **UI Components**: shadcn/ui component library for consistent, accessible interface elements

## Data Storage
- **Database**: Vercel KV (Redis-based key-value store)
- **Data Structures**:
  1. User list with access levels (`active`, `retired`, `admin`)
  2. Hierarchical sidebar links (categories containing links with title and URL)

## User Roles & Access
- **Admin**: Can manage authorized emails, sidebar links, and access levels
- **Active**: Can access the dashboard
- **Retired**: Cannot access the dashboard (soft-deleted)
- **Initial Setup**: First admin email hardcoded in initial deployment

## User Interface
- **Design**: Minimalist interface with light/dark mode toggle using shadcn/ui
- **Layout**: Collapsible sidebar (toggle-based) with links; main area for calendar
- **Calendar**: Google Calendar iframe embed
- **Header**: Group logo display
- **Responsiveness**: Fully responsive design for both desktop and mobile
- **Unauthorized Access**: Simple error message for unauthorized users

## Admin Interface
- **Functionality**:
  1. Add/remove/modify authorized emails
  2. Set user access levels
  3. Manage sidebar links in hierarchical categories
  
## Deployment & Operations
- **CI/CD**: GitHub integration with automatic deployments to Vercel
- **Environments**: Single production environment with local development
- **Monitoring**: Vercel's built-in error logging
```

## Implementation Plan - Iterative Steps

### Phase 1: Project Setup and Basic Structure

#### Step 1.1: Project Initialization and Dependencies
```
I need to create a new Next.js project with TypeScript for a fitness group captain dashboard. Please help me set up the project with the following requirements:

1. Initialize a new Next.js 14+ project with TypeScript and App Router ✅
2. Configure the project for Vercel deployment ✅
3. Set up ESLint and Prettier for code quality ✅
4. Install shadcn/ui and configure the basic theme with light/dark mode support ✅
5. Set up the basic folder structure following Next.js best practices ✅
6. Create a simple home page with a "Hello World" message to verify the setup ✅

Please provide the commands and initial configuration files needed to get started.
```

#### Step 1.2: Layout and Theme Configuration
```
Building on our Next.js project for the fitness group dashboard, I now need to create the basic layout structure with a collapsible sidebar and main content area. Please help with:

1. Create a responsive layout component with:
   - A header that displays a logo (placeholder for now) ✅
   - A collapsible sidebar that works on both desktop and mobile ✅
   - A main content area ✅
2. Implement light/dark mode toggle using shadcn/ui components ✅
3. Make the sidebar collapsible with a hamburger menu on mobile ✅
4. Ensure the layout is responsive and follows best practices ✅
5. Use shadcn/ui components for consistent styling ✅

Please provide the necessary component code and styling for this layout.
```

#### Step 1.3: Auth.js Integration for Google Authentication
```
For the fitness group dashboard, I need to implement Google authentication using Auth.js (formerly NextAuth.js). Please help me:

1. Install and configure Auth.js with Google provider ✅
2. Set up the necessary environment variables ✅
3. Create session management with a 30-day authentication period ✅
4. Implement basic protected routes that require authentication ✅
5. Create a login page with a Google sign-in button ✅
6. Handle authentication errors with a simple message ✅
7. Configure Auth.js to work with the Next.js App Router ✅

Please provide the configuration files, component code, and any middleware needed for authentication.
```

### Phase 2: Data Storage and User Management

#### Step 2.1: Vercel KV Integration
```
For the fitness group dashboard, I need to integrate Vercel KV (Redis-based key-value store) for data storage. Please help me:

1. Install and configure Vercel KV in the Next.js project
2. Set up the necessary environment variables for Vercel KV
3. Create utility functions for:
   - Reading from Vercel KV
   - Writing to Vercel KV
   - Updating values in Vercel KV
   - Deleting values from Vercel KV
4. Implement error handling for the KV operations
5. Add a simple test component to verify KV is working correctly

Please provide the necessary configuration and utility code for Vercel KV integration.
```

#### Step 2.2: User Authorization Model
```
For the fitness group dashboard, I need to implement a user authorization model with different access levels. Please help me create:

1. A data structure for storing user information in Vercel KV with:
   - Email address as the key
   - Access level (`active`, `retired`, `admin`) as part of the value
2. Utility functions to:
   - Check if a user exists and has access
   - Get a user's access level
   - Verify if a user has admin privileges
3. Implementation of hardcoded initial admin user
4. Middleware to protect routes based on authorization level
5. Simple redirection for unauthorized users with an error message

Please provide the data structure, utility functions, and middleware for the authorization model.
```

#### Step 2.3: Sidebar Links Data Model
```
For the fitness group dashboard, I need to implement a data model for hierarchical sidebar links stored in Vercel KV. Please help me:

1. Create a data structure for storing hierarchical sidebar links with:
   - Categories (with titles)
   - Links within categories (with titles and URLs)
2. Utility functions to:
   - Get all sidebar links
   - Add a new category
   - Add a new link to a category
   - Update a category
   - Update a link
   - Delete a category
   - Delete a link
3. Sample initial data for testing
4. Function to store the initial data in Vercel KV during setup

Please provide the data structure, utility functions, and sample data for the sidebar links.
```

### Phase 3: Core Dashboard Functionality

#### Step 3.1: Dynamic Sidebar Component
```
For the fitness group dashboard, I need to create a dynamic sidebar component that loads and displays links from Vercel KV. Please help me:

1. Create a React component that:
   - Fetches the hierarchical sidebar links from Vercel KV
   - Renders categories as collapsible sections
   - Renders links within each category
   - Handles loading and error states
2. Style the sidebar using shadcn/ui components
3. Make the sidebar responsive for mobile and desktop
4. Implement the collapsible functionality for categories
5. Connect this component to the layout created earlier

Please provide the component code and any necessary utility functions.
```

#### Step 3.2: Google Calendar Integration
```
For the fitness group dashboard, I need to implement the Google Calendar integration as the main content of the dashboard. Please help me:

1. Create a React component for the Google Calendar iframe
2. Implement responsive sizing for the calendar
3. Handle loading states gracefully
4. Allow for proper iframe embedding with appropriate security headers
5. Style the calendar container to fit well in the main content area
6. Ensure the calendar works well on both mobile and desktop

Please provide the component code and any necessary configuration.
```

#### Step 3.3: Dashboard Home Page
```
For the fitness group dashboard, I need to create the main dashboard page that combines all components. Please help me:

1. Create a dashboard home page that:
   - Uses the layout with the dynamic sidebar
   - Displays the Google Calendar in the main content area
   - Shows appropriate welcome information
   - Is only accessible to authenticated users with 'active' status
2. Implement proper loading states for all components
3. Add error handling for data fetching
4. Ensure all components are properly connected
5. Make sure the page is responsive and follows the design guidelines

Please provide the page component code that integrates all the previously created components.
```

### Phase 4: Admin Functionality

#### Step 4.1: Admin Layout and Navigation
```
For the fitness group dashboard, I need to create an admin section with its own layout and navigation. Please help me:

1. Create an admin layout that:
   - Extends the main layout
   - Adds an admin navigation bar with tabs for:
     - User Management
     - Sidebar Links Management
   - Is only accessible to users with 'admin' status
2. Implement navigation between admin sections
3. Add appropriate styling using shadcn/ui components
4. Ensure the admin layout is responsive
5. Add proper authorization checks for admin routes

Please provide the layout and navigation components for the admin section.
```

#### Step 4.2: User Management Interface
```
For the fitness group dashboard, I need to create a user management interface for admins. Please help me:

1. Create a user management page that:
   - Displays a list of all users with their email and access level
   - Allows adding new users with email and access level
   - Allows editing a user's access level
   - Allows setting a user to 'retired' status (soft delete)
2. Implement data fetching and mutation using Vercel KV
3. Add form validation for email addresses
4. Create a user-friendly interface with shadcn/ui components
5. Add success/error notifications for user actions
6. Ensure the interface is responsive

Please provide the components and utility functions for the user management interface.
```

#### Step 4.3: Sidebar Links Management Interface
```
For the fitness group dashboard, I need to create an interface for admins to manage sidebar links. Please help me:

1. Create a sidebar links management page that:
   - Displays the hierarchical structure of categories and links
   - Allows adding, editing, and deleting categories
   - Allows adding, editing, and deleting links within categories
   - Supports reordering of categories and links (optional if time permits)
2. Implement data fetching and mutation using Vercel KV
3. Add form validation for inputs
4. Create a user-friendly interface with shadcn/ui components
5. Add success/error notifications for user actions
6. Ensure the interface is responsive

Please provide the components and utility functions for the sidebar links management interface.
```

### Phase 5: Final Integration and Deployment

#### Step 5.1: Error Handling and Edge Cases
```
For the fitness group dashboard, I need to improve error handling and address edge cases. Please help me:

1. Implement comprehensive error handling for:
   - Authentication failures
   - Authorization issues
   - Data fetching errors
   - Form submission errors
2. Create user-friendly error messages
3. Add fallback UI for error states
4. Implement retry mechanisms where appropriate
5. Handle edge cases like:
   - First-time setup
   - Empty data states
   - Concurrent edits
6. Add logging for errors to aid debugging

Please provide the error handling components and utility functions for these scenarios.
```

#### Step 5.2: Testing and Polishing
```
For the fitness group dashboard, I need to implement testing and polish the application. Please help me:

1. Add unit tests for key utility functions
2. Implement basic component tests for critical components
3. Create a simple end-to-end test for the authentication flow
4. Optimize performance by:
   - Implementing proper data caching
   - Using React's useMemo and useCallback where appropriate
   - Optimizing image loading
5. Improve the visual design with:
   - Consistent spacing
   - Smooth transitions
   - Responsive design tweaks
6. Ensure accessibility compliance with WCAG standards

Please provide the testing setup, performance optimizations, and visual improvements.
```

#### Step 5.3: Deployment Configuration
```
For the fitness group dashboard, I need to prepare the project for deployment on Vercel. Please help me:

1. Create a proper production build configuration
2. Set up environment variables for production
3. Configure Vercel deployment settings
4. Set up GitHub integration for CI/CD
5. Implement basic monitoring using Vercel's built-in logs
6. Create a README.md with deployment and maintenance instructions
7. Add documentation for future development

Please provide the deployment configuration, GitHub workflow files, and documentation.
```

## Implementation Timeline Recommendation

- **Phase 1 (Project Setup)**: 1-2 days
- **Phase 2 (Data Storage)**: 2-3 days
- **Phase 3 (Core Dashboard)**: 2-3 days
- **Phase 4 (Admin Functionality)**: 3-4 days
- **Phase 5 (Integration & Deployment)**: 2-3 days

**Total Estimated Time**: 10-15 days

## Next Steps

1. Review the step-by-step plan and adjust as needed
2. Begin implementation with Phase 1
3. Test each component thoroughly before moving to the next phase
4. Review and refine after each phase
5. Deploy to Vercel after Phase 5 is complete

This plan follows best practices for incremental development, ensuring each step builds logically on the previous ones without introducing overwhelming complexity at any stage.
