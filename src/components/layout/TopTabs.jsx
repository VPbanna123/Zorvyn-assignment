const tabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'transactions', label: 'Transactions' },
  { id: 'insights', label: 'Insights' },
  { id: 'workspace', label: 'Workspace' },
]

function TopTabs({ activeTab, setActiveTab, role }) {
  return (
    <nav className="tab-shell no-scrollbar overflow-x-auto" aria-label="Dashboard sections">
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab
        const isLocked = tab.id === 'workspace' && role !== 'admin'

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            disabled={isLocked}
            className={`tab-pill shrink-0 ${isActive ? 'is-active' : ''}`}
            aria-current={isActive ? 'page' : undefined}
          >
            <span>{tab.label}</span>
            {isLocked ? <span className="tab-lock">Locked</span> : null}
          </button>
        )
      })}
    </nav>
  )
}

export default TopTabs
