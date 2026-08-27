import { useState } from "react";

export function HeroGraph({ targetJob = "Backend Developer", currentSkillsCount = 0, onNavigate }) {
  const [activeNode, setActiveNode] = useState(null);

  const sampleNodes = [
    { id: "origin", label: "CURRENT SKILLS", sub: `${currentSkillsCount} Mastered`, x: 80, y: 180, color: "#22d3ee", type: "origin" },
    { id: "python", label: "Python Node", sub: "Prerequisite", x: 230, y: 90, color: "#c4b5fd", type: "prereq" },
    { id: "sql", label: "SQL & Relational", sub: "Prerequisite", x: 250, y: 270, color: "#c4b5fd", type: "prereq" },
    { id: "docker", label: "Docker & Container", sub: "Graph Hop 1", x: 420, y: 130, color: "#8b5cf6", type: "path" },
    { id: "express", label: "Express API", sub: "Graph Hop 2", x: 440, y: 250, color: "#8b5cf6", type: "path" },
    { id: "target", label: targetJob, sub: "TARGET CAREER", x: 600, y: 180, color: "#a855f7", type: "target" },
  ];

  return (
    <div className="hero-graph-workspace-card">
      <div className="graph-workspace-topbar">
        <div className="graph-badge">
          <span className="live-pulse" />
          <span>NEO4J PREREQUISITE GRAPH TRAVERSAL</span>
        </div>
        <button
          type="button"
          className="replay-path-btn"
          onClick={() => onNavigate && onNavigate("graph")}
        >
          <span>Open Full Workspace →</span>
        </button>
      </div>

      <div className="workspace-svg-wrapper">
        <svg className="open-graph-svg" viewBox="0 0 700 360">
          <defs>
            <linearGradient id="edgeGradCyan" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#c4b5fd" stopOpacity="0.8" />
            </linearGradient>
            <linearGradient id="edgeGradPurple" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#c4b5fd" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.8" />
            </linearGradient>
            <linearGradient id="edgeGradTarget" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#a855f7" stopOpacity="0.8" />
            </linearGradient>
            <filter id="glowEffect" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Graph Edges / Connections */}
          <path d="M 80 180 C 150 120, 160 90, 230 90" stroke="url(#edgeGradCyan)" strokeWidth="2.5" fill="none" />
          <path d="M 80 180 C 150 240, 170 270, 250 270" stroke="url(#edgeGradCyan)" strokeWidth="2.5" fill="none" />
          <path d="M 230 90 C 320 90, 330 130, 420 130" stroke="url(#edgeGradPurple)" strokeWidth="2.5" fill="none" />
          <path d="M 250 270 C 340 270, 350 250, 440 250" stroke="url(#edgeGradPurple)" strokeWidth="2.5" fill="none" />
          <path d="M 420 130 C 500 130, 520 180, 600 180" stroke="url(#edgeGradTarget)" strokeWidth="3" strokeDasharray="6 4" fill="none" />
          <path d="M 440 250 C 510 250, 530 180, 600 180" stroke="url(#edgeGradTarget)" strokeWidth="3" strokeDasharray="6 4" fill="none" />

          {/* Graph Nodes */}
          {sampleNodes.map((node) => {
            const isHovered = activeNode === node.id;
            return (
              <g
                key={node.id}
                transform={`translate(${node.x}, ${node.y})`}
                onMouseEnter={() => setActiveNode(node.id)}
                onMouseLeave={() => setActiveNode(null)}
                style={{ cursor: "pointer" }}
              >
                <circle
                  r={node.type === "origin" || node.type === "target" ? "22" : "18"}
                  fill="#0b0a11"
                  stroke={node.color}
                  strokeWidth={isHovered ? "3.5" : "2.5"}
                  filter="url(#glowEffect)"
                />
                <circle
                  r={node.type === "origin" || node.type === "target" ? "8" : "6"}
                  fill={node.color}
                />
                <text
                  y={node.y > 180 ? 38 : -28}
                  textAnchor="middle"
                  fill="#f8fafc"
                  fontSize="12.5"
                  fontWeight="700"
                  fontFamily="Inter, sans-serif"
                >
                  {node.label}
                </text>
                <text
                  y={node.y > 180 ? 52 : -14}
                  textAnchor="middle"
                  fill="#a1a1aa"
                  fontSize="10"
                  fontWeight="600"
                  fontFamily="JetBrains Mono, monospace"
                >
                  {node.sub}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="graph-workspace-footer">
        <div className="active-node-detail">
          <span className="node-detail-lbl">Active Node:</span>
          <span className="node-detail-val">{activeNode ? activeNode.toUpperCase() : "HOVER NODE TO INSPECT"}</span>
        </div>
        <span className="graph-hint">Interactive 2D Prerequisite Traversal View</span>
      </div>
    </div>
  );
}

export default HeroGraph;
