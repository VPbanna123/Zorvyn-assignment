import { formatCurrency } from '../../utils/formatters'

const palette = ['#0ea5e9', '#10b981', '#f59e0b', '#f43f5e', '#6366f1', '#14b8a6', '#ef4444']

function buildGradient(data) {
  if (!data.length) {
    return '#e2e8f0'
  }

  let start = 0
  const parts = data.map((entry, index) => {
    const end = start + entry.percent
    const color = palette[index % palette.length]
    const chunk = `${color} ${start.toFixed(2)}% ${end.toFixed(2)}%`
    start = end
    return chunk
  })

  return `conic-gradient(${parts.join(', ')})`
}

function CategoryBreakdownChart({ breakdown }) {
  const totalExpense = breakdown.reduce((sum, item) => sum + item.amount, 0)

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Spending Mix</p>
      <h2 className="mt-1 text-lg font-bold text-slate-900 sm:text-xl">Category breakdown</h2>

      {breakdown.length ? (
        <>
          <div className="mt-6 flex flex-col items-center gap-4">
            <div
              className="relative h-36 w-36 rounded-full sm:h-44 sm:w-44"
              style={{ background: buildGradient(breakdown) }}
              aria-label="Expense category chart"
            >
              <div className="absolute inset-5 rounded-full bg-white shadow-inner sm:inset-6" />
            </div>
            <p className="text-center text-xs text-slate-500 sm:text-sm">
              Total tracked expenses: <span className="font-semibold text-slate-800">{formatCurrency(totalExpense)}</span>
            </p>
          </div>

          <ul className="mt-5 space-y-2">
            {breakdown.slice(0, 6).map((item, index) => (
              <li
                key={item.category}
                className="flex flex-col gap-1 rounded-lg bg-slate-50 px-3 py-2 text-xs sm:flex-row sm:items-center sm:justify-between sm:text-sm"
              >
                <span className="inline-flex items-center gap-2 text-slate-700">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: palette[index % palette.length] }}
                  />
                  {item.category}
                </span>
                <span className="break-words font-semibold text-slate-900">
                  {item.percent.toFixed(1)}% · {formatCurrency(item.amount)}
                </span>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p className="mt-6 rounded-xl border border-dashed border-slate-300 p-8 text-center text-slate-500">
          No expense data to visualize yet.
        </p>
      )}
    </article>
  )
}

export default CategoryBreakdownChart
