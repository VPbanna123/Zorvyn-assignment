import { formatCurrency } from '../../utils/formatters'

function monthLabel(monthKey) {
  const [year, month] = monthKey.split('-')
  const date = new Date(Number(year), Number(month) - 1, 1)
  return new Intl.DateTimeFormat('en-IN', { month: 'short', year: 'numeric' }).format(date)
}

function MonthlyComparisonTable({ monthlyComparison }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Month by Month</p>
          <h2 className="mt-1 text-lg font-bold text-slate-900 sm:text-xl">Income vs expense comparison</h2>
        </div>
      </div>

      <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200">
        <table className="min-w-[620px] divide-y divide-slate-200 text-left text-xs sm:min-w-full sm:text-sm">
          <thead className="bg-slate-50 text-[10px] uppercase tracking-[0.12em] text-slate-500 sm:text-xs">
            <tr>
              <th className="px-4 py-3">Month</th>
              <th className="px-4 py-3">Income</th>
              <th className="px-4 py-3">Expenses</th>
              <th className="px-4 py-3">Net</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {monthlyComparison.length ? (
              monthlyComparison.map((row) => (
                <tr key={row.month} className="transition hover:bg-slate-50">
                  <td className="px-4 py-3 font-semibold text-slate-800">{monthLabel(row.month)}</td>
                  <td className="px-4 py-3 text-emerald-700">{formatCurrency(row.income)}</td>
                  <td className="px-4 py-3 text-rose-700">{formatCurrency(row.expenses)}</td>
                  <td className={`px-4 py-3 font-semibold ${row.net >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                    {formatCurrency(row.net)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="px-4 py-10 text-center text-slate-500">
                  No monthly comparison data yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </article>
  )
}

export default MonthlyComparisonTable
