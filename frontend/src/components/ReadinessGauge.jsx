import { useState } from "react";
import Card from "./ui/Card";
import Badge from "./ui/Badge";
import Button from "./ui/Button";

export function ReadinessGauge({
  targetJob,
  currentSkills = [],
  requiredSkills = [],
  readinessScore = 0,
  masteredRequiredSkills = [],
  missingRequiredSkills = [],
}) {
  const [showAllMissing, setShowAllMissing] = useState(false);

  if (!targetJob || requiredSkills.length === 0) {
    return (
      <Card surface="elevated" bordered className="readiness-gauge-card empty">
        <div className="gauge-header">
          <span className="gauge-title">CAREER READINESS SCORE</span>
        </div>
        <p className="gauge-placeholder-text">
          Select a target job and current skills in the planner to evaluate your graph-based readiness score.
        </p>
      </Card>
    );
  }

  const known = masteredRequiredSkills.length > 0 ? masteredRequiredSkills : requiredSkills.filter((s) => currentSkills.includes(s));
  const missing = missingRequiredSkills.length > 0 ? missingRequiredSkills : requiredSkills.filter((s) => !currentSkills.includes(s));
  const scorePercent = readinessScore > 0 ? readinessScore : Math.round((known.length / requiredSkills.length) * 100);

  const displayedMissing = showAllMissing ? missing : missing.slice(0, 4);

  let badgeVariant = "cyan";
  let statusText = "Needs Learning Path";
  if (scorePercent >= 100) {
    badgeVariant = "green";
    statusText = "Fully Qualified";
  } else if (scorePercent >= 60) {
    badgeVariant = "purple";
    statusText = "Moderate Readiness";
  } else if (scorePercent >= 30) {
    badgeVariant = "amber";
    statusText = "Early Progress";
  }

  return (
    <Card surface="surface" bordered className="readiness-gauge-card">
      <div className="gauge-header">
        <div>
          <span className="gauge-title">CAREER READINESS EVALUATION</span>
          <h3 className="gauge-role-name">{targetJob}</h3>
        </div>
        <Badge variant={badgeVariant} size="md">
          {statusText}
        </Badge>
      </div>

      <div className="gauge-main-row">
        <div className="gauge-meter-wrapper">
          <svg className="gauge-svg" viewBox="0 0 100 100">
            <defs>
              <linearGradient id="purpleGaugeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#a855f7" />
              </linearGradient>
            </defs>
            <circle
              className="gauge-bg-circle"
              cx="50"
              cy="50"
              r="40"
              strokeWidth="9"
              fill="none"
            />
            <circle
              className="gauge-fill-circle"
              cx="50"
              cy="50"
              r="40"
              strokeWidth="9"
              fill="none"
              stroke="url(#purpleGaugeGrad)"
              strokeDasharray={251.2}
              strokeDashoffset={251.2 - (251.2 * scorePercent) / 100}
              strokeLinecap="round"
              transform="rotate(-90 50 50)"
            />
          </svg>
          <div className="gauge-center-text">
            <span className="gauge-score-value">{scorePercent}%</span>
            <span className="gauge-score-sub">Match</span>
          </div>
        </div>

        <div className="gauge-details">
          <div className="gauge-stat-box">
            <span className="stat-num">{known.length} of {requiredSkills.length}</span>
            <span className="stat-text">Required Graph Skills Mastered</span>
          </div>

          <div className="skill-breakdown-lists">
            {known.length > 0 && (
              <div className="breakdown-group">
                <span className="breakdown-label known">✓ Mastered Required Skills ({known.length})</span>
                <div className="breakdown-chips">
                  {known.map((skill) => (
                    <Badge key={skill} variant="green" size="sm">{skill}</Badge>
                  ))}
                </div>
              </div>
            )}

            {missing.length > 0 && (
              <div className="breakdown-group">
                <span className="breakdown-label missing">⚡ Target Missing Skills ({missing.length})</span>
                <div className="breakdown-chips">
                  {displayedMissing.map((skill) => (
                    <Badge key={skill} variant="red" size="sm">{skill}</Badge>
                  ))}
                </div>
                {missing.length > 4 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAllMissing(!showAllMissing)}
                    className="missing-skills-toggle-btn"
                  >
                    {showAllMissing ? "Show Top 4 Missing ↑" : `View all ${missing.length} missing skills →`}
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

export default ReadinessGauge;
