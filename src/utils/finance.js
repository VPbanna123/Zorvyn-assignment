function safeAmount(value) {
  const parsed = Number(value)
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return 0
  }
  return parsed
}

export function getSummary(transactions) {
  return transactions.reduce(
    (acc, tx) => {
      const amount = safeAmount(tx.amount)
      if (tx.type === 'income') {
        acc.income += amount
      } else {
        acc.expenses += amount
      }
      return acc
    },
    { income: 0, expenses: 0 },
  )
}

export function getBalance(transactions) {
  const { income, expenses } = getSummary(transactions)
  return income - expenses
}

export function getCategoryBreakdown(transactions) {
  const map = new Map()

  transactions
    .filter((tx) => tx.type === 'expense')
    .forEach((tx) => {
      const amount = safeAmount(tx.amount)
      if (!amount) {
        return
      }
      map.set(tx.category, (map.get(tx.category) || 0) + amount)
    })

  const total = [...map.values()].reduce((sum, value) => sum + value, 0)

  return [...map.entries()]
    .map(([category, amount]) => ({
      category,
      amount,
      percent: total ? (amount / total) * 100 : 0,
    }))
    .sort((a, b) => b.amount - a.amount)
}

export function getDailyBalanceTrend(transactions) {
  const dailyMap = new Map()

  transactions.forEach((tx) => {
    if (!tx?.date) {
      return
    }
    const delta = tx.type === 'income' ? safeAmount(tx.amount) : -safeAmount(tx.amount)
    dailyMap.set(tx.date, (dailyMap.get(tx.date) || 0) + delta)
  })

  const sortedDates = [...dailyMap.keys()].sort((a, b) => a.localeCompare(b))

  let runningBalance = 0
  return sortedDates.map((date) => {
    runningBalance += dailyMap.get(date)
    return {
      date,
      balance: runningBalance,
    }
  })
}

export function getMonthlyComparison(transactions) {
  const monthMap = new Map()

  transactions.forEach((tx) => {
    if (!tx?.date || tx.date.length < 7) {
      return
    }

    const monthKey = tx.date.slice(0, 7)
    if (!monthMap.has(monthKey)) {
      monthMap.set(monthKey, { income: 0, expenses: 0 })
    }

    const summary = monthMap.get(monthKey)
    const amount = safeAmount(tx.amount)
    if (tx.type === 'income') {
      summary.income += amount
    } else {
      summary.expenses += amount
    }
  })

  return [...monthMap.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([month, values]) => ({
      month,
      ...values,
      net: values.income - values.expenses,
    }))
}

export function getInsights(transactions) {
  const categoryBreakdown = getCategoryBreakdown(transactions)
  const monthly = getMonthlyComparison(transactions)

  const topCategory = categoryBreakdown[0]
  const latestMonth = monthly[monthly.length - 1]
  const previousMonth = monthly[monthly.length - 2]

  const monthlyNetDelta = previousMonth
    ? latestMonth.net - previousMonth.net
    : latestMonth
      ? latestMonth.net
      : 0

  const expenseRatio = latestMonth
    ? latestMonth.income
      ? (latestMonth.expenses / latestMonth.income) * 100
      : 0
    : 0

  const savingsRate = latestMonth?.income
    ? ((latestMonth.income - latestMonth.expenses) / latestMonth.income) * 100
    : 0

  const expenseTransactions = transactions.filter((tx) => tx.type === 'expense')
  const averageExpense = expenseTransactions.length
    ? expenseTransactions.reduce((sum, tx) => sum + safeAmount(tx.amount), 0) / expenseTransactions.length
    : 0

  return {
    topCategory,
    latestMonth,
    previousMonth,
    monthlyNetDelta,
    expenseRatio,
    savingsRate,
    averageExpense,
  }
}
