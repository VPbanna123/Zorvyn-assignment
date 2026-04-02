import { formatCurrency, formatShortMonth } from '../../utils/formatters'

function getY(balance, min, range, height, padding) {
  const normalized = (balance - min) / range
  return height - padding - normalized * (height - padding * 2)
}

function buildPath(points, width, height, padding) {
  if (!points.length) {
    return ''
  }

  const values = points.map((point) => point.balance)
  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min || 1

  return points
    .map((point, index) => {
      const x = padding + (index / Math.max(points.length - 1, 1)) * (width - padding * 2)
      const y = getY(point.balance, min, range, height, padding)
      return `${index === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`
    })
    .join(' ')
}

function buildAreaPath(points, width, height, padding) {
  if (!points.length) {
    return ''
  }

  const values = points.map((point) => point.balance)
  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min || 1

  const linePath = points
    .map((point, index) => {
      const x = padding + (index / Math.max(points.length - 1, 1)) * (width - padding * 2)
      const y = getY(point.balance, min, range, height, padding)
      return `${index === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`
    })
    .join(' ')

  const lastX = padding + (width - padding * 2)
  const baseY = height - padding

  return `${linePath} L ${lastX.toFixed(2)} ${baseY.toFixed(2)} L ${padding.toFixed(2)} ${baseY.toFixed(2)} Z`
}

function BalanceTrendChart({ trendData }) {
  const width = 820
  const height = 280
  const padding = 26

  const path = buildPath(trendData, width, height, padding)
  const areaPath = buildAreaPath(trendData, width, height, padding)

  const firstPoint = trendData[0]
  const lastPoint = trendData[trendData.length - 1]

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Balance Trend</p>
          <h2 className="mt-1 text-lg font-bold text-slate-900 sm:text-xl">Time-based cash flow movement</h2>
        </div>
        {lastPoint ? (
          <p className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 sm:text-sm">
            Latest: {formatCurrency(lastPoint.balance)}
          </p>
        ) : null}
      </div>

      {trendData.length ? (
        <>
          <div className="mt-4">
            <svg viewBox={`0 0 ${width} ${height}`} className="h-44 w-full sm:h-60">
              <defs>
                <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#0ea5e9" />
                  <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgba(14,165,233,0.28)" />
                  <stop offset="100%" stopColor="rgba(14,165,233,0.02)" />
                </linearGradient>
              </defs>
              <rect x="0" y="0" width={width} height={height} fill="#f8fafc" rx="14" />
              <path d={areaPath} fill="url(#areaGradient)" />
              <path d={path} fill="none" stroke="url(#lineGradient)" strokeWidth="4" strokeLinecap="round" />
            </svg>
          </div>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 sm:text-sm">
            <p>Start: {firstPoint ? `${formatShortMonth(firstPoint.date)} ${firstPoint.date.slice(8, 10)}` : '-'}</p>
            <p>End: {lastPoint ? `${formatShortMonth(lastPoint.date)} ${lastPoint.date.slice(8, 10)}` : '-'}</p>
          </div>
        </>
      ) : (
        <p className="mt-6 rounded-xl border border-dashed border-slate-300 p-8 text-center text-slate-500">
          No trend data yet. Switch to admin mode to add transactions.
        </p>
      )}
    </article>
  )
}

export default BalanceTrendChart
