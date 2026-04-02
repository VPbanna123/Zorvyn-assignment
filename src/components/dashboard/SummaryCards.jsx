import { formatCurrency } from '../../utils/formatters'

const cardConfig = [
  {
    key: 'balance',
    label: 'Total Balance',
    tone: 'from-slate-900 via-slate-800 to-slate-700',
    valueClass: 'text-emerald-300',
    negativeValueClass: 'text-rose-300',
  },
  {
    key: 'income',
    label: 'Income',
    tone: 'from-emerald-600 via-emerald-500 to-emerald-400',
    valueClass: 'text-white',
  },
  {
    key: 'expenses',
    label: 'Expenses',
    tone: 'from-rose-600 via-rose-500 to-rose-400',
    valueClass: 'text-white',
  },
]

function SummaryCards({ balance, summary }) {
  const values = {
    balance,
    income: summary.income,
    expenses: summary.expenses,
  }

  return (
    <section className="grid gap-4 md:grid-cols-3">
      {cardConfig.map((card) => {
        const isBalance = card.key === 'balance'
        const showNegativeTone = isBalance && values.balance < 0

        return (
          <article
            key={card.key}
            className={`rounded-2xl bg-gradient-to-br ${card.tone} p-4 shadow-lg transition-transform duration-300 hover:-translate-y-1 sm:p-5`}
          >
            <p className="text-sm font-medium text-white/85">{card.label}</p>
            <p
              className={`mt-3 break-words text-2xl font-bold tracking-tight sm:text-3xl ${
                showNegativeTone ? card.negativeValueClass : card.valueClass
              }`}
            >
              {formatCurrency(values[card.key])}
            </p>
          </article>
        )
      })}
    </section>
  )
}

export default SummaryCards
