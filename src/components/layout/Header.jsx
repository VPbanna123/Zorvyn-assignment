function Header({ role, setRole, totalTransactions, theme, onToggleTheme }) {
  const isDark = theme === 'dark'

  return (
    <header
      className={`relative overflow-hidden rounded-3xl p-6 shadow-xl backdrop-blur md:p-8 ${
        isDark ? 'border-slate-700/70 bg-slate-900/70' : 'border-white/60 bg-white/70'
      }`}
    >
      <div className="pointer-events-none absolute -right-14 -top-20 h-44 w-44 rounded-full bg-emerald-200/60 blur-2xl" />
      <div className="pointer-events-none absolute -left-8 bottom-0 h-36 w-36 rounded-full bg-cyan-200/70 blur-2xl" />

      <div className="relative flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0">
          <p className={`text-xs font-semibold uppercase tracking-[0.22em] ${isDark ? 'text-slate-300' : 'text-slate-500'}`}>
            Finance Command Center
          </p>
          <h1 className={`mt-2 text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl ${isDark ? 'text-slate-50' : 'text-slate-900'}`}>
            Personal Finance Dashboard
          </h1>
          <p className={`mt-2 max-w-2xl text-sm md:text-base ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            Monitor cash flow, track spending patterns, and act on insights with role-based controls.
          </p>
        </div>

        <div className="flex w-full flex-col items-start gap-3 sm:items-end md:w-auto">
          <button
            type="button"
            onClick={onToggleTheme}
            className={`flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-[0.08em] shadow-sm transition ${
              isDark
                ? 'border border-slate-600 bg-slate-800/90 text-slate-100 hover:bg-slate-700'
                : 'border border-slate-400/45 bg-white/90 text-slate-700 hover:bg-white'
            }`}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            <img
              src={isDark ? '/sun.svg' : '/moon.svg'}
              alt={isDark ? 'Sun icon' : 'Moon icon'}
              className="h-4 w-4"
            />
            {isDark ? 'Light Mode' : 'Dark Mode'}
          </button>

          <div className="inline-flex max-w-full items-center gap-3 rounded-2xl bg-slate-900 px-4 py-3 shadow-lg">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-300">
              Active Role
            </p>
            <select
              value={role}
              onChange={(event) => setRole(event.target.value)}
              className="mt-1 w-[120px] rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-sm font-semibold capitalize text-white outline-none transition focus:border-cyan-300"
              aria-label="Select role"
            >
              <option value="viewer">viewer</option>
              <option value="admin">admin</option>
            </select>
          </div>
          <div className="h-10 w-px shrink-0 bg-slate-700" />
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-300">Entries</p>
            <p className="text-xl font-bold text-white">{totalTransactions}</p>
          </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
