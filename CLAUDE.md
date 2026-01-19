# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build and Development Commands

```bash
# Development server (HTTPS with SSL)
npm start                    # Serves at https://localhost:4200 with SSL

# Development server (HTTP)
npm run start:http           # Serves at http://localhost:4200

# Environment-specific development
npm run start.sit            # SIT environment
npm run start.uat            # UAT environment

# Production build
npm run build.prod           # Builds with base-href and deploy-url set to /jlo-crm/

# Testing
npm run test                 # Run unit tests via Karma
npm run e2e                  # Run e2e tests via Protractor

# Linting
npm run lint
```

## Architecture Overview

This is an Angular 20 CRM application (jlo-crm) using standalone components with lazy loading.

### Core Structure

- **Layouts**: Two main layouts in `src/app/layouts/`
  - `AdminLayoutComponent`: Main authenticated layout with sidebar, navbar, taskbar, and tab-based navigation
  - `AuthLayoutComponent`: Login/authentication layout

- **Routing**: Defined in `src/app/app-routing.ts` using standalone component lazy loading pattern:
  ```typescript
  loadComponent: () => import('./pages/...').then(m => m.ComponentName)
  ```

- **Authentication**: JWT-based using `@auth0/angular-jwt`
  - `AuthGuard` protects routes and checks menu permissions via `respFlag` (R=Read, W=Write, X=Extra)
  - Token utilities in `src/app/shared/token-utils.ts`
  - HTTP interceptor in `src/app/interceptor/httploading.interceptor.ts` handles token refresh and loading spinner

### Key Services and Patterns

- **ApiService** (`src/app/services/api.service.ts`): Central HTTP service using `environment.endpoint` for backend URL
- **Globals** (`src/app/shared/globals.ts`): Application-wide state including user profile and menu items, initialized on app start
- **BaseComponent** (`src/app/shared/base.component.ts`): Base class for page components, provides permission checking methods (`CAN_WRITE()`, `CAN_EXTRA()`, `IS_ROLE()`)
- **TabManageService** (`src/app/layouts/admin/tab-manage.service.ts`): Manages browser-like tab navigation within the admin layout

### Shared Modules

- **SharedModule** (`src/app/shared/module/shared.module.ts`): Exports common modules (Forms, Material, Translate, Quill, FullCalendar, ngx-graph)
- **MaterialModule** (`src/app/shared/module/material.module.ts`): Angular Material components

### Environment Configuration

Environment files in `src/environments/`:
- `environment.ts` - Local development (localhost:8080)
- `environment.sit.ts` - SIT
- `environment.uat.ts` - UAT
- `environment.prod.ts` - Production

Key environment properties: `endpoint`, `whitelistedDomains`, `endpointWebsocket`

### Feature Modules (Pages)

Located in `src/app/pages/`:
- `customer/` - Customer management with detail views and tabs
- `case/` - Case management (activities, attachments, KB integration)
- `service-request/` - Service request handling
- `kb/` - Knowledge base with tree structure, favorites, documents
- `chat/` - Chat functionality with WebSocket support
- `workflow-mgmt/` - Workflow management and process flows
- `system/` - Admin settings (users, roles, menus, codebook, SLA, scheduler, etc.)
- `questionnaire/` - Survey/questionnaire builder with landing pages

### UI Components and Libraries

- Angular Material with custom theme (`src/assets/css/custom-theme.scss`)
- Material Dashboard SCSS (`src/assets/scss/material-dashboard.scss`)
- Bootstrap 5 with ng-bootstrap
- FontAwesome icons
- ngx-quill for rich text editing
- FullCalendar for scheduling
- ngx-graph for workflow visualization
- SweetAlert2 for dialogs

### Styling

- SCSS is the default style format
- Global styles in `src/styles.scss`
- Custom styles in `src/assets/css/jlo-crm.scss`
- Material theme customization in `src/assets/css/custom-theme.scss`

### i18n

Uses `@ngx-translate/core` with Thai as default language. Translation service initialized in Globals.
