# AJNX Banking Web App

Welcome to the **AJNX Banking** project! This is a full-stack banking web application built with **Express.js**, **MySQL**, and a **React** frontend. It supports key banking operations such as account management, transactions (deposits, withdrawals, transfers), credit card management, loans, and customer profiles.

---

## Features Supported

- **User Authentication** (Login / Register)
- **Accounts Management** (Checking / Savings / Credit Cards)
- **Branch Management**
- **Transactions** (Deposits, Withdrawals, Transfers)
- **Loans** (Apply for Loans, Pay Loans, Track Loan History)
- **Payments** (History tracking, Balance validation)
- **Credit Cards** (Apply, View, and Manage Credit Cards)
- **Customer Profile Management**
- **Admin Panel** (Manage Users, Export Data)
- **Privacy Policy** and **Terms of Service** pages

---

## Setup Instructions

Follow these steps carefully to set up and run the project locally or in production:

### 1. Configure Environment Variables

- Locate the `.env.example` file at the project root.
- Fill out all required fields:

  | Field | Description |
  |:--|:--|
  | `DB_HOST` | Your MySQL database host (e.g., `localhost`, or a remote IP) |
  | `DB_USER` | Your MySQL username |
  | `DB_PASSWORD` | Your MySQL password |
  | `DB_NAME` | Your database name (e.g., `AJNXBanking`) |
  | `PORT` | Port to run the backend server (e.g., `3306`) |
  | `JWT_SECRET` | Secret key used for signing JWT tokens |

- **Rename** the file from `.env.example` to `.env` (remove `.example`!)

### 2. Install Required Packages

From the root of your project, run:

```bash
npm install
```

This will install all server-side and client-side dependencies.

### 3. Build the Frontend

Before starting in production mode, you MUST build the React frontend:

```bash
npm run build
```

This compiles the React code into the `dist` folder.

### 4. Start the Server

Choose your preferred mode:

#### a) Production Mode

- Use this for fast startup.
- **Important:** You must complete the `npm run build` step first!

```bash
npm run start:prod
```

Notes:
- Minimal logs are printed.
- Fast and optimized, but harder to debug.

#### b) Development Mode

- Good for testing and active development.
- Automatically rebuilds when files are changed.

```bash
npm run start:dev
```

Notes:
- Slower startup since the project is recompiled.
- Much easier for debugging errors.

### Recommendations

- Always test your changes in **development mode** first.
- Switch to **production mode** only when you're ready to deploy or demo.

---

## Notes

- Minimal logs are available in production.
- Development mode shows detailed errors and auto-reloads.
- Database setup (schema, tables, procedures) must be completed separately.

---

## License

This project is internal to AJNX Banking.

Happy Building! 🚀