# St Martin Counsellors Frontend

A React + TypeScript + Vite application for the St Martin Counsellors platform. This project powers the client and admin experience for counsellor sign-in, profile management, schedules, events, and secure admin verification.

## Overview

This frontend connects to Supabase for authentication and database access, and integrates with the FastAPI backend for admin login verification using a bearer token and time-based OTP flow.

## Features

- Client login and sign-up flow
- Admin login with email + password + verification code
- Counsellor profile view and update workflow
- Schedule management and viewing
- Event management pages for admins
- Responsive UI built with Material UI
- Route-based navigation for client and admin dashboards

## Tech Stack

- React 19
- TypeScript
- Vite
- Material UI
- Supabase JS client
- React Router
- Axios

## Project Structure

```text
stmartin_counsellors/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   ├── database/
│   ├── models/
│   ├── screens/
│   ├── styles/
│   ├── App.tsx
│   ├── main.tsx
│   └── vite-env.d.ts
├── .env
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## Requirements

- Node.js 18+
- npm or pnpm
- A Supabase project configured with the required tables and auth settings
- The backend API running locally or deployed at a reachable URL

## Environment Variables

Create a `.env` file in the project root with the following values:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_KEY=your_supabase_anon_or_service_role_key
```

If your local backend is hosted separately, make sure the admin login requests in the app point to the correct backend URL, such as:

```env
VITE_API_BASE_URL=http://localhost:8000
```

You can also hardcode or replace the backend host in the frontend login logic if needed.

## Installation

```bash
npm install
```

## Running the App

```bash
npm run dev
```

Then open the local Vite URL in the browser, typically:

- http://localhost:5173

## Admin Login Flow

The admin experience follows this sequence:

1. User enters admin email and password.
2. Frontend signs in with Supabase.
3. A bearer token is sent to the backend at `/admin/verification`.
4. Backend sends a TOTP verification code to the authenticated email.
5. User enters the code in the UI.
6. Frontend submits it to `/admin/verify-code/{code}`.
7. If the code is valid, the app navigates to the admin dashboard.

## Backend Dependency

This frontend expects the backend service to be running and accessible on the configured host. The backend is responsible for:

- validating the access token
- sending the OTP email
- verifying the time-based code

## Available Scripts

```bash
npm run dev     # start local dev server
npm run build   # create production build
npm run preview # preview production build
npm run lint    # run linter checks
```

## Notes

- Keep `.env` values private and never commit them to version control.
- Adjust CORS and backend API URLs if the project is moved to another environment.
- The admin and client routes are separated in the app router 

