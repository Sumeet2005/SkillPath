import { useState, useEffect } from "react";
import useSkillPath from "./hooks/useSkillPath";
import Sidebar from "./components/layout/Sidebar";
import Header from "./components/Header";
import Dashboard from "./components/Dashboard";
import CareerPlanner from "./components/CareerPlanner";
import LearningRoadmap from "./components/LearningRoadmap";
import KnowledgeGraph from "./components/KnowledgeGraph";
import CareerExplorer from "./components/CareerExplorer";
import SkillExplorer from "./components/SkillExplorer";
import CourseLibrary from "./components/CourseLibrary";
import LandingPage from "./components/LandingPage";

export function App() {
  const {
    jobs,
    skills,
    categories,
    targetJob,
    setTargetJob,
    currentSkills,
    toggleSkill,
    clearAllSkills,
    learningPath,
    readinessScore,
    masteredRequiredSkills,
    missingRequiredSkills,
    activeTab,
    setActiveTab,
    isLoading,
    isGeneratingPath,
    error,
    backendOnline,
    handleGeneratePath,
    resetState,
    activeJobDetails,
  } = useSkillPath();

  const [showLanding, setShowLanding] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [plannerStep, setPlannerStep] = useState(1);

  // Close mobile drawer automatically if window is resized to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1024 && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [mobileMenuOpen]);

  // Handle Escape key to close mobile drawer
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileMenuOpen]);

  const handleToggleMenu = () => {
    if (window.innerWidth > 1024) {
      setSidebarCollapsed((prev) => !prev);
    } else {
      setMobileMenuOpen((prev) => !prev);
    }
  };

  const handleNavigate = (tabId) => {
    setActiveTab(tabId);
    setShowLanding(false);
    setMobileMenuOpen(false);
  };

  const handleLaunchApp = (targetTab = "dashboard") => {
    if (targetTab) setActiveTab(targetTab);
    setShowLanding(false);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleOpenLanding = () => {
    setShowLanding(true);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Shortcut flow from Career Explorer "Plan This Career →"
  const handlePlanCareer = async (selectedJobTitle) => {
    setTargetJob(selectedJobTitle);
    setShowLanding(false);
    if (currentSkills.length > 0) {
      setPlannerStep(3);
      setActiveTab("planner");
      await handleGeneratePath(selectedJobTitle, currentSkills, "planner");
    } else {
      setPlannerStep(2);
      setActiveTab("planner");
    }
  };

  // Full-screen Landing Page Entry Experience
  if (showLanding) {
    return (
      <LandingPage
        jobs={jobs}
        skills={skills}
        targetJob={targetJob}
        currentSkills={currentSkills}
        learningPath={learningPath}
        onNavigate={handleLaunchApp}
        onPlanCareer={(jobTitle) => {
          setTargetJob(jobTitle);
          handleLaunchApp("planner");
        }}
        isOnline={backendOnline}
      />
    );
  }

  return (
    <div className={`skillpath-app shell-layout ${sidebarCollapsed ? "sidebar-is-collapsed" : ""}`}>
      {/* Mobile Drawer Backdrop Overlay */}
      {mobileMenuOpen && (
        <div
          className="sidebar-backdrop"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={handleNavigate}
        onReset={resetState}
        isOnline={backendOnline}
        isCollapsed={sidebarCollapsed}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
        hasLearningPath={learningPath.length > 0}
        onOpenLanding={handleOpenLanding}
      />

      {/* Main Workspace Wrapper */}
      <div className="app-main-wrapper">
        <Header
          activeTab={activeTab}
          targetJob={targetJob}
          onReset={resetState}
          isOnline={backendOnline}
          onToggleMenu={handleToggleMenu}
          isCollapsed={sidebarCollapsed}
        />

        <main className="main-layout">
          {isLoading ? (
            <div className="sp-loading-container" style={{ padding: "64px", textAlign: "center" }}>
              <div className="btn-spinner" style={{ width: "32px", height: "32px", margin: "0 auto 16px" }} />
              <p style={{ color: "var(--text-secondary)" }}>Connecting to Neo4j SkillPath Engine...</p>
            </div>
          ) : error ? (
            <div className="sp-error-container" style={{ padding: "40px", background: "rgba(248, 113, 113, 0.1)", border: "1px solid var(--color-red-400)", borderRadius: "16px" }}>
              <h3 style={{ color: "var(--color-red-400)", margin: "0 0 8px" }}>System Notice</h3>
              <p style={{ color: "var(--text-primary)", margin: 0 }}>{error}</p>
            </div>
          ) : activeTab === "dashboard" ? (
            <Dashboard
              jobs={jobs}
              skills={skills}
              targetJob={targetJob}
              setTargetJob={setTargetJob}
              currentSkills={currentSkills}
              readinessScore={readinessScore}
              masteredRequiredSkills={masteredRequiredSkills}
              missingRequiredSkills={missingRequiredSkills}
              activeJobDetails={activeJobDetails}
              onNavigate={handleNavigate}
            />
          ) : activeTab === "planner" ? (
            <CareerPlanner
              jobs={jobs}
              skills={skills}
              categories={categories}
              targetJob={targetJob}
              setTargetJob={setTargetJob}
              currentSkills={currentSkills}
              toggleSkill={toggleSkill}
              clearAllSkills={clearAllSkills}
              readinessScore={readinessScore}
              masteredRequiredSkills={masteredRequiredSkills}
              missingRequiredSkills={missingRequiredSkills}
              isGeneratingPath={isGeneratingPath}
              handleGeneratePath={handleGeneratePath}
              activeJobDetails={activeJobDetails}
              plannerStep={plannerStep}
              setPlannerStep={setPlannerStep}
            />
          ) : activeTab === "roadmap" ? (
            <LearningRoadmap
              targetJob={targetJob}
              currentSkills={currentSkills}
              learningPath={learningPath}
              readinessScore={readinessScore}
              masteredRequiredSkills={masteredRequiredSkills}
              missingRequiredSkills={missingRequiredSkills}
              activeJobDetails={activeJobDetails}
              onNavigate={handleNavigate}
            />
          ) : activeTab === "graph" ? (
            <KnowledgeGraph
              jobs={jobs}
              skills={skills}
              currentSkills={currentSkills}
              learningPath={learningPath}
              targetJob={targetJob}
              setTargetJob={setTargetJob}
              toggleSkill={toggleSkill}
              isOnline={backendOnline}
              onNavigate={handleNavigate}
            />
          ) : activeTab === "jobs" ? (
            <CareerExplorer
              jobs={jobs}
              targetJob={targetJob}
              setTargetJob={setTargetJob}
              onNavigate={handleNavigate}
              onPlanCareer={handlePlanCareer}
              isOnline={backendOnline}
            />
          ) : activeTab === "skills" ? (
            <SkillExplorer
              skills={skills}
              categories={categories}
              currentSkills={currentSkills}
              toggleSkill={toggleSkill}
              onNavigate={handleNavigate}
              isOnline={backendOnline}
            />
          ) : activeTab === "courses" ? (
            <CourseLibrary
              learningPath={learningPath}
              targetJob={targetJob}
              onNavigate={handleNavigate}
              isOnline={backendOnline}
            />
          ) : (
            /* Fallback Page Placeholder */
            <div className="page-phase-placeholder" style={{ padding: "64px 32px", textAlign: "center", background: "var(--bg-surface)", border: "1px solid var(--border-subtle)", borderRadius: "20px" }}>
              <h2 style={{ fontSize: "28px", margin: "12px 0 8px" }}>
                {activeTab.toUpperCase()} Workspace
              </h2>
              <button
                type="button"
                className="sp-button btn-primary btn-md"
                onClick={() => handleNavigate("dashboard")}
              >
                Return to Dashboard Command Center
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;