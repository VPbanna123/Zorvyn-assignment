import { useEffect, useState } from 'react'
import Header from './components/layout/Header'
import TopTabs from './components/layout/TopTabs'
import RoleNotice from './components/layout/RoleNotice'
import WorkspacePanel from './components/layout/WorkspacePanel'
import SummaryCards from './components/dashboard/SummaryCards'
import BalanceTrendChart from './components/dashboard/BalanceTrendChart'
import CategoryBreakdownChart from './components/dashboard/CategoryBreakdownChart'
import InsightsPanel from './components/dashboard/InsightsPanel'
import MonthlyComparisonTable from './components/dashboard/MonthlyComparisonTable'
import TransactionsSection from './components/transactions/TransactionsSection'
import { useFinanceDashboard } from './hooks/useFinanceDashboard'
import './App.css'

function toCsv(transactions) {
  const rows = [
    ['id', 'date', 'description', 'amount', 'category', 'type'],
    ...transactions.map((tx) => [tx.id, tx.date, tx.description, tx.amount, tx.category, tx.type]),
  ]

  return rows
    .map((row) =>
      row
        .map((value) => {
          const escaped = String(value).replaceAll('"', '""')
          return `"${escaped}"`
        })
        .join(','),
    )
    .join('\n')
}

function App() {
  const [activeTab, setActiveTab] = useState('overview')
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') {
      return 'light'
    }

    return localStorage.getItem('finance-dashboard-theme') === 'dark' ? 'dark' : 'light'
  })

  const {
    role,
    setRole,
    transactions,
    filteredTransactions,
    summary,
    balance,
    trendData,
    categoryBreakdown,
    monthlyComparison,
    insights,
    categories,
    searchTerm,
    setSearchTerm,
    typeFilter,
    setTypeFilter,
    categoryFilter,
    setCategoryFilter,
    sortBy,
    setSortBy,
    startDateFilter,
    setStartDateFilter,
    endDateFilter,
    setEndDateFilter,
    groupBy,
    setGroupBy,
    clearFilters,
    isBootstrapping,
    syncStatus,
    syncMessage,
    lastSyncedAt,
    syncWithMockApi,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    clearTransactions,
    resetTransactions,
  } = useFinanceDashboard()

  function handleRoleChange(nextRole) {
    setRole(nextRole)

    if (nextRole !== 'admin' && activeTab === 'workspace') {
      setActiveTab('overview')
    }
  }

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('finance-dashboard-theme', theme)
  }, [theme])

  function toggleTheme() {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }

  function handleClearData() {
    const shouldClear = window.confirm(
      'Clear all transactions? This is useful for testing empty/no-data states before submission.',
    )
    if (shouldClear) {
      clearTransactions()
    }
  }

  function downloadBlob(content, fileName, mimeType) {
    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.href = url
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    URL.revokeObjectURL(url)
  }

  function handleExportJson() {
    downloadBlob(JSON.stringify(transactions, null, 2), 'transactions-export.json', 'application/json')
  }

  function handleExportCsv() {
    downloadBlob(toCsv(transactions), 'transactions-export.csv', 'text/csv;charset=utf-8')
  }

  return (
    <main
      className={`min-h-screen overflow-x-clip px-3 py-6 sm:px-4 sm:py-8 md:px-8 ${
        theme === 'dark'
          ? 'dashboard-theme-dark bg-[radial-gradient(circle_at_top,#1e293b_0,#111827_40%,#020617_78%)] text-slate-100'
          : 'bg-[radial-gradient(circle_at_top,#f2f8f5_0,#ecf4ff_36%,#f7f8f4_76%)] text-slate-900'
      }`}
    >
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <Header
          role={role}
          setRole={handleRoleChange}
          totalTransactions={transactions.length}
          theme={theme}
          onToggleTheme={toggleTheme}
        />
        {isBootstrapping ? (
          <p className="rounded-xl border border-cyan-300 bg-cyan-50 px-4 py-2 text-sm text-cyan-800">
            Loading transactions from mock API...
          </p>
        ) : null}
        <TopTabs activeTab={activeTab} setActiveTab={setActiveTab} role={role} />
        <RoleNotice role={role} />

        {activeTab === 'overview' ? (
          <section className="animate-up space-y-4">
            <SummaryCards balance={balance} summary={summary} />
            <section className="grid gap-4 xl:grid-cols-3">
              <div className="xl:col-span-2">
                <BalanceTrendChart trendData={trendData} />
              </div>
              <CategoryBreakdownChart breakdown={categoryBreakdown} />
            </section>
          </section>
        ) : null}

        {activeTab === 'transactions' ? (
          <section className="animate-up">
            <TransactionsSection
              role={role}
              allTransactionsCount={transactions.length}
              transactions={filteredTransactions}
              categories={categories}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              typeFilter={typeFilter}
              setTypeFilter={setTypeFilter}
              categoryFilter={categoryFilter}
              setCategoryFilter={setCategoryFilter}
              sortBy={sortBy}
              setSortBy={setSortBy}
              startDateFilter={startDateFilter}
              setStartDateFilter={setStartDateFilter}
              endDateFilter={endDateFilter}
              setEndDateFilter={setEndDateFilter}
              groupBy={groupBy}
              setGroupBy={setGroupBy}
              clearFilters={clearFilters}
              addTransaction={addTransaction}
              updateTransaction={updateTransaction}
              deleteTransaction={deleteTransaction}
            />
          </section>
        ) : null}

        {activeTab === 'insights' ? (
          <section className="animate-up space-y-4">
            <InsightsPanel insights={insights} />
            <MonthlyComparisonTable monthlyComparison={monthlyComparison} />
          </section>
        ) : null}

        {activeTab === 'workspace' ? (
          <section className="animate-up">
            <WorkspacePanel
              role={role}
              transactionCount={transactions.length}
              onReset={resetTransactions}
              onClear={handleClearData}
              onExportJson={handleExportJson}
              onExportCsv={handleExportCsv}
              onSyncMockApi={syncWithMockApi}
              syncStatus={syncStatus}
              syncMessage={syncMessage}
              lastSyncedAt={lastSyncedAt}
            />
          </section>
        ) : null}
      </div>
    </main>
  )
}

export default App
