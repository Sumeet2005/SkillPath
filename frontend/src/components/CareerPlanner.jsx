import { useState, useMemo, useEffect } from "react";
import Button from "./ui/Button";
import Card from "./ui/Card";
import Badge from "./ui/Badge";
import SearchInput from "./ui/SearchInput";
import Select from "./ui/Select";
import ReadinessGauge from "./ReadinessGauge";

export function CareerPlanner({
  jobs = [],
  skills = [],
  categories = [],
  targetJob,
  setTargetJob,
  currentSkills = [],
  toggleSkill,
  clearAllSkills,
  readinessScore = 0,
  masteredRequiredSkills = [],
  missingRequiredSkills = [],
  isGeneratingPath = false,
  handleGeneratePath,
  activeJobDetails,
  plannerStep = 1,
  setPlannerStep,
}) {
  const [prevPlannerStep, setPrevPlannerStep] = useState(plannerStep);
  const [activeStep, setActiveStep] = useState(plannerStep || 1);
  const [skillSearch, setSkillSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Sync active step when plannerStep prop changes during render
  if (plannerStep !== prevPlannerStep) {
    setPrevPlannerStep(plannerStep);
    setActiveStep(plannerStep);
  }

  const reqSkills = activeJobDetails?.requiredSkills || [];

  // Filter skills based on search term and category
  const filteredSkills = useMemo(() => {
    return skills.filter((skill) => {
      const matchesSearch =
        !skillSearch ||
        skill.name.toLowerCase().includes(skillSearch.toLowerCase()) ||
        (skill.category && skill.category.toLowerCase().includes(skillSearch.toLowerCase()));
      const matchesCategory = selectedCategory === "All" || skill.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [skills, skillSearch, selectedCategory]);

  const steps = [
    { num: "01", title: "Target Career", desc: "Select your destination role" },
    { num: "02", title: "Current Skills", desc: "Mark your mastered skills" },
    { num: "03", title: "Readiness & Path", desc: "Evaluate & generate graph path" },
  ];

  const handleStepClick = (stepNum) => {
    setActiveStep(stepNum);
    if (setPlannerStep) setPlannerStep(stepNum);
  };

  // Scroll target section into view when activeStep changes
  useEffect(() => {
    const sectionIds = {
      1: "planner-target-career",
      2: "planner-current-skills",
      3: "planner-readiness",
    };
    const targetId = sectionIds[activeStep] || "planner-target-career";
    const timer = setTimeout(() => {
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 80);
    return () => clearTimeout(timer);
  }, [activeStep]);

  return (
    <div className="planner-page">
      {/* 1. PAGE HEADER & PROGRESS BAR */}
      <div className="planner-header-section">
        <span className="planner-eyebrow">CAREER PLANNER WORKSPACE</span>
        <h1 className="planner-title">Build your software career path.</h1>
        <p className="planner-description">
          Choose your target engineering role and current technical skills to calculate your graph-based readiness and generate your shortest prerequisite learning path.
        </p>

        {/* Progress Indicator Controls */}
        <div className="planner-step-bar">
          {steps.map((step, idx) => {
            const stepNum = idx + 1;
            const isCompleted = stepNum < activeStep;
            const isCurrent = stepNum === activeStep;
            return (
              <button
                key={step.num}
                type="button"
                className={`step-item ${isCurrent ? "current" : isCompleted ? "completed" : ""}`}
                onClick={() => handleStepClick(stepNum)}
                aria-current={isCurrent ? "step" : undefined}
                aria-label={`Step ${step.num}: ${step.title} - ${step.desc}`}
              >
                <div className="step-badge">
                  {isCompleted ? "✓" : step.num}
                </div>
                <div className="step-text">
                  <span className="step-label-title">{step.title}</span>
                  <span className="step-label-desc">{step.desc}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. WORKFLOW SECTIONS */}
      <div className="planner-content-stack">

        {/* STEP 01 — TARGET CAREER */}
        <section
          id="planner-target-career"
          className={`planner-section ${activeStep === 1 ? "active-step-panel" : ""}`}
        >
          <div className="section-title-strip">
            <span className="section-step-tag">STEP 01</span>
            <h2 className="section-heading">Select Target Engineering Career</h2>
          </div>

          <Card surface="surface" bordered className="planner-workspace-card">
            <div className="job-selector-row">
              <div className="job-select-field">
                <Select
                  label="Target Career Destination"
                  value={targetJob}
                  onChange={(e) => setTargetJob(e.target.value)}
                  options={jobs.map((j) => ({ value: j.title, label: j.title }))}
                />
              </div>

              {activeJobDetails && (
                <div className="selected-job-summary-badge">
                  <div className="job-meta-item">
                    <span className="meta-lbl">Industry</span>
                    <span className="meta-val">{activeJobDetails.industry || "Software Engineering"}</span>
                  </div>
                  <div className="job-meta-divider" />
                  <div className="job-meta-item">
                    <span className="meta-lbl">Level</span>
                    <span className="meta-val">{activeJobDetails.level || "Mid–Senior"}</span>
                  </div>
                  <div className="job-meta-divider" />
                  <div className="job-meta-item">
                    <span className="meta-lbl">Required Skills</span>
                    <span className="meta-val highlight-purple">{reqSkills.length} Graph Skills</span>
                  </div>
                </div>
              )}
            </div>

            <div className="popular-roles-block">
              <span className="popular-roles-label">FEATURED DESTINATION ROLES</span>
              <div className="popular-roles-grid">
                {jobs.map((job) => {
                  const isSelected = job.title === targetJob;
                  const reqCount = job.requiredSkills?.length || 0;
                  return (
                    <button
                      key={job.title}
                      type="button"
                      className={`role-option-card ${isSelected ? "selected" : ""}`}
                      onClick={() => setTargetJob(job.title)}
                    >
                      <div className="role-card-header">
                        <span className="role-card-title">{job.title}</span>
                        {isSelected && <span className="role-selected-check">✓</span>}
                      </div>
                      <div className="role-card-meta">
                        <Badge variant={isSelected ? "purple" : "neutral"} size="sm">
                          {job.industry || "Engineering"}
                        </Badge>
                        <span className="role-req-count">{reqCount} Skills</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </Card>

          {activeStep === 1 && (
            <div className="step-nav-footer">
              <span className="step-hint-text">Step 1 of 3: Target Role Configured ({targetJob})</span>
              <Button variant="primary" size="md" onClick={() => handleStepClick(2)}>
                Next: Select Current Skills →
              </Button>
            </div>
          )}
        </section>

        {/* STEP 02 — CURRENT SKILLS */}
        <section
          id="planner-current-skills"
          className={`planner-section ${activeStep === 2 ? "active-step-panel" : ""}`}
        >
          <div className="section-title-strip">
            <span className="section-step-tag">STEP 02</span>
            <h2 className="section-heading">Mark Your Mastered Skills</h2>
          </div>

          {currentSkills.length === 0 && (
            <div className="planner-notice-banner">
              <div className="notice-icon-badge">💡</div>
              <div className="notice-text-content">
                <strong style={{ color: "var(--text-primary)" }}>Target Role Selected: {targetJob}</strong>
                <p style={{ margin: "4px 0 0", fontSize: "13.5px", color: "var(--text-secondary)", lineHeight: "1.4" }}>
                  Select your mastered technical skills below so SkillPath can calculate your personalized career readiness match score and generate your graph prerequisite learning path.
                </p>
              </div>
            </div>
          )}

          <Card surface="surface" bordered className="planner-workspace-card">
            {/* Search & Filter Header */}
            <div className="skills-toolbar">
              <div className="skills-search-wrap">
                <SearchInput
                  value={skillSearch}
                  onChange={(e) => setSkillSearch(e.target.value)}
                  onClear={() => setSkillSearch("")}
                  placeholder="Search technical skills (e.g. Python, Docker, SQL)..."
                />
              </div>

              <div className="skills-selected-status">
                <span className="mastered-count-text">
                  Mastered: <strong>{currentSkills.length}</strong> / {skills.length}
                </span>
                {currentSkills.length > 0 && (
                  <Button variant="ghost" size="sm" onClick={() => clearAllSkills()}>
                    Clear All
                  </Button>
                )}
              </div>
            </div>

            {/* Category Filter Tabs */}
            {categories.length > 1 && (
              <div className="skills-category-bar">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    className={`category-chip-btn ${selectedCategory === cat ? "active" : ""}`}
                    onClick={() => setSelectedCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}

            {/* Skill Selection Grid */}
            <div className="skills-directory-grid">
              {filteredSkills.length === 0 ? (
                <div className="skills-empty-state">
                  <p>No skills match "{skillSearch}". Try another search query or category.</p>
                </div>
              ) : (
                filteredSkills.map((skill) => {
                  const isSelected = currentSkills.includes(skill.name);
                  const isRequiredForTarget = reqSkills.includes(skill.name);
                  return (
                    <button
                      key={skill.name}
                      type="button"
                      className={`skill-selectable-card ${isSelected ? "selected" : ""} ${isRequiredForTarget ? "is-required" : ""}`}
                      onClick={() => toggleSkill(skill.name)}
                    >
                      <div className="skill-card-top">
                        <span className="skill-card-name">{skill.name}</span>
                        <span className={`skill-check-indicator ${isSelected ? "checked" : ""}`}>
                          {isSelected ? "✓" : "+"}
                        </span>
                      </div>
                      <div className="skill-card-bottom">
                        <span className="skill-category-tag">{skill.category || "General"}</span>
                        {isRequiredForTarget && (
                          <Badge variant="cyan" size="sm">Required Role Skill</Badge>
                        )}
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </Card>

          {activeStep === 2 && (
            <div className="step-nav-footer">
              <Button variant="secondary" size="md" onClick={() => handleStepClick(1)}>
                ← Back to Target Role
              </Button>
              <Button variant="primary" size="md" onClick={() => handleStepClick(3)}>
                Next: Evaluate Readiness →
              </Button>
            </div>
          )}
        </section>

        {/* STEP 03 — READINESS & PATH GENERATION */}
        <section
          id="planner-readiness"
          className={`planner-section ${activeStep === 3 ? "active-step-panel" : ""}`}
        >
          <div className="section-title-strip">
            <span className="section-step-tag">STEP 03</span>
            <h2 className="section-heading">Graph Readiness & Path Generation</h2>
          </div>

          <div className="planner-readiness-layout">
            <ReadinessGauge
              targetJob={targetJob}
              currentSkills={currentSkills}
              requiredSkills={reqSkills}
              readinessScore={readinessScore}
              masteredRequiredSkills={masteredRequiredSkills}
              missingRequiredSkills={missingRequiredSkills}
            />

            {/* Primary Action Card */}
            <Card surface="elevated" bordered className="path-generation-action-card">
              <div className="action-card-header">
                <span className="action-eyebrow">NEO4J GRAPH ALGORITHM</span>
                <h3 className="action-title">Generate Prerequisite Traversal</h3>
                <p className="action-description">
                  Computes the shortest Cypher path traversal from your <strong>{currentSkills.length} origin skills</strong> to <strong>{targetJob}</strong>.
                </p>
              </div>

              <div className="action-card-footer">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => handleGeneratePath()}
                  disabled={isGeneratingPath || !targetJob}
                  isLoading={isGeneratingPath}
                  icon={
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                    </svg>
                  }
                >
                  {isGeneratingPath ? "Computing Graph ShortestPath..." : "Build My Learning Path →"}
                </Button>
              </div>
            </Card>
          </div>
        </section>

      </div>
    </div>
  );
}

export default CareerPlanner;
