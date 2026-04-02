# Finance Dashboard UI

A frontend-only finance dashboard built for the Frontend Developer Intern assignment.

## Overview

This project focuses on clear UI architecture, meaningful interactions, and practical state management using mock financial data.

## Primary Tech Stack

- React.js (JavaScript)
- Vite
- Tailwind CSS v4
- Custom hook-based state management
- LocalStorage for persistence

## Core Requirements Coverage

### Dashboard Overview

- Summary cards: Total Balance, Income, Expenses
- Time-based visualization: balance trend chart (SVG)
- Categorical visualization: spending breakdown (conic-gradient donut)

### Transactions Section

- Transaction list with: date, description, category, type, amount
- Search by description/category
- Filter by type/category/date range
- Sorting by date, amount, and alphabetical order
- Grouping by category/type/month
- Admin actions: add, edit, delete
- Empty-state handling for filtered/no data

### Basic Role-Based UI

- Viewer mode: read-only
- Admin mode: full transaction management
- Workspace access restricted for Viewer

### Insights Section

- Highest spending category
- Month-over-month net comparison
- Expense ratio
- Savings signal and average expense ticket

### State Management

Centralized in `src/hooks/useFinanceDashboard.js`:

- Source state: role, transactions, filters, grouping, theme preference
- Derived state: summary totals, trend data, category breakdown, monthly comparison, insights

### UI/UX and Responsiveness

- Responsive across mobile, tablet, and desktop
- Dark/Light theme with persistence
- Smooth transitions and polished interaction states
- Sticky/scrollable data sections where needed

## Optional Enhancements Included

- Dark mode toggle (persisted)
- LocalStorage persistence
- Mock API simulation (bootstrap + manual sync)
- Export JSON
- Export CSV
- Advanced grouping in transactions

## Edge Cases Handled

- Invalid/corrupt LocalStorage fallback
- Transaction payload sanitization
- Empty dataset behavior for charts/tables/insights
- Role-guarded mutation actions

## Folder Structure

```bash
src/
  api/
    mockApi.js
  components/
    dashboard/
      BalanceTrendChart.jsx
      CategoryBreakdownChart.jsx
      InsightsPanel.jsx
      MonthlyComparisonTable.jsx
      SummaryCards.jsx
    layout/
      Header.jsx
      RoleNotice.jsx
      TopTabs.jsx
      WorkspacePanel.jsx
    transactions/
      TransactionForm.jsx
      TransactionsSection.jsx
  data/
    transactions.js
  hooks/
    useFinanceDashboard.js
  utils/
    finance.js
    formatters.js
  App.jsx
  App.css
  index.css
  main.jsx
public/
  sun.svg
  moon.svg
```

## Run Locally

```bash
npm install
npm run dev
```

## Production Build

```bash
npm run lint
npm run build
npm run preview
```

## Notes

- This is intentionally frontend-only as per assignment scope.
- No backend authentication or persistent server database is included.
