---
name: Auth Pages Setup
overview: Create a complete authentication UI with Login, Sign Up, and Password Reset pages using React Router and CSS Modules. The pages will be UI-only (no backend integration), ready for future auth service connection.
todos:
  - id: install-router
    content: Install react-router-dom package
    status: completed
  - id: auth-layout
    content: Create AuthLayout wrapper component with CSS Module
    status: completed
    dependencies:
      - install-router
  - id: form-input
    content: Create reusable FormInput component with validation styling
    status: completed
  - id: login-page
    content: Build LoginPage with email/password form
    status: completed
    dependencies:
      - auth-layout
      - form-input
  - id: signup-page
    content: Build SignUpPage with registration form
    status: completed
    dependencies:
      - auth-layout
      - form-input
  - id: reset-page
    content: Build ResetPasswordPage with email form
    status: completed
    dependencies:
      - auth-layout
      - form-input
  - id: setup-routes
    content: Configure React Router in App.tsx with all auth routes
    status: completed
    dependencies:
      - login-page
      - signup-page
      - reset-page
---

# Auth Pages Implementation Plan

## Overview

Build three authentication pages (Login, Sign Up, Password Reset) with React Router navigation and CSS Modules styling. The implementation will include form validation and a clean, modern UI ready for backend integration.

## Architecture

```mermaid
graph TD
    subgraph routes [Routes]
        Login["/login"]
        SignUp["/signup"]
        Reset["/reset-password"]
        Home["/"]
    end
    
    subgraph components [Shared Components]
        AuthLayout["AuthLayout"]
        FormInput["FormInput"]
    end
    
    Login --> AuthLayout
    SignUp --> AuthLayout
    Reset --> AuthLayout
    AuthLayout --> FormInput
```

## File Structure

```
src/
├── pages/
│   └── auth/
│       ├── LoginPage.tsx
│       ├── LoginPage.module.css
│       ├── SignUpPage.tsx
│       ├── SignUpPage.module.css
│       ├── ResetPasswordPage.tsx
│       └── ResetPasswordPage.module.css
├── components/
│   └── auth/
│       ├── AuthLayout.tsx
│       ├── AuthLayout.module.css
│       ├── FormInput.tsx
│       └── FormInput.module.css
└── App.tsx (updated with routes)
```

## Implementation Steps

### 1. Install React Router

Add `react-router-dom` package for client-side routing.

### 2. Create Shared Auth Components

- **AuthLayout**: Wrapper component with centered card design, logo area, and consistent styling
- **FormInput**: Reusable input component with label, validation states, and error messages

### 3. Build Auth Pages

- **LoginPage**: Email/password fields, "Forgot password?" link, sign up link
- **SignUpPage**: Email, password, confirm password fields, login link
- **ResetPasswordPage**: Email field for password reset request, back to login link

### 4. Configure Routing

Update [src/App.tsx](src/App.tsx) to set up React Router with routes for `/login`, `/signup`, `/reset-password`, and redirect logic.

### 5. Form Validation

Add client-side validation for:

- Email format validation
- Password minimum length (8 characters)
- Password confirmation matching
- Required field checks

## Key Features

- Clean, pet-themed aesthetic with warm colors
- Responsive design for mobile and desktop
- Accessible form inputs with proper labels
- Visual feedback for validation errors
- Smooth transitions between auth states