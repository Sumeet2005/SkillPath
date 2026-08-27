import { useState, lazy, Suspense } from "react";
import Button from "./ui/Button";
import Card from "./ui/Card";
import Badge from "./ui/Badge";
import SectionHeader from "./ui/SectionHeader";
import StatusIndicator from "./ui/StatusIndicator";

// Lazy-load Ambient 3D WebGL Background Canvas
const Ambient3DCanvas = lazy(() => import("./graph/Ambient3DCanvas"));

export function LandingPage({
  targetJob,
  onNavigate,
  onPlanCareer,
  isOnline = true,
}) {
  const [activeHeroStage, setActiveHeroStage] = useState(2);
  const [activeWorkflowStage, setActiveWorkflowStage] = useState(3);
  const [activeRelType, setActiveRelType] = useState("requires");
  const [activeTechCategory, setActiveTechCategory] = useState("all");
  const [activeArchLayer, setActiveArchLayer] = useState("cypher");
  const [activeTechItem, setActiveTechItem] = useState("Neo4j");

  // 1. Hero 3D Spatial Visualization Stages
  const heroStages = [
    {
      id: "skills",
      num: "01",
      label: "SKILLS",
      title: "Origin Skill Profile",
      desc: "Mastered technical competencies recorded as candidate origin nodes in Neo4j.",
      accent: "cyan",
    },
    {
      id: "engine",
      num: "02",
      label: "GRAPH ENGINE",
      title: "Neo4j Cypher Traversal",
      desc: "Variable-length pattern matching (-[:PREREQUISITE_OF*1..10]->) executing in graph memory.",
      accent: "purple",
    },
    {
      id: "prereqs",
      num: "03",
      label: "PREREQUISITES",
      title: "shortestPath() Algorithm",
      desc: "Identifies foundational skill dependencies required before advanced topics can be learned.",
      accent: "violet",
    },
    {
      id: "career",
      num: "04",
      label: "CAREER",
      title: "Destination Readiness",
      desc: "Calculates overall role match percentage and maps step-by-step course recommendations.",
      accent: "green",
    },
  ];

  // 2. 5-Step Workflow Stages
  const workflowStages = [
    {
      num: "01",
      title: "Current Skills",
      sub: "What you already know",
      desc: "Select the technical skills you already know across 41 indexed technologies (e.g. Python, Docker, SQL, REST APIs).",
      tag: "ORIGIN PROFILE",
    },
    {
      num: "02",
      title: "Target Career",
      sub: "Choose the role you want",
      desc: "Choose the engineering role you want to reach from 15 destination roles (e.g. Generative AI Engineer, Backend Developer).",
      tag: "ROLE SELECTION",
    },
    {
      num: "03",
      title: "Neo4j Graph Analysis",
      sub: "Evaluates relationships",
      desc: "Neo4j compares origin skills against target role requirements and traverses multi-hop dependency chains.",
      tag: "NEO4J CYPHER ENGINE",
    },
    {
      num: "04",
      title: "Prerequisite Path",
      sub: "Find missing dependencies",
      desc: "Shortest relevant learning sequence is calculated by resolving missing skill dependencies.",
      tag: "SHORTEST PATH ALGORITHM",
    },
    {
      num: "05",
      title: "Learning Roadmap",
      sub: "Follow ordered path",
      desc: "Follow the resulting skill sequence and graph-mapped course recommendations to bridge gaps.",
      tag: "CAREER TRANSIT",
    },
  ];

  // 3. System Architecture Layers
  const archLayers = [
    {
      id: "react",
      title: "React 18 SPA Frontend",
      layer: "FRONTEND",
      tech: "React 18 • Custom State Hooks • Atomic UI",
      desc: "Component-driven UI architecture, custom state hooks, and zero hardcoded data.",
    },
    {
      id: "vite",
      title: "Vite Build Pipeline",
      layer: "BUILD ENGINE",
      tech: "Vite 8.2 • HMR • Rollup Code-Splitting",
      desc: "Sub-second dev HMR & code-split production bundle pipeline.",
    },
    {
      id: "api",
      title: "REST API Endpoint Layer",
      layer: "REST API",
      tech: "Express.js • CORS • JSON Endpoints",
      desc: "Clean HTTP API contracts (GET /api/jobs, GET /api/skills, POST /api/path, GET /api/recommendations) with strict validation.",
    },
    {
      id: "express",
      title: "Express.js Application Server",
      layer: "BACKEND",
      tech: "3-Tier Node.js Express Server",
      desc: "Handles HTTP requests, route controllers, and centralized error handling middleware.",
    },
    {
      id: "service",
      title: "Decoupled Business Services",
      layer: "SERVICES",
      tech: "jobService • skillService • pathService",
      desc: "Decoupled domain services executing path calculation, readiness scoring, and course attachment logic.",
    },
    {
      id: "cypher",
      title: "Parameterized Cypher Queries",
      layer: "QUERY LAYER",
      tech: "queries/*.js • shortestPath()",
      desc: "100% parameterized Cypher queries ($targetJob, $currentSkills) with variable-length prerequisite traversals (-[:PREREQUISITE_OF*1..10]->).",
    },
    {
      id: "db",
      title: "Neo4j / CognoDB Graph Database",
      layer: "DATABASE",
      tech: "Bolt Protocol • neo4j-driver ^6.2.0",
      desc: "Hosted graph database storing Job, Skill, Course, and Certification nodes connected by REQUIRES, PREREQUISITE_OF, and TEACHES relationships.",
    },
  ];

  // 4. Technology Constellation
  const techConstellation = [
    { name: "React 18", category: "frontend", desc: "Component-driven application interface." },
    { name: "Vite", category: "frontend", desc: "Sub-second dev build & HMR server." },
    { name: "JavaScript", category: "frontend", desc: "ES2022+ logic and async execution." },
    { name: "Express.js", category: "backend", desc: "3-tier REST API backend server." },
    { name: "Neo4j", category: "database", desc: "Graph database powering prerequisite traversal." },
    { name: "CognoDB", category: "database", desc: "Cloud graph database instance." },
    { name: "Cypher", category: "database", desc: "Declarative graph query language." },
    { name: "neo4j-driver", category: "database", desc: "Official Neo4j JavaScript driver." },
    { name: "Three.js", category: "frontend", desc: "Interactive 3D spatial visualization." },
    { name: "WebGL", category: "frontend", desc: "Hardware-accelerated GPU rendering." },
    { name: "CSS System", category: "frontend", desc: "Custom CSS design tokens & grid system." },
  ];

  const filteredTechCards = techConstellation.filter(
    (t) => activeTechCategory === "all" || t.category === activeTechCategory
  );

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="landing-shell">
      {/* 0. MANDATORY 3D AMBIENT BACKGROUND LAYER (z-index: 0) */}
      <div className="landing-3d-background">
        <Suspense fallback={null}>
          <Ambient3DCanvas />
        </Suspense>
      </div>

      {/* 1. MANDATORY FOREGROUND CONTENT CONTAINER (z-index: 10) */}
      <div className="landing-content">
        {/* HEADER: STICKY TOP NAVBAR (z-index: 20) */}
        <header className="landing-top-navbar">
          <div className="landing-nav-container">
            <div className="landing-nav-brand">
              <div className="landing-brand-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
              </div>
              <div className="landing-brand-text">
                <span className="landing-brand-name">SkillPath</span>
                <span className="landing-brand-sub">AI CAREER KNOWLEDGE GRAPH</span>
              </div>
            </div>

            <div className="landing-nav-links">
              <button type="button" className="landing-nav-link" onClick={() => scrollToSection("landing-overview")}>Overview</button>
              <button type="button" className="landing-nav-link" onClick={() => scrollToSection("landing-workflow")}>How It Works</button>
              <button type="button" className="landing-nav-link" onClick={() => scrollToSection("landing-why-graph")}>Why Graph</button>
              <button type="button" className="landing-nav-link" onClick={() => scrollToSection("landing-architecture")}>Architecture</button>
              <button type="button" className="landing-nav-link" onClick={() => scrollToSection("landing-pathfinding")}>Pathfinding</button>
              <button type="button" className="landing-nav-link" onClick={() => scrollToSection("landing-tech-stack")}>Tech Stack</button>
              <button type="button" className="landing-nav-link" onClick={() => scrollToSection("landing-journey")}>Product Journey</button>
            </div>

            <div className="landing-nav-actions">
              <StatusIndicator isOnline={isOnline} label="Neo4j Active" />
              <Button variant="primary" size="sm" onClick={() => onNavigate("planner")}>
                Launch SkillPath →
              </Button>
            </div>
          </div>
        </header>

        {/* MAIN LANDING BODY */}
        <main className="landing-main-body">
          {/* SECTION 1: HERO */}
          <section id="landing-overview" className="cinematic-hero-section">
            <div className="cinematic-hero-grid">
              {/* LEFT COLUMN */}
              <div className="hero-product-intro">
                <div className="landing-eyebrow-badge">
                  <span className="live-pulse" />
                  <span>SKILLPATH • AI CAREER KNOWLEDGE GRAPH</span>
                </div>

                <h1 className="cinematic-hero-headline">
                  Your Skills Are the Origin. <br />
                  <span className="gradient-text-purple">Your Career Is the Destination.</span>
                </h1>

                <p className="cinematic-hero-subtext">
                  SkillPath uses a <strong>Neo4j knowledge graph</strong> to connect careers, technical skills, prerequisites, and courses to calculate personalized career readiness and generate a prerequisite learning path.
                </p>

                <div className="landing-hero-ctas">
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={() => onNavigate("planner")}
                    icon={
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                      </svg>
                    }
                  >
                    Launch SkillPath →
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

                <div className="landing-status-strip">
                  <span className="status-badge-item green">
                    <span className="status-dot green" /> Neo4j / CognoDB
                  </span>
                  <span className="status-divider">•</span>
                  <span className="status-badge-item cyan">
                    <span className="status-dot cyan" /> Graph Traversal
                  </span>
                  <span className="status-divider">•</span>
                  <span className="status-badge-item violet">
                    <span className="status-dot violet" /> Parameterized Cypher
                  </span>
                  <span className="status-divider">•</span>
                  <span className="status-badge-item green">
                    <span className="status-dot green" /> Three.js / WebGL
                  </span>
                </div>
              </div>

              {/* RIGHT COLUMN — 3D SPATIAL PRODUCT VISUALIZATION */}
              <div className="hero-spatial-visualization">
                <div className="spatial-system-column">
                  <div className="spatial-column-header">
                    <span className="spatial-column-tag">3D PRODUCT VISUALIZATION</span>
                    <span className="spatial-column-hint">Skills → Graph → Prerequisites → Career</span>
                  </div>

                  <div className="spatial-stages-list">
                    {heroStages.map((stage, idx) => {
                      const isHovered = activeHeroStage === idx;
                      return (
                        <div
                          key={stage.id}
                          className={`spatial-stage-box ${isHovered ? "active" : ""}`}
                          onMouseEnter={() => setActiveHeroStage(idx)}
                        >
                          <div className="stage-box-top">
                            <span className={`stage-num-pill ${stage.accent}`}>{stage.num}</span>
                            <span className="stage-label-title">{stage.label}</span>
                          </div>
                          <span className="stage-sub-title">{stage.title}</span>
                          {isHovered && <p className="stage-hover-desc">{stage.desc}</p>}
                          {idx < heroStages.length - 1 && <div className="spatial-flow-down-arrow">↓</div>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 2: HOW IT WORKS */}
          <section id="landing-workflow" className="landing-section">
            <SectionHeader
              eyebrow="SYSTEM WORKFLOW"
              title="From Skills to Career"
              subtitle="SkillPath transforms your current technical state into a graph-derived learning sequence in 5 interactive stages."
            />

            <div className="workflow-5step-wrap">
              <div className="workflow-nav-nodes">
                {workflowStages.map((st, idx) => {
                  const stepIndex = idx + 1;
                  const isSelected = activeWorkflowStage === stepIndex;
                  return (
                    <div
                      key={st.num}
                      className={`workflow-node-card ${isSelected ? "selected" : ""}`}
                      onMouseEnter={() => setActiveWorkflowStage(stepIndex)}
                      onClick={() => setActiveWorkflowStage(stepIndex)}
                    >
                      <div className="workflow-card-head">
                        <span className="step-badge">{st.num}</span>
                        <span className="step-tag-pill">{st.tag}</span>
                      </div>
                      <h4 className="workflow-card-title">{st.title}</h4>
                      <span className="workflow-card-sub">{st.sub}</span>
                      {idx < workflowStages.length - 1 && <div className="workflow-node-connector" />}
                    </div>
                  );
                })}
              </div>

              <Card surface="elevated" bordered className="workflow-active-detail">
                <div className="detail-header">
                  <Badge variant="purple" size="sm">{workflowStages[activeWorkflowStage - 1].tag}</Badge>
                  <span className="detail-stage-num">Stage {activeWorkflowStage} of 5</span>
                </div>
                <h3 className="detail-title">{workflowStages[activeWorkflowStage - 1].title}</h3>
                <p className="detail-desc">{workflowStages[activeWorkflowStage - 1].desc}</p>
                <div className="detail-cta-row">
                  <Button
                    variant="primary"
                    size="md"
                    onClick={() =>
                      onPlanCareer ? onPlanCareer(targetJob || "Generative AI Engineer") : onNavigate("planner")
                    }
                  >
                    Execute Stage {activeWorkflowStage} in Career Planner →
                  </Button>
                </div>
              </Card>
            </div>
          </section>

          {/* SECTION 3: SYSTEM METRICS */}
          <section className="landing-metrics-strip">
            <div className="metrics-container">
              <div className="metric-box">
                <span className="metric-number">15+</span>
                <span className="metric-label">CAREER ROLES</span>
              </div>
              <div className="metric-divider" />
              <div className="metric-box">
                <span className="metric-number">41+</span>
                <span className="metric-label">TECHNICAL SKILLS</span>
              </div>
              <div className="metric-divider" />
              <div className="metric-box">
                <span className="metric-number">28+</span>
                <span className="metric-label">MAPPED COURSES</span>
              </div>
              <div className="metric-divider" />
              <div className="metric-box">
                <span className="metric-number">170+</span>
                <span className="metric-label">GRAPH RELATIONSHIPS</span>
              </div>
              <div className="metric-divider" />
              <div className="metric-box">
                <span className="metric-number">Bolt</span>
                <span className="metric-label">NEO4J / COGNODB</span>
              </div>
            </div>
          </section>

          {/* SECTION 4: WHY KNOWLEDGE GRAPH? */}
          <section id="landing-why-graph" className="landing-section">
            <SectionHeader
              eyebrow="COMPARATIVE ADVANTAGE"
              title="Why Does SkillPath Use a Knowledge Graph?"
              subtitle="Traditional career portals give flat, unorganized skill lists. SkillPath models software careers as a connected prerequisite graph in Neo4j."
            />

            <div className="comparison-grid">
              <Card surface="surface" bordered className="comparison-card flat-card">
                <div className="card-tag red">TRADITIONAL APPROACH</div>
                <h3 className="card-title">Flat Unorganized Skill String</h3>
                <p className="card-desc">
                  Treats required skills as isolated strings without dependency context or prerequisite order.
                </p>
                <div className="flat-list-diagram">
                  <span className="flat-item">Python</span>
                  <span className="flat-item">Machine Learning</span>
                  <span className="flat-item">Docker</span>
                  <span className="flat-item">SQL</span>
                  <span className="flat-item">Git</span>
                </div>
                <div className="card-footer-note">❌ Flat skill list • ❌ No prerequisite ordering • ❌ No dependency relationships • ❌ Generic recommendations</div>
              </Card>

              <Card surface="elevated" bordered className="comparison-card graph-card">
                <div className="card-tag green">SKILLPATH GRAPH APPROACH</div>
                <h3 className="card-title">Directed Dependency Tree</h3>
                <p className="card-desc">
                  Models skill relationships natively. Traverses multi-hop dependency chains efficiently using native Neo4j Cypher algorithms.
                </p>
                <div className="graph-flow-diagram">
                  <div className="flow-step cyan">(:Job Target Role)</div>
                  <div className="flow-arrow">↓ REQUIRES</div>
                  <div className="flow-step violet">(:Skill Required Skill)</div>
                  <div className="flow-arrow">↓ PREREQUISITE_OF</div>
                  <div className="flow-step lavender">(:Skill Prerequisite)</div>
                  <div className="flow-arrow">↑ TEACHES</div>
                  <div className="flow-step green">(:Course Recommended Course)</div>
                </div>
                <div className="card-footer-note">✓ Connected skills • ✓ Prerequisite relationships • ✓ Career → Skill • ✓ Course → Skill • ✓ Graph traversal • ✓ Personalized path</div>
              </Card>
            </div>
          </section>

          {/* SECTION 5: GRAPH DATA MODEL */}
          <section className="landing-section">
            <SectionHeader
              eyebrow="NEO4J SCHEMA"
              title="Graph Data Relationship Model"
              subtitle="SkillPath uses three primary directed relationship types in Neo4j to build its career intelligence network."
            />

            <div className="relationships-grid">
              <Card
                surface="surface"
                bordered
                className={`rel-card ${activeRelType === "requires" ? "active-rel" : ""}`}
                onClick={() => setActiveRelType("requires")}
              >
                <div className="rel-header">
                  <span className="rel-type">REQUIRES</span>
                  <span className="rel-node-label">(:Job) ──► (:Skill)</span>
                </div>
                <p className="rel-desc">
                  Connects a career role to the skills it expects.
                </p>
                <div className="rel-example">
                  <code>(:Job &#123;title: "Generative AI Engineer"&#125;)-[:REQUIRES]-&gt;(:Skill &#123;name: "LLM Fundamentals"&#125;)</code>
                </div>
              </Card>

              <Card
                surface="surface"
                bordered
                className={`rel-card ${activeRelType === "prereq" ? "active-rel" : ""}`}
                onClick={() => setActiveRelType("prereq")}
              >
                <div className="rel-header">
                  <span className="rel-type">PREREQUISITE_OF</span>
                  <span className="rel-node-label">(:Skill) ──► (:Skill)</span>
                </div>
                <p className="rel-desc">
                  One skill must be learned before another.
                </p>
                <div className="rel-example">
                  <code>(:Skill &#123;name: "Python"&#125;)-[:PREREQUISITE_OF]-&gt;(:Skill &#123;name: "Machine Learning"&#125;)</code>
                </div>
              </Card>

              <Card
                surface="surface"
                bordered
                className={`rel-card ${activeRelType === "teaches" ? "active-rel" : ""}`}
                onClick={() => setActiveRelType("teaches")}
              >
                <div className="rel-header">
                  <span className="rel-type">TEACHES</span>
                  <span className="rel-node-label">(:Course) ──► (:Skill)</span>
                </div>
                <p className="rel-desc">
                  A course teaches a skill.
                </p>
                <div className="rel-example">
                  <code>(:Course &#123;name: "Docker Mastery"&#125;)-[:TEACHES]-&gt;(:Skill &#123;name: "Docker"&#125;)</code>
                </div>
              </Card>
            </div>
          </section>

          {/* SECTION 6: SYSTEM ARCHITECTURE */}
          <section id="landing-architecture" className="landing-section">
            <SectionHeader
              eyebrow="FULL-STACK ARCHITECTURE"
              title="Engineered as a Graph-First Full-Stack System"
              subtitle="Connected visual pipeline representing clean separation of concerns from React down to Neo4j."
            />

            <div className="architecture-interactive-wrap">
              <div className="arch-layers-list">
                {archLayers.map((layer) => {
                  const isSelected = activeArchLayer === layer.id;
                  return (
                    <button
                      key={layer.id}
                      type="button"
                      className={`arch-layer-item ${isSelected ? "selected" : ""}`}
                      onClick={() => setActiveArchLayer(layer.id)}
                    >
                      <span className="layer-pill">{layer.layer}</span>
                      <span className="layer-title">{layer.title}</span>
                      <span className="layer-tech">{layer.tech}</span>
                    </button>
                  );
                })}
              </div>

              <Card surface="elevated" bordered className="arch-detail-card">
                <div className="arch-detail-header">
                  <Badge variant="cyan" size="sm">DECOUPLED LAYER DETAILS</Badge>
                </div>
                {(() => {
                  const cur = archLayers.find((l) => l.id === activeArchLayer) || archLayers[5];
                  return (
                    <div>
                      <h3 className="arch-card-title">{cur.title}</h3>
                      <p className="arch-card-desc">{cur.desc}</p>
                      <div className="arch-tech-pill">{cur.tech}</div>
                    </div>
                  );
                })()}
              </Card>
            </div>
          </section>

          {/* SECTION 7: PATHFINDING ENGINE */}
          <section id="landing-pathfinding" className="landing-section">
            <SectionHeader
              eyebrow="CYPHER ALGORITHMS"
              title="How the Learning Path Is Generated"
              subtitle="SkillPath traverses prerequisite relationships to determine the shortest relevant path between origin skills and target career requirements."
            />

            <Card surface="surface" bordered className="cypher-code-block-card">
              <div className="code-header">
                <span className="code-filename">queries/learningPath.js — FIND_LEARNING_PATH</span>
                <Badge variant="violet" size="sm">100% Parameterized Cypher</Badge>
              </div>
              <pre className="cypher-syntax-pre">
{`MATCH (j:Job {title: $targetJob})-[:REQUIRES]->(target:Skill)
WHERE NOT target.name IN $currentSkills

OPTIONAL MATCH pKnown = shortestPath((start:Skill)-[:PREREQUISITE_OF*1..10]->(target))
WHERE start.name IN $currentSkills

OPTIONAL MATCH pRoot = shortestPath((root:Skill)-[:PREREQUISITE_OF*1..10]->(target))
WHERE NOT ()-[:PREREQUISITE_OF]->(root) AND NOT root.name IN $currentSkills

RETURN target.name AS targetSkill,
       [n IN nodes(bestPath) | n.name] AS learningChain,
       length(bestPath) AS hops,
       collect(DISTINCT { name: course.name, provider: course.provider }) AS courses`}
              </pre>
            </Card>
          </section>

          {/* SECTION 8: PRODUCT JOURNEY */}
          <section id="landing-journey" className="landing-section">
            <SectionHeader
              eyebrow="APPLICATION STRUCTURE"
              title="One Platform. Two Ways to Explore."
              subtitle="Clearly separating the two main purposes of the SkillPath application: Action vs Exploration."
            />

            <div className="journey-dual-grid">
              <Card surface="surface" bordered className="journey-group-card">
                <div className="group-header">
                  <Badge variant="purple" size="sm">CAREER JOURNEY (ACTION)</Badge>
                  <h3 className="group-title">Personalized Career Planning</h3>
                </div>
                <p className="group-desc">Find where you want to go and how to get there.</p>
                <div className="workspace-links-list">
                  <button type="button" className="workspace-link-btn" onClick={() => onNavigate("planner")}>
                    <span>Career Planner</span>
                    <span className="link-arrow">→</span>
                  </button>
                  <button type="button" className="workspace-link-btn" onClick={() => onNavigate("roadmap")}>
                    <span>Learning Roadmap</span>
                    <span className="link-arrow">→</span>
                  </button>
                </div>
              </Card>

              <Card surface="surface" bordered className="journey-group-card">
                <div className="group-header">
                  <Badge variant="cyan" size="sm">KNOWLEDGE DISCOVERY (EXPLORATION)</Badge>
                  <h3 className="group-title">Graph Exploration Layer</h3>
                </div>
                <p className="group-desc">Understand the relationships inside the career knowledge graph.</p>
                <div className="workspace-links-list">
                  <button type="button" className="workspace-link-btn" onClick={() => onNavigate("jobs")}>
                    <span>Career Explorer</span>
                    <span className="link-arrow">→</span>
                  </button>
                  <button type="button" className="workspace-link-btn" onClick={() => onNavigate("skills")}>
                    <span>Skill Explorer</span>
                    <span className="link-arrow">→</span>
                  </button>
                  <button type="button" className="workspace-link-btn" onClick={() => onNavigate("courses")}>
                    <span>Course Library</span>
                    <span className="link-arrow">→</span>
                  </button>
                  <button type="button" className="workspace-link-btn" onClick={() => onNavigate("graph")}>
                    <span>Knowledge Graph (3D Stage)</span>
                    <span className="link-arrow">→</span>
                  </button>
                </div>
              </Card>
            </div>
          </section>

          {/* SECTION 9: TECHNOLOGY STACK */}
          <section id="landing-tech-stack" className="landing-section">
            <SectionHeader
              eyebrow="REPOSITORY TECH STACK"
              title="Technology Constellation"
              subtitle="Built strictly with production dependencies present in backend and frontend package.json."
            />

            <div className="tech-filter-bar">
              {["all", "frontend", "backend", "database"].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className={`tech-chip-btn ${activeTechCategory === cat ? "active" : ""}`}
                  onClick={() => setActiveTechCategory(cat)}
                >
                  {cat.toUpperCase()}
                </button>
              ))}
            </div>

            <div className="tech-cards-grid">
              {filteredTechCards.map((tech) => (
                <Card
                  key={tech.name}
                  surface="surface"
                  bordered
                  hoverable
                  className={`tech-card ${activeTechItem === tech.name ? "active-tech" : ""}`}
                  onClick={() => setActiveTechItem(tech.name)}
                >
                  <Badge variant={tech.category === "database" ? "cyan" : "violet"} size="sm">
                    {tech.category.toUpperCase()}
                  </Badge>
                  <h4 className="tech-name">{tech.name}</h4>
                  <p className="tech-desc">{tech.desc}</p>
                </Card>
              ))}
            </div>
          </section>

          {/* SECTION 10: ENGINEERING HIGHLIGHTS */}
          <section className="landing-section">
            <SectionHeader
              eyebrow="QUALITY AUDIT"
              title="Engineering Highlights"
              subtitle="Audit benchmarks verified across repository tests, linting, build pipelines, and Cypher traversals."
            />

            <div className="highlights-grid">
              {[
                "Graph-first architecture with native Neo4j integration",
                "Real Neo4j database integration",
                "100% Parameterized Cypher ($targetJob, $currentSkills)",
                "Multi-hop prerequisite traversal (-[:PREREQUISITE_OF*1..10]->)",
                "Dynamic readiness analysis & gap score",
                "Personalized learning path generation",
                "Decoupled 3-tier REST API architecture",
                "Interactive 3D WebGL ambient visualization",
                "Code-split WebGL chunk & fast Vite build",
                "Responsive UI tested across desktop & mobile viewports",
              ].map((item, idx) => (
                <div key={idx} className="highlight-item-box">
                  <span className="check-icon">✓</span>
                  <span className="item-text">{item}</span>
                </div>
              ))}
            </div>
          </section>

          {/* SECTION 11: FINAL CTA */}
          <section className="landing-cta-banner">
            <div className="cta-banner-content">
              <span className="cta-eyebrow">NEO4J CAREER INTELLIGENCE PLATFORM</span>
              <h2 className="cta-title">Your next career path is already connected.</h2>
              <p className="cta-subtext">
                Start with what you know. Let the graph find what comes next.
              </p>

              <div className="cta-buttons-row">
                <Button variant="primary" size="lg" onClick={() => onNavigate("planner")}>
                  Launch SkillPath →
                </Button>
                <Button variant="secondary" size="lg" onClick={() => onNavigate("graph")}>
                  Explore Knowledge Graph →
                </Button>
              </div>
            </div>
          </section>
        </main>

        {/* SECTION 12: FOOTER */}
        <footer className="landing-footer">
          <div className="landing-footer-container">
            <div className="footer-left">
              <span className="footer-brand">SkillPath AI</span>
              <span className="footer-tagline">AI Career Knowledge Graph Platform</span>
            </div>
            <div className="footer-tech-stack">
              <span>React 18</span>
              <span>Express.js</span>
              <span>Neo4j / CognoDB</span>
              <span>Cypher</span>
              <span>Three.js</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default LandingPage;
