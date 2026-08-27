import { useState, useMemo } from "react";
import Button from "./ui/Button";
import Card from "./ui/Card";
import Badge from "./ui/Badge";
import SearchInput from "./ui/SearchInput";
import StatusIndicator from "./ui/StatusIndicator";

export function CourseLibrary({
  learningPath = [],
  targetJob,
  onNavigate,
  isOnline = true,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProvider, setSelectedProvider] = useState("All");

  // Extract authentic course recommendations from current learningPath
  const authenticCourses = useMemo(() => {
    const list = [];
    const seen = new Set();

    learningPath.forEach((step) => {
      (step.courses || []).forEach((course) => {
        if (course && course.name && !seen.has(course.name)) {
          seen.add(course.name);
          list.push({
            ...course,
            targetSkill: step.targetSkill,
          });
        }
      });
    });

    return list;
  }, [learningPath]);

  // Extract unique providers for filter chips
  const providers = useMemo(() => {
    return ["All", ...Array.from(new Set(authenticCourses.map((c) => c.provider).filter(Boolean))).sort()];
  }, [authenticCourses]);

  // Filter courses based on search & provider
  const filteredCourses = useMemo(() => {
    return authenticCourses.filter((c) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        c.name.toLowerCase().includes(q) ||
        (c.provider && c.provider.toLowerCase().includes(q)) ||
        (c.targetSkill && c.targetSkill.toLowerCase().includes(q));

      const matchesProvider = selectedProvider === "All" || c.provider === selectedProvider;

      return matchesSearch && matchesProvider;
    });
  }, [authenticCourses, searchQuery, selectedProvider]);

  return (
    <div className="explorer-page">
      {/* 1. PAGE HEADER */}
      <div className="explorer-header-section">
        <div className="explorer-header-left">
          <span className="explorer-eyebrow">KNOWLEDGE DISCOVERY</span>
          <h1 className="explorer-title">Course Library</h1>
          <p className="explorer-description">
            Recommended learning materials and technical courses mapped directly to your active career path missing skills.
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
              placeholder="Search courses by title, provider, or skill..."
            />
          </div>

          {providers.length > 1 && (
            <div className="explorer-filter-chips">
              {providers.map((p) => (
                <button
                  key={p}
                  type="button"
                  className={`explorer-chip-btn ${selectedProvider === p ? "active" : ""}`}
                  onClick={() => setSelectedProvider(p)}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="toolbar-right-meta">
          <span className="count-badge">{filteredCourses.length} Courses Available</span>
        </div>
      </div>

      {/* 3. AUTHENTIC COURSE GRID OR INTENTIONAL EMPTY STATE */}
      {authenticCourses.length === 0 ? (
        <Card variant="subtle" className="explorer-empty-card">
          <div className="empty-content-box">
            <div className="empty-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              </svg>
            </div>
            <h3 className="empty-title">No course recommendations available yet</h3>
            <p className="empty-desc">
              Generate a learning path in the Career Planner for target role <strong style={{ color: "var(--color-cyan-400)" }}>{targetJob || "your selected career"}</strong> to populate your personalized course recommendations library.
            </p>
            <Button
              variant="primary"
              size="md"
              onClick={() => onNavigate && onNavigate("planner")}
            >
              Open Career Planner →
            </Button>
          </div>
        </Card>
      ) : filteredCourses.length === 0 ? (
        <Card variant="subtle" className="explorer-empty-card">
          <div className="empty-content-box">
            <h3 className="empty-title">No Matching Courses</h3>
            <p className="empty-desc">No courses matched your query "{searchQuery}".</p>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setSearchQuery("");
                setSelectedProvider("All");
              }}
            >
              Reset Search
            </Button>
          </div>
        </Card>
      ) : (
        <div className="courses-explorer-grid">
          {filteredCourses.map((c) => {
            const courseUrl = c.url || c.link || c.href;

            return (
              <Card key={c.name} variant="default" className="course-library-card">
                <div className="course-card-top">
                  <div className="course-meta-row">
                    {c.provider && <Badge variant="green" size="sm">{c.provider}</Badge>}
                    {c.level && <Badge variant="neutral" size="sm">{c.level}</Badge>}
                    {c.durationHours && (
                      <span className="course-duration-text">{c.durationHours} Hours</span>
                    )}
                  </div>
                  <h3 className="course-name-heading">{c.name}</h3>
                </div>

                <div className="course-card-middle">
                  <span className="course-target-label">MAPPED SKILL:</span>
                  <Badge variant="violet" size="sm">↳ {c.targetSkill}</Badge>
                </div>

                {courseUrl && (
                  <div className="course-card-bottom">
                    <a
                      href={courseUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="course-link-action"
                    >
                      Open Course →
                    </a>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default CourseLibrary;
