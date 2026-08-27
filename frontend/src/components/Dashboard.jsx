import Button from "./ui/Button";
import Card from "./ui/Card";
import Badge from "./ui/Badge";
import Stat from "./ui/Stat";
import SectionHeader from "./ui/SectionHeader";
import HowItWorks from "./ui/HowItWorks";
import HeroGraph from "./graph/HeroGraph";
import ReadinessGauge from "./ReadinessGauge";

export function Dashboard({
  jobs = [],
  skills = [],
  targetJob,
  setTargetJob,
  currentSkills = [],
  readinessScore = 0,
  masteredRequiredSkills = [],
  missingRequiredSkills = [],
  activeJobDetails,
  onNavigate,
}) {
  const reqSkills = activeJobDetails?.requiredSkills || [];

  return (
    <div className="dashboard-page">
      {/* Hero Workspace Section (Career Transit Metaphor) */}
      <section className="dashboard-hero-banner">
        <div className="banner-left-content">
          <span className="banner-eyebrow">CAREER TRANSIT SYSTEM</span>
          <h1 className="banner-title">
            Your skills are the origin. <br />
            <span className="gradient-violet">Your career is the destination.</span>
          </h1>
          <p className="banner-subtext">
            SkillPath maps software engineering skills inside a Neo4j prerequisite graph to calculate your career readiness score and generate your shortest learning path sequence.
          </p>
          <div className="banner-actions">
            <Button
              variant="primary"
              size="lg"
              onClick={() => onNavigate("planner")}
              icon={
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
              }
            >
              Start Career Planner
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => onNavigate("graph")}
              icon={
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="18" cy="5" r="3" />
                  <circle cx="6" cy="12" r="3" />
                  <circle cx="18" cy="19" r="3" />
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                </svg>
              }
            >
              Explore Knowledge Graph
            </Button>
          </div>
        </div>

        <div className="banner-right-workspace">
          <HeroGraph
            targetJob={targetJob || "Backend Developer"}
            currentSkillsCount={currentSkills.length}
            onNavigate={onNavigate}
          />
        </div>
      </section>

      {/* System Telemetry Strip */}
      <section className="status-telemetry-strip">
        <Stat
          value={skills.length}
          label="Skills Indexed"
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          }
        />
        <div className="telemetry-divider" />
        <Stat
          value={jobs.length}
          label="Career Roles"
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
            </svg>
          }
        />
        <div className="telemetry-divider" />
        <Stat
          value="35+"
          label="Graph Relationships"
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
            </svg>
          }
        />
        <div className="telemetry-divider" />
        <Stat
          value={`${currentSkills.length} Skills`}
          label="Origin Mastered State"
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          }
        />
      </section>

      {/* Analytical Career Readiness Snapshot */}
      <section className="dashboard-section">
        <SectionHeader
          eyebrow="ANALYTICAL READINESS ENGINE"
          title="Career Match Evaluation"
          subtitle="Real-time match scoring and requirement gap analysis computed from your origin skill set."
        />
        {targetJob ? (
          <ReadinessGauge
            targetJob={targetJob}
            currentSkills={currentSkills}
            requiredSkills={reqSkills}
            readinessScore={readinessScore}
            masteredRequiredSkills={masteredRequiredSkills}
            missingRequiredSkills={missingRequiredSkills}
          />
        ) : (
          <Card surface="elevated" bordered className="onboarding-readiness-card">
            <div className="onboarding-card-content">
              <div className="onboarding-icon-wrap">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 8v4" />
                  <path d="M12 16h.01" />
                </svg>
              </div>
              <div className="onboarding-text">
                <h3 className="onboarding-title">No Target Career Selected</h3>
                <p className="onboarding-subtitle">
                  Select a destination engineering role to view graph match scores and missing skill requirements.
                </p>
              </div>
              <Button variant="primary" size="md" onClick={() => onNavigate("planner")}>
                Select Target Career
              </Button>
            </div>
          </Card>
        )}
      </section>

      {/* Featured Career Destinations Grid */}
      <section className="dashboard-section">
        <SectionHeader
          eyebrow="CAREER DIRECTORY"
          title="Featured Software Engineering Roles"
          subtitle="Popular destination careers indexed inside SkillPath graph network."
          action={
            <Button variant="ghost" size="sm" onClick={() => onNavigate("jobs")}>
              View All Roles →
            </Button>
          }
        />
        <div className="featured-jobs-grid">
          {jobs.slice(0, 3).map((job) => {
            const isSelected = job.title === targetJob;
            const reqCount = job.requiredSkills?.length || 0;
            return (
              <Card
                key={job.title}
                surface="surface"
                bordered
                hoverable
                className={`featured-job-card ${isSelected ? "active-target-card" : ""}`}
              >
                <div className="job-card-top">
                  <Badge variant={isSelected ? "purple" : "cyan"} size="sm">
                    {job.industry || "Software Engineering"}
                  </Badge>
                  <span className="job-req-count">{reqCount} Requirements</span>
                </div>
                <h3 className="job-card-title">{job.title}</h3>
                <div className="job-card-bottom">
                  <Button
                    variant={isSelected ? "secondary" : "tertiary"}
                    size="sm"
                    onClick={() => {
                      setTargetJob(job.title);
                      onNavigate("planner");
                    }}
                  >
                    {isSelected ? "Active Destination ✓" : "Set Target Destination"}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* How SkillPath Thinks Section */}
      <section className="dashboard-section">
        <SectionHeader
          eyebrow="CAREER TRANSIT ENGINE"
          title="How SkillPath Thinks"
          subtitle="Three steps connecting your current skills to your target career goal."
        />
        <HowItWorks />
      </section>

      {/* Application Footer */}
      <footer className="app-footer">
        <div className="footer-container">
          <div className="footer-brand">
            <span className="footer-logo">SkillPath AI</span>
            <span className="footer-dot">•</span>
            <span className="footer-desc">AI Career Knowledge Graph Platform</span>
          </div>
          <div className="footer-tech-stack">
            <span>Neo4j Graph Database</span>
            <span>Cypher ShortestPath</span>
            <span>React 19</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Dashboard;
