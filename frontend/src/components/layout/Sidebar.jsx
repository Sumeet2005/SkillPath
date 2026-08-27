import Button from "../ui/Button";
import StatusIndicator from "../ui/StatusIndicator";

export function Sidebar({
  activeTab,
  onTabChange,
  onReset,
  isOnline = true,
  isCollapsed = false,
  mobileOpen = false,
  onCloseMobile,
  hasLearningPath = false,
  onOpenLanding,
}) {
  const navGroups = [
    {
      heading: "OVERVIEW",
      groupId: "overview",
      items: [
        {
          id: "dashboard",
          label: "Dashboard",
          subtitle: "Overview & system metrics",
          icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
            </svg>
          ),
        },
      ],
    },
    {
      heading: "CAREER JOURNEY",
      groupId: "journey",
      items: [
        {
          id: "planner",
          label: "Career Planner",
          subtitle: "Configure target role & skills",
          icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          ),
        },
        {
          id: "roadmap",
          label: "Learning Roadmap",
          subtitle: "Personalized prerequisite sequence",
          badge: hasLearningPath ? "Path Ready" : null,
          icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
          ),
        },
      ],
    },
    {
      heading: "KNOWLEDGE DISCOVERY",
      groupId: "discovery",
      items: [
        {
          id: "graph",
          label: "Knowledge Graph",
          subtitle: "3D WebGL network stage",
          isAdvanced: true,
          icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
            </svg>
          ),
        },
        {
          id: "jobs",
          label: "Career Explorer",
          subtitle: "Explore career requirements",
          icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
            </svg>
          ),
        },
        {
          id: "skills",
          label: "Skill Explorer",
          subtitle: "Explore skill relationships",
          icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          ),
        },
        {
          id: "courses",
          label: "Course Library",
          subtitle: "Explore graph-mapped courses",
          icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
          ),
        },
      ],
    },
  ];

  return (
    <aside
      className={`app-sidebar ${isCollapsed ? "collapsed" : ""} ${
        mobileOpen ? "mobile-open" : ""
      }`}
    >
      {/* Brand Header */}
      <div className="sidebar-brand">
        <div className="sidebar-brand-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
          </svg>
        </div>
        <div className="sidebar-brand-text">
          <h1 className="sidebar-brand-title">SkillPath</h1>
          <span className="sidebar-brand-tagline">AI CAREER KNOWLEDGE GRAPH</span>
        </div>
        {mobileOpen && (
          <button
            type="button"
            className="sidebar-close-btn"
            onClick={onCloseMobile}
            aria-label="Close menu drawer"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="sidebar-nav">
        {navGroups.map((group) => {
          const isGroupActive = group.items.some((item) => item.id === activeTab);
          return (
            <div
              key={group.heading}
              className={`sidebar-nav-group group-${group.groupId} ${
                isGroupActive ? "group-active" : ""
              }`}
            >
              <div className="sidebar-heading-wrap">
                <span className="sidebar-section-heading">{group.heading}</span>
                {isGroupActive && <span className="group-active-indicator" />}
              </div>

              <div
                className={`sidebar-section-items ${
                  group.groupId === "journey" ? "journey-workflow-stack" : ""
                }`}
              >
                {group.items.map((item) => {
                  const isActive = item.id === activeTab;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      className={`sidebar-nav-btn ${isActive ? "active" : ""} ${
                        item.isAdvanced ? "nav-btn-advanced" : ""
                      }`}
                      onClick={() => onTabChange(item.id)}
                      title={isCollapsed ? `${item.label} — ${item.subtitle}` : undefined}
                    >
                      <span className="nav-btn-icon">{item.icon}</span>
                      <div className="nav-btn-text">
                        <div className="nav-btn-label-row">
                          <span className="nav-btn-label">{item.label}</span>
                          {item.badge && <span className="nav-btn-badge">{item.badge}</span>}
                        </div>
                        <span className="nav-btn-subtitle">{item.subtitle}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>

      {/* System Status Footer */}
      <div className="sidebar-system-footer">
        <span className="sidebar-system-heading">SYSTEM CONNECTION</span>
        <StatusIndicator isOnline={isOnline} />
        {onOpenLanding && (
          <Button
            variant="tertiary"
            size="sm"
            onClick={onOpenLanding}
            icon={
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="12 2 2 7 12 12 22 7 12 2" />
                <polyline points="2 17 12 22 22 17" />
                <polyline points="2 12 12 17 22 12" />
              </svg>
            }
          >
            Overview
          </Button>
        )}
        <Button
          variant="tertiary"
          size="sm"
          onClick={onReset}
          icon={
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
            </svg>
          }
        >
          Reset State
        </Button>
      </div>
    </aside>
  );
}

export default Sidebar;
