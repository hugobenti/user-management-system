# User Management System

A React application for managing users, featuring authentication, user CRUD operations, theme customization, and automated testing. This project uses the [Reqres](https://reqres.in/) mock REST API for backend operations.

---

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Usage](#usage)
- [Testing](#testing)
- [Docker Deployment](#docker-deployment)
- [Final Remarks](#final-remarks)

---

## Features

- **Authentication:** Sign-up and sign-in with session management.
- **User Dashboard:** List, create, update, and delete users (with pagination).
- **Theme Customization:** Switch between light and dark themes, with persistence.
- **Automated Testing:** End-to-end tests (Cypress).
- **Dockerized:** Easily deployable using Docker.

---

## Technologies Used

- **Frontend:** React, React Router
- **State Management:** React Context API 
- **Styling:** TailsinCss
- **API:** [Reqres](https://reqres.in/) (mock REST API)
- **Testing:** Cypress 
- **Containerization:** Docker

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16+ recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Docker](https://www.docker.com/) (optional, for containerization)

### Installation

1. **Clone the repository:**
  ```bash
  git clone https://github.com/hugobenti/user-management-system.git
  cd user-management-system
  ```

2. **Install dependencies:**
  ```bash
  npm install
  # or
  yarn install
  ```

3. **Start the development server:**
  ```bash
  npm run dev
  # or
  yarn run dev
  ```

4. **Access the app:**
  Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Project Structure

```
user-management-system/
├── public/
├── src/
│   ├── assets/
│   ├── components/         # Shared UI components (Button, Input, Modal, etc)
│   ├── context/            # React Contexts (Session, Theme, Users)
│   ├── guards/             # Route guards (AuthGuard)
│   ├── hooks/              # Custom React hooks
│   ├── interfaces/         # TypeScript interfaces (IUser, etc)
│   ├── pages/
│   │   ├── auth/           # Auth pages (SignIn, SignUp)
│   │   └── dashboard/      # Dashboard
│   ├── services/           # API services (authService, usersService)
│   ├── styles/             # CSS and Tailwind files
│   └── main.tsx            # App entry point
├── cypress/
│   ├── e2e/                # Cypress E2E test specs
│   ├── fixtures/
│   ├── screenshots/
│   └── support/
├── Dockerfile
├── .dockerignore
├── package.json
├── README.md
└── ... (config files)
```

---

## Usage

### Authentication

- **Sign Up:** Register a new user. Password confirmation is required.
- **Sign In:** Log in with existing credentials.
- **Session:** Active sessions are persisted; users are redirected to the dashboard if already logged in.

### User Management Dashboard

- **List Users:** Paginated (6 users per page).
- **Create User:** Add new users.
- **Update User:** Edit user information.
- **Delete User:** Remove users from the list.
- **Note:** All changes are simulated on the frontend and reset on page refresh.

### Theme Customization

- Switch between light and dark themes.
- Selected theme is saved and persists across sessions.

---

## Testing

- **End-to-end tests (Cypress):**
  ```bash
  npx cypress open
  ```

---

## Docker Deployment

1. **Build the Docker image:**
  ```bash
  npm run docker:build
  ```
  or
  ```bash
  docker build -t user-management-system .
  ```

2. **Run the Docker container:**
  ```bash
  docker run -p 8080:80 user-management-system
  ```
  Access at [http://localhost:8080](http://localhost:8080)

---

