import { useEffect, useMemo, useRef, useState } from 'react'
import TransactionForm from './TransactionForm'
import { formatCurrency, formatDate } from '../../utils/formatters'

function TypeBadge({ type }) {
  const isIncome = type === 'income'
  return (
    <span
      className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold capitalize ${
        isIncome ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
      }`}
    >
      {type}
    </span>
  )
}

function TransactionsSection({
  role,
  allTransactionsCount,
  transactions,
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
  addTransaction,
  updateTransaction,
  deleteTransaction,
}) {
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const tableRef = useRef(null)
  const firstMatchRef = useRef(null)

  const editingTransaction = useMemo(
    () => transactions.find((transaction) => transaction.id === editingId) || null,
    [editingId, transactions],
  )
  const groupedTransactions = useMemo(() => {
    if (groupBy === 'none') {
      return []
    }

    const map = new Map()
    transactions.forEach((tx) => {
      const key = groupBy === 'month' ? tx.date.slice(0, 7) : tx[groupBy]
      if (!map.has(key)) {
        map.set(key, [])
      }
      map.get(key).push(tx)
    })

    return [...map.entries()].sort(([a], [b]) => a.localeCompare(b))
  }, [groupBy, transactions])

  function groupLabel(key) {
    if (groupBy !== 'month') {
      return key
    }
    const [year, month] = key.split('-')
    const date = new Date(Number(year), Number(month) - 1, 1)
    return new Intl.DateTimeFormat('en-IN', { month: 'long', year: 'numeric' }).format(date)
  }

  function handleCreate(transaction) {
    addTransaction(transaction)
    setShowCreateForm(false)
  }

  function handleUpdate(transaction) {
    if (!editingId) {
      return
    }

    updateTransaction(editingId, transaction)
    setEditingId(null)
  }

  function handleDelete(id) {
    const shouldDelete = window.confirm('Delete this transaction? This action cannot be undone.')
    if (shouldDelete) {
      deleteTransaction(id)
      if (editingId === id) {
        setEditingId(null)
      }
    }
  }

  function handleCategoryInputChange(value) {
    const normalized = value.trim()
    const isAll =
      !normalized ||
      normalized.toLowerCase() === 'all categories' ||
      normalized.toLowerCase() === 'all'

    setCategoryFilter(isAll ? 'all' : normalized)
  }

  useEffect(() => {
    const query = searchTerm.trim()
    if (!query || !transactions.length) {
      return
    }

    tableRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    firstMatchRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [searchTerm, transactions])

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5" id="transactions">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Transactions</p>
          <h2 className="mt-1 text-xl font-bold text-slate-900">Search, filter and review activity</h2>
          <p className="mt-1 text-sm text-slate-500">
            Showing {transactions.length} of {allTransactionsCount} transactions
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setEditingId(null)
            setShowCreateForm((prev) => !prev)
          }}
          disabled={role !== 'admin'}
          className="w-full rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-45 sm:w-auto"
        >
          + Add Transaction
        </button>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-6">
        <input
          type="search"
          placeholder="Search by description/category"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          className="w-full min-w-0 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-cyan-500 xl:col-span-2"
        />

        <select
          value={typeFilter}
          onChange={(event) => setTypeFilter(event.target.value)}
          className="w-full min-w-0 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-cyan-500"
        >
          <option value="all">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>

        <input
          list="category-filter-options"
          value={categoryFilter === 'all' ? '' : categoryFilter}
          onChange={(event) => handleCategoryInputChange(event.target.value)}
          placeholder="All Categories"
          className="w-full min-w-0 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-cyan-500"
        />

        <input
          type="date"
          value={startDateFilter}
          onChange={(event) => setStartDateFilter(event.target.value)}
          className="w-full min-w-0 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-cyan-500"
          title="Start date"
        />

        <input
          type="date"
          value={endDateFilter}
          onChange={(event) => setEndDateFilter(event.target.value)}
          className="w-full min-w-0 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-cyan-500"
          title="End date"
        />

        <datalist id="category-filter-options">
          <option value="All Categories" />
          {categories.map((category) => (
            <option key={category} value={category} />
          ))}
        </datalist>

        <select
          value={sortBy}
          onChange={(event) => setSortBy(event.target.value)}
          className="w-full min-w-0 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-cyan-500 sm:col-span-2 xl:col-span-3"
        >
          <option value="date-desc">Sort: Newest First</option>
          <option value="date-asc">Sort: Oldest First</option>
          <option value="amount-desc">Sort: Highest Amount</option>
          <option value="amount-asc">Sort: Lowest Amount</option>
          <option value="alpha">Sort: Description A-Z</option>
        </select>

        <select
          value={groupBy}
          onChange={(event) => setGroupBy(event.target.value)}
          className="w-full min-w-0 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-cyan-500 sm:col-span-2 xl:col-span-1"
        >
          <option value="none">Group: None</option>
          <option value="category">Group: Category</option>
          <option value="type">Group: Type</option>
          <option value="month">Group: Month</option>
        </select>

        <button
          type="button"
          onClick={clearFilters}
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 sm:col-span-2 xl:col-span-1"
        >
          Reset Filters
        </button>

        <p className="rounded-lg bg-slate-100 px-3 py-2 text-sm text-slate-600 sm:col-span-2 xl:col-span-3">
          Role access: {role === 'admin' ? 'Admin can add, edit and delete transactions' : 'Viewer can only read data'}
        </p>
      </div>

      {showCreateForm && role === 'admin' ? (
        <div className="mt-4">
          <TransactionForm
            key="create"
            categories={categories}
            initialValues={null}
            onSubmit={handleCreate}
            onCancel={() => setShowCreateForm(false)}
          />
        </div>
      ) : null}

      {editingTransaction && role === 'admin' ? (
        <div className="mt-4">
          <TransactionForm
            key={`edit-${editingId}`}
            categories={categories}
            initialValues={editingTransaction}
            onSubmit={handleUpdate}
            onCancel={() => setEditingId(null)}
          />
        </div>
      ) : null}

      {groupBy === 'none' ? (
        <div
          ref={tableRef}
          className="transactions-table mt-4 overflow-x-auto overflow-y-auto rounded-xl border border-slate-200"
        >
          <table className="w-full min-w-[700px] divide-y divide-slate-200 text-left text-sm md:min-w-full">
            <thead className="bg-slate-50 text-xs uppercase tracking-[0.12em] text-slate-500">
              <tr>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Description</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {transactions.length ? (
                transactions.map((tx, index) => (
                  <tr
                    key={tx.id}
                    ref={index === 0 ? firstMatchRef : null}
                    className={`transition hover:bg-slate-50 ${searchTerm.trim() && index === 0 ? 'bg-cyan-50/70' : ''}`}
                  >
                    <td className="whitespace-nowrap px-4 py-3 text-slate-700">{formatDate(tx.date)}</td>
                    <td className="px-4 py-3 font-medium text-slate-800">{tx.description}</td>
                    <td className="px-4 py-3 text-slate-700">{tx.category}</td>
                    <td className="px-4 py-3">
                      <TypeBadge type={tx.type} />
                    </td>
                    <td className={`px-4 py-3 font-semibold ${tx.type === 'income' ? 'text-emerald-700' : 'text-rose-700'}`}>
                      {tx.type === 'income' ? '+' : '-'} {formatCurrency(tx.amount)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setShowCreateForm(false)
                            setEditingId(tx.id)
                          }}
                          disabled={role !== 'admin'}
                          className="rounded-md border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-45"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(tx.id)}
                          disabled={role !== 'admin'}
                          className="rounded-md border border-rose-300 px-3 py-1 text-xs font-semibold text-rose-700 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-45"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-4 py-10 text-center text-slate-500">
                    No transactions match your current filters. Try resetting filters or add a new transaction as admin.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          {groupedTransactions.length ? (
            groupedTransactions.map(([key, items]) => {
              const total = items.reduce((sum, item) => sum + item.amount, 0)

              return (
                <article key={key} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <h3 className="text-sm font-semibold text-slate-800">{groupLabel(key)}</h3>
                    <p className="text-xs text-slate-600">
                      {items.length} items · {formatCurrency(total)}
                    </p>
                  </div>
                  <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
                    <table className="w-full min-w-[680px] divide-y divide-slate-200 text-left text-sm md:min-w-full">
                      <thead className="bg-slate-50 text-xs uppercase tracking-[0.12em] text-slate-500">
                        <tr>
                          <th className="px-4 py-2">Date</th>
                          <th className="px-4 py-2">Description</th>
                          <th className="px-4 py-2">Category</th>
                          <th className="px-4 py-2">Type</th>
                          <th className="px-4 py-2">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {items.map((tx) => (
                          <tr key={tx.id}>
                            <td className="px-4 py-2 text-slate-700">{formatDate(tx.date)}</td>
                            <td className="px-4 py-2 font-medium text-slate-800">{tx.description}</td>
                            <td className="px-4 py-2 text-slate-700">{tx.category}</td>
                            <td className="px-4 py-2">
                              <TypeBadge type={tx.type} />
                            </td>
                            <td className={`px-4 py-2 font-semibold ${tx.type === 'income' ? 'text-emerald-700' : 'text-rose-700'}`}>
                              {tx.type === 'income' ? '+' : '-'} {formatCurrency(tx.amount)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </article>
              )
            })
          ) : (
            <p className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
              No transactions available to group.
            </p>
          )}
        </div>
      )}
    </section>
  )
}

export default TransactionsSection
