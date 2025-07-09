<p align="center">
  <img src="public/favicon.svg" alt="Finance Tracker Logo" width="100"/>
</p>

<h1 align="center">Finance Tracker Website</h1>

<p align="center">
  <b>A modern personal finance dashboard to track your accounts, budgets, goals, and transactions with beautiful charts and insights.</b>
</p>

<p align="center">
  <a href="#"><img src="https://img.shields.io/badge/build-passing-brightgreen" alt="Build Status"></a>
  <a href="#"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License"></a>
  <a href="#"><img src="https://img.shields.io/badge/made%20with-React-blue" alt="Made with React"></a>
</p>

---

## 📑 Table of Contents
- [Features](#-features)
- [Screenshots](#-screenshots)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Folder Structure](#-folder-structure)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

- **Account Management:** Add, edit, and view multiple financial accounts.
- **Transaction Tracking:** Log income and expenses, view recent transactions.
- **Budgeting:** Set monthly budgets and get alerts when you go over.
- **Goals:** Track savings goals and progress.
- **Dashboard:** Visualize your finances with charts (income, expenses, net income, category breakdown).
- **Reports:** Generate and view financial reports.
- **Authentication:** Secure login and user management (via Supabase).
- **Responsive UI:** Works great on desktop and mobile.

---

## 🖼️ Screenshots

<p align="center">
  <img src="public/placeholder.svg" alt="Dashboard Screenshot" width="600"/>
  <br/>
  <i>Dashboard Overview (replace with your own screenshot)</i>
</p>

---

## 🛠️ Tech Stack

- **Frontend:** React, TypeScript, Vite
- **State Management:** Zustand
- **Styling:** Tailwind CSS
- **Charts:** (e.g., Chart.js or similar)
- **Backend/DB:** Supabase

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+ recommended)
- npm or bun

### Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/YOUR_USERNAME/finance-tracker-website.git
   cd finance-tracker-website
   ```
2. **Install dependencies:**
   ```sh
   npm install
   # or
   bun install
   ```
3. **Set up Supabase:**
   - Create a [Supabase](https://supabase.com/) project.
   - Copy your Supabase URL and anon/public key.
   - Update the config in `src/integrations/supabase/client.ts` as needed.
4. **Start the development server:**
   ```sh
   npm run dev
   # or
   bun run dev
   ```

### Building for Production
```sh
npm run build
# or
bun run build
```

---

## 📁 Folder Structure

- `src/components/` - UI and feature components
- `src/pages/` - Main pages (Dashboard, Auth, etc.)
- `src/stores/` - State management (Zustand stores)
- `src/integrations/supabase/` - Supabase client and types
- `src/lib/` - Utility functions

---

## 🤝 Contributing

Contributions are welcome! Please open issues or pull requests for improvements or bug fixes.

---

## 📄 License

MIT
