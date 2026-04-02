import { initialTransactions } from '../data/transactions'

function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

function cloneTransactions(items) {
  return items.map((item) => ({ ...item }))
}

export async function fetchMockTransactions() {
  await wait(650)
  return cloneTransactions(initialTransactions)
}

export async function pushTransactionsToMockApi(transactions) {
  await wait(700)

  if (Math.random() < 0.08) {
    throw new Error('Mock API sync failed. Please retry.')
  }

  return {
    syncedCount: transactions.length,
    syncedAt: new Date().toISOString(),
  }
}
