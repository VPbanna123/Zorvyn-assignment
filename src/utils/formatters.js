const currencyFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
})

const dateFormatter = new Intl.DateTimeFormat('en-IN', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
})

export function formatCurrency(value) {
  return currencyFormatter.format(value)
}

export function formatDate(dateString) {
  return dateFormatter.format(new Date(dateString))
}

export function formatShortMonth(dateString) {
  return new Intl.DateTimeFormat('en-IN', {
    month: 'short',
  }).format(new Date(dateString))
}
