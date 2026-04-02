function RoleNotice({ role }) {
  const isAdmin = role === 'admin'

  return (
    <section className={`role-banner ${isAdmin ? 'role-banner-admin' : 'role-banner-viewer'}`}>
      <div className="min-w-0">
        <p className="role-kicker">Current Mode</p>
        <h2 className="role-title">{isAdmin ? 'Admin Workspace Enabled' : 'Viewer Read-Only Mode'}</h2>
        <p className="role-description">
          {isAdmin
            ? 'You can add, edit, and manage transactions with full dashboard controls.'
            : 'You can explore all insights and transactions, but editing actions are locked.'}
        </p>
      </div>
      <p className="role-chip w-full text-center sm:w-auto">{isAdmin ? 'Admin Control' : 'Read-Only'}</p>
    </section>
  )
}

export default RoleNotice
