# Expense Tracker

A modern expense tracking application built with Next.js.

## Features

- Add income and expense transactions
- Organize transactions by categories
- Recurring monthly transactions
- Interactive charts (12-month trend, category breakdown, income vs expenses)
- Monthly summaries
- Data persists in localStorage
- Ready to migrate to Prisma + database

## Tech Stack

- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- Recharts
- localStorage (in-memory store)

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Build & Production

```bash
npm run build
npm start
```

## Architecture

- **API Routes:** `/app/api/*` — RESTful endpoints for transactions, categories, summary
- **In-Memory Store:** `/app/lib/store.ts` — Singleton data store, synced to localStorage
- **Context:** `/app/context/AppContext.tsx` — Global state management
- **Components:** `/app/components/*` — React UI components

### Migration to Database

Replace the in-memory store with Prisma:
1. `npm install @prisma/client`
2. Update `app/lib/store.ts` to use Prisma client
3. Keep API route signatures identical
4. Zero changes needed to components

## Testing

Open DevTools and check:
- Local Storage: `expense-tracker-state` contains all data
- Network tab: API routes respond correctly
- Charts: Render without errors

## Future Enhancements

- PostgreSQL + Prisma database
- User authentication
- Budget goals and alerts
- Receipt uploads
- CSV/PDF export
- Mobile app (React Native)
