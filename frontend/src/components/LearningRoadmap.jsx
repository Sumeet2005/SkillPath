import Button from "./ui/Button";
import Card from "./ui/Card";
import Badge from "./ui/Badge";

export function LearningRoadmap({
  targetJob,
  currentSkills = [],
  learningPath = [],
  readinessScore = 0,
  masteredRequiredSkills = [],
  activeJobDetails,
  onNavigate,
}) {
  const reqSkills = activeJobDetails?.requiredSkills || [];

  // Calculate total course duration across unique courses in path
  const uniqueCoursesMap = new Map();
  learningPath.forEach((step) => {
    (step.courses || []).forEach((c) => {
      if (c && c.name && !uniqueCoursesMap.has(c.name)) {
        uniqueCoursesMap.set(c.name, c);
      }
    });
  });

  const totalCourseHours = Array.from(uniqueCoursesMap.values()).reduce(
    (acc, c) => acc + (c.durationHours || 0),
    0
  );

  const hasPathData = learningPath.length > 0;

  return (
    <div className="roadmap-page">
      {/* 1. PAGE HEADER */}
      <div className="roadmap-header-section">
        <div className="roadmap-header-left">
          <span className="roadmap-eyebrow">LEARNING ROADMAP WORKSPACE</span>
          <h1 className="roadmap-title">Your Skill Transformation Path</h1>
          <p className="roadmap-description">
            Sequential prerequisite learning sequence calculated from Neo4j shortestPath traversal. Unlocks your target career destination.
          </p>
        </div>

        {targetJob && (
          <div className="roadmap-header-right">
            <div className="compact-target-badge">
              <span className="compact-lbl">TARGET ROLE</span>
              <span className="compact-val">{targetJob}</span>
            </div>
            <div className="compact-score-badge">
              <span className="compact-lbl">MATCH SCORE</span>
              <span className="compact-score-val">{readinessScore}%</span>
            </div>
          </div>
        )}
      </div>

      {/* 2. PATH SUMMARY TELEMETRY STRIP */}
      {targetJob && (
        <div className="roadmap-telemetry-strip">
          <div className="roadmap-stat-item">
            <span className="stat-lbl">Target Role</span>
            <span className="stat-val highlight-violet">{targetJob}</span>
          </div>
          <div className="roadmap-stat-divider" />
          <div className="roadmap-stat-item">
            <span className="stat-lbl">Readiness Score</span>
            <span className="stat-val highlight-cyan">{readinessScore}% Match</span>
          </div>
          <div className="roadmap-stat-divider" />
          <div className="roadmap-stat-item">
            <span className="stat-lbl">Mastered Skills</span>
            <span className="stat-val text-green">{masteredRequiredSkills.length} / {reqSkills.length}</span>
          </div>
          <div className="roadmap-stat-divider" />
          <div className="roadmap-stat-item">
            <span className="stat-lbl">Prerequisite Steps</span>
            <span className="stat-val">{learningPath.length} Milestones</span>
          </div>
          <div className="roadmap-stat-divider" />
          <div className="roadmap-stat-item">
            <span className="stat-lbl">Est. Duration</span>
            <span className="stat-val">{totalCourseHours} Hours</span>
          </div>
        </div>
      )}

      {/* 3. MAIN ROADMAP CONTENT */}
      {!hasPathData ? (
        /* Empty State */
        <Card surface="surface" bordered className="roadmap-empty-card">
          <div className="empty-card-content">
            <div className="empty-icon-circle">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
            </div>
            <h3 className="empty-card-title">No Active Learning Path Generated</h3>
            <p className="empty-card-desc">
              Select your target career role and mark your current mastered skills in the Career Planner to construct your dynamic graph prerequisite roadmap.
            </p>
            <Button
              variant="primary"
              size="lg"
              onClick={() => onNavigate && onNavigate("planner")}
            >
              Open Career Planner →
            </Button>
          </div>
        </Card>
      ) : (
        /* Milestone Prerequisite Timeline */
        <div className="roadmap-timeline-wrapper">
          <div className="timeline-header-strip">
            <h2 className="timeline-section-title">Prerequisite Learning Sequence</h2>
            <div className="timeline-header-actions">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onNavigate && onNavigate("planner")}
              >
                Reconfigure Planner
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigate && onNavigate("graph")}
              >
                Explore Knowledge Graph →
              </Button>
            </div>
          </div>

          <div className="timeline-nodes-list">
            {/* Origin Skills Node */}
            <div className="timeline-node-item origin-node">
              <div className="timeline-marker">
                <span className="marker-dot cyan-glow" />
                <div className="marker-line" />
              </div>
              <Card surface="surface" bordered className="milestone-card origin-card">
                <div className="milestone-badge-row">
                  <Badge variant="cyan" size="sm">ORIGIN STATE</Badge>
                  <span className="milestone-step-lbl">Current Mastered Skills</span>
                </div>
                <h3 className="milestone-skill-name">
                  {currentSkills.length} Skills Mastered
                </h3>
                <div className="origin-chips-wrap">
                  {currentSkills.slice(0, 8).map((skill) => (
                    <Badge key={skill} variant="neutral" size="sm">✓ {skill}</Badge>
                  ))}
                  {currentSkills.length > 8 && (
                    <span className="more-skills-tag">+{currentSkills.length - 8} more</span>
                  )}
                </div>
              </Card>
            </div>

            {/* Path Steps */}
            {learningPath.map((step, idx) => {
              const stepNum = String(idx + 1).padStart(2, "0");
              const hasCourses = step.courses && step.courses.length > 0;
              const isLastStep = idx === learningPath.length - 1;

              // Safely format prerequisites: split comma strings & clean items
              const rawPrereqs = Array.isArray(step.prerequisites)
                ? step.prerequisites
                : step.prerequisites
                ? [step.prerequisites]
                : [];
              const prereqList = Array.from(
                new Set(
                  rawPrereqs
                    .flatMap((p) => (typeof p === "string" ? p.split(",") : [p]))
                    .map((p) => (typeof p === "string" ? p.trim() : String(p)))
                    .filter((p) => p && p !== "I" && p !== step.targetSkill)
                )
              );

              return (
                <div key={step.targetSkill} className="timeline-node-item step-node">
                  <div className="timeline-marker">
                    <span className="marker-badge">{stepNum}</span>
                    {!isLastStep && <div className="marker-line" />}
                  </div>

                  <Card surface="surface" bordered className="milestone-card">
                    {/* Milestone Top Info */}
                    <div className="milestone-card-top">
                      <div className="milestone-title-group">
                        <div className="milestone-step-header">
                          <span className="step-tag">MILESTONE {stepNum}</span>
                          <Badge variant="purple" size="sm">Graph Hop {step.hops}</Badge>
                        </div>
                        <h3 className="milestone-skill-name">{step.targetSkill}</h3>
                      </div>
                      <Badge variant="amber" size="md">Required Skill Gap</Badge>
                    </div>

                    {/* Prerequisites Requirement */}
                    {prereqList.length > 0 && (
                      <div className="milestone-prereqs-block">
                        <span className="prereq-block-label">DIRECT PREREQUISITES</span>
                        <div className="prereq-chips-row">
                          {prereqList.map((prereq) => (
                            <Badge key={prereq} variant="violet" size="sm">
                              ↳ {prereq}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Course Recommendations */}
                    {hasCourses && (
                      <div className="milestone-courses-block">
                        <span className="courses-block-label">RECOMMENDED LEARNING COURSES</span>
                        <div className="courses-grid">
                          {step.courses.map((course, cIdx) => {
                            const courseUrl = course.url || course.link || course.href;
                            return (
                              <div key={`${course.name}-${cIdx}`} className="course-recommend-card">
                                <div className="course-card-top">
                                  <span className="course-provider-tag">{course.provider || "Partner Course"}</span>
                                  <span className="course-duration-tag">{course.durationHours} Hours</span>
                                </div>
                                <h4 className="course-title">{course.name}</h4>
                                <div className="course-card-bottom">
                                  <Badge variant="neutral" size="sm">{course.level || "Intermediate"}</Badge>
                                  {courseUrl && (
                                    <a
                                      href={courseUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="course-link-action"
                                    >
                                      Open Course →
                                    </a>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </Card>
                </div>
              );
            })}

            {/* Target Job Destination Node */}
            <div className="timeline-node-item target-node">
              <div className="timeline-marker">
                <span className="marker-dot purple-glow" />
              </div>
              <Card surface="elevated" bordered className="milestone-card target-card compact-target-card">
                <div className="milestone-badge-row">
                  <Badge variant="purple" size="sm">DESTINATION GOAL</Badge>
                  <span className="milestone-step-lbl">Career Match Destination</span>
                </div>
                <h3 className="milestone-skill-name">{targetJob}</h3>
                <p className="target-node-desc">
                  Completing this prerequisite path unlocks full graph qualification for {targetJob}.
                </p>
              </Card>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LearningRoadmap;
