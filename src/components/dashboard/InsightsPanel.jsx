import { formatCurrency } from '../../utils/formatters'

function monthLabel(monthKey) {
  if (!monthKey) {
    return '-'
  }

  const [year, month] = monthKey.split('-')
  const date = new Date(Number(year), Number(month) - 1, 1)
  return new Intl.DateTimeFormat('en-IN', { month: 'long', year: 'numeric' }).format(date)
}

function InsightsPanel({ insights }) {
  const deltaTone = insights.monthlyNetDelta >= 0 ? 'text-emerald-600' : 'text-rose-600'
  const savingsTone = insights.savingsRate >= 0 ? 'text-emerald-600' : 'text-rose-600'

  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Top Spending Category</p>
        <h3 className="mt-2 text-lg font-bold text-slate-900">{insights.topCategory?.category || 'No expense category yet'}</h3>
        <p className="mt-2 text-sm text-slate-600">
          {insights.topCategory
            ? `${formatCurrency(insights.topCategory.amount)} • ${insights.topCategory.percent.toFixed(1)}% of expenses`
            : 'Add expense transactions to unlock this insight.'}
        </p>
      </article>

      <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Monthly Comparison</p>
        <h3 className="mt-2 text-lg font-bold text-slate-900">{monthLabel(insights.latestMonth?.month)}</h3>
        <p className={`mt-2 text-sm font-semibold ${deltaTone}`}>
          Net delta: {insights.monthlyNetDelta >= 0 ? '+' : ''}
          {formatCurrency(insights.monthlyNetDelta)}
        </p>
        <p className="mt-1 text-sm text-slate-600">Compared with {monthLabel(insights.previousMonth?.month)}</p>
      </article>

      <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Expense Pressure</p>
        <h3 className="mt-2 text-lg font-bold text-slate-900">Expense Ratio</h3>
        <p className="mt-2 text-sm text-slate-600">
          {insights.expenseRatio.toFixed(1)}% of your latest monthly income was spent.
        </p>
      </article>

      <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Savings Signal</p>
        <h3 className={`mt-2 text-lg font-bold ${savingsTone}`}>{insights.savingsRate.toFixed(1)}%</h3>
        <p className="mt-2 text-sm text-slate-600">Average expense ticket: {formatCurrency(insights.averageExpense)}</p>
      </article>
    </section>
  )
}

export default InsightsPanel
