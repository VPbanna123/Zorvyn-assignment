import { useEffect, useMemo, useState } from 'react'
import { initialTransactions } from '../data/transactions'
import { fetchMockTransactions, pushTransactionsToMockApi } from '../api/mockApi'
import {
  getBalance,
  getCategoryBreakdown,
  getDailyBalanceTrend,
  getInsights,
  getMonthlyComparison,
  getSummary,
} from '../utils/finance'

const STORAGE_KEY = 'finance-dashboard-state-v2'

function sanitizeTransaction(transaction, fallbackId) {
  if (!transaction || typeof transaction !== 'object') {
    return null
  }

  const date = typeof transaction.date === 'string' ? transaction.date : ''
  const description = typeof transaction.description === 'string' ? transaction.description.trim() : ''
  const category = typeof transaction.category === 'string' ? transaction.category.trim() : ''
  const amount = Number(transaction.amount)
  const type = transaction.type === 'income' ? 'income' : transaction.type === 'expense' ? 'expense' : null

  if (!date || !description || !category || !type || !Number.isFinite(amount) || amount <= 0) {
    return null
  }

  return {
    id: Number.isFinite(Number(transaction.id)) ? Number(transaction.id) : fallbackId,
    date,
    description,
    amount,
    category,
    type,
  }
}

function cloneDefaults() {
  return initialTransactions.map((item, index) => sanitizeTransaction(item, index + 1)).filter(Boolean)
}

function readStoredState() {
  if (typeof window === 'undefined') {
    return null
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return null
    }

    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed.transactions)) {
      return null
    }

    const transactions = parsed.transactions
      .map((item, index) => sanitizeTransaction(item, Date.now() + index))
      .filter(Boolean)

    return {
      role: parsed.role === 'admin' ? 'admin' : 'viewer',
      transactions,
    }
  } catch {
    return null
  }
}

function isWithinDateRange(date, startDate, endDate) {
  if (startDate && date < startDate) {
    return false
  }

  if (endDate && date > endDate) {
    return false
  }

  return true
}

export function useFinanceDashboard() {
  const [storedState] = useState(() => readStoredState())

  const [role, setRole] = useState(storedState?.role || 'viewer')
  const [transactions, setTransactions] = useState(storedState?.transactions || [])
  const [isBootstrapping, setIsBootstrapping] = useState(!storedState)
  const [syncStatus, setSyncStatus] = useState('idle')
  const [syncMessage, setSyncMessage] = useState('')
  const [lastSyncedAt, setLastSyncedAt] = useState(null)

  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [sortBy, setSortBy] = useState('date-desc')
  const [startDateFilter, setStartDateFilter] = useState('')
  const [endDateFilter, setEndDateFilter] = useState('')
  const [groupBy, setGroupBy] = useState('none')

  useEffect(() => {
    if (storedState) {
      return
    }

    let isMounted = true

    async function bootstrapTransactions() {
      setIsBootstrapping(true)

      try {
        const response = await fetchMockTransactions()
        const sanitized = response
          .map((item, index) => sanitizeTransaction(item, index + 1))
          .filter(Boolean)

        if (isMounted) {
          setTransactions(sanitized.length ? sanitized : cloneDefaults())
        }
      } catch {
        if (isMounted) {
          setTransactions(cloneDefaults())
        }
      } finally {
        if (isMounted) {
          setIsBootstrapping(false)
        }
      }
    }

    bootstrapTransactions()

    return () => {
      isMounted = false
    }
  }, [storedState])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        role,
        transactions,
      }),
    )
  }, [role, transactions])

  const summary = useMemo(() => getSummary(transactions), [transactions])
  const balance = useMemo(() => getBalance(transactions), [transactions])
  const trendData = useMemo(() => getDailyBalanceTrend(transactions), [transactions])
  const categoryBreakdown = useMemo(() => getCategoryBreakdown(transactions), [transactions])
  const monthlyComparison = useMemo(() => getMonthlyComparison(transactions), [transactions])
  const insights = useMemo(() => getInsights(transactions), [transactions])

  const categories = useMemo(() => {
    return [...new Set(transactions.map((tx) => tx.category))].sort((a, b) => a.localeCompare(b))
  }, [transactions])

  const filteredTransactions = useMemo(() => {
    const search = searchTerm.trim().toLowerCase()

    function getSearchRank(transaction) {
      if (!search) {
        return Number.MAX_SAFE_INTEGER
      }

      const description = transaction.description.toLowerCase()
      const category = transaction.category.toLowerCase()

      if (description.startsWith(search)) return 0
      if (category.startsWith(search)) return 1

      const descriptionIndex = description.indexOf(search)
      if (descriptionIndex !== -1) return 10 + descriptionIndex

      const categoryIndex = category.indexOf(search)
      if (categoryIndex !== -1) return 100 + categoryIndex

      return Number.MAX_SAFE_INTEGER
    }

    const filtered = transactions.filter((tx) => {
      const matchesSearch =
        !search ||
        tx.description.toLowerCase().includes(search) ||
        tx.category.toLowerCase().includes(search)

      const matchesType = typeFilter === 'all' || tx.type === typeFilter
      const matchesCategory = categoryFilter === 'all' || tx.category === categoryFilter
      const matchesDateRange = isWithinDateRange(tx.date, startDateFilter, endDateFilter)

      return matchesSearch && matchesType && matchesCategory && matchesDateRange
    })

    return filtered.sort((a, b) => {
      if (search) {
        const rankDiff = getSearchRank(a) - getSearchRank(b)
        if (rankDiff !== 0) {
          return rankDiff
        }
      }

      if (sortBy === 'date-desc') {
        return new Date(b.date) - new Date(a.date)
      }
      if (sortBy === 'date-asc') {
        return new Date(a.date) - new Date(b.date)
      }
      if (sortBy === 'amount-desc') {
        return b.amount - a.amount
      }
      if (sortBy === 'amount-asc') {
        return a.amount - b.amount
      }
      return a.description.localeCompare(b.description)
    })
  }, [transactions, searchTerm, typeFilter, categoryFilter, sortBy, startDateFilter, endDateFilter])

  function addTransaction(payload) {
    if (role !== 'admin') {
      return
    }

    const nextId = transactions.reduce((max, tx) => Math.max(max, tx.id), 0) + 1
    const candidate = sanitizeTransaction({ id: nextId, ...payload }, nextId)
    if (!candidate) {
      return
    }

    setTransactions((prev) => [candidate, ...prev])
  }

  function updateTransaction(id, payload) {
    if (role !== 'admin') {
      return
    }

    setTransactions((prev) =>
      prev.map((tx) => {
        if (tx.id !== id) {
          return tx
        }

        const candidate = sanitizeTransaction({ ...tx, ...payload, id: tx.id }, tx.id)
        return candidate || tx
      }),
    )
  }

  function deleteTransaction(id) {
    if (role !== 'admin') {
      return
    }

    setTransactions((prev) => prev.filter((tx) => tx.id !== id))
  }

  function clearTransactions() {
    if (role !== 'admin') {
      return
    }

    setTransactions([])
  }

  function resetTransactions() {
    if (role !== 'admin') {
      return
    }

    setTransactions(cloneDefaults())
  }

  function clearFilters() {
    setSearchTerm('')
    setTypeFilter('all')
    setCategoryFilter('all')
    setSortBy('date-desc')
    setStartDateFilter('')
    setEndDateFilter('')
    setGroupBy('none')
  }

  async function syncWithMockApi() {
    setSyncStatus('syncing')
    setSyncMessage('Syncing transactions to mock API...')

    try {
      const result = await pushTransactionsToMockApi(transactions)
      setSyncStatus('success')
      setSyncMessage(`Mock API sync complete (${result.syncedCount} records).`)
      setLastSyncedAt(result.syncedAt)
    } catch (error) {
      setSyncStatus('error')
      setSyncMessage(error instanceof Error ? error.message : 'Mock API sync failed.')
    }
  }

  return {
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
  }
}
