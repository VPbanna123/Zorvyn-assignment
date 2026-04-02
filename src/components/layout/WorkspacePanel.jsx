function WorkspacePanel({
  role,
  transactionCount,
  onReset,
  onClear,
  onExportJson,
  onExportCsv,
  onSyncMockApi,
  syncStatus,
  syncMessage,
  lastSyncedAt,
}) {
  if (role !== 'admin') {
    return (
      <section className="rounded-2xl border border-amber-200 bg-amber-50 p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">Workspace Access</p>
        <h2 className="mt-2 text-2xl font-bold text-amber-900">Admin-only workspace</h2>
        <p className="mt-2 max-w-2xl text-sm text-amber-800">
          Switch your role to <strong>Admin</strong> to access dataset management actions like reset, clear, and export.
        </p>
      </section>
    )
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Admin Workspace</p>
      <h2 className="mt-2 text-2xl font-bold text-slate-900">Manage dashboard dataset safely</h2>
      <p className="mt-2 text-sm text-slate-600">
        Use these controls to test edge-cases and demonstrate strong product behavior for evaluation.
      </p>

      <div className="mt-5 grid gap-4 md:grid-cols-3">
        <article className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm font-medium text-slate-700">Current dataset</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{transactionCount}</p>
          <p className="text-sm text-slate-500">transactions</p>
        </article>

        <article className="rounded-xl border border-slate-200 bg-slate-50 p-4 md:col-span-2">
          <p className="text-sm font-medium text-slate-700">Quick actions</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={onReset}
              className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
            >
              Reset Demo Data
            </button>
            <button
              type="button"
              onClick={onExportJson}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              Export JSON
            </button>
            <button
              type="button"
              onClick={onExportCsv}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              Export CSV
            </button>
            <button
              type="button"
              onClick={onSyncMockApi}
              disabled={syncStatus === 'syncing'}
              className="rounded-lg border border-cyan-300 bg-cyan-50 px-3 py-2 text-sm font-semibold text-cyan-700 transition hover:bg-cyan-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {syncStatus === 'syncing' ? 'Syncing...' : 'Sync Mock API'}
            </button>
            <button
              type="button"
              onClick={onClear}
              className="rounded-lg border border-rose-300 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-100"
            >
              Clear All
            </button>
          </div>
          {syncMessage ? (
            <p
              className={`mt-3 text-sm ${
                syncStatus === 'error'
                  ? 'text-rose-600'
                  : syncStatus === 'success'
                    ? 'text-emerald-600'
                    : 'text-slate-600'
              }`}
            >
              {syncMessage}
            </p>
          ) : null}
          {lastSyncedAt ? (
            <p className="mt-1 text-xs text-slate-500">Last synced: {new Date(lastSyncedAt).toLocaleString('en-IN')}</p>
          ) : null}
        </article>
      </div>
    </section>
  )
}

export default WorkspacePanel
