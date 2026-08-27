import { useState, useMemo } from "react";
import Button from "./ui/Button";
import Card from "./ui/Card";
import Badge from "./ui/Badge";
import SearchInput from "./ui/SearchInput";
import StatusIndicator from "./ui/StatusIndicator";

export function SkillExplorer({
  skills = [],
  categories = [],
  currentSkills = [],
  toggleSkill,
  onNavigate,
  isOnline = true,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCat, setSelectedCat] = useState("All");
  const [masteredOnly, setMasteredOnly] = useState(false);

  // Filter skills based on search query, category, and mastered state
  const filteredSkills = useMemo(() => {
    return skills.filter((s) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        s.name.toLowerCase().includes(q) ||
        (s.category && s.category.toLowerCase().includes(q));

      const matchesCat = selectedCat === "All" || s.category === selectedCat;
      const matchesMastered = !masteredOnly || currentSkills.includes(s.name);

      return matchesSearch && matchesCat && matchesMastered;
    });
  }, [skills, searchQuery, selectedCat, masteredOnly, currentSkills]);

  return (
    <div className="explorer-page">
      {/* 1. PAGE HEADER */}
      <div className="explorer-header-section">
        <div className="explorer-header-left">
          <span className="explorer-eyebrow">KNOWLEDGE DISCOVERY</span>
          <h1 className="explorer-title">Skill Explorer</h1>
          <p className="explorer-description">
            Browse the index of software engineering skills, track your mastered competencies, and build career readiness.
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
              placeholder="Search skills by name or category..."
            />
          </div>

          <div className="explorer-filter-chips">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`explorer-chip-btn ${selectedCat === cat ? "active" : ""}`}
                onClick={() => setSelectedCat(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="toolbar-right-meta">
          <button
            type="button"
            className={`mastered-toggle-btn ${masteredOnly ? "active" : ""}`}
            onClick={() => setMasteredOnly(!masteredOnly)}
          >
            {masteredOnly ? "Show All Skills" : "Filter Mastered"}
          </button>
          <span className="count-badge">
            {currentSkills.length} / {skills.length} Mastered
          </span>
        </div>
      </div>

      {/* 3. SKILLS DIRECTORY GRID */}
      {filteredSkills.length === 0 ? (
        <Card variant="subtle" className="explorer-empty-card">
          <div className="empty-content-box">
            <div className="empty-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </div>
            <h3 className="empty-title">No Skills Found</h3>
            <p className="empty-desc">
              No skill entries matched your search criteria. Try adjusting your filters.
            </p>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setSearchQuery("");
                setSelectedCat("All");
                setMasteredOnly(false);
              }}
            >
              Reset Filters
            </Button>
          </div>
        </Card>
      ) : (
        <div className="skills-explorer-grid">
          {filteredSkills.map((sk) => {
            const isMastered = currentSkills.includes(sk.name);

            return (
              <Card
                key={sk.name}
                variant={isMastered ? "highlight" : "default"}
                className="skill-explorer-card"
              >
                <div className="skill-card-header">
                  <div className="skill-meta-row">
                    {sk.category && <Badge variant="violet" size="sm">{sk.category}</Badge>}
                    <Badge variant={isMastered ? "green" : "neutral"} size="sm">
                      {isMastered ? "✓ Mastered" : "Not Mastered"}
                    </Badge>
                  </div>
                  <h3 className="skill-card-name">{sk.name}</h3>
                </div>

                <div className="skill-card-actions">
                  <Button
                    variant={isMastered ? "secondary" : "primary"}
                    size="sm"
                    fullWidth
                    onClick={() => toggleSkill(sk.name)}
                  >
                    {isMastered ? "Mark Unmastered" : "+ Mark as Mastered"}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* 4. BOTTOM ACTION STRIP */}
      <div className="explorer-bottom-cta">
        <div className="cta-text">
          <h4>Ready to generate a prerequisite learning roadmap?</h4>
          <p>Use your {currentSkills.length} mastered skills to calculate target career match readiness.</p>
        </div>
        <Button
          variant="primary"
          size="md"
          onClick={() => onNavigate && onNavigate("planner")}
        >
          Build Career Learning Path →
        </Button>
      </div>
    </div>
  );
}

export default SkillExplorer;
