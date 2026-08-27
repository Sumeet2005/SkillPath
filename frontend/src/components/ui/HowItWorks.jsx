import Card from "./Card";

export function HowItWorks() {
  const steps = [
    {
      num: "01",
      title: "Understand Your Skills",
      desc: "Tell SkillPath what you already know. Choose your mastered technical skills or import your current engineering background as your graph origin state.",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z"/>
          <path d="M12 6v6l4 2"/>
        </svg>
      ),
    },
    {
      num: "02",
      title: "Traverse Prerequisite Graph",
      desc: "SkillPath queries Neo4j using Cypher graph traversal algorithms to evaluate prerequisite dependencies, identify skill gaps, and calculate match scores.",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="18" cy="5" r="3"/>
          <circle cx="6" cy="12" r="3"/>
          <circle cx="18" cy="19" r="3"/>
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
        </svg>
      ),
    },
    {
      num: "03",
      title: "Build Shortest Path",
      desc: "Generate a prerequisite-ordered learning sequence that connects your current knowledge state directly to your target software engineering career goal.",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
        </svg>
      ),
    },
  ];

  return (
    <div className="how-it-works-section">
      <div className="how-steps-grid">
        {steps.map((step, idx) => (
          <div key={step.num} className="step-wrapper">
            <Card surface="surface" bordered className="how-step-card">
              <div className="how-step-top">
                <span className="how-step-num">{step.num}</span>
                <div className="how-step-icon-wrap">{step.icon}</div>
              </div>
              <h3 className="how-step-title">{step.title}</h3>
              <p className="how-step-desc">{step.desc}</p>
            </Card>
            {idx < steps.length - 1 && (
              <div className="how-connector-line">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default HowItWorks;
