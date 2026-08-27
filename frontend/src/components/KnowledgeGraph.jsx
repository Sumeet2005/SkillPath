import { useState, useMemo, useRef, lazy, Suspense } from "react";
import Button from "./ui/Button";
import Badge from "./ui/Badge";
import SearchInput from "./ui/SearchInput";
import StatusIndicator from "./ui/StatusIndicator";

// Lazy-load Three.js 3D WebGL Canvas
const KnowledgeGraph3D = lazy(() => import("./graph/KnowledgeGraph3D"));

export function KnowledgeGraph({
  jobs = [],
  skills = [],
  currentSkills = [],
  learningPath = [],
  targetJob,
  setTargetJob,
  toggleSkill,
  isOnline = true,
  onNavigate,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [hoveredNodeId, setHoveredNodeId] = useState(null);
  const [autoRotate, setAutoRotate] = useState(true);
  const [fitSignal, setFitSignal] = useState(0);

  const graph3DRef = useRef(null);

  // 1. Build authentic nodes from real data ONLY
  const nodes = useMemo(() => {
    const list = [];

    // Skill nodes
    skills.forEach((s) => {
      list.push({
        id: `skill-${s.name}`,
        rawId: s.name,
        name: s.name,
        type: "skill",
        category: s.category || "General Skill",
        isMastered: currentSkills.includes(s.name),
      });
    });

    // Career / Job nodes
    jobs.forEach((j) => {
      list.push({
        id: `job-${j.title}`,
        rawId: j.title,
        name: j.title,
        type: "job",
        industry: j.industry || "Software Engineering",
        level: j.level || "Mid–Senior",
        requiredSkills: j.requiredSkills || [],
      });
    });

    // Course nodes (extracted ONLY from authentic course recommendations in learningPath)
    const uniqueCourses = new Map();
    learningPath.forEach((step) => {
      (step.courses || []).forEach((c) => {
        if (c && c.name && !uniqueCourses.has(c.name)) {
          uniqueCourses.set(c.name, c);
        }
      });
    });

    uniqueCourses.forEach((c) => {
      list.push({
        id: `course-${c.name}`,
        rawId: c.name,
        name: c.name,
        type: "course",
        provider: c.provider || "Partner Course",
        durationHours: c.durationHours || 0,
        level: c.level || "Intermediate",
      });
    });

    return list;
  }, [skills, jobs, currentSkills, learningPath]);

  // 2. Build authentic edges from real relationships ONLY
  const edges = useMemo(() => {
    const list = [];

    // Job -> Required Skill edges
    jobs.forEach((job) => {
      (job.requiredSkills || []).forEach((skillName) => {
        if (skills.some((s) => s.name === skillName)) {
          list.push({
            source: `job-${job.title}`,
            target: `skill-${skillName}`,
            type: "REQUIRES",
          });
        }
      });
    });

    // Skill -> Prerequisite edges (from authentic path)
    learningPath.forEach((step) => {
      (step.prerequisites || []).forEach((prereq) => {
        const cleanPrereq = typeof prereq === "string" ? prereq.trim() : prereq;
        if (cleanPrereq && cleanPrereq !== "I" && cleanPrereq !== step.targetSkill) {
          list.push({
            source: `skill-${cleanPrereq}`,
            target: `skill-${step.targetSkill}`,
            type: "PREREQUISITE_OF",
          });
        }
      });

      // Skill -> Course edges
      (step.courses || []).forEach((c) => {
        if (c && c.name) {
          list.push({
            source: `skill-${step.targetSkill}`,
            target: `course-${c.name}`,
            type: "RECOMMENDS_COURSE",
          });
        }
      });
    });

    return list;
  }, [jobs, skills, learningPath]);

  // Selected Node details object
  const selectedNode = useMemo(() => {
    if (!selectedNodeId) return null;
    return nodes.find((n) => n.id === selectedNodeId) || null;
  }, [selectedNodeId, nodes]);

  // Connected nodes for Selected Node
  const connectedDetails = useMemo(() => {
    if (!selectedNodeId) return { prerequisites: [], dependentJobs: [], courses: [] };

    const prereqs = [];
    const jobsList = [];
    const courseList = [];

    edges.forEach((e) => {
      if (e.source === selectedNodeId) {
        const targetNode = nodes.find((n) => n.id === e.target);
        if (targetNode?.type === "skill") prereqs.push(targetNode);
        if (targetNode?.type === "course") courseList.push(targetNode);
      }
      if (e.target === selectedNodeId) {
        const sourceNode = nodes.find((n) => n.id === e.source);
        if (sourceNode?.type === "job") jobsList.push(sourceNode);
        if (sourceNode?.type === "skill") prereqs.push(sourceNode);
      }
    });

    return { prerequisites: prereqs, dependentJobs: jobsList, courses: courseList };
  }, [selectedNodeId, edges, nodes]);

  // Filtered nodes for Search
  const filteredNodes = useMemo(() => {
    return nodes.filter((n) => {
      const matchesSearch =
        !searchQuery ||
        n.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (n.category && n.category.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory =
        selectedCategory === "All" ||
        (selectedCategory === "Jobs" && n.type === "job") ||
        (selectedCategory === "Skills" && n.type === "skill") ||
        (selectedCategory === "Courses" && n.type === "course");
      return matchesSearch && matchesCategory;
    });
  }, [nodes, searchQuery, selectedCategory]);

  return (
    <div className="graph-workspace-page">
      {/* 1. PAGE HEADER */}
      <div className="graph-header-section">
        <div className="graph-header-left">
          <span className="graph-eyebrow">KNOWLEDGE GRAPH WORKSPACE</span>
          <h1 className="graph-title">AI Skill & Career Knowledge Graph</h1>
          <p className="graph-description">
            Interactive 3D WebGL network visualization connecting software skills, career dependencies, and prerequisite learning paths.
          </p>
        </div>
        <div className="graph-header-right">
          <StatusIndicator isOnline={isOnline} />
        </div>
      </div>

      {/* 2. GRAPH TOOLBAR */}
      <div className="graph-toolbar-strip">
        <div className="toolbar-left-controls">
          <div className="graph-search-wrap">
            <SearchInput
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onClear={() => setSearchQuery("")}
              placeholder="Search 3D nodes (e.g. Python, Backend Developer)..."
            />
          </div>

          <div className="graph-category-filter">
            {["All", "Jobs", "Skills", "Courses"].map((cat) => (
              <button
                key={cat}
                type="button"
                className={`graph-cat-btn ${selectedCategory === cat ? "active" : ""}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="toolbar-right-controls">
          {/* Legend */}
          <div className="graph-legend-group">
            <span className="legend-item"><span className="legend-dot violet" /> Skills ({skills.length})</span>
            <span className="legend-item"><span className="legend-dot cyan" /> Careers ({jobs.length})</span>
            {nodes.some((n) => n.type === "course") && (
              <span className="legend-item"><span className="legend-dot green" /> Courses</span>
            )}
          </div>

          {/* Compact Camera Controls (+ Zoom In, - Zoom Out, Reset View, Auto-Rotate) */}
          <div className="camera-btn-group">
            <button
              type="button"
              className="camera-ctrl-btn"
              onClick={() => graph3DRef.current?.zoomIn()}
              title="Zoom In (+)"
            >
              +
            </button>
            <button
              type="button"
              className="camera-ctrl-btn"
              onClick={() => graph3DRef.current?.zoomOut()}
              title="Zoom Out (-)"
            >
              −
            </button>
            <button
              type="button"
              className="camera-ctrl-btn"
              onClick={() => {
                if (graph3DRef.current) graph3DRef.current.resetView();
                setFitSignal((prev) => prev + 1);
              }}
              title="Reset View (Fit to Graph)"
            >
              Reset View
            </button>
            <button
              type="button"
              className={`rotate-toggle-btn ${autoRotate ? "active" : ""}`}
              onClick={() => setAutoRotate(!autoRotate)}
              title="Toggle idle camera rotation"
            >
              {autoRotate ? "Auto-Rotate: ON" : "Auto-Rotate: OFF"}
            </button>
          </div>
        </div>
      </div>

      {/* 3. 3D WEBGL GRAPH VIEW & NODE INSPECTOR */}
      <div className="graph-stage-layout">
        <div className="graph-canvas-container">
          {selectedCategory === "Courses" && !nodes.some((n) => n.type === "course") ? (
            <div className="empty-courses-graph-overlay">
              <div className="empty-courses-content">
                <div className="empty-courses-icon">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                  </svg>
                </div>
                <h3 className="empty-courses-title">No course relationships available yet</h3>
                <p className="empty-courses-desc">
                  Generate a learning path in the Career Planner to populate course node recommendations in the knowledge graph.
                </p>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => onNavigate && onNavigate("planner")}
                >
                  Open Career Planner →
                </Button>
              </div>
            </div>
          ) : (
            <Suspense
              fallback={
                <div className="graph-loading-skeleton">
                  <div className="btn-spinner" style={{ width: "36px", height: "36px", margin: "0 auto 16px" }} />
                  <p style={{ color: "var(--text-secondary)" }}>Loading 3D WebGL Engine...</p>
                </div>
              }
            >
              <KnowledgeGraph3D
                ref={graph3DRef}
                nodes={filteredNodes}
                edges={edges}
                selectedNodeId={selectedNodeId}
                hoveredNodeId={hoveredNodeId}
                onHoverNode={setHoveredNodeId}
                onSelectNode={(node) => {
                  setSelectedNodeId(node.id);
                  setAutoRotate(false);
                }}
                autoRotate={autoRotate}
                searchQuery={searchQuery}
                targetJob={targetJob}
                selectedCategory={selectedCategory}
                fitSignal={fitSignal}
              />
            </Suspense>
          )}
        </div>

        {/* 4. NODE INSPECTOR PANEL */}
        <aside className="node-inspector-panel">
          {!selectedNode ? (
            <div className="inspector-empty-prompt">
              <div className="prompt-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="18" cy="5" r="3" />
                  <circle cx="6" cy="12" r="3" />
                  <circle cx="18" cy="19" r="3" />
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                </svg>
              </div>
              <h3 className="prompt-title">Select a Node to Inspect</h3>
              <p className="prompt-desc">
                Click any 3D node in the graph workspace to inspect prerequisites, required role dependencies, and recommended courses.
              </p>
            </div>
          ) : (
            <div className="inspector-node-details">
              <div className="inspector-header">
                <div>
                  <Badge
                    variant={
                      selectedNode.type === "job"
                        ? "cyan"
                        : selectedNode.type === "course"
                        ? "green"
                        : "purple"
                    }
                    size="sm"
                  >
                    {selectedNode.type.toUpperCase()} NODE
                  </Badge>
                  <h3 className="inspector-node-name">{selectedNode.name}</h3>
                </div>
                <button
                  type="button"
                  className="close-inspector-btn"
                  onClick={() => setSelectedNodeId(null)}
                >
                  ✕
                </button>
              </div>

              {/* Skill Node Detail */}
              {selectedNode.type === "skill" && (
                <div className="inspector-body-stack">
                  <div className="detail-meta-box">
                    <span className="meta-lbl">Category</span>
                    <span className="meta-val">{selectedNode.category}</span>
                  </div>
                  <div className="detail-meta-box">
                    <span className="meta-lbl">Mastery State</span>
                    <Badge variant={selectedNode.isMastered ? "green" : "neutral"} size="sm">
                      {selectedNode.isMastered ? "✓ Mastered" : "Not Mastered"}
                    </Badge>
                  </div>
                  <Button
                    variant={selectedNode.isMastered ? "secondary" : "primary"}
                    size="sm"
                    onClick={() => toggleSkill(selectedNode.name)}
                  >
                    {selectedNode.isMastered ? "Mark Unmastered" : "Mark as Mastered Skill"}
                  </Button>

                  {connectedDetails.prerequisites.length > 0 && (
                    <div className="inspector-rel-section">
                      <span className="rel-section-lbl">RELATED PREREQUISITES</span>
                      <div className="rel-chips-wrap">
                        {connectedDetails.prerequisites.map((p) => (
                          <Badge key={p.id} variant="violet" size="sm">↳ {p.name}</Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {connectedDetails.courses.length > 0 && (
                    <div className="inspector-rel-section">
                      <span className="rel-section-lbl">RECOMMENDED COURSES</span>
                      <div className="rel-chips-wrap">
                        {connectedDetails.courses.map((c) => (
                          <Badge key={c.id} variant="green" size="sm">📖 {c.name}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Job Node Detail */}
              {selectedNode.type === "job" && (
                <div className="inspector-body-stack">
                  <div className="detail-meta-box">
                    <span className="meta-lbl">Industry</span>
                    <span className="meta-val">{selectedNode.industry}</span>
                  </div>
                  <div className="detail-meta-box">
                    <span className="meta-lbl">Level</span>
                    <span className="meta-val">{selectedNode.level}</span>
                  </div>
                  <Button
                    variant={targetJob === selectedNode.name ? "secondary" : "primary"}
                    size="sm"
                    onClick={() => {
                      setTargetJob(selectedNode.name);
                      if (onNavigate) onNavigate("planner");
                    }}
                  >
                    {targetJob === selectedNode.name ? "Active Target Role ✓" : "Set Target Career Destination"}
                  </Button>

                  {selectedNode.requiredSkills.length > 0 && (
                    <div className="inspector-rel-section">
                      <span className="rel-section-lbl">REQUIRED GRAPH SKILLS ({selectedNode.requiredSkills.length})</span>
                      <div className="rel-chips-wrap">
                        {selectedNode.requiredSkills.map((sk) => (
                          <Badge key={sk} variant="cyan" size="sm">{sk}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Course Node Detail */}
              {selectedNode.type === "course" && (
                <div className="inspector-body-stack">
                  <div className="detail-meta-box">
                    <span className="meta-lbl">Provider</span>
                    <span className="meta-val">{selectedNode.provider}</span>
                  </div>
                  <div className="detail-meta-box">
                    <span className="meta-lbl">Est. Duration</span>
                    <span className="meta-val">{selectedNode.durationHours} Hours</span>
                  </div>
                  <div className="detail-meta-box">
                    <span className="meta-lbl">Difficulty Level</span>
                    <Badge variant="neutral" size="sm">{selectedNode.level}</Badge>
                  </div>
                </div>
              )}
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

export default KnowledgeGraph;
