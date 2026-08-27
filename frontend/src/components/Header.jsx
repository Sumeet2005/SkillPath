import Button from "./ui/Button";
import StatusIndicator from "./ui/StatusIndicator";

export function Header({
  activeTab = "dashboard",
  targetJob,
  onReset,
  isOnline = true,
  onToggleMenu,
  isCollapsed = false,
}) {
  const pageTitles = {
    landing: {
      title: "3D Product Overview & Landing",
      desc: "Interactive overview of the SkillPath AI Career Knowledge Graph platform.",
    },
    dashboard: {
      title: "Dashboard Command Center",
      desc: "Overview of your target career, graph readiness, and skill transit metrics.",
    },
    planner: {
      title: "Career Planner Workspace",
      desc: "Select target career destination and tell SkillPath your mastered skills.",
    },
    roadmap: {
      title: "Learning Roadmap Timeline",
      desc: "Shortest prerequisite learning path sequence generated from Neo4j graph traversal.",
    },
    graph: {
      title: "Knowledge Graph Workspace",
      desc: "Explore indexed technical skills, prerequisite relationships, and career dependencies.",
    },
    jobs: {
      title: "Career Explorer Directory",
      desc: "Discover software engineering roles, industry sectors, and required skills.",
    },
    skills: {
      title: "Skill Explorer Directory",
      desc: "Inspect technical skills, category classifications, and prerequisites.",
    },
    courses: {
      title: "Technical Course Library",
      desc: "Curated technical learning resources recommended for your skill gaps.",
    },
  };

  const currentInfo = pageTitles[activeTab] || pageTitles.dashboard;

  return (
    <header className="app-header">
      <div className="header-container">
        {/* Left Page Context & Menu Toggle */}
        <div className="header-left-group" style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <button
            type="button"
            className="menu-toggle-btn mobile-menu-btn"
            onClick={onToggleMenu}
            aria-label="Toggle navigation menu"
            title={isCollapsed ? "Expand Navigation Sidebar" : "Collapse Navigation Sidebar"}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>

          <div className="header-page-context">
            <span className="page-context-eyebrow">SKILLPATH PLATFORM</span>
            <div className="page-context-title-group">
              <h2 className="page-context-title">{currentInfo.title}</h2>
              {targetJob && activeTab !== "dashboard" && (
                <span className="page-context-desc">• Target: {targetJob}</span>
              )}
            </div>
          </div>
        </div>

        {/* Right Header Actions & Status */}
        <div className="header-actions">
          <StatusIndicator isOnline={isOnline} />
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            icon={
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                <path d="M3 3v5h5" />
              </svg>
            }
          >
            Reset
          </Button>
        </div>
      </div>
    </header>
  );
}

export default Header;
