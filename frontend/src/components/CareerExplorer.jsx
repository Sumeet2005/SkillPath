import { useState, useMemo } from "react";
import Button from "./ui/Button";
import Card from "./ui/Card";
import Badge from "./ui/Badge";
import SearchInput from "./ui/SearchInput";
import StatusIndicator from "./ui/StatusIndicator";

export function CareerExplorer({
  jobs = [],
  targetJob,
  setTargetJob,
  onNavigate,
  onPlanCareer,
  isOnline = true,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("All");

  // Extract unique levels for filter chips
  const levels = useMemo(() => {
    return ["All", ...Array.from(new Set(jobs.map((j) => j.level).filter(Boolean))).sort()];
  }, [jobs]);

  // Filter jobs based on search query & selected level
  const filteredJobs = useMemo(() => {
    return jobs.filter((j) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        j.title.toLowerCase().includes(q) ||
        (j.industry && j.industry.toLowerCase().includes(q)) ||
        (j.requiredSkills && j.requiredSkills.some((s) => s.toLowerCase().includes(q)));

      const matchesLevel = selectedLevel === "All" || j.level === selectedLevel;

      return matchesSearch && matchesLevel;
    });
  }, [jobs, searchQuery, selectedLevel]);

  const handleCardAction = (jobTitle) => {
    if (onPlanCareer) {
      onPlanCareer(jobTitle);
    } else {
      setTargetJob(jobTitle);
      if (onNavigate) onNavigate("planner");
    }
  };

  return (
    <div className="explorer-page">
      {/* 1. PAGE HEADER */}
      <div className="explorer-header-section">
        <div className="explorer-header-left">
          <span className="explorer-eyebrow">KNOWLEDGE DISCOVERY</span>
          <h1 className="explorer-title">Career Explorer</h1>
          <p className="explorer-description">
            Explore indexed software engineering career paths, required skill graph profiles, and target role specifications.
          </p>
        </div>
        <div className="explorer-header-right">
          <StatusIndicator isOnline={isOnline} />
        </div>
      </div>

      {/* 2. TOOLBAR & FILTERS */}
      <div className="explorer-toolbar-strip">
        <div className="toolbar-left-controls">
          <div className="explorer-search-wrap">
            <SearchInput
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onClear={() => setSearchQuery("")}
              placeholder="Search careers by title, industry, or skill..."
            />
          </div>

          <div className="explorer-filter-chips">
            {levels.map((lvl) => (
              <button
                key={lvl}
                type="button"
                className={`explorer-chip-btn ${selectedLevel === lvl ? "active" : ""}`}
                onClick={() => setSelectedLevel(lvl)}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

        <div className="toolbar-right-meta">
          <span className="count-badge">{filteredJobs.length} Careers Found</span>
        </div>
      </div>

      {/* 3. CAREER DIRECTORY GRID */}
      {filteredJobs.length === 0 ? (
        <Card variant="subtle" className="explorer-empty-card">
          <div className="empty-content-box">
            <div className="empty-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>
            <h3 className="empty-title">No Careers Found</h3>
            <p className="empty-desc">
              No career paths matched "{searchQuery}". Try clearing your search query or switching filters.
            </p>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setSearchQuery("");
                setSelectedLevel("All");
              }}
            >
              Clear Search Filters
            </Button>
          </div>
        </Card>
      ) : (
        <div className="explorer-cards-grid">
          {filteredJobs.map((job) => {
            const isSelectedTarget = job.title === targetJob;
            const requiredSkills = job.requiredSkills || [];

            return (
              <Card
                key={job.title}
                variant={isSelectedTarget ? "highlight" : "default"}
                className="career-explorer-card"
              >
                <div className="career-card-top">
                  <div className="career-card-header">
                    <div>
                      <div className="career-badges-row">
                        {job.level && <Badge variant="neutral" size="sm">{job.level}</Badge>}
                        {job.industry && <Badge variant="cyan" size="sm">{job.industry}</Badge>}
                        {isSelectedTarget && <Badge variant="violet" size="sm">✓ Active Target</Badge>}
                      </div>
                      <h3 className="career-card-title">{job.title}</h3>
                    </div>
                  </div>
                </div>

                <div className="career-card-body">
                  <span className="skills-section-label">REQUIRED SKILLS ({requiredSkills.length})</span>
                  <div className="career-skills-chips">
                    {requiredSkills.slice(0, 6).map((sk) => (
                      <Badge key={sk} variant="violet" size="sm">
                        {sk}
                      </Badge>
                    ))}
                    {requiredSkills.length > 6 && (
                      <Badge variant="neutral" size="sm">
                        +{requiredSkills.length - 6} more
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="career-card-footer">
                  <Button
                    variant={isSelectedTarget ? "secondary" : "primary"}
                    size="sm"
                    fullWidth
                    onClick={() => handleCardAction(job.title)}
                  >
                    {isSelectedTarget ? "Active Target Role (Open Plan →)" : "Plan This Career →"}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default CareerExplorer;
