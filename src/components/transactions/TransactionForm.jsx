import { useId, useState } from 'react'

const emptyForm = {
  date: '',
  description: '',
  amount: '',
  category: '',
  type: 'expense',
}

function normalizeInitialValues(initialValues) {
  if (!initialValues) {
    return emptyForm
  }

  return {
    date: initialValues.date,
    description: initialValues.description,
    amount: String(initialValues.amount),
    category: initialValues.category,
    type: initialValues.type,
  }
}

function TransactionForm({ categories, initialValues, onSubmit, onCancel }) {
  const [formValues, setFormValues] = useState(() => normalizeInitialValues(initialValues))
  const [error, setError] = useState('')
  const datalistId = useId()

  function updateField(field, value) {
    setFormValues((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  function handleSubmit(event) {
    event.preventDefault()

    if (!formValues.description.trim()) {
      setError('Description is required.')
      return
    }

    if (!formValues.date) {
      setError('Date is required.')
      return
    }

    const amount = Number(formValues.amount)
    if (!amount || amount <= 0) {
      setError('Amount should be greater than zero.')
      return
    }

    if (!formValues.category.trim()) {
      setError('Category is required.')
      return
    }

    onSubmit({
      date: formValues.date,
      description: formValues.description.trim(),
      amount,
      category: formValues.category.trim(),
      type: formValues.type,
    })

    if (!initialValues) {
      setFormValues(emptyForm)
    }
    setError('')
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="grid gap-3 md:grid-cols-2">
        <label className="text-sm text-slate-700">
          Date
          <input
            type="date"
            value={formValues.date}
            onChange={(event) => updateField('date', event.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none focus:border-cyan-500"
          />
        </label>

        <label className="text-sm text-slate-700">
          Amount
          <input
            type="number"
            value={formValues.amount}
            onChange={(event) => updateField('amount', event.target.value)}
            min="1"
            step="1"
            placeholder="5000"
            className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none focus:border-cyan-500"
          />
        </label>

        <label className="text-sm text-slate-700 md:col-span-2">
          Description
          <input
            type="text"
            value={formValues.description}
            onChange={(event) => updateField('description', event.target.value)}
            placeholder="Transaction details"
            className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none focus:border-cyan-500"
          />
        </label>

        <label className="text-sm text-slate-700">
          Category
          <input
            list={datalistId}
            value={formValues.category}
            onChange={(event) => updateField('category', event.target.value)}
            placeholder="Housing"
            className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none focus:border-cyan-500"
          />
          <datalist id={datalistId}>
            {categories.map((category) => (
              <option key={category} value={category} />
            ))}
          </datalist>
        </label>

        <label className="text-sm text-slate-700">
          Type
          <select
            value={formValues.type}
            onChange={(event) => updateField('type', event.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none focus:border-cyan-500"
          >
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </label>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-rose-600">{error || ' '}</p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            {initialValues ? 'Save Changes' : 'Add Transaction'}
          </button>
        </div>
      </div>
    </form>
  )
}

export default TransactionForm
