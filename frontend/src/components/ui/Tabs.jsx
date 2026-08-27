export function Tabs({
  tabs = [], // [{ id, label, badge }]
  activeTab,
  onTabChange,
  className = "",
}) {
  return (
    <div className={`sp-tabs-container ${className}`}>
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            type="button"
            className={`sp-tab-btn ${isActive ? "active" : ""}`}
            onClick={() => onTabChange(tab.id)}
          >
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span className="sp-tab-badge">{tab.badge}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export default Tabs;
